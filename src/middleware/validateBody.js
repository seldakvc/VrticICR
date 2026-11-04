import ApiError from "../utils/ApiError.js";
import { isObjectId } from "../utils/objectId.js";

function validateBody(rules) {
  return async function validateRequestBody(req, res, next) {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const validated = {};
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = body[field];
      const present = Object.prototype.hasOwnProperty.call(body, field);

      if ((!present || value === null) && rule.required) {
        errors[field] = [`The ${field} field is required.`];
        continue;
      }

      if (!present) {
        continue;
      }

      if (value === null && rule.nullable) {
        validated[field] = null;
        continue;
      }

      let valid = true;
      if (rule.type === "string") {
        valid = typeof value === "string";
      } else if (rule.type === "integer") {
        valid = (typeof value === "number" && Number.isInteger(value))
          || (typeof value === "string" && /^-?\d+$/.test(value));
      } else if (rule.type === "objectId") {
        valid = isObjectId(value);
      }

      if (!valid) {
        errors[field] = [rule.type === "objectId"
          ? `The ${field} must be a valid identifier.`
          : `The ${field} must be ${rule.type === "integer" ? "an integer" : `a ${rule.type}`}.`];
        continue;
      }

      if (rule.type === "string") {
        const length = [...value].length;
        if (rule.min !== undefined && length < rule.min) {
          errors[field] = [`The ${field} must be at least ${rule.min} characters.`];
          continue;
        }
        if (rule.max !== undefined && length > rule.max) {
          errors[field] = [`The ${field} may not be greater than ${rule.max} characters.`];
          continue;
        }
      }

      if (rule.unique && await rule.model.exists({ [rule.unique]: value })) {
        errors[field] = [`The ${field} has already been taken.`];
        continue;
      }

      if (rule.exists && !await rule.exists.exists({ _id: value })) {
        errors[field] = [`The selected ${field} is invalid.`];
        continue;
      }

      validated[field] = rule.type === "integer" && typeof value === "string"
        ? Number(value)
        : value;
    }

    if (Object.keys(errors).length) {
      return next(new ApiError(422, "The given data was invalid.", errors));
    }

    req.body = validated;
    return next();
  };
}

export default validateBody;

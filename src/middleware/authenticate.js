import Staratelj from "../models/Staratelj.js";
import Vaspitac from "../models/Vaspitac.js";
import ApiError from "../utils/ApiError.js";
import { isObjectId } from "../utils/objectId.js";
import { verifyToken } from "../utils/tokens.js";

const userModels = {
  admin: Vaspitac,
  staratelj: Staratelj,
  vaspitac: Vaspitac,
};

function authenticate(...allowedRoles) {
  return async function authenticateRequest(req, res, next) {
    const authorization = req.get("authorization") || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return next(new ApiError(401, "Unauthenticated."));
    }

    let payload;
    try {
      payload = verifyToken(match[1]);
    } catch (error) {
      if (error.name === "ApiError") {
        return next(error);
      }
      return next(new ApiError(401, "Unauthenticated."));
    }

    const roles = payload.role && allowedRoles.includes(payload.role)
      ? [payload.role]
      : [];

    if (!roles.length || !isObjectId(payload.sub)) {
      return next(new ApiError(401, "Unauthenticated."));
    }

    try {
      for (const role of roles) {
        const user = await userModels[role].findById(payload.sub);
        if (user && (role !== "admin" || user.uloga === "admin")) {
          req.auth = { role, user };
          return next();
        }
      }
      return next(new ApiError(401, "Unauthenticated."));
    } catch (error) {
      return next(error);
    }
  };
}

export default authenticate;

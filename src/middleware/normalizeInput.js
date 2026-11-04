const untrimmedKeys = new Set(["current_password", "password", "password_confirmation"]);

function normalizeValue(value, key) {
  if (typeof value === "string") {
    const normalized = untrimmedKeys.has(key) ? value : value.trim();
    return normalized === "" ? null : normalized;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, ""));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        normalizeValue(childValue, childKey),
      ]),
    );
  }

  return value;
}

function normalizeInput(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = normalizeValue(req.body, "");
  }
  next();
}

export default normalizeInput;

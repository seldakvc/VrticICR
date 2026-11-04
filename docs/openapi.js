const json = (schema) => ({
  "application/json": { schema },
});

const response = (description, schema) => ({
  description,
  ...(schema ? { content: json(schema) } : {}),
});

const apiError = { $ref: "#/components/schemas/ApiError" };
const errorResponses = {
  401: response("Authentication required or credentials are invalid.", apiError),
  422: response("Request validation failed.", apiError),
  500: response("Unexpected server error.", apiError),
  503: response("MongoDB is not connected.", apiError),
  429: response("API request rate limit exceeded.", apiError),
};
const registrationErrors = {
  422: response("Request validation failed.", apiError),
  500: response("Registration failed.", { $ref: "#/components/schemas/RegistrationError" }),
  503: response("MongoDB is not connected.", apiError),
  429: response("API request rate limit exceeded.", apiError),
};
const publicErrors = {
  500: response("Unexpected server error.", apiError),
  503: response("MongoDB is not connected.", apiError),
  429: response("API request rate limit exceeded.", apiError),
};
const bearer = [{ bearerAuth: [] }];

function operation(summary, tags, responses, options = {}) {
  return {
    summary,
    tags: [tags],
    ...(options.security ? { security: bearer } : {}),
    ...(options.parameters ? { parameters: options.parameters } : {}),
    ...(options.requestBody ? { requestBody: options.requestBody } : {}),
    responses,
  };
}

function itemParameters() {
  return [{
    in: "path",
    name: "id",
    required: true,
    description: "MongoDB ObjectId.",
    schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
  }];
}

function requestBody(schema, description = "JSON request body.") {
  return {
    required: true,
    description,
    content: json({ $ref: `#/components/schemas/${schema}` }),
  };
}

function securedErrors(extra = {}) {
  return { ...extra, ...errorResponses };
}

const openApiDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Vrtic backend API",
    version: "1.0.0",
    description: "Express migration of the active Laravel API. IDs are MongoDB ObjectIds represented as strings.",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ApiError: {
        type: "object",
        properties: {
          message: { type: "string" },
          errors: {
            type: "object",
            additionalProperties: { type: "array", items: { type: "string" } },
          },
        },
        required: ["message"],
      },
      RegistrationError: {
        type: "object",
        properties: {
          message: { type: "string", example: "Registration failed" },
          error: { type: "string" },
        },
        required: ["message", "error"],
      },
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      VaspitacRegistration: {
        type: "object",
        required: ["ime", "prezime", "grupa_id", "username", "password"],
        properties: {
          ime: { type: "string", maxLength: 255 },
          prezime: { type: "string", maxLength: 255 },
          grupa_id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
          username: { type: "string", maxLength: 255 },
          password: { type: "string", minLength: 6 },
        },
      },
      StarateljRegistration: {
        type: "object",
        required: ["ime", "prezime", "username", "password"],
        properties: {
          ime: { type: "string", maxLength: 255 },
          prezime: { type: "string", maxLength: 255 },
          kontakt: { type: "string", nullable: true, maxLength: 255 },
          adresa: { type: "string", nullable: true, maxLength: 255 },
          status: { type: "integer", nullable: true },
          username: { type: "string", maxLength: 255 },
          password: { type: "string", minLength: 6 },
        },
      },
      VaspitacWrite: {
        type: "object",
        properties: {
          ime: { type: "string" },
          prezime: { type: "string" },
          statuss: { type: "string" },
          grupa_id: { type: "string", nullable: true, pattern: "^[a-fA-F0-9]{24}$" },
          username: { type: "string" },
          password: { type: "string" },
          status: { type: "integer" },
          uloga: { type: "string", enum: ["vaspitac", "admin"] },
        },
      },
      StarateljWrite: {
        type: "object",
        properties: {
          ime: { type: "string" },
          prezime: { type: "string" },
          kontakt: { type: "string", nullable: true },
          adresa: { type: "string", nullable: true },
          status: { type: "integer", nullable: true },
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      DijeteWrite: {
        type: "object",
        description: "Fields accepted by the Laravel Dijete model; source table type definitions are unavailable.",
        properties: {
          ime: { type: "string" },
          prezime: { type: "string" },
          datum_rodjenja: { description: "Type preserved from the request; not specified by a Laravel create-table migration." },
          pol: { description: "Type preserved from the request; not specified by a Laravel create-table migration." },
          staratelj_id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
          grupa_id: { type: "string", nullable: true, pattern: "^[a-fA-F0-9]{24}$" },
          prisustvo: { description: "Type preserved from the request; not specified by a Laravel create-table migration." },
          status: { description: "Type preserved from the request; not specified by a Laravel create-table migration." },
        },
      },
      GrupaWrite: {
        type: "object",
        description: "Fields accepted by the Laravel Grupa model; source table type definitions are unavailable.",
        properties: {
          naziv_grupe: { type: "string" },
          uzrast: { description: "Type preserved from the request; not specified by a Laravel create-table migration." },
          max_br_clanova: { description: "Type preserved from the request; not specified by a Laravel create-table migration." },
          status: { description: "Type preserved from the request; not specified by a Laravel create-table migration." },
        },
      },
      Dijete: {
        type: "object",
        properties: {
          dijete_id: { type: "string" },
          ime: { type: "string" },
          prezime: { type: "string" },
          datum_rodjenja: {},
          pol: {},
          staratelj_id: { type: "string" },
          grupa_id: { type: "string", nullable: true },
          prisustvo: {},
          status: {},
        },
      },
      Grupa: {
        type: "object",
        properties: {
          grupa_id: { type: "string" },
          naziv_grupe: { type: "string" },
          uzrast: {},
          max_br_clanova: {},
          status: {},
        },
      },
      Staratelj: {
        type: "object",
        properties: {
          staratelj_id: { type: "string" },
          ime: { type: "string" },
          prezime: { type: "string" },
          kontakt: { type: "string", nullable: true },
          adresa: { type: "string", nullable: true },
          status: { type: "integer", nullable: true },
          username: { type: "string" },
        },
      },
      Vaspitac: {
        type: "object",
        properties: {
          vaspitac_id: { type: "string" },
          ime: { type: "string" },
          prezime: { type: "string" },
          statuss: { type: "string" },
          grupa_id: { type: "string", nullable: true },
          username: { type: "string" },
          status: { type: "integer" },
          uloga: { type: "string", enum: ["vaspitac", "admin"] },
          grupa: { $ref: "#/components/schemas/Grupa" },
        },
      },
      AuthVaspitacResponse: {
        type: "object",
        properties: {
          vaspitac: { $ref: "#/components/schemas/Vaspitac" },
          role: { type: "string" },
          token: { type: "string" },
        },
      },
      AuthStarateljResponse: {
        type: "object",
        properties: {
          staratelj: {
            type: "object",
            properties: {
              staratelj_id: { type: "string" },
              username: { type: "string" },
            },
          },
          token: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/": {
      get: operation("API welcome message", "System", {
        200: response("Welcome response.", {
          type: "object",
          properties: { message: { type: "string" } },
        }),
      }),
    },
    "/health": {
      get: operation("Health check", "System", {
        200: response("Server is healthy.", {
          type: "object",
          properties: { status: { type: "string", example: "ok" } },
        }),
      }),
    },
    "/api/vaspitac": {
      get: operation("List educators", "Educators", {
        200: response("Educator list.", { type: "array", items: { $ref: "#/components/schemas/Vaspitac" } }),
        ...publicErrors,
      }),
    },
    "/api/vaspitac/register": {
      post: operation("Register an educator", "Authentication", {
        201: response("Educator and bearer token created.", { $ref: "#/components/schemas/AuthVaspitacResponse" }),
        ...registrationErrors,
      }, { requestBody: requestBody("VaspitacRegistration") }),
    },
    "/api/vaspitac/login": {
      post: operation("Log in an educator", "Authentication", {
        200: response("Educator and bearer token.", { $ref: "#/components/schemas/AuthVaspitacResponse" }),
        401: response("Invalid credentials.", apiError),
        422: response("Request validation failed.", apiError),
        500: response("Unexpected server error.", apiError),
        503: response("MongoDB is not connected.", apiError),
        429: response("API request rate limit exceeded.", apiError),
      }, { requestBody: requestBody("LoginRequest") }),
    },
    "/api/vaspitac/me": {
      get: operation("Get the authenticated educator and group", "Educators", securedErrors({
        200: response("Current educator, including the populated group.", { $ref: "#/components/schemas/Vaspitac" }),
      }), { security: true }),
    },
    "/api/vaspitac/grupa-djeca": {
      get: operation("List children in the educator's group", "Educators", securedErrors({
        200: response("Children in the current educator's group.", { type: "array", items: { $ref: "#/components/schemas/Dijete" } }),
      }), { security: true }),
    },
    "/api/vaspitac/{id}": {
      get: operation("Get an educator by ID", "Educators", securedErrors({
        200: response("Educator record, or null when no record exists.", { $ref: "#/components/schemas/Vaspitac" }),
      }), { security: true, parameters: itemParameters() }),
      put: operation("Update an educator", "Educators", securedErrors({
        200: response("Updated educator.", { $ref: "#/components/schemas/Vaspitac" }),
        404: response("Educator not found.", apiError),
      }), { security: true, parameters: itemParameters(), requestBody: requestBody("VaspitacWrite") }),
      delete: operation("Delete an educator", "Educators", securedErrors({
        200: response("Deletion confirmation.", { type: "object", properties: { message: { type: "string" } } }),
        404: response("Educator not found.", apiError),
      }), { security: true, parameters: itemParameters() }),
    },
    "/api/staratelj/register": {
      post: operation("Register a guardian", "Authentication", {
        201: response("Guardian and bearer token created.", { $ref: "#/components/schemas/AuthStarateljResponse" }),
        ...registrationErrors,
      }, { requestBody: requestBody("StarateljRegistration") }),
    },
    "/api/staratelj/login": {
      post: operation("Log in a guardian", "Authentication", {
        200: response("Guardian and bearer token.", { $ref: "#/components/schemas/AuthStarateljResponse" }),
        401: response("Invalid credentials.", apiError),
        422: response("Request validation failed.", apiError),
        500: response("Unexpected server error.", apiError),
        503: response("MongoDB is not connected.", apiError),
        429: response("API request rate limit exceeded.", apiError),
      }, { requestBody: requestBody("LoginRequest") }),
    },
    "/api/staratelj/me": {
      get: operation("Get the authenticated guardian", "Guardians", securedErrors({
        200: response("Current guardian.", { $ref: "#/components/schemas/Staratelj" }),
      }), { security: true }),
    },
    "/api/staratelj/djeca": {
      get: operation("List the authenticated guardian's children", "Guardians", securedErrors({
        200: response("Children owned by the current guardian.", { type: "array", items: { $ref: "#/components/schemas/Dijete" } }),
      }), { security: true }),
    },
    "/api/staratelj/djeca/{id}": {
      get: operation("Get one of the authenticated guardian's children", "Guardians", securedErrors({
        200: response("Owned child record.", { $ref: "#/components/schemas/Dijete" }),
        404: response("Child not found or not owned by the guardian.", apiError),
      }), { security: true, parameters: itemParameters() }),
    },
    "/api/staratelji": {
      get: operation("List guardians", "Guardians", securedErrors({
        200: response("Guardian list.", { type: "array", items: { $ref: "#/components/schemas/Staratelj" } }),
      }), { security: true }),
      post: operation("Create a guardian", "Guardians", securedErrors({
        201: response("Created guardian.", { $ref: "#/components/schemas/Staratelj" }),
      }), { security: true, requestBody: requestBody("StarateljRegistration") }),
    },
    "/api/staratelji/{id}": {
      get: operation("Get a guardian by ID", "Guardians", securedErrors({
        200: response("Guardian record, or null when no record exists.", { $ref: "#/components/schemas/Staratelj" }),
      }), { security: true, parameters: itemParameters() }),
      put: operation("Update a guardian", "Guardians", securedErrors({
        200: response("Updated guardian.", { $ref: "#/components/schemas/Staratelj" }),
        404: response("Guardian not found.", apiError),
      }), { security: true, parameters: itemParameters(), requestBody: requestBody("StarateljWrite") }),
      delete: operation("Delete a guardian", "Guardians", securedErrors({
        200: response("Deletion confirmation.", { type: "object", properties: { message: { type: "string" } } }),
        404: response("Guardian not found.", apiError),
      }), { security: true, parameters: itemParameters() }),
    },
    "/api/grupa": {
      get: operation("List groups", "Groups", securedErrors({
        200: response("Group list.", { type: "array", items: { $ref: "#/components/schemas/Grupa" } }),
      }), { security: true }),
      post: operation("Create a group", "Groups", securedErrors({
        201: response("Created group.", { $ref: "#/components/schemas/Grupa" }),
      }), { security: true, requestBody: requestBody("GrupaWrite") }),
    },
    "/api/grupa/{id}": {
      get: operation("Get a group by ID", "Groups", securedErrors({
        200: response("Group record, or null when no record exists.", { $ref: "#/components/schemas/Grupa" }),
      }), { security: true, parameters: itemParameters() }),
      put: operation("Update a group", "Groups", securedErrors({
        200: response("Updated group.", { $ref: "#/components/schemas/Grupa" }),
        404: response("Group not found.", apiError),
      }), { security: true, parameters: itemParameters(), requestBody: requestBody("GrupaWrite") }),
      delete: operation("Delete a group", "Groups", securedErrors({
        200: response("Deletion confirmation.", { type: "object", properties: { message: { type: "string" } } }),
        404: response("Group not found.", apiError),
      }), { security: true, parameters: itemParameters() }),
    },
    "/api/dijete": {
      get: operation("List children", "Children", securedErrors({
        200: response("Child list.", { type: "array", items: { $ref: "#/components/schemas/Dijete" } }),
      }), { security: true }),
      post: operation("Create a child", "Children", securedErrors({
        201: response("Created child.", { $ref: "#/components/schemas/Dijete" }),
      }), { security: true, requestBody: requestBody("DijeteWrite", "A vaspitac or staratelj bearer token is accepted.") }),
    },
    "/api/dijete/{id}": {
      get: operation("Get a child by ID", "Children", securedErrors({
        200: response("Child record, or null when no record exists.", { $ref: "#/components/schemas/Dijete" }),
      }), { security: true, parameters: itemParameters() }),
      put: operation("Update a child", "Children", securedErrors({
        200: response("Updated child.", { $ref: "#/components/schemas/Dijete" }),
        404: response("Child not found.", apiError),
      }), { security: true, parameters: itemParameters(), requestBody: requestBody("DijeteWrite") }),
      delete: operation("Delete a child", "Children", securedErrors({
        200: response("Deletion confirmation.", { type: "object", properties: { message: { type: "string" } } }),
        404: response("Child not found.", apiError),
      }), { security: true, parameters: itemParameters() }),
    },
  },
};

export default openApiDefinition;

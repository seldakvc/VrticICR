import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import app from "../src/app.js";
import Dijete from "../src/models/Dijete.js";
import Staratelj from "../src/models/Staratelj.js";
import User from "../src/models/User.js";
import Vaspitac from "../src/models/Vaspitac.js";
import openApi from "../docs/openapi.js";
import swaggerSpec from "../src/config/swagger.js";
import validateBody from "../src/middleware/validateBody.js";
import { educatorRegistrationRules } from "../src/middleware/validationRules.js";
import { createToken, verifyToken } from "../src/utils/tokens.js";
import { comparePassword } from "../src/utils/passwords.js";
import RegistrationError from "../src/utils/RegistrationError.js";
import errorHandler from "../src/middleware/errorHandler.js";

let server;
let baseUrl;

before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, () => resolve(listener));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test("health and root routes preserve their existing response shapes", async () => {
  const root = await fetch(`${baseUrl}/`);
  assert.equal(root.status, 200);
  assert.deepEqual(await root.json(), { message: "Vrtic backend API" });

  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });
});

test("Swagger UI serves the generated OpenAPI 3 specification", async () => {
  const response = await fetch(`${baseUrl}/api-docs/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Swagger UI/);
  assert.equal(openApi.openapi, "3.0.3");
  assert.ok(swaggerSpec.paths["/api/dijete"]);
});

test("API requests report the inactive database without opening a connection", async () => {
  const response = await fetch(`${baseUrl}/api/grupa`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { message: "Database connection is not active." });
  assert.equal(mongoose.connection.readyState, 0);
});

test("all active Laravel API routes have documented methods", () => {
  const routes = [
    ["get", "/api/vaspitac"],
    ["post", "/api/vaspitac/register"],
    ["post", "/api/vaspitac/login"],
    ["get", "/api/vaspitac/me"],
    ["get", "/api/vaspitac/grupa-djeca"],
    ["get", "/api/vaspitac/{id}"],
    ["put", "/api/vaspitac/{id}"],
    ["delete", "/api/vaspitac/{id}"],
    ["post", "/api/staratelj/register"],
    ["post", "/api/staratelj/login"],
    ["get", "/api/staratelj/me"],
    ["get", "/api/staratelj/djeca"],
    ["get", "/api/staratelj/djeca/{id}"],
    ["get", "/api/staratelji"],
    ["get", "/api/staratelji/{id}"],
    ["post", "/api/staratelji"],
    ["put", "/api/staratelji/{id}"],
    ["delete", "/api/staratelji/{id}"],
    ["get", "/api/grupa"],
    ["get", "/api/grupa/{id}"],
    ["post", "/api/grupa"],
    ["put", "/api/grupa/{id}"],
    ["delete", "/api/grupa/{id}"],
    ["get", "/api/dijete"],
    ["post", "/api/dijete"],
    ["get", "/api/dijete/{id}"],
    ["put", "/api/dijete/{id}"],
    ["delete", "/api/dijete/{id}"],
  ];

  for (const [method, path] of routes) {
    assert.ok(swaggerSpec.paths[path]?.[method], `Missing Swagger operation: ${method.toUpperCase()} ${path}`);
  }
});

test("Mongoose JSON preserves Laravel entity ID names and hides passwords", () => {
  const objectId = new mongoose.Types.ObjectId();
  const child = new Dijete({ _id: objectId, ime: "Ana" }).toJSON();
  assert.equal(child.dijete_id, objectId.toString());
  assert.equal(child.ime, "Ana");
  assert.equal("_id" in child, false);

  const guardian = new Staratelj({ username: "parent", password: "secret" }).toJSON();
  assert.equal("password" in guardian, false);

  const educator = new Vaspitac({ username: "teacher" }).toJSON();
  assert.ok("vaspitac_id" in educator);

  const user = new User({ name: "User" }).toJSON();
  assert.ok("id" in user);
});

test("educator registration validation returns Laravel-style 422 fields", async () => {
  const error = await new Promise((resolve) => {
    validateBody(educatorRegistrationRules)({ body: {} }, {}, resolve);
  });
  assert.equal(error.status, 422);
  assert.deepEqual(Object.keys(error.errors).sort(), [
    "grupa_id",
    "ime",
    "password",
    "prezime",
    "username",
  ]);
});

test("foreign-key validation checks the referenced model", async () => {
  const id = new mongoose.Types.ObjectId().toString();
  let queriedId;
  const request = { body: { group_id: id } };
  const result = await new Promise((resolve) => {
    validateBody({
      group_id: {
        required: true,
        type: "objectId",
        exists: {
          async exists(query) {
            queriedId = query._id;
            return true;
          },
        },
      },
    })(request, {}, resolve);
  });

  assert.equal(result, undefined);
  assert.equal(queriedId, id);
  assert.equal(request.body.group_id, id);
});

test("Express JWTs carry the account role and use the configured secret", () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-only-secret";
  try {
    const id = new mongoose.Types.ObjectId().toString();
    const token = createToken({ _id: id }, "staratelj");
    const payload = verifyToken(token);
    assert.equal(payload.sub, id);
    assert.equal(payload.role, "staratelj");
  } finally {
    if (previousSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = previousSecret;
    }
  }
});

test("bcrypt verifies the PHP 2y password-hash prefix", async () => {
  const bcryptHash = await bcrypt.hash("migration-password", 4);
  const phpHash = `$2y$${bcryptHash.slice(4)}`;
  assert.equal(await comparePassword("migration-password", phpHash), true);
});

test("educator registration errors preserve the Laravel response shape", () => {
  let statusCode;
  let body;
  const response = {
    headersSent: false,
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  errorHandler(new RegistrationError("duplicate account"), {}, response, assert.fail);
  assert.equal(statusCode, 500);
  assert.deepEqual(body, {
    message: "Registration failed",
    error: "duplicate account",
  });
});

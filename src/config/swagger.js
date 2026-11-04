import swaggerJSDoc from "swagger-jsdoc";
import openApiDefinition from "../../docs/openapi.js";

const swaggerSpec = swaggerJSDoc({
  definition: openApiDefinition,
  apis: [],
});

export default swaggerSpec;

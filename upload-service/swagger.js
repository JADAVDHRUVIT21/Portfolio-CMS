const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Portfolio CMS Multer Upload API",
      version: "1.0.0",
      description:
        "API documentation for the Portfolio CMS image upload service",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local upload server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
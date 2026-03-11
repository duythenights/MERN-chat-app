import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { Env } from "./env.config";

/**
 * Registers Swagger UI at `/api-docs` with an OpenAPI document for this API.
 * @param app - Express application instance.
 * @returns void
 */
export function setupSwagger(app: Express): void {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(buildOpenApiDocument(), {
      customSiteTitle: "Chat API docs",
    })
  );
}

function buildOpenApiDocument() {
  const baseUrl = `http://localhost:${Env.PORT}`;

  return {
    openapi: "3.0.3",
    info: {
      title: "MERN Real-Time Messenger API",
      version: "1.0.0",
      description:
        "REST API for auth, users, chats, and messages. JWT is issued as an **httpOnly** cookie `accessToken` on register and login. For protected routes in Swagger UI, use **Authorize** and paste the raw JWT value (cookie value).",
    },
    servers: [{ url: baseUrl, description: "Local" }],
    tags: [
      { name: "Health" },
      { name: "Auth" },
      { name: "Users" },
      { name: "Chats" },
      { name: "Messages" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            avatar: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            avatar: { type: "string" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        CreateChatRequest: {
          type: "object",
          properties: {
            participantId: {
              type: "string",
              description: "Other user id for a 1:1 chat",
            },
            isGroup: { type: "boolean" },
            participants: {
              type: "array",
              items: { type: "string" },
              description: "Additional user ids (group)",
            },
            groupName: { type: "string" },
          },
          description:
            "For a direct chat send `participantId`. For a group send `isGroup: true`, `participants`, and `groupName`.",
        },
        SendMessageRequest: {
          type: "object",
          required: ["chatId"],
          properties: {
            chatId: { type: "string" },
            content: { type: "string" },
            image: {
              type: "string",
              description: "Base64 or data URL uploaded to Cloudinary",
            },
            replyToId: { type: "string" },
          },
          description: "Provide at least one of `content` or `image`.",
        },
        ErrorBody: {
          type: "object",
          properties: {
            message: { type: "string" },
            statusCode: { type: "integer" },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      status: { type: "string", example: "OK" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created; sets accessToken cookie",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Validation or conflict",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "OK; sets accessToken cookie",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout",
          responses: {
            "200": {
              description: "Clears accessToken cookie",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/status": {
        get: {
          tags: ["Auth"],
          summary: "Current user from JWT cookie",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "Authenticated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Missing or invalid token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
      "/api/user/all": {
        get: {
          tags: ["Users"],
          summary: "List users except self",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      users: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
      "/api/chat/create": {
        post: {
          tags: ["Chats"],
          summary: "Create or return existing direct chat",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateChatRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Chat created or retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      chat: { type: "object", additionalProperties: true },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
      "/api/chat/all": {
        get: {
          tags: ["Chats"],
          summary: "List chats for current user",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      chats: {
                        type: "array",
                        items: { type: "object", additionalProperties: true },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
      "/api/chat/{id}": {
        get: {
          tags: ["Chats"],
          summary: "Get chat and messages",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      chat: { type: "object", additionalProperties: true },
                      messages: {
                        type: "array",
                        items: { type: "object", additionalProperties: true },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Not found or forbidden",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
      "/api/chat/message/send": {
        post: {
          tags: ["Messages"],
          summary: "Send a message",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SendMessageRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      userMessage: {
                        type: "object",
                        additionalProperties: true,
                      },
                      chat: { type: "object", additionalProperties: true },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Validation or chat access",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorBody" },
                },
              },
            },
          },
        },
      },
    },
  };
}

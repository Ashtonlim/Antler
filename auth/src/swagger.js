const swaggerJsDoc = {
  "openapi": "3.0.2",
  "info": {
    "title": "Library API",
    "version": "1.0.0",
    "description": "A simple Express Library API"
  },
  "servers": [
    {
      "url": "http://localhost:8000"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Returns the list of all users",
        "tags": ["Users"],
        "responses": {
          "200": {
            "description": "List of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "tags": [],
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "required": ["email", "username", "password", "name", "phone_num", "funds", "portfolio_private"],
        "properties": {
          "id": {
            "type": "string",
            "description": "The auto-generated id of the user"
          },
          "email": {
            "type": "string",
            "description": "The user email"
          },
          "username": {
            "type": "string",
            "description": "The user username"
          },
          "password": {
            "type": "string",
            "description": "The user password"
          },
          "phone_num": {
            "type": "string",
            "description": "The user phone number"
          },
          "funds": {
            "type": "string",
            "description": "The user available funds"
          },
          "portfolio_private": {
            "type": "string",
            "description": "If portfolio is viewable by the public or not"
          }
        },
        "example": {
          "portfolio_private": true,
          "_id": "60c22bc5731895089860b64c",
          "username": "ash",
          "name": "ashy"
        }
      }
    }
  }
}

export default swaggerJsDoc
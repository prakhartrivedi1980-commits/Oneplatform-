# API Design

## Overview

OnePlatform provides a REST API under the `/api/v1` endpoint. The API is built using NestJS.

## API Structure

```
/api/v1/
├── auth/          # Authentication endpoints
├── users/         # User-related endpoints
├── problems/      # Problem-related endpoints
├── submissions/   # Submission-related endpoints
├── analytics/     # Analytics endpoints
├── topics/        # Topic-related endpoints
└── recommendations # Recommendation endpoints
```

## Core Principles

1. **Versioning**: All endpoints are versioned with `/v1`
2. **Consistency**: Consistent response formats
3. **Validation**: DTO validation for all inputs
4. **Error Handling**: Consistent error responses
5. **Pagination**: Support for paginated responses
6. **Authentication**: JWT-based authentication
7. **Authorization**: Role-based access control

## DTO Validation

1. **Input Validation**: All request bodies are validated
2. **Response Validation**: Response schemas are defined
3. **Error Responses**: Standardized error formats

## Error Handling

Standard error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "property": "email",
      "message": "must be an email"
    }
  ]
}
```

## Pagination

All list endpoints support pagination:

```
?page=1
&limit=20
&sort=createdAt:desc
```

## Authentication

1. **JWT**: JSON Web Tokens for authentication
2. **Refresh Tokens**: For token refresh
3. **Session Management**: Secure session handling

## Authorization

1. **Role-Based**: Different roles have different permissions
2. **Resource Ownership**: Users can only access their own data
3. **Policy Decorators**: Fine-grained authorization

## API Documentation

1. **Swagger/OpenAPI**: Automatic API documentation
2. **Endpoint Descriptions**: Clear descriptions for each endpoint
3. **Example Requests/Responses**: Provided for each endpoint

## Implementation Considerations

1. **NestJS Modules**: Organized by feature
2. **Controllers**: Handle HTTP requests
3. **Services**: Business logic
4. **Repositories**: Database access
5. **Interceptors**: Cross-cutting concerns

## Rate Limiting

1. **Global Rate Limits**: Applied to all endpoints
2. **User-Specific Limits**: Applied to user-specific endpoints
3. **Throttling**: Exponential backoff for rate-limited requests

## Security Headers

1. **CORS**: Configured for allowed origins
2. **Content Security Policy**: Enforced
3. **XSS Protection**: Enabled
4. **HTTP Strict Transport Security**: Enforced

## API Gateway Considerations

While we're starting with a direct NestJS API, we may add an API gateway in the future for:

1. Rate limiting
2. Authentication
3. Request/response transformation
4. Load balancing
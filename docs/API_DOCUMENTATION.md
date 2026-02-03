# Adonis Health API Documentation

Welcome to the Adonis Health API documentation. This document provides detailed information about all available endpoints, request schemas, and response formats.

---

## Authentication

The authentication API provides a secure and HIPAA-compliant way to manage user accounts and sessions. All endpoints in this section are prefixed with `/auth`.

### POST /auth/register

Registers a new patient user and creates their associated profile.

**Request Body:**

| Field | Type | Description |
|---|---|---|
| `email` | `string` | The user's email address. Must be unique. |
| `password` | `string` | The user's password. Must meet strength requirements. |
| `firstName` | `string` | The user's first name. |
| `lastName` | `string` | The user's last name. |
| `dob` | `string` | The user's date of birth in `YYYY-MM-DD` format. |
| `gender` | `string` | The user's gender (`MALE` or `FEMALE`). |

**Example Request:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "gender": "MALE"
}
```

**Success Response (201 Created):**

Returns a JWT access token and user object.

```json
{
  "access_token": "<jwt_token>",
  "user": {
    "id": "<user_id>",
    "email": "john.doe@example.com",
    "role": "PATIENT"
  }
}
```

**Error Responses:**

- `400 Bad Request`: If the password does not meet the strength requirements.
- `409 Conflict`: If a user with the provided email already exists.

---

### POST /auth/login

Authenticates a user and returns a JWT access token.

**Request Body:**

| Field | Type | Description |
|---|---|---|
| `email` | `string` | The user's email address. |
| `password` | `string` | The user's password. |

**Example Request:**

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**

```json
{
  "access_token": "<jwt_token>",
  "user": {
    "id": "<user_id>",
    "email": "john.doe@example.com",
    "role": "PATIENT"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: If the credentials are invalid or the account is locked.

---

### POST /auth/logout

Logs out the currently authenticated user. This endpoint requires a valid JWT token.

**Authorization:** `Bearer <jwt_token>`

**Success Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

---

### GET /auth/me

Retrieves the profile of the currently authenticated user. This endpoint requires a valid JWT token.

**Authorization:** `Bearer <jwt_token>`

**Success Response (200 OK):**

```json
{
  "id": "<user_id>",
  "email": "john.doe@example.com",
  "role": "PATIENT",
  "createdAt": "2026-02-03T22:49:34.328Z",
  "patientProfile": {
    "id": "<profile_id>",
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1990-01-01T00:00:00.000Z",
    "gender": "MALE",
    "phone": null,
    "address": null
  },
  "providerProfile": null,
  "conciergeProfile": null
}
```

---

### POST /auth/change-password

Changes the password for the currently authenticated user. This endpoint requires a valid JWT token.

**Authorization:** `Bearer <jwt_token>`

**Request Body:**

| Field | Type | Description |
|---|---|---|
| `currentPassword` | `string` | The user's current password. |
| `newPassword` | `string` | The user's new password. Must meet strength requirements. |

**Example Request:**

```json
{
  "currentPassword": "SecurePassword123!",
  "newPassword": "EvenMoreSecure123!@#"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

- `400 Bad Request`: If the new password does not meet strength requirements.
- `401 Unauthorized`: If the current password is incorrect.

---

## Error Responses

| Status Code | Message | Description |
|---|---|---|
| `400 Bad Request` | `Bad Request` | The request body is invalid or missing required fields. |
| `401 Unauthorized` | `Unauthorized` | The request is missing a valid JWT token or the credentials are invalid. |
| `403 Forbidden` | `Forbidden` | The authenticated user does not have permission to access the resource. |
| `404 Not Found` | `Not Found` | The requested resource could not be found. |
| `409 Conflict` | `Conflict` | The request could not be completed due to a conflict with the current state of the resource. |
| `500 Internal Server Error` | `Internal Server Error` | An unexpected error occurred on the server. |

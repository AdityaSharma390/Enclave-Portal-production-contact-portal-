# Enclave Portal - REST API Documentation

This document describes the endpoints provided by the Enclave Portal backend. All request/response payloads use JSON format, except where multipart/form-data is specified for file uploads.

---

## Authentication Endpoints

### 1. Register User
* **URL**: `/api/auth/register`
* **Method**: `POST`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "strongpassword123",
    "role": "User" // Optional: "User" or "Admin" (defaults to "User")
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "token": "eyJhbGciOi...",
    "user": {
      "id": "60d0fe23...",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "User",
      "createdAt": "2026-07-12T10:00:00.000Z"
    }
  }
  ```

### 2. User Login
* **URL**: `/api/auth/login`
* **Method**: `POST`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "strongpassword123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "id": "60d0fe23...",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "User",
      "createdAt": "2026-07-12T10:00:00.000Z"
    }
  }
  ```

### 3. Get Logged-in Profile
* **URL**: `/api/auth/profile`
* **Method**: `GET`
* **Access**: Private (Requires `Authorization: Bearer <token>` header)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "60d0fe23...",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "User",
      "createdAt": "2026-07-12T10:00:00.000Z"
    }
  }
  ```

---

## Contact Management Endpoints

All contact routes are **Private** and require the `Authorization: Bearer <token>` header.

- **Security Enforcement**: Regular users can only access/modify contacts that they created. Admin users can access all contacts globally.

### 4. Create Contact
* **URL**: `/api/contact`
* **Method**: `POST`
* **Content-Type**: `multipart/form-data`
* **Request Parameters**:
  - `firstName` (String, Required)
  - `lastName` (String, Required)
  - `email` (String, Optional)
  - `phone` (String, Optional)
  - `company` (String, Optional)
  - `address` (String, Optional)
  - `notes` (String, Optional)
  - `profileImage` (File, Optional - Image under 5MB)
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Contact created successfully",
    "contact": {
      "id": "60d0f419...",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@company.com",
      "phone": "+1 555-123-4567",
      "company": "Tech Corp",
      "address": "123 Main St",
      "notes": "Met at conference.",
      "profileImage": "https://res.cloudinary.com/...",
      "createdBy": "60d0fe23...",
      "createdAt": "2026-07-12T10:15:00.000Z",
      "updatedAt": "2026-07-12T10:15:00.000Z"
    }
  }
  ```

### 5. List Contacts (with Search, Filter, Sort, Paginate)
* **URL**: `/api/contact` (also aliased as `/api/contact/search`)
* **Method**: `GET`
* **Query Parameters (Optional)**:
  - `search` (String): Search by name, email, company, or phone (case-insensitive regex match)
  - `company` (String): Exact/partial filter for company name
  - `sort` (String): Sort by name (`name`) or date (`date`). Defaults to date desc.
  - `order` (String): `asc` or `desc` (Defaults to desc)
  - `page` (Number): Page number (Defaults to 1)
  - `limit` (Number): Items per page (Defaults to 10)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "contacts": [ ... ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
  ```

### 6. Get Contact Details
* **URL**: `/api/contact/:id`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "contact": { ... }
  }
  ```

### 7. Update Contact
* **URL**: `/api/contact/:id`
* **Method**: `PUT`
* **Content-Type**: `multipart/form-data`
* **Request Parameters**: Same as Create Contact, but all fields are optional (partial updates).
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Contact updated successfully",
    "contact": { ... }
  }
  ```

### 8. Delete Contact
* **URL**: `/api/contact/:id`
* **Method**: `DELETE`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Contact deleted successfully"
  }
  ```

### 9. Get Dashboard Stats
* **URL**: `/api/contact/dashboard-stats`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "stats": {
      "totalContacts": 12,
      "totalUsers": 2,
      "recentContacts": [ ... ],
      "latestActivity": [
        {
          "id": "create-60d0...",
          "type": "create",
          "message": "Contact \"John Smith\" was created",
          "time": "2026-07-12T10:15:00.000Z",
          "user": "Jane Doe"
        }
      ]
    }
  }
  ```

---

## Global Error Responses

### Validation Errors (400 Bad Request)
Returned when body validation checks (Zod) fail.
```json
{
  "success": false,
  "message": "Validation errors occurred",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### Unauthorized Error (401 Unauthorized)
Returned if JWT is missing, invalid, or expired.
```json
{
  "success": false,
  "message": "Not authorized, token invalid or expired"
}
```

### Forbidden Error (403 Forbidden)
Returned if a user attempts to access/modify a contact they do not own (and they are not an Admin).
```json
{
  "success": false,
  "message": "Forbidden. You do not own this contact."
}
```

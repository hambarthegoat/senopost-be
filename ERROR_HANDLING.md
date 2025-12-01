# Error Handling Documentation

This document outlines all the error handling implemented across the SenoPost API.

## Error Types

The API uses the following NestJS exception types:

- **BadRequestException (400)**: Invalid input, missing required fields, or malformed data
- **UnauthorizedException (401)**: Authentication failed or missing authentication
- **NotFoundException (404)**: Resource not found (user, post, community, comment)
- **ConflictException (409)**: Duplicate entries (email, community name)
- **InternalServerErrorException (500)**: Unexpected errors or database failures

## Endpoints Error Handling

### Authentication (`/auth`)

#### POST `/auth/register`
**Possible Errors:**
- `400 Bad Request`: Email or password missing, password less than 6 characters
- `409 Conflict`: Email already exists
- `500 Internal Server Error`: Database connection issues

#### POST `/auth/login`
**Possible Errors:**
- `400 Bad Request`: Email or password missing
- `401 Unauthorized`: Invalid credentials (wrong email or password)
- `500 Internal Server Error`: Database connection issues

---

### Users (`/users` and `/me`)

#### GET `/me`
**Possible Errors:**
- `401 Unauthorized`: Not authenticated (no JWT token)
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database issues

#### PATCH `/me`
**Possible Errors:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: User not found
- `409 Conflict`: Email already in use
- `500 Internal Server Error`: Database issues

#### DELETE `/me`
**Possible Errors:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database issues

#### GET `/user/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid user ID
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database issues

---

### Communities (`/communities`)

#### POST `/communities`
**Possible Errors:**
- `400 Bad Request`: Community name missing or creator ID missing
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Creator user not found
- `409 Conflict`: Community name already exists
- `500 Internal Server Error`: Database issues

#### GET `/communities/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid community ID
- `404 Not Found`: Community not found
- `500 Internal Server Error`: Database issues

#### GET `/communities/:id/posts`
**Possible Errors:**
- `400 Bad Request`: Invalid community ID
- `500 Internal Server Error`: Database issues

#### PATCH `/communities/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid community ID
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Community not found
- `500 Internal Server Error`: Database issues

#### DELETE `/communities/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid community ID
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Community not found
- `500 Internal Server Error`: Database issues

---

### Posts (`/communities/:cid/posts` and `/posts`)

#### POST `/communities/:cid/posts`
**Possible Errors:**
- `400 Bad Request`: Title missing, invalid community ID, or author ID missing
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Community or author not found
- `500 Internal Server Error`: Database issues

#### GET `/communities/:cid/posts`
**Possible Errors:**
- `400 Bad Request`: Invalid community ID
- `500 Internal Server Error`: Database issues

#### PATCH `/posts/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid post ID
- `404 Not Found`: Post not found
- `500 Internal Server Error`: Database issues

#### DELETE `/posts/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid post ID
- `404 Not Found`: Post not found
- `500 Internal Server Error`: Database issues

---

### Comments (`/posts/:pid/comments` and `/comments`)

#### POST `/posts/:pid/comments`
**Possible Errors:**
- `400 Bad Request`: Content missing, invalid post ID, or author ID missing
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Post, parent comment, or author not found
- `500 Internal Server Error`: Database issues

#### GET `/posts/:pid/comments`
**Possible Errors:**
- `400 Bad Request`: Invalid post ID
- `500 Internal Server Error`: Database issues

#### PATCH `/comments/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid comment ID or content missing
- `404 Not Found`: Comment not found
- `500 Internal Server Error`: Database issues

#### DELETE `/comments/:id`
**Possible Errors:**
- `400 Bad Request`: Invalid comment ID
- `404 Not Found`: Comment not found
- `500 Internal Server Error`: Database issues

---

### Votes (`/posts/:id/votes` and `/comments/:id/votes`)

#### POST `/posts/:id/votes`
**Possible Errors:**
- `400 Bad Request`: Invalid post ID, user ID missing, or vote value not 1 or -1
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Post or user not found
- `500 Internal Server Error`: Database issues

#### POST `/comments/:id/votes`
**Possible Errors:**
- `400 Bad Request`: Invalid comment ID, user ID missing, or vote value not 1 or -1
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Comment or user not found
- `500 Internal Server Error`: Database issues

---

## HTTP Status Codes

All endpoints now return proper HTTP status codes:

- `200 OK`: Successful GET, PATCH requests
- `201 Created`: Successful POST requests (creating resources)
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Client error - invalid input
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Duplicate resource
- `500 Internal Server Error`: Server-side error

## Error Response Format

All errors follow NestJS standard format:

```json
{
  "statusCode": 400,
  "message": "Email and password are required",
  "error": "Bad Request"
}
```

## Database Error Codes Handled

The following Prisma error codes are specifically handled:

- **P2002**: Unique constraint violation (duplicate entry)
- **P2003**: Foreign key constraint violation (referenced entity not found)
- **P2025**: Record not found (for updates/deletes)

## Validation Rules

### Authentication
- Email: Required for registration and login
- Password: Required, minimum 6 characters

### Users
- Email: Unique across all users
- Username: Optional string
- Photo: Optional string (URL)

### Communities
- Name: Required, unique
- Description: Optional

### Posts
- Title: Required
- Content: Optional
- Image: Optional (URL)
- Community: Must exist
- Author: Must exist

### Comments
- Content: Required
- Post: Must exist
- Parent: Optional (must exist if provided)
- Author: Must exist

### Votes
- Value: Required, must be exactly 1 or -1
- Target (post/comment): Must exist
- User: Must be authenticated

## Testing Error Handling

To test error handling, try these scenarios:

1. **Duplicate email**: Try registering with same email twice
2. **Invalid credentials**: Login with wrong password
3. **Missing fields**: Send requests without required fields
4. **Invalid IDs**: Use non-existent UUIDs
5. **Unauthorized access**: Try protected endpoints without JWT
6. **Invalid vote values**: Send vote with value other than 1 or -1
7. **Foreign key violations**: Try to create post with non-existent community ID

# Token Check Endpoint

Use this endpoint to check if a JWT is expired. The token is verified for signature then expiration is checked.

- Endpoint: POST /api/user/check-token
- Headers: Authorization: Bearer <token>
- Body: { token: "<token>" } (optional; Authorization header is preferred)

Example curl (Authorization header):

```bash
curl -X POST \
  http://localhost:3000/api/user/check-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>"
```

Example curl (token in body):

```bash
curl -X POST \
  http://localhost:3000/api/user/check-token \
  -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN>"}'
```

Response examples:

- If token valid:
  ```json
  {
    "valid": true,
    "expired": false,
    "expiresAt": "2025-02-23T13:34:56.000Z",
    "decoded": { "id": "12345", "iat": 163..., "exp": 163... }
  }
  ```

- If token expired:
  ```json
  {
    "valid": false,
    "expired": true,
    "expiresAt":"2025-02-23T13:34:56.000Z",
    "decoded": {...}
  }
  ```

- If token invalid:
  ```json
  { "valid": false, "expired": false, "error": "Invalid token" }
  ```

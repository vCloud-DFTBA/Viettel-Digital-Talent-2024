# Giải pháp sử dụng để authen/authorization cho các service

## 1. HAProxy

gen cert

```bash
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

## 2. JWT

### 2.1. Solution

- Set up middleware cho việc phân quyền bằng jwt
- Decode token và check role thuộc [user, admin]
- Sử dụng các package để detect auth: golang-jwt/jwt/v5, gofiber/contrib/jwt

### 2.2. Source code

- [middlewares/jwt.go](https://github.com/lmhuong711/go-go-be/blob/main/middlewares/jwt.go)

### 2.3. Output

- ![invalid role](./images/6.2-1.png)
- ![role_user_get](./images/6.2-2.png)
- ![role_user_post](./images/6.2-3.png)
- ![role_admin](./images/6.2-4.png)

## 3. Rate limit
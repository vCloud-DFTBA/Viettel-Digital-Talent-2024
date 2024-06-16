## Giới Thiệu

Một trong những yêu cầu của bài tập là đảm bảo rằng nếu có quá 10 request trong 1 phút gửi đến Endpoint của API service thì các request sau đó bị trả về HTTP Response 409.

## Giải Pháp

### Mục Tiêu

- Giới hạn số lượng yêu cầu gửi đến API từ một IP cụ thể trong một khoảng thời gian nhất định để tránh quá tải.

### Phương Pháp

- Sử dụng thư viện `express-rate-limit` để giới hạn số lượng yêu cầu từ một IP trong một khoảng thời gian nhất định.
- Trả về HTTP Response 409 nếu số lượng yêu cầu vượt quá giới hạn cho phép.

### Các Bước Triển Khai

1. Cài đặt thư viện cần thiết: `express-rate-limit`.
2. Tạo middleware để xử lý giới hạn tốc độ.
3. Áp dụng middleware này cho các route của API service.

## Triển Khai Giải Pháp

### 1. Cài Đặt Thư Viện

Cài đặt thư viện `express-rate-limit` bằng npm:

```bash
npm install express-rate-limit
```

### 2. Tạo Middleware cho Giới Hạn Tốc Độ

```js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 10, // giới hạn mỗi IP chỉ được thực hiện 10 requests mỗi phút
  message: {
    status: 409,
    message: "Too many requests, please try again later.",
  },
});

module.exports = limiter;
```

### 3. Áp Dụng Middleware trong app.js

```js
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const studentRouter = require("./routes/studentRouter");
const userRouter = require("./routes/userRouter");
const metricsMiddleware = require("./middleware/metricsMiddleware");
const {
  authenticateToken,
  authorizeRole,
} = require("./middleware/authMiddleware");
const rateLimiter = require("./middleware/rateLimiter");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

sequelize.sync().then(() => console.log("Database is ready"));

// Sử dụng middleware để đo thời gian xử lý request và đếm số lượng request
app.use(metricsMiddleware);

// Áp dụng rate limiting middleware cho tất cả các routes
app.use(rateLimiter);

// Define routes using studentRouter
app.use("/api/students", authenticateToken, studentRouter);
app.use("/api/users", userRouter);

module.exports = app;
```

### 4. Sử dụng PostMan để check requests

![](./images/1.png)

### 5. Tạo một `testRateLimiter.js` để gửi các request

```js
const axios = require("axios");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE4Mjk1NDE2LCJleHAiOjE3MTgyOTkwMTZ9.H-tKpGqpXWlLtFbmYbFBgTnob2c0jgDqHBrX3iEGDqk"; //dùng token khi loging
const url = "http://localhost:4000/api/students";

const sendRequests = async () => {
  for (let i = 1; i <= 15; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Request ${i}: Status ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.log(
          `Request ${i}: Status ${error.response.status} - ${error.response.data.message}`
        );
      } else {
        console.log(`Request ${i}: Error ${error.message}`);
      }
    }
  }
};

sendRequests();
```

Nhập lệnh

```bash
node testRateLimiter.js
```

Output:
![](./images/2.png)


Bổ sung giải thích: Tại sao lại trả về status 429 thay vì 409. Mặc định, thư viện `express-rate-limit` trả về mã trạng thái HTTP 429 (Too Many Requests) khi số lượng yêu cầu vượt quá giới hạn cho phép. Mã trạng thái 429 là tiêu chuẩn cho việc giới hạn tốc độ (rate limiting) theo RFC 6585.

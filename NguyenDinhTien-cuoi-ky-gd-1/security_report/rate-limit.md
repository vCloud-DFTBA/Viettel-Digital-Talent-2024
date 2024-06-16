# Tích hợp giải pháp để ratelimit cho Endpoint của api Service

Ở đây em sử dụng thư viện Flask-Limiter 
Reference: [flask-limiter](https://flask-limiter.readthedocs.io/en/stable/)

## Thiết lập ratelimit:

- Giới hạn truy cập với 10 request/min.

```python
limiter = Limiter(get_remote_address, app=application, default_limits=["10 per minute"], storage_uri="mongodb://localhost:27017/VDT24")
```

- Với giới hạn này, mặc định các request được gọi tới tối đa sẽ chỉ là 10 requests trong 1 phút, các request còn lại sẽ được trả về HTTP Response 429 (Too many request)
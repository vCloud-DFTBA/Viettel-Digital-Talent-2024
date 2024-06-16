# Tích hợp giải pháp để authen/authorization cho các service

Ở đây em sử dụng thư viện flask-HTTPAuth để triển khai xác thực cho ứng dụng

Reference: [flask-HTTPAuth Homepage](https://flask-httpauth.readthedocs.io/en/latest/) 

## Phân chia tài khoản và quyền của user

- Đối với user bình thường, em thiết lập các thông tin cho user này như username là user, password là pwd-user và role được khai báo là user

- Đối với user có quyền quản trị (admin), username sẽ là admin, password sẽ là pwd-admin và role là admin

```python
# app authentication
auth = HTTPBasicAuth()
# authentication config
users = {
    "user": {"password": "pwd-user", "role": "user"},
    "admin": {"password": "pwd-admin", "role": "admin"}
}
```

## Xác thực mật khẩu đăng nhập
- Hàm xác thực mật khẩu tương ứng với username
```python
@auth.verify_password
def verify_password(username, password):
    if username in users and users[username]['password'] == password:
        return username
```

## Xử lý lỗi:
- Custom lại hàm xử lý lỗi để trả về HTTP Response 403 thay vì 401 như mặc định
```python
@auth.error_handler
def unauthorized():
    return jsonify(), 403
```

## Kiểm tra role của người đăng nhập:
- Phát triển hàm kiểm tra role của người đăng nhập, và chủ yếu được dùng để kiểm tra role admin
```python
def check_role(role):
    def wrapper(f):
        def decorated_function(*args, **kwargs):
            user = auth.current_user()
            if users[user]['role'] != role:
                return jsonify(), 403
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function
    return wrapper
```
## Tích hợp và triển khai vào trong ứng dụng:

- Đối với những endpoint cần đăng nhập, ```@auth.login_required``` sẽ được đặt. Những truy cập không đăng nhập sẽ được trả về HTTP Response 403.

- Đối với những endpoint cần quyền admin, ```@check_role('admin')``` sẽ được đặt. Những truy cập không đăng nhập cùng truy cập đăng nhập nhưng với quyền 'user' bình thường sẽ trả về HTTP Response 403.
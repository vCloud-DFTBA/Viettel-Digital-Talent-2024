# Phát triển một 3-tier web application đơn giản
* Đường đẫn mã nguồn ứng dụng: [Web](https://github.com/DoTruong1/vdt-frontend)
* Đường dẫn dockerhub: [Dockerhub](https://hub.docker.com/repository/docker/dotruong1910/frontend/general)
## Web Application
### Mô tả chung về ứng dụng api
Ứng dụng được viết bằng [ReactJs](https://react.dev) sử dụng [ViteJS]() làm công cụ để build ứng dụng.
 

![](https://i.postimg.cc/Pr45d0Pw/Screenshot-2024-05-26-at-00-25-32.png)

### Các biến môi trường dùng để config ứng dụng
| Tên biến        | Mô tả                                  |
| --------------- |:-------------------------------------- |
| **APP_API_URL**     | địa chỉ của api ứng dụng  |



### Cách chạy thử image của ứng dụng
Tạo một file `docker-compose.yaml` với nội dung dưới đây(thay thế các giá trị nằm trong dấu `< >` bằng giá trị của mình).
```yaml
version: "3"
services:
  web:
    image: <image web của ứng dụng>:<tag>
    restart: always
    environment:
    -  APP_API_URL=<Địa chỉ api ứng dụng>
    ports:
    - <Cổng expose api>:80
```
Sau đó tại thư mục chứa file `docker-compose.yaml` chạy lệnh sau
```bash
docker compose up
```
### Hình ảnh của ứng dụng web
#### Hiển thị danh sách
#### Xem thông tin chi tiết
#### Sửa thông tin người dùng
#### Xoá Người dùng
#### Thêm người dùng
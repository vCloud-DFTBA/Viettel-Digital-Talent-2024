# Phát triển một 3-tier web application đơn giản
* Đường dẫn mã nguồn ứng dụng: [Web](https://github.com/DoTruong1/vdt-frontend)
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
    - <Cổng expose ứng dụng web>:80
```
Sau đó tại thư mục chứa file `docker-compose.yaml` chạy lệnh sau
```bash
docker compose up
```
### Hình ảnh của ứng dụng web
#### Hiển thị danh sách
[![Screenshot-2024-05-26-at-18-27-28.png](https://i.postimg.cc/J0Bp6V22/Screenshot-2024-05-26-at-18-27-28.png)](https://postimg.cc/4HsvyMZ6)
#### Xem thông tin chi tiết
[![Screenshot-2024-05-26-at-18-28-16.png](https://i.postimg.cc/NFhnwjmc/Screenshot-2024-05-26-at-18-28-16.png)](https://postimg.cc/FdZpymTW)
[![Screenshot-2024-05-26-at-18-28-53.png](https://i.postimg.cc/d3LVgn2X/Screenshot-2024-05-26-at-18-28-53.png)](https://postimg.cc/YLB7W6yf)
#### Sửa thông tin người dùng
[![Screenshot-2024-05-26-at-18-29-55.png](https://i.postimg.cc/ncnJs39t/Screenshot-2024-05-26-at-18-29-55.png)](https://postimg.cc/kDYZzFyj)
[![Screenshot-2024-05-26-at-18-31-04.png](https://i.postimg.cc/Ssz9HWWg/Screenshot-2024-05-26-at-18-31-04.png)](https://postimg.cc/BL4tKP7F)
[![Screenshot-2024-05-26-at-18-33-33.png](https://i.postimg.cc/ZntwQYyy/Screenshot-2024-05-26-at-18-33-33.png)](https://postimg.cc/BLp5L0pq)
#### Xoá Người dùng
[![Screenshot-2024-05-26-at-18-34-45.png](https://i.postimg.cc/ryDdnC8W/Screenshot-2024-05-26-at-18-34-45.png)](https://postimg.cc/rzLFz4RF)
#### Thêm người dùng
[![Screenshot-2024-05-26-at-18-36-28.png](https://i.postimg.cc/dVwNj087/Screenshot-2024-05-26-at-18-36-28.png)](https://postimg.cc/Mv3YWq3x)
[![Screenshot-2024-05-26-at-18-41-07.png](https://i.postimg.cc/V6KzmTmg/Screenshot-2024-05-26-at-18-41-07.png)](https://postimg.cc/G8TWjXBT)
[![Screenshot-2024-05-26-at-18-41-57.png](https://i.postimg.cc/wx5GyJNK/Screenshot-2024-05-26-at-18-41-57.png)](https://postimg.cc/t7T58sDD)

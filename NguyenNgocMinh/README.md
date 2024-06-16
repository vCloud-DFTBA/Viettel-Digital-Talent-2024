# Mid-term Project Viettel Digital Talent 2024 - Cloud

## Nguyễn Ngọc Minh

### I. Phát triển 3-tier web application
- Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng bảng với các thông tin sau: `Họ và tên`, `Giới tính`, `Trường`

![Student List](./images/image1.jpeg)

- Thêm sinh viên

![Add Student](./images/image2.jpeg)

- Kết quả sau khi thêm sinh viên

![Add Student 1](./images/image3.jpeg)

- Xem chi tiết sinh viên

![View Detail Student](./images/image4.jpeg)

- Cập nhật sinh viên

![Update Student](./images/image5.jpeg)

- Kết quả sau khi cập nhật

![Update Student 1](./images/image6.jpeg)

- Xoá sinh viên

![Delete Student](./images/image7.jpeg)

![Delete Student 2](./images/image8.jpeg)

- Code frontend: [Midterm Frontend VDT2024](https://github.com/Minh141120/frontend_midterm_vdt2024)
- Code backend: [Midterm Backend VDT2024](https://github.com/Minh141120/vdt2024_backend_midterm)
- Database: [Database](https://github.com/Minh141120/backend_midterm_vdt2024/blob/main/vdt2024/docker-compose.yml)

- Kết quả chạy unit tests

![Run unittests](./images/image9.jpeg)

- Source code for unit tests: [Unit Test](https://github.com/Minh141120/backend_midterm_vdt2024/tree/main/vdt2024/src/test/java/com/viettel/vdt2024)

### II. Triển khai web application sử dụng các DevOps tools & practices

#### 1. Containerization

- Dockerfile cho backend

![Dockerfile backend](./images/image10.jpeg)

- Dockerfile cho frontend

![Dockerfile frontend](./images/image11.jpeg)

- Docker-compose file cho project

![Docker-compose file1](./images/image12.jpeg)

![Docker-compose file 2](./images/image13.jpeg)

- Đóng gói ứng dụng backend sử dụng câu lệnh `docker build -t nnm-vdt2024-backend-app .`

![docker build backend 1](./images/image14.jpeg)
![docker build backend 2](./images/image15.jpeg)

- Kiểm tra xem image đã được build chưa sử dụng câu lệnh `docker images`

![Check if backend image is created](./images/image17.jpeg)

- Sau khi build xong image, chạy thử image bằng câu lệnh `docker run -d --name vdt2024-backend -p 8080:8080 nnm-vdt2024-backend-app`

![Run backend image](./images/image18.jpeg)

- Build ứng dụng frontend sử dụng câu lệnh `docker build -t nnm-vdt-2024-frontend-app .`

![Build frontend image](./images/image20.jpeg)

- Chạy docker compose file cho dự án frontend + backend

![Docker-compose run 1](./images/image21.jpeg)

![Docker-compose run 2](./images/image22.jpeg)

![Docker-compose run 3](./images/image23.jpeg)

![Docker-compose run 4](./images/image24.jpeg)

![Docker-compose run 5](./images/image25.jpeg)

![Docker-compose run 6](./images/image26.jpeg)

#### 2. Continuous Integration

- File CI

![CI 1](./images/image27.jpeg)
![CI 2](./images/image28.jpeg)

- File logs CI

![CI Logs 1](./images/image29.jpeg)

![CI Logs 2](./images/image30.jpeg)

![CI Logs 3](./images/image31.jpeg)

![CI Logs 4](./images/image32.jpeg)

![CI Logs 5](./images/image33.jpeg)

#### 3. Automation

- Soure code Ansible: [Ansible Source Code](https://github.com/Minh141120/ansible-development/tree/main/roles)

- Chạy Ansible file
![Ansible 1](./images/image34.jpeg)
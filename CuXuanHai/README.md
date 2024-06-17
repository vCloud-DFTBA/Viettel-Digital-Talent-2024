# Bài tập lớn giữa kỳ chương trình VDT 2024 lĩnh vực Cloud

## Phát triển một 3-tier web application đơn giản

### 1. Chức năng

- Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng bảng với các thông tin: Họ và tên, Giới tính, và Trường đang theo học.
- Cho phép xem chi tiết, thêm, xóa, và cập nhật thông tin sinh viên.

### 2. Kiến trúc hệ thống

Hệ thống được thiết kế với ba dịch vụ:

- **web**: React
- **api**: Js, Express
- **db**: Postgresql

![3-tier](./images/Three-Tier-architecture.png)

### 3. Kho mã nguồn

- [Web](https://github.com/vuitinhvl7x/VDT2024-Midterm-frontend)
- [API](https://github.com/vuitinhvl7x/VDT2024-Midterm-api)

### 4. Output

- Hiển thị danh sách sinh viên  
  ![students](./images/list.png)

- Thêm sinh viên mới
  ![add_student](./images/Add.png)

- Xóa sinh viên
  ![delete_student](./images/delete.png)

- Xem chi tiết
  ![profile](./images/moredetails.png)

- Cập nhật thông tin
  ![edit](./images/edit.png)

## Triển khai web application sử dụng các DevOps tools & practices

### 1. Containerization

- **API** :

  - Source code

    - [Dockerfile](https://github.com/vuitinhvl7x/VDT2024-Midterm-api/blob/main/users/Dockerfile)
    - [Docker-compose](https://github.com/vuitinhvl7x/VDT2024-Midterm-api/blob/main/users/docker-compose.yml)

  - History image
    ![History api](./images/dockerhistory-api.png)
    ![History db](./images/dockerhistory-db.png)

- **WEB** :

  - Source code

    - [Dockerfile](https://github.com/vuitinhvl7x/VDT2024-Midterm-frontend/blob/main/Dockerfile)

  - History image
    ![History web](./images/dockerhistoy-frontend.png)

### 2. Continuous Integration

- Source code: [here](https://github.com/vuitinhvl7x/VDT2024-Midterm-api/blob/main/.github/workflows/ci.yml)

- Output:
  ![Output1](./images/ci1.png)  
  ![Output2](./images/ci2.png)

### 3. Automation

- Source code: [here](https://github.com/vuitinhvl7x/VDT2024-Midterm-Ansible)
- Output:
  - Log
    ![Log ansible](./images/ansible-log.png)

### 4. Research topic: [Security in Docker](./Research%20topic/README.md)

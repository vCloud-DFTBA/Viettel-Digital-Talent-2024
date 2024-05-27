# Bài tập lớn giữa kỳ chương trình VDT 2024 lĩnh vực Cloud

## Table of Contents
1. [Phát triển một 3-tier web application đơn giản](#1-phát-triển-một-3-tier-web-application-đơn-giản)
    - [Chức năng](#chức-năng)
    - [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
    - [Kho mã nguồn](#kho-mã-nguồn)
    - [Output](#output)
        - [Hiển thị danh sách sinh viên](#hiển-thị-danh-sách-sinh-viên)
        - [Thêm sinh viên mới](#thêm-sinh-viên-mới)
        - [Xóa sinh viên](#xóa-sinh-viên)
        - [Xem chi tiết](#xem-chi-tiết)
        - [Cập nhật thông tin](#cập-nhật-thông-tin)
2. [Triển khai web application sử dụng các DevOps tools & practices](#2-triển-khai-web-application-sử-dụng-các-devops-tools--practices)
    - [Containerization](#containerization)
        - [API](#api)
        - [WEB](#web)
    - [Continuous Integration](#continuous-integration)
    - [Automation](#automation)
3. [Research topic: Microservices Security](#3-research-topic-microservices-security)

## 1. Phát triển một 3-tier web application đơn giản

### Chức năng
- Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng bảng với các thông tin: Họ và tên, Giới tính, và Trường đang theo học.
- Cho phép xem chi tiết, thêm, xóa, và cập nhật thông tin sinh viên.

### Kiến trúc hệ thống
Hệ thống được thiết kế với ba dịch vụ:
- **web**: Vue.js
- **api**: TypeScript, Express
- **db**: PostgreSQL  

![3-tier](images/3_tier_web.svg)

### Kho mã nguồn
- [Web](https://github.com/descent1511/vdt2024-vuejs-frontend)
- [API](https://github.com/descent1511/vdt2024-api-nodejs)

### Output
#### Hiển thị danh sách sinh viên   
![students](images/Home.png)  
![students2](images/Home_dark.png)

#### Thêm sinh viên mới
![add_student](images/add%20user.png)

#### Xóa sinh viên
![delete_student](images/delete.png)

#### Xem chi tiết
![profile](images/profile.png)

#### Cập nhật thông tin
![edit](images/edit_profile.png)

## 2. Triển khai web application sử dụng các DevOps tools & practices

### Containerization

#### API
- Source code
    - [Dockerfile](https://github.com/descent1511/vdt2024-api-nodejs/blob/main/users/Dockerfile)
    - [Docker-compose](https://github.com/descent1511/vdt2024-api-nodejs/blob/main/docker-compose.yml)
- Lệnh build:  
    ```bash
    docker build -t api --no-cache --compress . # Build image cụ thể
    docker-compose up --build # Build nhiều dịch vụ cùng lúc 
    ```
- History image
    ![History api](images/history_api.jpeg)
                        
    ![History db](images/history_db.jpeg)

#### WEB
- Source code
    - [Dockerfile](https://github.com/descent1511/vdt2024-vuejs-frontend/blob/main/Dockerfile)
    - [Docker-compose](https://github.com/descent1511/vdt2024-vuejs-frontend/blob/main/docker-compose.yml)
- Lệnh build:
    ```bash
    docker build -t web --no-cache --compress . # Build image cụ thể
    docker-compose up --build # Build nhiều dịch vụ cùng lúc 
    ```
- History image
    ![History web](images/history_web.jpeg)

### Continuous Integration
- Source code: [here](https://github.com/descent1511/vdt2024-api-nodejs/blob/develop/.github/workflows/ci.yml)

- Output: 
![Output1](images/log_ci1.png)  
![Output2](images/log_ci2.png)

### Automation
- Source code: [here](https://github.com/descent1511/vdt2024-ansible/tree/develop)
- Output: 
    - Log 
    ![Log ansible](images/log_ansible.png)  
    - Kiểm tra container đang chạy
    ![container_running](images/container1.png)
    ![container_running](images/container2.png)
    - Demo app:  
        - API : 192.168.0.109
            ![API](images/api_local.png)
        - WEB : 192.168.0.107
            ![WEB](images/web_remote.png)

## 3. Research topic: [Microservices Security](https://github.com/descent1511/Viettel-Digital-Talent-2024/tree/midterm/Le-Hoang-Truong/Midterm/research)

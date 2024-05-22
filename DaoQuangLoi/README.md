# Bài tập lớn giữa kỳ chương trình VDT 2024 lĩnh vực CLOUD

Mục lục

[**Phát triển một 3-tier web application đơn giản
(3đ)**](#phát-triển-một-3-tier-web-application-đơn-giản-3đ) **1**

[**Triển khai web application sử dụng các DevOps tools & practices
(5đ)**](#triển-khai-web-application-sử-dụng-các-devops-tools-practices-5đ)
**11**

> [1. Containerization (2đ)](#containerization-2đ) 11
>
> [2. Continuous Integration (1.5đ)](#continuous-integration-1.5đ) 16
>
> [3. Automation (1.5đ)](#automation-1.5đ) 22

[**Nghiên cứu sâu về một vấn đề, khái niệm trong các chủ đề đã được học
(2đ)**](#_sut47spvoird) **23**

## Phát triển một 3-tier web application đơn giản (3đ)

**Yêu cầu:**

- Phát triển web application có các chức năng sau (0.5đ):

<!-- -->

- Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng
  bảng với các thông tin sau: Họ và tên, Giới tính, trường đang theo
  học.

Màn hình giao diện chính

<img src="./media/image33.png"
style="width:6.26772in;height:3.52778in" />

- Cho phép xem chi tiết/thêm/xóa/cập nhật thông tin sinh viên.

1.  Tính năng thêm sinh viên:

<img src="./media/image39.png"
style="width:6.26772in;height:3.52778in" />

sau khi thêm:

<img src="./media/image18.png"
style="width:6.26772in;height:3.52778in" />

2.  Tính năng cập nhật thông tin sinh viên

<img src="./media/image9.png"
style="width:6.26772in;height:3.52778in" />

sau khi cập nhật:

<img src="./media/image36.png"
style="width:6.26772in;height:3.52778in" />

3.  Tính năng xóa sinh viên:

> Ấn vào button delete
>
> sau khi xóa:

<img src="./media/image13.png"
style="width:6.26772in;height:3.52778in" />

- Thiết kế hệ thống với ba dịch vụ (1đ):

  - **web**: Giao diện web, tuỳ chọn ngôn ngữ, framework.

> Phần giao diện em sử dụng thư viện ReactJS kết hợp với ViteJS có tác
> dụng nâng cao tốc độ trang web

- **api**: RESTful API viết bằng ngôn ngữ lập trình tùy chọn, có đầy đủ
  các chức năng: list, get, create, update, delete.

> Về phần Backend em sử dụng framework Java Springboot

- **db**: Database SQL hoặc NoSQL lưu trữ thông tin sinh viên.

> Ở đây em sử dụng MySQL database dạng container với image được lấy từ
> Docker Hub chứ không sử dụng MySQL Workbench.
>
> Đây là dữ liệu hiện tại

<img src="./media/image22.png"
style="width:7.58597in;height:4.27183in" />

- Viết unit tests cho các chức năng APIs, mỗi API tối thiếu 1 testcase
  (0.5đ).

> Unit test cho Controller (đủ các test case cho CRUD API)
>
> [<u>https://github.com/JackeyyLove/StudentManagement-BE/blob/master/backend/src/test/java/com/example/backend/controller/StudentControllerTest.java</u>](https://github.com/JackeyyLove/StudentManagement-BE/blob/master/backend/src/test/java/com/example/backend/controller/StudentControllerTest.java)
>
> <img src="./media/image46.png"
> style="width:6.26772in;height:3.52778in" />
>
> Kết quả chạy test Controllers
>
> <img src="./media/image41.png"
> style="width:6.26772in;height:3.52778in" />
>
> Unit test cho các Services
>
> [<u>https://github.com/JackeyyLove/StudentManagement-BE/blob/master/backend/src/test/java/com/example/backend/service/impl/StudentServiceImplTest.java</u>](https://github.com/JackeyyLove/StudentManagement-BE/blob/master/backend/src/test/java/com/example/backend/service/impl/StudentServiceImplTest.java)
>
> <img src="./media/image28.png"
> style="width:6.26772in;height:3.52778in" />
>
> Kết quả chạy test services
>
> <img src="./media/image37.png"
> style="width:6.26772in;height:3.52778in" />
>
> Hoặc có thể dùng command “mvn test" để chạy tất cả các test
>
> <img src="./media/image43.png"
> style="width:6.26772in;height:3.52778in" />
>
> <img src="./media/image32.png"
> style="width:6.26772in;height:3.52778in" />

- Maintain source code của **api** và **web** ở 2 repo khác nhau, mỗi
  feature là 1 Pull Request (1đ).

Back-end(API):
[<u>https://github.com/JackeyyLove/StudentManagement-BE.git</u>](https://github.com/JackeyyLove/StudentManagement-BE.git)

Front-end(web):
[<u>https://github.com/JackeyyLove/StudentManagement-FE.git</u>](https://github.com/JackeyyLove/StudentManagement-FE.git)

**Output:**

- Hình ảnh thể hiện kết quả đã đạt được

- Mã nguồn của từng dịch vụ (link github)

## Triển khai web application sử dụng các DevOps tools & practices (5đ)

### Containerization (2đ)

**Yêu cầu:**

- Viết Dockerfile để ở từng repo để đóng gói các dịch vụ trên thành các
  container image (1đ)

- Yêu cầu image đảm bảo tối ưu thời gian build và kích thước chiếm dụng,
  khuyến khích sử dụng các thủ thuật build image đã được giới thiệu
  (layer-caching, optimized RUN instructions, multi-stage build, etc.)
  (1đ)

**Output:**

- File Dockerfile cho từng dịch vụ

> [<u>Dockerfile-API</u>](https://github.com/JackeyyLove/StudentManagement-BE/blob/master/backend/Dockerfile)
>
> [<u>Dockerfile-Web</u>](https://github.com/JackeyyLove/StudentManagement-FE/blob/master/frontend/Dockerfile)

Dockerfile cho front-end - sử dụng phương pháp layer-caching bằng cách
COPY các file package.json và package-lock.json vào trước khi sử dụng
câu lệnh npm install

<img src="./media/image35.png"
style="width:6.26772in;height:3.52778in" />

Dockerfile cho back-end - Sử dụng phương pháp Multi-stage, trong giai
đoạn buildtime, sử dụng một base image lớn hơn ( cho việc compile
application ). Ở stage giai đoạn build time, sử dụng base image nhỏ hơn
dùng cho giai đoạn Run time

<img src="./media/image20.png"
style="width:6.26772in;height:3.52778in" />

Docker-compose file để chạy một lúc các container

<img src="./media/image45.png"
style="width:6.26772in;height:3.52778in" />

- Output câu lệnh build và thông tin docker history của từng image

Build backend image

<img src="./media/image17.png"
style="width:6.26772in;height:3.52778in" />

<img src="./media/image24.png"
style="width:6.26772in;height:3.52778in" />

Docker history của backend-image

<img src="./media/image30.png"
style="width:6.26772in;height:1.83333in" />

Build front-end image

<img src="./media/image14.png"
style="width:6.26772in;height:3.52778in" />

Docker history của frontend-image

<img src="./media/image31.png"
style="width:6.26772in;height:1.83333in" />

###  Continuous Integration (1.5đ)

> **Yêu cầu:**
>
> Ở đây em tích hợp webhook của Github cho Jenkins (tick vào ô Pushes và
> Pull Requestes để cho phép tự động trigger build pipeline khi tạo một
> Pull request hoặc push commit)
>
> Về url của Jenkins, vì không có server riêng cho Jenkins nên cách
> nhanh nhất em nghĩ ra là sử dụng Ngrok

- Tự động chạy unit test khi tạo PR vào branch main (0.5đ)

Tạo một pull request

<img src="./media/image23.png"
style="width:6.26772in;height:3.52778in" />

Webhook

<img src="./media/image34.png"
style="width:6.26772in;height:3.52778in" />

Chạy pipeline thành công (#4)

<img src="./media/image21.png"
style="width:6.26772in;height:3.52778in" />

- Tự động chạy unit test khi push commit lên một branch (1đ)

> <img src="./media/image42.png"
> style="width:6.26772in;height:3.52778in" />
>
> <img src="./media/image38.png"
> style="width:6.26772in;height:3.52778in" />
>
> **Output:**

- File setup công cụ CI

> [<u>https://github.com/JackeyyLove/StudentManagement-BE/blob/master/Jenkinsfile</u>](https://github.com/JackeyyLove/StudentManagement-BE/blob/master/Jenkinsfile)

- Output log của luồng CI

<!-- -->

- Checkout from Github

> <img src="./media/image29.png"
> style="width:6.26772in;height:3.52778in" />
>
> Cài đặt maven
>
> <img src="./media/image40.png"
> style="width:6.26772in;height:3.52778in" />
>
> Chạy unit test
>
> <img src="./media/image15.png"
> style="width:6.26772in;height:3.52778in" />
>
> <img src="./media/image25.png"
> style="width:6.26772in;height:3.52778in" />

Build image

> <img src="./media/image12.png"
> style="width:6.26772in;height:3.52778in" />
>
> Push image to Dockerhub
>
> <img src="./media/image44.png"
> style="width:6.26772in;height:3.52778in" />

- Các hình ảnh demo khác

> Tổng quan
>
> <img src="./media/image16.png"
> style="width:6.26772in;height:3.52778in" />

### Automation (1.5đ)

> **Yêu cầu:**

- Viết ansible playbooks để triển khai các image docker của các dịch vụ
  web, api, db, mỗi dịch vụ 1 role (0.5đ).

Các roles: sử dụng lệnh “ansible-galaxy init \<role_name\>” để tạo các
role với template sẵn

<img src="./media/image7.png"
style="width:6.26772in;height:3.18056in" />

- Trong từng role cho phép tuỳ biến cấu hình của các dịch vụ thông qua
  các variables (0.5đ).

> DB role
>
> <img src="./media/image4.png" style="width:5in;height:2.8125in" />
>
> <img src="./media/image2.png"
> style="width:5.39583in;height:3.61458in" />
>
> API role
>
> <img src="./media/image8.png"
> style="width:5.39583in;height:3.61458in" />
>
> <img src="./media/image11.png"
> style="width:5.39583in;height:3.61458in" />
>
> Web role
>
> <img src="./media/image6.png"
> style="width:5.39583in;height:3.61458in" />
>
> <img src="./media/image1.png"
> style="width:5.39583in;height:3.61458in" />

- Cho phép triển khai các dịch vụ trên các host khác nhau thông qua file
  inventory (0.5đ).

File inventory:

<img src="./media/image5.png"
style="width:6.26772in;height:0.91667in" />

File Vagrantfile để chạy các máy ảo

<img src="./media/image3.png"
style="width:6.26772in;height:5.54167in" />

Kết quả chạy playbooks

<img src="./media/image26.png"
style="width:6.26772in;height:3.52778in" />

Kiểm tra kết quả trong các VMs

<img src="./media/image27.png"
style="width:6.26772in;height:3.52778in" />

<img src="./media/image19.png"
style="width:6.26772in;height:3.52778in" />

Truy cập vào browser để xem website

<img src="./media/image10.png"
style="width:6.26772in;height:3.52778in" />

**Output:**

- Link github source code của ansible playbooks

Playbooks:
[<u>playbooks</u>](https://github.com/JackeyyLove/ansible_project_stu_manage/blob/master/webservers-config.yml)

Ansible_project:
[<u>https://github.com/JackeyyLove/ansible_project_stu_manage</u>](https://github.com/JackeyyLove/ansible_project_stu_manage)

Nghiên cứu sâu về một vấn đề, khái niệm trong các chủ đề đã được học
(2đ)

Yêu cầu:

- Viết bất gì về bất cứ gì trong các chủ đề đã được học

Output:

- File báo cáo trong PR lên repo chung

[<u>File Research</u>](Research.md)

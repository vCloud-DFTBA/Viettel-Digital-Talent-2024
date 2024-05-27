# Bài tập lớn giữa kỳ chương trình VDT 2024 lĩnh vực Cloud

## Phát triển một 3-tier web application đơn giản

### Yêu cầu:

- Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng bảng với các thông tin sau: Họ và tên, Giới tính, trường đang theo học. 
- Cho phép xem chi tiết/thêm/xóa/cập nhật thông tin sinh viên.

### Hình ảnh kết quả 

#### Web service
Web service sử dụng framework ReactJs
- Chức năng danh sách thí sinh
![alt text](./images/website/web_student_list.png)

- Chức năng xem thông tin chi tiết thí sinh
![alt text](./images/website/web_detail_student.png)

- Chức năng thêm một thí sinh
![alt text](./images/website/web_add_student.png)

- Chức năng cập nhật một thí sinh
![alt text](./images/website/web_update_student.png)

- Chức năng xóa một thí sinh
![alt text](./images/website/web_remove_student.png)

#### Api service
Api service sử dụng framework Django REST API
- API list danh sách thí sinh (url: http://192.168.144.135:8001/api/students/)
![alt text](./images/website/api_student_list.png)

- API get thí sinh (url: http://192.168.144.135:8001/api/students/1)
![alt text](./images/website/api_get_student.png)

- API thêm một thí sinh () (url: http://192.168.144.135:8001/api/students/create, method: POST)
![alt text](./images/website/api_add_student.png)

- API cập nhật một thí sinh (url: http://192.168.144.135:8001/api/students/update/79, method: PUT)
![alt text](./images/website/api_update_student.png)

- API xóa một thí sinh (url: http://192.168.144.135:8001/api/students/delete/78, method: DELETE)
![alt text](./images/website/api_remove_student.png)

#### Database service
Database service sử dụng Postgres, danh sách các bảng sau khi migrate từ backend Django
![alt text](./images/website/db_table_list.png)

#### Unit test cho các API: Unit test được chạy trên một database test khác với database chính của API

Mã nguồn unit test: https://github.com/Vinh1507/vdt-api/blob/main/vdt_api/base/tests.py
![alt text](./images/website/api_unit_test_result.png)

### Mã nguồn từng dịch vụ

#### Web service: https://github.com/Vinh1507/vdt-web
#### Api service: https://github.com/Vinh1507/vdt-api


## Triển khai web application sử dụng các DevOps tools & practices

### 1. Containerization
Triển khai 3-tier web sử dụng Docker và Docker compose
- Dockerfile cho dịch vụ Web: https://github.com/Vinh1507/vdt-web/blob/main/Dockerfile
- Dockerfile cho dịch vụ API: https://github.com/Vinh1507/vdt-api/blob/main/vdt_api/Dockerfile
- Dockerfile cho dịch vụ DB: https://github.com/Vinh1507/vdt-db/blob/main/Dockerfile

#### Web Service Containerization
Dockerfile cho dịch vụ web sử dụng thủ thuật multi-stage build, giúp giảm kích thước image và giảm thời gian chạy bằng cách tách môi trường build khỏi môi trường run-time

Sử dụng web server Nginx triển khai dự án React JS

- Output lệnh build: (image: vinhbh/vdt_web:1.0)
![alt text](./images/containerization/web_build_dockerfile.png)

- Docker history của Web image (image: vinhbh/vdt_web:1.0)
![alt text](./images/containerization/web_image_history.png)

#### API Service Containerization
Dockerfile cho dịch vụ API sử dụng layer caching trong việc cài đặt các thư viện cần thiết (copy requirements.txt) riêng biệt. Nếu file requirements.txt không thay đổi, Docker sẽ tái sử dụng cached layer để tiết kiệm thời gian build. Đồng thời khi cài đặt sử dụng câu lệnh 'pip install --no-cache-dir' để đảm bảo không sử dụng cache trong quá trình cài đặt các dependencies, điều này giúp giảm kích thước của các cache không cần thiết bên trong image, từ đó giảm kích thước image.

- Output lệnh build: (image: vinhbh/vdt_api:2.0)
![alt text](./images/containerization/api_build_dockerfile.png)

- Docker history của API image (image: vinhbh/vdt_api:2.0)
![alt text](./images/containerization/api_image_history.png)

#### DB Service Containerization
Dockerfile cho dịch vụ DB được buidl từ base image postgres:lastest
- Output lệnh build: (image: vinhbh/vdt_db:1.0)
![alt text](./images/containerization/db_build_dockerfile.png)
- Docker history của DB image (image: vinhbh/vdt_db:1.0)
![alt text](./images/containerization/db_image_history.png)

### 2. Continuous Integration
Hệ thống sử dụng Jenkins trong quá trình thực hiện CI.

Cấu hình job trên Jenkins: 
- Sử dụng multi branch pipeline
- Sử dụng github webhook khi có sự kiện tạo pull request và push commit
- Sử dụng github integration jenkins plugin

#### File cài đặt Jenkins với Docker: 
Dockerfile: https://github.com/Vinh1507/vdt-ci/blob/main/jenkins/Dockerfile

Docker compose: https://github.com/Vinh1507/vdt-ci/blob/main/jenkins/docker-compose.yml
#### File setup CI cho API service: https://github.com/Vinh1507/vdt-api/blob/main/Jenkinsfile

#### Output log của luồng CI
[Log triển khai Jenkins CI](https://github.com/Vinh1507/Viettel-Digital-Talent-2024/blob/vdt-mid-term/BuiHoangVinh/logs/jenkins-pipeline-log.txt)
- stage Checkout SCM:
![alt text](./images/ci/ci_checkout_scm.png)
- stage Checkout Git
![alt text](./images/ci/ci_clone_code.png)
- stage Build Image (Tạo docker image từ source code mới nhất trên branch git)
![alt text](./images/ci/ci_build_image.png)
- stage Run Test (Sử dụng docker inside và chạy command run unit test bên trong container được tạo bới image trong bước trước)
![alt text](./images/ci/ci_run_test.png)

#### Một số hình ảnh demo
- Khi có sự kiện push commit lên 1 nhánh
![alt text](./images/ci/ci_push_webhook.png)
![alt text](./images/ci/ci_push_job.png)
![alt text](./images/ci/ci_push_pipeline.png)

- Khi có sự kiện tạo pull request vào branch main
![alt text](./images/ci/ci_pr_webhook.png)
![alt text](./images/ci/ci_pr_pipeline.png) 

### 3. Automation

#### Link github của repo triển khai ansible: https://github.com/Vinh1507/vdt-automation
#### Link github source code của playbooks: https://github.com/Vinh1507/vdt-automation/blob/main/playbooks/ansible.yml

#### Kiến trúc triển khai:

Triển khai các dịch vụ trên 5 VM khác nhau, trong đó:
- VM 192.168.144.135: triển khai 1 Web service và load balancer HA Proxy
- VM 192.168.144.136: triển khai 1 Web service
- VM 192.168.144.132: triển khai 1 Api service
- VM 192.168.144.133: triển khai 1 Api service
- VM 192.168.144.129: triển khai 1 DB service
- File cấu hình load balancer HA Proxy: https://github.com/Vinh1507/vdt-automation/blob/main/roles/vdt_lb/files/haproxy.cfg

![alt text](./images/automation/deploy_architecture.png)

Cấu trúc thư mục của ansible:

![alt text](./images/automation/cd_ansible_tree.png)

#### Output
![alt text](./images/automation/ansible1.png)
![alt text](./images/automation/ansible2.png)
![alt text](./images/automation/ansible3.png)
![alt text](./images/automation/ansible4.png)

#### Quá trình triển khai:
[Log triển khai ansible playbook](https://github.com/Vinh1507/Viettel-Digital-Talent-2024/blob/vdt-mid-term/BuiHoangVinh/logs/ansible-log.txt)

- Sử dụng docker image đã được push lên dockerhub để tiển hành triển khai vào các VM
- Sử dụng 1 role: common, triển khai các công cụ cần thiết trên các VM như docker, docker compose
- Triển khai các dịch vụ trên các host khác nhau và được cấu hình trong file inventory.ini
- Trong các role: vdt_web, vdt_api, vdt_db: sử dụng Ansible variables và Ansible templates để thuận tiện và linh hoạt trong quá trình triển khai
- Đối với role vdt_api:
    + Sử dụng Ansible Vault mã hóa một số thông tin nhạy cảm
    + Sử dụng Ansible serial keyword trong việc down/up lần lượt từng API server tránh down-time khi deploy
- Hình ảnh docker image tại docker hub:
+ Docker Image Web service:
![alt text](./images/automation/docker_image_web.png)
+ Docker Image Api service:
![alt text](./images/automation/docker_image_api.png)
+ Docker Image DB service:
![alt text](./images/automation/docker_image_db.png)



## Nghiên cứu sâu về một vấn đề, khái niệm trong các chủ đề đã được học 
### Đề tài: Tìm hiểu về cách thức hoạt động của Ansible

File báo cáo: https://github.com/Vinh1507/Viettel-Digital-Talent-2024/blob/vdt-mid-term/BuiHoangVinh/research/Ansible%20research.pdf 
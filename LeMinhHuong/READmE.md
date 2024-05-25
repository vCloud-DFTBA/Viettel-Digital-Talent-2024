# Project giữa kỳ Viettel Digital Talent 2024

Lê Minh Hương

# TOC
{:toc}

## 1. Phát triển một 3-tier web application đơn giản

- Mã nguồn be: https://github.com/lmhuong711/go-go-go/tree/main/go-go-be

- Mã nguồn fe: https://github.com/lmhuong711/go-go-go/tree/main/go-go-fe

- Hiển thị danh sách sinh viên
  ![alt](./assets/list.png)

- Thêm sinh viên
  ![alt](./assets/create.png)

- Lưu thành công
  ![alt](./assets/saved.png)

- Xem chi tiết sinh viên
  ![alt](./assets/detail.png)

- Cập nhật thông tin sinh viên
  ![alt](./assets/edit.png)

- Xóa sinh viên
  ![alt](./assets/delete.png)

## 2.Triển khai web application sử dụng các DevOps tools & practices

### 2.1. Containerization

- Link docker compose be: https://github.com/lmhuong711/go-go-go/blob/main/go-go-be/docker-compose.yml

- Link docker be server: https://github.com/lmhuong711/go-go-go/blob/main/go-go-be/dockerfile.server

- Link docker be postgres: https://github.com/lmhuong711/go-go-go/blob/main/go-go-be/dockerfile.postgres

- Link docker compose fe: https://github.com/lmhuong711/go-go-go/blob/main/go-go-fe/docker-compose.yml

- Link docker fe: https://github.com/lmhuong711/go-go-go/blob/main/go-go-fe/Dockerfile

- Docker compose be
  ![alt](./assets/docker-compose-be.png)

- Docker compose fe
  ![alt](./assets/docker-compose-fe.png)

- Docker history db
  ![alt](./assets/docker-history-db.png)

- Docker history server
  ![alt](./assets/docker-history-server.png)

- Docker history fe
  ![alt](./assets/docker-history-fe.png)

### 2.2. Continuous Integration

- File setup công cụ CI: (https://github.com/lmhuong711/go-go-go/tree/main/.github/workflows)

  Lịch sử chạy CI : (https://github.com/lmhuong711/go-go-go/actions)

- Output log của luồng CI
  ![alt](https://github.com/lmhuong711/go-go-go/actions/runs/9234992385/job/25409319473)
  ![alt](https://github.com/lmhuong711/go-go-go/actions/runs/9234992384/job/25409319471)
- Ảnh demo
  ![alt](./assets/ci-cd-1.png)
  ![alt](./assets/ci-cd-2.png)
  ![alt](./assets/ci-cd-3.png)

## 3. Automation

### Viết ansible playbooks để triển khai các image docker của các dịch vụ web, api, db, mỗi dịch vụ 1 role

Ví dụ triển khai hệ thống với Ansible + Vagrant: Triển khai lên 2 máy ảo go_go_1 và go_go_2

- inventory.yml (https://github.com/lmhuong711/go-go-go/blob/main/inventory.yml)

- playbook.yml (https://github.com/lmhuong711/go-go-go/blob/main/intro-playbook.yml)

- ansible.cnf (https://github.com/lmhuong711/go-go-go/blob/main/ansible.cfg)

- Chạy Ansible playbook:
  `ansible-playbook [-v] intro-playbook.yml`

- Output log triển khai hệ thống (https://github.com/lmhuong711/go-go-go/blob/main/ansible.log)

- Ảnh demo
  ![alt](./assets/ansible-1.png)
  ![alt](./assets/ansible-2.png)
  ![alt](./assets/ansible-3.png)
  ![alt](./assets/ansible-4.png)
  ![alt](./assets/ansible-5.png)
  ![alt](./assets/ansible-6.png)

## 4. Nghiên cứu sâu về một vấn đề, khái niệm trong các chủ đề đã được học (2đ)

[report](./Prometheus-Kubernetes.pdf)

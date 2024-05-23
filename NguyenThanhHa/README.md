## Project giữa kỳ
### Nguyễn Thanh Hà

### Phát triển một 3-tier web application đơn giản 
Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng bảng với các thông tin sau: Họ và tên, Giới tính, trường đang theo học. 
![Home](./image/danhsachsv.png)
Cho phép xem chi tiết/thêm/xóa/cập nhật thông tin sinh viên.

- Thêm sinh viên
![Create](./image/createUser1.png)
![Create](./image/createUser2.png)

- Xem chi tiết sinh viên
![Detail](./image/ListUserInfo.png)

- Cập nhật thông tin sinh viên
![Update](./image/updateUser1.png)
![Update](./image/updateUser2.png)

- Xóa sinh viên
![Delete](./image/deleteUser.png)

- Kết quả unit test cho các chức năng API: 

 ![unit_test](./image/unit_test.png)

# Mã nguồn web service: [web](https://github.com/hantbk/web_service)
# Mã nguồn api service: [api](https://github.com/hantbk/api_service)

### Triển khai web application sử dụng các DevOps tools & practices

#### 1. Containerization 
 - Dockerfile cho từng dịch vụ: 
- [Web](https://github.com/hantbk/web_service/blob/main/Dockerfile) 
    ```Dockerfile
    # Stage 1: Build the React app
    FROM node:lts-alpine AS build

    # Set working directory
    WORKDIR /app

    # Copy package.json and package-lock.json
    COPY package.json .
    COPY package-lock.json .

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Build the React app
    RUN npm run build

    # Stage 2: Serve the built React app
    FROM nginx:alpine

    # Copy the built React app from the previous stage
    COPY --from=build /app/dist /usr/share/nginx/html

    # Copy nginx configuration file
    COPY nginx.conf /etc/nginx/conf.d/default.conf

    # Expose port 80
    EXPOSE 80

    # Start nginx
    CMD ["nginx", "-g", "daemon off;"]
    ```
- [API](https://github.com/hantbk/api_service/blob/main/Dockerfile)

    ```Dockerfile
    # Stage 1: Build the application
    FROM node:lts-alpine AS build

    WORKDIR /app

    COPY package*.json ./

    RUN npm ci --only=production

    COPY . .

    # Stage 2: Production-ready image
    FROM node:lts-alpine AS production

    WORKDIR /app

    COPY --from=build /app ./

    EXPOSE 9000

    CMD ["npm", "start"]

    ```
- [Database](https://github.com/hantbk/vdtproject/blob/main/webcrud/db/Dockerfile)

    ```Dockerfile
    FROM mongo:4.4.6

    # Tạo thư mục để chứa dữ liệu và script khởi tạo
    RUN mkdir -p /docker-entrypoint-initdb.d

    # Sao chép tệp attendees.json vào thư mục /docker-entrypoint-initdb.d/
    COPY attendees.json /docker-entrypoint-initdb.d/attendees.json

    # Sao chép tệp init-data.sh vào thư mục /docker-entrypoint-initdb.d/
    COPY init-data.sh /docker-entrypoint-initdb.d/init-data.sh

    # Đặt quyền thực thi cho tệp init-data.sh
    RUN chmod +x /docker-entrypoint-initdb.d/init-data.sh

    # Chạy init-data.sh để khởi tạo dữ liệu trong MongoDB và sau đó khởi động MongoDB
    CMD ["bash", "-c", "/docker-entrypoint-initdb.d/init-data.sh && mongod --bind_ip_all"]

    ```
- Output câu lệnh build và history image web service

    ![alt](./image/web-build.png)

    ![alt](./image/web-history.png)

- Output câu lệnh build và history image api service

    ![alt](./image/api-build.png)

    ![alt](./image/api-history.png)

- Output câu lệnh build và history image db service

    ![alt](./image/db-build.png)

    ![alt](./image/db-history.png)

- Link image dockerhub:
    - [Web](https://hub.docker.com/repository/docker/nthhaf/hant-web-service)
    - [API](https://hub.docker.com/repository/docker/nthhaf/hant-api-service)
    - [DB](https://hub.docker.com/repository/docker/nthhaf/hant-db-service)

- Sử dụng docker-compose để triển khai 3 dịch vụ web, api, db
    
[docker-compose.yml](https://github.com/hantbk/vdtproject/blob/main/webcrud/docker-compose.yml)
```yaml
version: '3.8'

services:
    client:
        image: nthhaf/hant-web-service:lastest
        ports:
        - "80:80"
        networks:
        - hant-network
            
    server:
        image: nthhaf/hant-api-service:lastest
        ports:
        - "9000:9000"
        depends_on:
        - mongo
        environment:
        - MONGODB_URI=mongodb://mongo:27017/webcrud
        networks:
        - hant-network

    mong:
        image: nthhaf/hant-db-service:lastest
        volumes:
        - mongo-data:/data/db
        networks:
        - hant-network

volumes:
    mongo-data:

networks:
    hant-network:
```

- Link source code và cách chạy:
    - [Source code](https://github.com/hantbk/vdtproject/tree/main)
    
    - Cách chạy: 
        - Clone source code về máy và chạy lệnh `cd vdtproject/webcrud` để vào thư mục chứa file docker-compose.yml
        - Chạy lệnh `docker-compose up` để triển khai 3 dịch vụ web, api, db
        - Truy cập vào địa chỉ `http://localhost:80` để xem web service
        - Truy cập vào địa chỉ `http://localhost:9000` để xem api service

#### 2. Continuous Integration
- Tự động chạy unit test khi tạo Pull request vào nhánh main
- Tự động chạy unit test khi push commit lên một nhánh
 - File setup công cụ CI: [ci](https://github.com/hantbk/api_service/blob/main/.github/workflows/ci.yml)

    ```yml
    name: Continuous Integration

    on:
      pull_request: 
        branches: // Quá trình CI sẽ chạy khi có pull request vào nhánh main
          - main 
      push:
        branches: // Quá trình CI sẽ chạy khi có push commit lên mọi nhánh
          - '*'

    jobs:
      test:
        runs-on: ubuntu-latest

        services:
          mongodb:
            image: mongo:latest
            ports:
              - 27017:27017

        steps:
          - name: Checkout code
            uses: actions/checkout@v2

          - name: Set up Node.js
            uses: actions/setup-node@v2
            with:
              node-version: '18'

          - name: Install dependencies
            run: npm install
            working-directory: ./webcrud/api/

          - name: Run unit tests
            run: npm test
            working-directory: ./webcrud/api/

    ```
Lịch sử chạy CI : [CI History](https://github.com/hantbk/api_service/actions)
- Output log của luồng CI
     
     ![alt](./image/ci1.png)

     ![alt](./image/ci3.png)

- Lịch sử chạy CI khi push commit

    Success
    ![alt](./image/ci2.png)
    Fail
    ![alt](./image/ci4.png)
    
- Tự động chạy test khi Pull request

    ![alt](./image/pr1.png)

    ![alt](./image/pr2.png)

- Lịch sử chạy CI khi Pull request

    ![alt](./image/pr3.png)

- Output log của luồng CI khi Pull request

    ![alt](./image/pr4.png)

    ![alt](./image/pr5.png)

#### 3. Automation 
#### Viết ansible playbooks để triển khai các image docker của các dịch vụ web, api, db, mỗi dịch vụ 1 role

Cấu trúc thư mục Ansible:

    ansible/
    ├── roles/
    │   ├── common/
    │   │   ├── tasks/
    │   │   │   └── main.yml
    │   │   └── vars/
    │   │       └── main.yml
    │   ├── web/
    │   │   ├── tasks/
    │   │   │   └── main.yml
    │   │   └── vars/
    │   │       └── main.yml
    │   ├── api/
    │   │   ├── tasks/
    │   │   │   └── main.yml
    │   │   └── vars/
    │   │       └── main.yml
    │   └── db/
    │       ├── tasks/
    │       │   └── main.yml
    │       ├── files/
    │       │   ├── attendees.json
    │       │   └── init-data.sh
    │       └── vars/
    │           └── main.yml
    ├── playbook.yml
    └── inventory.yml


  - Danh sách các roles: 
     
    - [common](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/common/tasks/main.yml)
    - [web](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/web/tasks/main.yml)
    - [api](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/api/tasks/main.yml)
    - [db](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/db/tasks/main.yml)

#### Trong từng role cho phép tuỳ biến cấu hình của các dịch vụ thông qua các variables

- variables cho từng role:
    - [common](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/common/vars/main.yml)
    - [web](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/web/vars/main.yml)
    - [api](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/api/vars/main.yml)
    - [db](https://github.com/hantbk/vdtproject/blob/main/ansible/roles/db/vars/main.yml)

#### Cho phép triển khai các dịch vụ trên các host khác nhau thông qua file inventory
Ví dụ triển khai hệ thống với Ansible: Triển khai lên 2 máy ảo host1 và host2

![alt](./image/setup.png)

Sử dụng inventory file là [inventory.yml](https://github.com/hantbk/vdtproject/blob/main/ansible/inventory.yml)
```yaml
---
all:
  hosts:
    host1:
      ansible_host: 192.168.1.22
      ansible_user: hant
      ansible_become: true
      ansible_become_method: sudo
      ansible_become_password: 123

    host2:
      ansible_host: 192.168.1.21
      ansible_user: hant
      ansible_become: true
      ansible_become_method: sudo
      ansible_become_password: 123
```

  Với cấu hình file playbook là [playbook.yml](https://github.com/hantbk/vdtproject/blob/main/ansible/playbook.yml)

  ```yaml
  ---
  - name: Setup Docker
    hosts: all
    become: true
    gather_facts: true

    roles:
      - common

  - name: Setup Web service 
    hosts: all
    become: true
    gather_facts: true

    roles:
      - web

  - name: Setup API + DB service
    hosts: all
    become: true
    gather_facts: true

    roles:
      - api
      - db
  ```

  Sử dụng lệnh sau để chạy Ansible playbook:
  `ansible-playbook -i inventory.yml playbook.yml`

- Output log triển khai hệ thống

    ![alt](./image/ansi1.png)

    ![alt](./image/ansi2.png)

    ![alt](./image/ansi3.png)

- Kết quả triển khai lên máy ảo host1 và host2
    ![alt](./image/ansi4.png)

Happy coding! :smile: :smile: :smile:

# Ansible
Đường dẫn đến repo: [anisble](https://github.com/DoTruong1/ansible)
# Mô tả nội dung đã làm
## Các roles trong repo
### 1. common
- Role này dùng để cài đặt cả ứng dụng cần thiết để triển khai `docker images` trên tất cả các host. Ngoài docker, thì role còn cài đặt thêm các module python cần thiết để chạy `docker, docker-compose` module của ansible
- Các gói được cài đặt:
  - ca-certificates
  - curl
  - python3
  - python3-pip
  - docker-ce
  - docker-ce-cli
  - containerd.io
  - docker-buildx-plugin
  - docker-compose-plugin
- Các gói python được cài đặt
    - requests < 2.29.0
    - urllib3<2.0
    - docker==6.1.3
    - docker-compose
### 2. api
- Role này được sử dụng để triển khai image api của ứng dụng.
- Image api được triển khai bằng cách sử dụng docker-compose kết hợp với một image `nginx` dùng để cân bằng tải khi có request gửi đến.
- Các "vars" mặc định của role nằm trong `defaults/main.yaml` của role. Theo từng môi trường thì các biến sẽ có giá trị khác nhau. Vd: để sử dụng các giá trị của môi trường production thì giá trị của env sẽ thay bằng `production`
```yaml
# ---
env: default

api:
  default: # môi trường triển khai (môi trường đefault)
    api_image: dotruong1910/backend # tên image
    api_image_tag: test-v4 # tag của image
    api_port: 3000 # cổng image
    api_path: /api/v1 
    api_replicas: 2 # số lượng container muốn triển khai
  production: # môi trường production
  staging: # môi trường production
```
- Template của file `docker-compose.yaml` và file `nginx.conf` nẳm trong thư mục template của role. Dưới đây lần lượt là nội dung của các template
```nginx, nginx.conf.j2
# nginx.conf.j2
upstream backend {
    server backend:3000;
}

server {
    listen 80;

    resolver 127.0.0.11 valid=5s;
    
    include /etc/nginx/mime.types;

    location / {
        proxy_pass http://backend/;
    }
}
```

```yaml ,docker-compose.yaml.j2
# docker-compose.yaml
version: '3'
services:
  backend:
    image: "{{  api[env].api_image }}:{{ api[env].api_image_tag}}"
    environment:
      DB_USER: "{{ db[env].db_user }}"
      DB_PASSWORD: "{{ db[env].db_user_passw }}"
      DB_NAME: "{{ db[env].db_name }}"
      DB_PORT: "{{ db[env].db_port }}"
      DB_HOST: "{{ hostvars[(env +".db")].ansible_host }}"
      API_PATH: "{{ api[env].api_path }}"
      PORT: 3000
    deploy:
      replicas: "{{ api[env].api_replicas }}"
    networks:
      - loadbalancing
  nginx:
    image: nginx:latest
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - /etc/nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf
    networks:
      - loadbalancing
    depends_on:
      - backend
networks:
  loadbalancing: {}
```

### 3. db
- Role này được sử dụng để triển khai dựng database.
- Image dbs được triển khai bằng cách sử dụng các docker module của ansible.
- Các "vars" mặc định của role nằm trong `defaults/main.yaml` của role. Theo từng môi trường thì các biến sẽ có giá trị khác nhau. Vd: để sử dụng các giá trị của môi trường production thì giá trị của env sẽ thay bằng `production`
```yaml
# ---
# defaults file for db
env: default
db:
  default:
    db_user: vdt # Tên user cho db
    db_user_passw: vdt1234 # mật khẩu của users
    db_name: users # tên database
    db_port: 3306
  production:
  test:
```
### 4. web
- Role này được sử dụng để triển khai image của ứng dụng web.
- Image của ứng dụng được triển khai bằng cách sử dụng các docker module của ansible.
- Các "vars" mặc định của role nằm trong `defaults/main.yaml` của role. Theo từng môi trường thì các biến sẽ có giá trị khác nhau. Vd: để sử dụng các giá trị của môi trường production thì giá trị của env sẽ thay bằng `production`
```yaml
# ---
# defaults file for we
env: default
web:
  default:
    web_image: dotruong1910/frontend # tên image
    web_tag: main-14f12e2 # image tag
    # api_path: /api/v1
    web_port: 80 # cổng muốn expose service
    web_replicas: 1
    web_backend_env_url: default #tên môi trường triển khai của đường dẫn api muốn sử dụng
  production:
  test:
```
## File inventory
- Để triển khai ứng dụng em sẽ tạo 3 máy ảo với 3 với mỗi mỗi image tương ứng sẽ được triển khai lên máy ảo tương ứng, các máy ảo này đã được setup ssh keys

- Các máy ảo này có địa chỉ IP private là khác nhau và được chia theo mục đích muốn triển khải và được prefix theo môi trường
### Nội dung file inventory
```yaml
webs:
  hosts:
    web:
      ansible_host: 198.19.249.120
apis:
  hosts:
    default.api:
      ansible_host: 198.19.249.207
dbs:
  hosts:
    default.db:
      ansible_host: 198.19.249.129
```
### Các biến môi trường trong group_vars
- Mặc dù các role đã có các giá trị mặc định của mình, tuy nhiên có thể custom lại giá trị của biến theo mục đích thông qua file `group_vars/all/all.yaml`. Nếu như file này để trống thì mặc định khi chạy các playbook thì sẽ nhận giá trị mặc định của roles. Dưới đây là nội dung của file.
```yaml
---
env: default
db:
  default:
    db_host: db.home.arpa
    db_user: vdt
    db_user_passw: vdt1234
    db_name: users
    db_port: 3306
  production:
  test:

web:
  default:
    web_image: dotruong1910/frontend
    web_tag: main-14f12e2
    # api_path: /api/v1
    web_port: 80
    web_replicas: 1
    web_backend_env_url: default
  production:
  test:

api:
  default:
    api_image: dotruong1910/backend
    api_image_tag: main-12d8b5b
    api_port: 3000
    api_path: /api/v1
    api_replicas: 2
    api_lb_host: api.home.arpa
  production:
  test:
```
# Output của các role
## Role common

[![Screenshot-2024-05-26-at-02-29-22.png](https://i.postimg.cc/g2qHtN0s/Screenshot-2024-05-26-at-02-29-22.png)](https://postimg.cc/Xrq5pKdB)
[![Screenshot-2024-05-26-at-02-30-57.png](https://i.postimg.cc/LXBq20rQ/Screenshot-2024-05-26-at-02-30-57.png)](https://postimg.cc/G8t3jz3v)
## Role db
[![Screenshot-2024-05-26-at-02-32-14.png](https://i.postimg.cc/ZnX0ct3R/Screenshot-2024-05-26-at-02-32-14.png)](https://postimg.cc/0Kd8k4VR)
## Role api
[![Screenshot-2024-05-26-at-02-34-45.png](https://i.postimg.cc/R0zmTCDy/Screenshot-2024-05-26-at-02-34-45.png)](https://postimg.cc/9D1sm2VY)
## Role web
[![Screenshot-2024-05-26-at-02-35-52.png](https://i.postimg.cc/sfKpdvPP/Screenshot-2024-05-26-at-02-35-52.png)](https://postimg.cc/7bGCSPWb)
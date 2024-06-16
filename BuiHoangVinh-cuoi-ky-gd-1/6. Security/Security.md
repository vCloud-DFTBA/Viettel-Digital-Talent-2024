# Security
## Yêu cầu 1: 

- Dựng HAProxy Loadbalancer trên 1 VM riêng (trong trường hợp cụm lab riêng của sinh viên) hoặc trên Basion Node (trường hợp sử dụng cụm Lab của Viettel Cloud) với mode TCP, mở 2 port web_port và api_port trên LB trỏ đến 2 NodePort của Web Deployment và API Deployment trên K8S Cluster.
- Sử dụng 1 trong 2 giải pháp Ingress, hoặc haproxy sidecar container cho các deployment, đảm bảo các truy cập đến các port web_port và api_port sử dụng https
- Cho phép sinh viên sử dụng self-signed cert để làm bài

## Triển khai của HAProxy Loadbalancer cho web port và api port
VM Master node có IP: 192.168.144.143
VM Worker node có IP: 192.168.144.145
Chạy trên 1 VM Mới có IP là 192.168.144.136

### Tạo self signed cert:
```
# cài đặt OpenSSL
sudo apt-get install openssl

# Tạo chứng chỉ tự ký
sudo openssl req -new -x509 -key /etc/ssl/private/haproxy-selfsigned.key -out /etc/ssl/certs/haproxy-selfsigned.crt -days 365

# Kết hợp khóa và chứng chỉ thành file PEM
cat /etc/ssl/private/haproxy-selfsigned.key /etc/ssl/certs/haproxy-selfsigned.crt > /etc/ssl/private/haproxy.pem
```

### Haproxy được cấu hính sử dụng SSL https với chứng chỉ self signed cert

File haproxy.cfg
```
global
    log /dev/log    local0
    log /dev/log    local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

    # Tuning SSL
    tune.ssl.default-dh-param 2048

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend web_port_in
    bind *:3000 ssl crt /etc/ssl/private/haproxy.pem #file chứng chỉ
    mode tcp
    default_backend web_port_out
frontend api_port_in
    bind *:8000 ssl crt /etc/ssl/private/haproxy.pem #file chứng chỉ
    mode tcp
    default_backend api_port_out
backend web_port_out
    mode tcp
    balance roundrobin
    server web1 192.168.144.143:30001 check
    server web2 192.168.144.145:30001 check
backend api_port_out
    mode tcp
    balance roundrobin
    server api1 192.168.144.143:30002 check
    server api2 192.168.144.145:30002 check
```


## Kết quả:
Truy cập Web service thông qua LB: https://192.168.144.136:3000

Hình ảnh chứng chỉ SSL self signed cert và call api tới API Service qua url: https://192.168.144.136:8000/api/students/?query=
![alt text](./images/lb-web.png)

Truy cập API service thông qua LB: https://192.168.144.136:8000/api/students/
![alt text](./images/lb-api.png)

## Yêu cầu 2:

- Đảm bảo 1 số URL của api service  khi truy cập phải có xác thực thông qua 1 trong số các phương thức cookie, basic auth, token auth, nếu không sẽ trả về HTTP response code 403. 

- Thực hiện phân quyền cho 2 loại người dùng trên API:
Nếu người dùng có role là user thì truy cập vào GET request trả về code 200, còn truy cập vào POST/DELETE thì trả về 403

- Nếu người dùng có role là admin thì truy cập vào GET request trả về code 200, còn truy cập vào POST/DELETE thì trả về 2xx
## Output: 

- File trình bày giải pháp sử dụng để authen/authorization cho các service
- Kết quả HTTP Response khi curl hoặc dùng postman gọi vào các URL khi truyền thêm thông tin xác thực và khi không truyền thông tin xác thực
- Kết quả HTTP Response khi curl hoặc dùng postman vào các URL với các method GET/POST/DELETE  khi lần lượt dùng thông tin xác thực của các user có role là user và admin

## Giải pháp thực hiện authen/authorization
### [File trình bày giải pháp authen/authorization](./solutions/authen-author-solution.md)

Sử dụng xác thực thông qua token auth (Barer Authentication)

Trong hệ thống đang có 2 role là admin và user

Tài khoản role admin: 
- username: admin
- password: 123

Tài khoản role user: 
- username: user1
- password: 123

![alt text](./images/table-vdt-users.png)

## Kết quả HTTP Response khi dùng postman gọi vào các URL khi truyền thêm thông tin xác thực và khi không truyền thông tin xác thực

Viết 1 middleware đứng trước controller, nhận tất cả request và kiểm tra token, nếu có token tiếp tục giải mã token và lấy thông tin kiểm tra xem có tồn tại thông tin đó. Trong token lưu user_id và username. Ngoại trừ đường dẫn /api/login (Là đường dẫn để tạo token)

Hình ảnh không sử dụng token Baerer và truy cập vào đường dẫn [GET] http://192.168.144.143:30002/api/students/, API Service kiểm tra không có token và trả về lỗi 403 Forbidden

![alt text](./images/no-token.png)

Tiến hành đăng nhập vào tài khoản admin để nhận về 1 token
![alt text](./images/login-admin.png)

```
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIn0.Sb5ibowk_Gifx63N_VbiH288OIUKbnt-tQ6KQhPTlRI"
```

Lấy token vừa nhận được, truyền vào Baerer Token trong Postman và gửi request tới [GET]http://192.168.144.143:30002/api/students/, lần này API service đã kiểm tra và xác thực token hợp lệ và trả về data với status 200 OK
![alt text](./images/valid-token.png)

Nếu gửi 1 token không hợp lệ (ví dụ token: demo-wrong-token), API Service sẽ kiểm tra không hợp lệ và trả về lỗi 403 Forbidden
![alt text](./images/invalid-token.png)

## Kết quả HTTP Response khi dùng postman vào các URL với các method GET/POST/DELETE khi lần lượt dùng thông tin xác thực của các user có role là user và admin


### Khi truy cập với vai trò User thông thường
#### Lấy token user khi truy cập vào đường dẫn http://192.168.144.143:30002/api/login/

Điền thông tin tài khoản username: user1, password: 123

![alt text](./images/user-login.png)
```
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InVzZXIxIn0.CN8vVb5p9OTPGc19SDtWJZJRYgWsurF6YEGGFFao_m8"
```
#### (User) URL: [GET] http://192.168.144.143:30002/api/students/, trả về status 200 OK
![alt text](./images/user-get.png)

#### (User) URL: [POST] http://192.168.144.143:30002/api/students/create, trả về status 403 Forbidden, error: User không đủ thẩm quyền
![alt text](./images/user-post.png)

#### (User) URL: [DELETE] http://192.168.144.143:30002/api/students/delete/49, trả về status 403 Forbidden, error: User không đủ thẩm quyền
![alt text](./images/user-delete.png)


### Khi truy cập với vai trò Admin
```
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIn0.Sb5ibowk_Gifx63N_VbiH288OIUKbnt-tQ6KQhPTlRI"
```

#### (Admin) URL: [GET] http://192.168.144.143:30002/api/students/, trả về status 200 OK

![alt text](./images/admin-get.png)

#### (Admin) URL: [POST] http://192.168.144.143:30002/api/students/create, trả về status 201 Created
![alt text](./images/admin-post.png)

#### (Admin) URL: [DELETE] http://192.168.144.143:30002/api/students/delete/49, trả về status 204 No Content, "message": "Student deleted successfully"
![alt text](./images/admin-delete.png)



## Yêu cầu 3:

Sử dụng 1 trong số các giải pháp để ratelimit cho Endpoint của api Service, sao cho nếu có  quá 10 request trong 1 phút gửi đến Endpoint của api service thì các request sau đó bị trả về HTTP Response 409 

## Output:

- File tài liệu trình bày giải pháp
- File ghi lại kết quả thử nghiệm khi gọi quá 10 request trong 1 phút vào Endpoint của API Service

### [File tài liệu trình bày giải pháp ratelimit](./solutions/ratelimit-solution.md)
## Kết quả thử nghiệm khi gọi quá 10 request trong 1 phút
### Hình ảnh chụp màn hình kibana
Các request tới API /api/students/ được gửi bắt đầu từ Jun 13, 2024 @ 21:06:21.945 tới Jun 13, 2024 @ 21:06:41.484, trong đó có 10 request đầu tiên trả về trạng thái 200, từ request thứ 11 trả về trạng thái 409

#### [File log kết quả thử nghiệm ratelimit export từ kibana](./logs/kibana-ratelimit.json)
![alt text](./images/kibana-ratelimit.png)

### Hình ảnh chụp màn hình argocd log của vdt-api
Log được sinh ra từ deployement vdt-api trên ArgoCD bắt đầu từ [13/Jun/2024 14:06:21] (GMT0) tới [13/Jun/2024 14:06:41](GMT0), trong đó có 10 request đầu tiên trả về trạng thái 200, từ request thứ 11 trả về trạng thái 409

Chú ý độ lệnh múi giờ GMT+7 nên log hiển thị là 14:06:21, tương đương với 21:06:21 (GMT+7)

#### [File log kết quả thử nghiệm ratelimit từ argocd](./logs/deployment-log.md)
![alt text](./images/argo-ratelimit.png)

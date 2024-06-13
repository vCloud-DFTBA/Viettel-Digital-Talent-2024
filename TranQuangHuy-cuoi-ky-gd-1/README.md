# Bài tập lớn cuối kỳ chương trình VDT 2024 lĩnh vực Cloud - GĐ 1

**Chú ý:**
- Hạn nộp bài:  23:59 11/6/2024, toàn bộ action trên PR sau mốc 23:59 11/6/2024 (giờ Việt Nam) đều không được tính với bất cứ lí do gì!
- Tổng điểm đánh giá trên các yêu cầu là 10
- Nộp bài bằng cách tạo 1 PR với folder là tên cá nhân-cuoi-ky-gd-1 (ví dụ VuTuanDat) và submit https://github.com/vCloud-DFTBA/Viettel-Digital-Talent-2024
- PR yêu cầu không chứa source code của web application (chỉ dẫn link github), chỉ chứa thông tin giải thích, phân tích, quá trình tìm hiểu, hình ảnh kết quả v.v.
- Khi có thắc mắc về đề bài, gửi thắc mắc lên kênh chat Telegram của chương trình
- Trong trường hợp sinh viên sử dụng cụm lab của Viettel Cloud và cần expose các dịch vụ ra Internet thông qua Bastion Node, chỉ sử dụng port nằm trong dải port đã được cấp cho từng người trên Bastion Node 116.103.226.146. - chi tiết: Final - Phân chia dải port trên basion host
- Ví dụ: sinh viên Trần Quang Huy có dải port mạng là 8460 -8479, trên bastion host có home folder ở path /home/user019 muốn expose service nginx  ra internet thông qua IP 116.103.226.146 và port  8465 có thể thực hiện:
- Tạo folder /home/user019/nginx-service
- Tạo file  /home/user019/nginx-service/docker-compose.yml với nội dung tương tự như sau và sử dụng lệnh docker-compose up -d để bật dịch vụ lên trên Bastion Node ở port 8465:
```
version: '3.7'
services:
 nginx:
   image: nginx:1.17
   ports:
     - 8465:80
```
## Chi tiết đề bài
### Triển khai Kubernetes (1 điểm)

#### Yêu cầu:

Y/c 1:
- Triển khai được Kubernetes thông qua công cụ minikube trên 1 node: 0.5 điểm
Hoặc
- Triển khai được Kubernetes thông qua công cụ kubeadm hoặc kubespray lên 1 master node VM + 1 worker node VM: 1 điểm

**Output**:

- Tài liệu cài đặt
Log của các lệnh kiểm tra hệ thống như: kubectl get nodes - o wide
-------------------------------------
[Bài làm câu 1](./NoiDung/P1.md)
------------------------------------
## Triển khai web application sử dụng các DevOps tools & practices K8S Helm Chart (1.5đ)
#### Yêu cầu 1:

- Cài đặt ArgoCD lên Kubernetes Cluster, expose được ArgoCD qua NodePort
Trong trường hợp sử dụng cụm Lab trên Viettel Cloud, cài đặt Loadbalancer lên Bastion Node thông qua công cụ docker-compose, expose port ArgoCD ra môi trường public thông qua một trong số các port đã được cấp cho từng sinh viên
- Output 1:
- File manifests sử dụng để triển khai ArgoCD lên K8S  Cluster
- File config, docker-compose.yaml sử dụng để triển khai loadbalancer của ArgoCD lên Bastion Node (trong trường hợp sử dụng cụm lab trên Viettel Cloud)
- Ảnh chụp giao diện màn hình hệ thống ArgoCD khi truy cập qua trình duyệt trình duyệt


#### Yêu cầu 2: 
- Viết 2 Helm Chart cho web Deployment và api Deployment, để vào 1 folder riêng trong repo web và repo api
- Tạo 2 Repo Config cho web và api, trong các repo này chứa các file values.yaml với nội dung của cá file values.yaml là các config cần thiết để chạy web và api trên k8s bằng Helm Chart 
Sử dụng tính năng multiple sources của ArgoCD để triển khai các service web và api service lên K8S Cluster  theo hướng dẫn của ArgoCD, expose các service này dưới dạng NodePort Multiple Sources for an Application - Argo CD - Declarative GitOps CD for Kubernetes
- Trong trường hợp sử dụng cụm Lab trên Viettel Cloud, cài đặt Loadbalancer lên Bastion Node thông qua công cụ docker-compose, expose 2 port của Web ra môi trường public thông qua một trong số các port đã được cấp cho từng sinh viên

#### Output 2:
- Các Helm Chart sử dụng để triển khai web Deployment và api Deployment lên K8S Cluster 
- Các file values.yaml trong 2 config repo của  của web service và api service
- Manifest của ArgoCD Application
- File config, docker-compose.yaml sử dụng để triển khai loadbalancer của ArgoCD lên Bastion Node (trong trường hợp sử dụng cụm lab trên Viettel Cloud)
- Ảnh chụp giao diện màn hình hệ thống ArgoCD trên trình duyệt
- Ảnh chụp giao diện màn hình trình duyệt khi truy cập vào Web URL, API URL
-------------------------------------
[Bài làm câu 2](./NoiDung/P2.md)
------------------------------------
## Continuous Delivery (1.5đ)
### Yêu cầu:
- Viết 2 luồng CD cho 2 repo web và api, khi có 1 tag mới được tạo ra trên trên 1 trong 2 repo này thì luồng deploy tương ứng của repo đó thực hiện các công việc sau:
  - Build docker image với image tag là tag name đã được tạo ra trên gitlab và push docker image sau khi build xong lên Docker Hub
  - Sửa giá trị Image version trong file values.yaml  trong config repo và push thay đổi lên config repo. Tham khảo: https://stackoverflow.com/a/72696837
- Cấu hình ArgoCD tự động triển khai lại web Deployment và api Deployment khi có sự thay đổi trên config repo.
                           
### Output:
- Các file setup công cụ của 2 luồng CD
- Output log của 2 luồng CD khi tạo tag mới trên repo web và repo api
- Hình ảnh app triển khai argoCD, hình ảnh diff khi argoCD phát hiện thay đổi ở config repo tương tự hình ảnh sau
- Các hình ảnh demo khác như danh sách event trong app
-------------------------------------
[Bài làm câu 3](./NoiDung/P3.md)
------------------------------------

## Monitoring (1.5đ)
### Yêu cầu:
- Expose metric của web service và api service ra 1 http path. Tham khảo:
https://github.com/korfuri/django-prometheus
- Triển khai Prometheus lên Kubernetes Cluster thông qua Prometheus Operator, phơi ra ngoài dưới dạng NodePort: 
Expose Prometheus dưới dạng Nodeport
- Trong trường hợp sử dụng cụm lab của Viettel Cloud, tạo 1 load balancer với backend là NodePort Service của Prometheus, để expose Prometheus UI ra Public Internet 
- Sử dụng Service Monitor của Prometheus Operator để giám sát Web Deployment và API Deployment
### Output:
- Các file setup để triển khai Prometheus lên Kubernetes Cluster
- Hình ảnh khi truy cập vào Prometheus UI thông qua trình duyệt
- Hình ảnh danh sách target của Web Deployment và API Deployment được giám sát bởi Prometheus, ví dụ:

-------------------------------------
[Bài làm câu 4](./NoiDung/P4.md)
------------------------------------
## Logging (1.5đ)
### Yêu cầu:
- Sử dụng Kubernetes DaemonSet triển khai fluentd hoặc fluentbit lên kubernetes đẩy log của các Deployment Web Deployment và API Deployment lên cụm ElasticSearch tập trung với prefix index dưới dạng tên_sinh_viên_viết_tắt_sdt: Ví dụ: conghm_012345678
Thông tin cụm ES tập trung:
- Username: elastic
- Password: iRsUoyhqW-CyyGdwk6V_
- Elastic Search URL: https://116.103.226.146:9200
- Kibana URL: http://116.103.226.146:5601/login?next=%2Fapp%2Fdiscover#/
- Cấu hình logging cho web service và api service, đảm bảo khi có http request gửi vào web service hoặc api service thì trong các log mà các service này sinh ra, có ít nhất 1 log có các thông tin:
 Request Path(VD: /api1/1, /api2/3 ..)
- HTTP Method VD: (GET PUT POST…)
- Response Code: 302, 200, 202, 201…
#### Output:
- Hình ảnh chụp màn hình Kibana kết quả tìm kiếm log của các Service Web và Service API theo url path
-------------------------------------
[Bài làm câu 5](./NoiDung/P5.md)
------------------------------------
## Security

### Yêu cầu 1 (1đ): 

- Dựng HAProxy Loadbalancer trên 1 VM riêng (trong trường hợp cụm lab riêng của sinh viên) hoặc trên Basion Node (trường hợp sử dụng cụm Lab của Viettel Cloud) với mode TCP, mở 2 port web_port và api_port trên LB trỏ đến 2 NodePort của Web Deployment và API Deployment trên K8S Cluster. (0.5)
- Sử dụng 1 trong 2 giải pháp Ingress, hoặc haproxy sidecar container cho các deployment, đảm bảo các truy cập đến các port web_port và api_port sử dụng https (0.5)
Cho phép sinh viên sử dụng self-signed cert để làm bài

### Output 1: 

- File cấu hình của HAProxy Loadbalancer cho web port và api port
- File cấu hình ingress hoặc file cấu hình deployment sau khi thêm HAProxy sidecar container vào Deployment
- Kết quả truy cập vào web port và api port từ trình duyệt thông qua giao thức https hoặc dùng curl. Ví dụ:
	
### Yêu cầu 2 (1đ):

- Đảm bảo 1 số URL của api service  khi truy cập phải có xác thực thông qua 1 trong số các phương thức cookie, basic auth, token auth, nếu không sẽ trả về HTTP response code 403. (0.5)
- Thực hiện phân quyền cho 2 loại người dùng trên API:
- Nếu người dùng có role là user thì truy cập vào GET request trả về code 200, còn truy cập vào POST/DELETE thì trả về 403
- Nếu người dùng có role là admin thì truy cập vào GET request trả về code 200, còn truy cập vào POST/DELETE thì trả về 2xx
### Output: 

- File trình bày giải pháp sử dụng để authen/authorization cho các service
- Kết quả HTTP Response khi curl hoặc dùng postman gọi vào các URL khi truyền thêm thông tin xác thực và khi không truyền thông tin xác thực
- Kết quả HTTP Response khi curl hoặc dùng postman vào các URL với các method GET/POST/DELETE  khi lần lượt dùng thông tin xác thực của các user có role là user và admin

Tham khảo cách sử dụng công cụ CURL với thông tin xác thực: https://reqbin.com/req/c-haxm0xgr/curl-basic-auth-example
	

Yêu cầu 3 (1đ):

Sử dụng 1 trong số các giải pháp để ratelimit cho Endpoint của api Service, sao cho nếu có  quá 10 request trong 1 phút gửi đến Endpoint của api service thì các request sau đó bị trả về HTTP Response 409 

Output:

File tài liệu trình bày giải pháp
File ghi lại kết quả thử nghiệm khi gọi quá 10 request trong 1 phút vào Endpoint của API Service
-------------------------------------
[Bài làm câu 6](./NoiDung/P6.md)
------------------------------------
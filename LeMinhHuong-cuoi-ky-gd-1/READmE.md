# FINAL

LeMinhHuong

# 1. Triển khai Kubernetes (1 điểm)

Triển khai được Kubernetes thông qua công cụ kubeadm hoặc kubespray lên 1 master node VM + 1 worker node VM: 1 điểm

- Tài liệu cài đặt

- Log của các lệnh kiểm tra hệ thống như `kubectl get nodes - o wide`

## [1-kubespray.md](assets/1-kubespray.md)

# Triển khai web application sử dụng các DevOps tools & practices

# 2. K8S Helm Chart (1.5đ)

## Output 1:

- File manifests sử dụng để triển khai ArgoCD lên K8S Cluster
- Ảnh chụp giao diện màn hình hệ thống ArgoCD khi truy cập qua trình duyệt trình duyệt

## Output 2:
- Các Helm Chart sử dụng để triển khai web Deployment và api Deployment lên K8S Cluster
- Các file values.yaml trong 2 config repo của của web service và api service
- Manifest của ArgoCD Application

## [2-argocd.md](./assets/2-argocd.md) 

# 3. Continuous Delivery (1.5đ)

- Các file setup công cụ của 2 luồng CD
- Output log của 2 luồng CD khi tạo tag mới trên repo web và repo api
- Hình ảnh history của ArgoCD khi có sự thay đổi trên web config repo và api config repo tương tự hình ảnh sau
- Các hình ảnh demo khác

## [3-cd.md](./assets/3-cd.md) 

# 4. Monitoring (1.5đ)

- Các file setup để triển khai Prometheus lên Kubernetes Cluster
- Hình ảnh khi truy cập vào Prometheus UI thông qua trình duyệt
- Hình ảnh danh sách target của Web Deployment và API Deployment được giám sát bởi Prometheus

## [4-prometheus.md](./assets/4-prometheus.md) 

# 5. Logging (1.5đ)

- Hình ảnh chụp màn hình Kibana kết quả tìm kiếm log của các Service Web và Service API theo url path

## [5-logging.md](./assets/5-logging.md)

# 6. Security (1đ)

## Output 1:

- File cấu hình của HAProxy Loadbalancer cho web port và api port
- File cấu hình ingress hoặc file cấu hình deployment sau khi thêm HAProxy sidecar container vào Deployment
- Kết quả truy cập vào web port và api port từ trình duyệt thông qua giao thức https hoặc dùng curl.

## Output 2:

- File trình bày giải pháp sử dụng để authen/authorization cho các service
- Kết quả HTTP Response khi curl hoặc dùng postman gọi vào các URL khi truyền thêm thông tin xác thực và khi không truyền thông tin
xác thực
- Kết quả HTTP Response khi curl hoặc dùng postman vào các URL với các method GET/POST/DELETE khi lần lượt dùng thông tin
xác thực của các user có role là user và admin

## Output 3:
- File tài liệu trình bày giải pháp
- File ghi lại kết quả thử nghiệm khi gọi quá 10 request trong 1 phút vào Endpoint của API Service

## [6-security.md](./assets/6-security.md)
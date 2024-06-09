# Bài tập cuối kỳ chương trình VDT 2024 lĩnh vực Cloud

## Table of Contents

## Triển khai Kubernetes

### 1. Yêu cầu: 
-   Triển khai Kubernetes thông qua công cụ kubeadm lên một master node VM và một worker node VM.

### 2. khái niệm 
<div align="center">
    <img src="images/kubecdm.png" style="width: 80%;margin-bottom: 10">
</div>

#### 2.1 Kubeadm là gì?
-   Kubeadm là một công cụ để thiết lập cụm Kubernetes khả thi tối thiểu mà không cần cấu hình phức tạp. Ngoài ra, Kubeadm giúp toàn bộ quá trình trở nên dễ dàng bằng cách chạy một loạt các bước kiểm tra trước để đảm bảo rằng máy chủ có tất cả các thành phần và cấu hình cần thiết để chạy Kubernetes.

#### 2.2 Điều kiện tiên quyết để thiết lập Kubeadm
-   Sau đây là các điều kiện tiên quyết để thiết lập cụm Kubeadm Kubernetes: 
    +   Tối thiểu hai nút Ubuntu [Một nút chính và một nút công nhân]. Bạn có thể có nhiều nút công nhân hơn theo yêu cầu của bạn.
    +   Nút chính phải có tối thiểu 2 vCPU và RAM 2GB.
    +   Đối với các nút công nhân, nên sử dụng tối thiểu 1vCPU và RAM 2 GB.
    +   Phạm vi mạng 10.X.X.X/X với IP tĩnh cho nút chính và nút công nhân. Chúng tôi sẽ sử dụng chuỗi 192.x.x.x làm phạm vi mạng nhóm sẽ được plugin mạng Calico sử dụng. Đảm bảo phạm vi Node IP và phạm vi IP nhóm không trùng nhau.

### 3. Cài đặt Kubernetes bằng Kubeadm
#### 3.1. Chuẩn bị môi trường
- Chạy các lệnh bên dưới trên cả Master và Worker Node

1. Tạo tệp `/etc/modules-load.d/k8s.conf` và thêm các mô-đun kernel cần thiết:
    ```bash
    cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
    overlay
    br_netfilter
    EOF
    ```
    -   **overlay**: Mô-đun này hỗ trợ hệ thống tệp overlay, cần thiết cho các container.
    -   **br_netfilter**: Mô-đun này cho phép Netfilter (tường lửa) xử lý gói tin đi qua cầu mạng (bridge network), cần thiết cho việc lọc gói tin trong mạng của Kubernetes.

2. Tải các mô-đun kernel :
    ```bash
    sudo modprobe overlay
    sudo modprobe br_netfilter
    ```
3. Tạo tệp cấu hình sysctl `/etc/sysctl.d/k8s.conf` để thiết lập các tham số mạng cần thiết:
    ```bash 
    cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-iptables  = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    net.ipv4.ip_forward                 = 1
    EOF
    ```

4. Vô hiệu hóa **SWAP**:
    ```bash
    sudo swapoff -a
    (crontab -l 2>/dev/null; echo "@reboot /sbin/swapoff -a") | crontab - || true
    ```

5. Install **Docker Engine** :

    ```bash
    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

6. Cài đặt kubeadm, kubelet và kubectl:
-   Cập nhật danh sách gói APT và cài đặt các gói cần thiết để sử dụng kho apt của Kubernetes
    ```bash
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl gpg
    ```
-   Tải `public signing key` cho Kubernetes package repositories
    ```bash
    curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
    ```
-   Thêm kho lưu trữ Kubernetes apt thích hợp
    ```bash
    echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
    ```
-   Update the apt package index, install kubelet, kubeadm and kubectl, and pin their version:
    ```bash
    sudo apt-get update
    sudo apt-get install -y kubelet kubeadm kubectl
    sudo apt-mark hold kubelet kubeadm kubectl
    ```
-   Kích hoạt dịch vụ kubelet trước khi chạy kubeadm:
    ```bash
    sudo systemctl enable --now kubelet
    ```
#### 3.2. Khởi động control plane và node
1. Khởi tạo control plane
-   `control plane` là nơi chạy các component bao gồm `etcd` (cơ sở dữ liệu của `cluster`) và `API Server` (nơi các câu lệnh `kubectl` giao tiếp).
- Chạy câu lệnh sau ở máy ảo mà chúng ta đặt tên là Master:
    ```bash
    sudo kubeadm init --apiserver-advertise-address=192.168.56.2 --pod-network-cidr=10.244.0.0/16
    ```
    - `apiserver-advertise-address=192.168.0.106`: Địa chỉ IP mà máy chủ API sẽ lắng nghe các câu lệnh. Trong hướng dẫn này sẽ là địa chỉa IP của máy ảo Master.
    - `pod-network-cidr=10.244.0.0/16`: Chọn CIDR sao cho không trùng với bất kỳ dải mạng hiện có để tránh xung đột địa chỉ IP.

- Tạo kubeconfig trong master để có thể sử dụng kubectl để tương tác với cluster API.
    ```
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    ```
-   Xác minh kubeconfig bằng cách thực hiện lệnh kubectl sau để liệt kê tất cả các nhóm trong không gian tên kube-system.
    ```
    kubectl get po -n kube-system
    ```
    <div align="center">
    <img src="images/log1.png">
    </div>

2. Add worker node to master node Kubernetes
-  Tạo token (hoặc có thể lấy nó ở phần kết quả sau khi khởi tạo control plane)
    ```bash
    kubeadm token create --print-join-command
    ```

- Chạy lệnh để add worker node :
    ```bash
    sudo kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
    ```

### 4. Kết quả kiểm tra hệ thống:
```bash
kubectl get nodes - o wide
```
<div align="center">
    <img src="images/log2.png" style="margin-bottom: 20">
</div>

```bash
kubectl describe nodes
```

<div align="center">
    <img src="images/log3.png">
</div>


## Triển khai web application sử dụng các DevOps tools & practices
### K8S Helm Chart 

### 1. Yêu cầu: 
-   Cài đặt ArgoCD lên Kubernetes Cluster, expose được ArgoCD qua NodePort
-   Viết 2 Helm Chart cho web Deployment và api Deployment, để vào 1 folder riêng trong repo web và repo api
-   Tạo 2 Repo Config cho web và api, trong các repo này chứa các file values.yaml với nội dung của cá file values.yaml là các config cần thiết để chạy web và api trên k8s bằng Helm Chart 
-   Sử dụng tính năng multiple sources của ArgoCD để triển khai các service web và api service lên K8S Cluster  theo hướng dẫn của ArgoCD, expose các service này dưới dạng NodePort Multiple Sources for an Application - Argo CD - Declarative GitOps CD for Kubernetes


### 2. khái niệm 
#### 2.1 ArgoCD là gì ?
-   **ArgoCD** là một công cụ GitOps cho Kubernetes, giúp tự động hóa việc triển khai ứng dụng thông qua quản lý phiên bản mã nguồn.
    +   **GitOps**: Tập hợp các phương pháp tận dụng sức mạnh của Git để giúp kiểm soát các sửa đổi và thay đổi trong nền tảng Kubernetes
    +   **Application**: Định nghĩa trong ArgoCD đại diện cho một ứng dụng triển khai trên Kubernetes từ một hoặc nhiều nguồn git repo.
    +  **NodePort** : Loại service trong Kubernetes cho phép truy cập vào các pod từ bên ngoài cluster bằng cách mở một cổng cụ thể trên mỗi node.

#### 2.1 Helm là gì ?
-   **Helm** là một công cụ giúp quản lý các biểu đồ (charts), là các gói chứa tất cả các định nghĩa tài nguyên cần thiết để chạy một ứng dụng trên Kubernetes.
    +   **Chart**: Một biểu đồ Helm là một bộ sưu tập các tệp giúp định nghĩa một ứng dụng Kubernetes.
    + **Values.yaml**: Tệp giá trị mặc định cho các cấu hình trong một chart.

### 2. Cài đặt ArgoCD lên Kubernetes Cluster ++++++

### 3. Triển khai helm chart 

#### 3.1 Source code: 
##### API
- **Chart**: [api-chart](https://github.com/descent1511/vdt2024-api-nodejs/tree/feat/helm-chart/api-chart)
- **Config**: [api-config](https://github.com/descent1511/vdt2024-api-config)

##### Web
- **Chart**: [web-chart](https://github.com/descent1511/vdt2024-vuejs-frontend/tree/develop/web-chart)
- **Config**: [web-config](https://github.com/descent1511/vdt2024-web-config)

#### 3.2 Kết quả:

##### Check services:
```bash
kubectl get svc 
```
<div align="center">
    <img src="images/check-svc-argocd.png" style="margin-bottom: 20">
</div>

##### Giao diện Argocd:

<div align="center">
    <img src="images/argocd.png" style="margin-bottom: 20">
</div>

##### Web:
-   ip: `192.168.0.106`
-   port: `30002`
<div align="center">
    <img src="images/app-argocd.png" style="margin-bottom: 20">
</div>

##### API:
-   ip: `192.168.0.106`
-   port: `30001`
<div align="center">
    <img src="images/api-argocd.png" style="margin-bottom: 20">
</div>

## Continuous Delivery 
### Yêu cầu 
-   Viết 2 luồng CD cho 2 repo web và api, khi có 1 tag mới được tạo ra trên trên 1 trong 2 repo này thì luồng deploy tương ứng của repo đó thực hiện các công việc sau:
    +   Build docker image với image tag là tag name đã được tạo ra trên gitlab và push docker image sau khi build xong lên Docker Hub
    +   Sửa giá trị Image version trong file values.yaml  trong config repo và push thay đổi lên config repo.
-   Cấu hình ArgoCD tự động triển khai lại web Deployment và api Deployment khi có sự thay đổi trên config repo.

### Triển khai 
#### Tạo GitHub Secrets
-   Vào Settings của repo trên GitHub.
-   Chọn Secrets > Actions 
-   Tạo secrets cần thiết

<div align="center">
    <img src="images/secret_key.png">
</div>  

#### Tạo GitHub Actions Workflow
-   Tạo file `.github/workflows/cd.yml`:
    + API: [code here](https://github.com/descent1511/vdt2024-api-nodejs/blob/develop/.github/workflows/cd.yml)
    + Web:: [code here](https://github.com/descent1511/vdt2024-vuejs-frontend/blob/develop/.github/workflows/cd.yml)

#### Cấu hình ArgoCD để tự động triển khai
-   Cấu hình **SyncPolicy**: Đặt là automated để ArgoCD tự động triển khai lại khi có thay đổi trên config repo.
```yaml
 syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
```

### Kết quả
#### API
-   Auto build image and push 
<div align="center">
    <img src="images/cd-api-log1.png"  style="margin-bottom: 20">
</div>  

<div align="center">
    <img src="images/cd-api-log3.png"  style="margin-bottom: 20">
</div>  

-   Update config
<div align="center">
    <img src="images/cd-api-log2.png"  style="margin-bottom: 20">
</div>  
<div align="center">
    <img src="images/api-config-change.png"  style="margin-bottom: 20">
</div>  

#### Web
-   Auto build image and push 
<div align="center">
    <img src="images/cd-web-log1.png"  style="margin-bottom: 20">
</div>  

<div align="center">
    <img src="images/cd-web-log3.png"  style="margin-bottom: 20">
</div>  

-   Update config
<div align="center">
    <img src="images/cd-web-log2.png"  style="margin-bottom: 20">
</div>  
<div align="center">
    <img src="images/web-config-change.png"  style="margin-bottom: 20">
</div>  

#### History của ArgoCD  +++++
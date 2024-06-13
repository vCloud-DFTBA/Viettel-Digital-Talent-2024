# VDT Final Project
## Name: Hoang Ba Bao

## I. Triển khai Kubernetes
### Request: cài đặt Kubernetes thông qua công cụ kubeadm với 1 master node VM + 2 worker node VM

### Các bước cài đặt và tài liệu
#### 1. Chuẩn bị và setup máy ảo trước khi cài đặt Kubernetes
- Tạo 3 con VM ubuntu ec2 trên AWS đảm bảo:
  -  3 VM ở cùng một VPC để có thể ping thông một cách dễ dàng
  -  Tạo ssh-key để đảm bảo Security
  -  Security Group cho phép ssh vào các máy đó từ máy mình
 
![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/f1b15862-2f37-42a8-9640-fabb5f6a77cd)

- Để có thể truy cập dễ dàng hơn ta có thể đổi tên hostname từ ip tương ứng với master, worker1, worker2
```
sudo hostnamectl set-hostname your-desired-hostname
exec bash
```

- Update file /etc/hosts để enable host name với IP address tương ứng

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/d382fceb-3bea-4e84-ae29-6ea6cb6e2d3e)

- Disable Swap bởi vì bộ nhớ swap có thể ảnh hưởng đến scheduling decisions của k8s vì tốc độ đọc viết và truy cập khác biệt với RAM
- Thay đổi file fstab để đảm bảo rằng những thay đổi này được lâu dài   

```
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
```

- Đảm bảo rằng tất cả package đều up-to-date trước khi cài đặt Kubernetes

```
sudo apt-get update && sudo apt-get upgrade -y 
```

- Cài đặt IP Bridge cho các nodes có thể kết nối với nhau qua mạng

```
cat << EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter
```

- Cấu hình tham số cần thiết bởi sysctl:

```
cat << EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
EOF
```

- Apply những thay đổi bằng câu lệnh sau:

```
sudo sysctl --system
```

#### 2. Bắt đầu triển khai Kubernetes trên các máy VM đã được cấu hình ở trên
- Cài đặt kubeadm, kubelet và kubectl

- Install ca-certificates để đảm bảo rằng tài liệu mình tải là real và an toàn

```
sudo apt-get install -y apt-transport-https ca-certificates curl
```

- Tạo directory ở /etc/apt/keyrings để chứa public key cho gói cài đặt Kubernetes và curl public key về
  
```
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

- Thêm gói cài đặt apt của K8s vào trong source cài đặt
  
```
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

- Update index của apt package, cài đặt kubelet, kubeadm và kubectl đồng thời giữ lại version hiện tại để tránh việc auto-upgrade dẫn đến conflict versions

```
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

#### 3. Cài đặt Docker với containerd là container runtime nền tảng cho K8s
- Cài đặt Docker đơn giản bằng câu lệnh trên các nodes

```
sudo apt install docker.io
```

- Bắt đầu set up containerd trên tất cả các nodes để đảm bảo rằng mọi thứ đều đồng bộ bằng cách tạo thư mục ở /etc/

```
sudo mkdir /etc/containerd
```

- Gen ra một file config mặc định cho containerd

```
sudo sh -c "containerd config default > /etc/containerd/config.toml"
```

- Enable SystemdCgroup để đảm bảo rằng Kubernetes có thể tối ưu việc quản lý tài nguyên cho containers.

```
sudo sed -i 's/ SystemdCgroup = false/ SystemdCgroup = true/' /etc/containerd/config.toml
```

- Apply những thay đổi này bằng cách restart lại các service và enable kubelet service để đảm bảo rằng nó luôn được boot và hoạt động mỗi lần khởi chạy VM

```
sudo systemctl restart containerd.service && sudo systemctl restart kubelet.service
sudo systemctl enable kubelet.service
```

#### 4. Cài đặt cụm Kubernetes trên Node master

- Cài đặt K8s control plane với đầy đủ các component cần thiết bằng cách xử dụng một câu lệnh sau

```
sudo kubeadm config images pull
```

- Chỉ định dải mạng cho pod đảm bảo rằng các pod có thể communicate với nhau một cách dễ dàng

- Dải mạng của calico => sẽ không hoạt động ở các VM trên cloud khi mà clusterIP thường dc assign với dạng 10.x.x.x   

```
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
```

- Dải mạng của flannel => hoạt động được trên các VM ở cloud (Đây là dải mạng sẽ được sử dụng)
```
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

- Cài đặt file config .kube với config của cụm và cập nhật để đảm bảo rầng mình có đủ quyền để sửa

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

- Sau bước kubeadm init thành công lưu lại token dùng để add worker node vào mạng lưới của master node

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/6ff1d794-d3bf-4a4f-acee-3d8771833437)

#### 5. Cài Network Plugin thích hợp (Calico hỗ trợ máy ảo local, không hỗ trợ cho cloud) => (Flannel hỗ trợ cho cloud)

- Việc cài Calico khiến em tốn tận 2 ngày ngồi debug và mày mò network trước khi nhận ra nó không hỗ trợ cloud nên ví dụ dưới đây sẽ chỉ áp dụng cho việc cài máy ảo ở local
 
- Deploy Calico operator sử dụng

```
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml
```

- Tải file custom cho resources của Calico, định nghĩa cho việc triển khai tài nguyên của Calico

```
curl https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml -O
```

- Chạy file vừa curl về để triển khai resources

```
kubectl create -f custom-resources.yaml
```

- Cài đặt triển khai cho các VM trên cloud với cluster IP của pod 10.x.x.x thì ta sẽ sử dụng Flannel nếu không sẽ không thể tạo connection giữa các pod vì khác private network của pod (10.x.x.x và 192.168.x.x)

- Chỉ đơn giản bằng 1 câu lệnh ta sẽ cài xong flannel

```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

```



#### 6. Add worker nodes vào cụm

- Sau khi config xong master đầy là thời gian để add những node worker vào cụm
- Generate token dùng để join vào cụm bằng câu lệnh sau ở master node và sử dụng token ở worker node để add worker node vào cụm

```
kubeadm token create --print-join-command
```
- Khi join worker thành công sẽ có thông báo như sau:

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/f09914fc-bebd-4878-b6f5-ed958d524067)

#### 7. Kiểm tra hệ thống đã cài với các câu lệnh

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/c32cc221-11b0-4889-b79c-33030e272989)

Quá tuyệt vời cho một buổi cài đặt K8s qua kubeadm :)

# II. Triển khai web application sử dụng các DevOps tools & practices

## K8S Helm Chart

### Request 1:

- Bắt đầu triển khai argoCD lên cụm K8s bằng cách tạo một namespace riêng và install file manifest sau

```
kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

- Chờ khi deploy thành công bắt đầu expose ArgoCD thông qua service NodePort bằng file yaml có nội dung sau:

```
apiVersion: v1
kind: Service
metadata:
  name: argocd-server
  namespace: argocd
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: argocd-server
  ports:
    - name: http
      port: 80
      targetPort: 8080
      nodePort: 30080
```
- port: 80 là port được exposed của cụm K8S thường để phục vụ http
- targetPort: 8080 : khi traffic đi qua port của cụm K8S sẽ được redirect đến port này của argocd-server pod
- nodePort: 30080: đấy là port exposed ra ở VM host cụm K8s và khi đi qua nodePort sẽ được redirect đến pod này
=> NodePort(30080) => Cluster Port(80) => Pod Port(8080) 

- Kiểm tra việc exposed bằng việc xem các service thông qua
```
kubectl get svc -n argocd
```

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/bbe632b2-52d5-47e8-9347-d800e035bc2c)



- Ảnh chụp giao diện màn hình khi đã deploy thành công và expose qua NodePort

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/0645ed9c-8206-4b97-a746-1e79117cb562)


- Link File Manifest để triển khai ArgoCD lên K8S: https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

### Request 2:

#### Repo chứa Helm Chart và values.yaml (2 repo Helm Chart, 2 repo config values.yaml) cho web và api

- Helm Chart sử dụng để triển khai web Deployment : https://github.com/BaoICTHustK67/VDT_frontend/tree/main/frontend

- Repo chứa file values.yaml của web: https://github.com/BaoICTHustK67/web_values

- Helm Chart sử dụng để triển khai api Deployment : https://github.com/BaoICTHustK67/VDT_backend/tree/main/backend

- Repo chứa file values.yaml của api: https://github.com/BaoICTHustK67/api_values

#### Manifest của ArgoCD Application

- web:

```
project: default
destination:
  server: 'https://kubernetes.default.svc'
  namespace: vdt-web
syncPolicy:
  automated:
    prune: true
    selfHeal: true
  syncOptions:
    - CreateNamespace=true
sources:
  - repoURL: 'https://github.com/BaoICTHustK67/VDT_frontend'
    path: frontend
    targetRevision: HEAD
    helm:
      valueFiles:
        - $values/values.yaml
  - repoURL: 'https://github.com/BaoICTHustK67/web_values'
    targetRevision: HEAD
    ref: values
```

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/e9677d51-a650-4442-aebb-459e8c1f32e1)

- api:
```
project: default
destination:
  server: 'https://kubernetes.default.svc'
  namespace: vdt-api
syncPolicy:
  automated:
    prune: true
    selfHeal: true
  syncOptions:
    - CreateNamespace=true
sources:
  - repoURL: 'https://github.com/BaoICTHustK67/VDT_backend'
    path: backend
    targetRevision: HEAD
    helm:
      valueFiles:
        - $values/values.yaml
  - repoURL: 'https://github.com/BaoICTHustK67/api_values'
    targetRevision: HEAD
    ref: values

```

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/7c7a56df-b159-45c2-8021-416da4e8b4bb)



#### Ảnh chụp giao diện 

- Màn hình hệ thống ArgoCD trên trình duyệt (Public có sự thay đổi do với lần cài ArgoCD là do em đã tắt và bật lại VM trên EC2 để tiết kiệm chi phí khi không dùng nên public address mới sẽ được assign)

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/bd635786-aad4-4feb-8cef-c4316588cd2e)


![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/394ecea2-fb34-4c03-801a-457aa384762c)



- Khi truy cập vào Web URL exposed qua NodePort:


![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/cf9c9a34-625b-4686-9a9f-f02c632ef7d5)




- Khi truy cập vào API URL exposed qua NodePort:

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/4ce31d11-982f-4612-a8fb-73574cd6c19b)

## III. Continuous Delivery

### File Setup công cụ của 2 luồng CD

- File Setup CD cho web: https://github.com/BaoICTHustK67/VDT_frontend/blob/main/.github/workflows/deploy.yml

```
name: Deploy

on:
  push:
    tags:
      - '*'

jobs:
  build-and-deploy:
    permissions:
      contents: write
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract tag name
        id: extract_tag
        run: echo "TAG=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV

      - name: Build and push Docker image
        run: |
          docker build -t baofci/reactjs:${{ env.TAG }} .
          docker push baofci/reactjs:${{ env.TAG }}

      - name: Checkout config repository
        uses: actions/checkout@v3
        with:
          repository: BaoICTHustK67/web_values
          token: ${{ secrets.GITHUB_TOKEN }}
          path: .
          

      - name: Commit and push changes
        run: |
          git clone https://user:$GITHUB_TOKEN@github.com/BaoICTHustK67/web_values
          cd web_values

          git config --global user.name 'GitHub Actions'
          git config --global user.email 'bachdtm169@gmail.com'

          sed -i "s/^  tag: .*/  tag: ${{ env.TAG }}/" values.yaml

          git add values.yaml
          git commit -m "Update image version to ${{ env.TAG }}"

          git remote -v

          git push --set-upstream origin main
          git push --set-upstream https://user:$GITHUB_TOKEN@github.com/BaoICTHustK67/web_values main
        env:
          GITHUB_TOKEN: ${{ secrets.WEB_TOKEN }}

```

- File Setup CD cho api: https://github.com/BaoICTHustK67/VDT_backend/blob/main/.github/workflows/deploy.yml

```
name: Deploy

on:
  push:
    tags:
      - '*'

jobs:
  build-and-deploy:
    permissions:
      contents: write
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract tag name
        id: extract_tag
        run: echo "TAG=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV

      - name: Build and push Docker image
        run: |
          docker build -t baofci/app:${{ env.TAG }} .
          docker push baofci/app:${{ env.TAG }}

      - name: Checkout config repository
        uses: actions/checkout@v3
        with:
          repository: BaoICTHustK67/api_values
          token: ${{ secrets.GITHUB_TOKEN }}
          path: .
          

      - name: Commit and push changes
        run: |
          git clone https://user:$GITHUB_TOKEN@github.com/BaoICTHustK67/api_values
          cd api_values

          git config --global user.name 'GitHub Actions'
          git config --global user.email 'bachdtm169@gmail.com'

          sed -i "s/^  tag: .*/  tag: ${{ env.TAG }}/" values.yaml

          git add values.yaml
          git commit -m "Update image version to ${{ env.TAG }}"

          git remote -v

          git push --set-upstream origin main
          git push --set-upstream https://user:$GITHUB_TOKEN@github.com/BaoICTHustK67/api_values main
        env:
          GITHUB_TOKEN: ${{ secrets.WEB_TOKEN }}
```

### Output log của 2 luồng CD khi tạo tag mới trên repo web và repo api

- Log luồng chạy CD trên repo web: https://github.com/BaoICTHustK67/VDT_frontend/actions/runs/9453019581/job/26037449571

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/45125cd2-c354-4ad1-b60d-921230876326)


- Log luồng chạy CD trên repo api: https://github.com/BaoICTHustK67/VDT_backend/actions/runs/9453225741/job/26038154868
![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/d6325a96-0927-4dbc-a987-b67bcf2a13a7)


### Hình ảnh app triển khai ArgoCD

- Web:

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/cd02db4d-0682-44ea-bbe9-fbb456309272)

- Hình ảnh diff khi ArgoCD phát hiện thay đổi ở file config của Web

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/7124d734-e2e2-4cf1-a533-7a18acb6dd73)


- App:

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/6dafca00-a094-4aa8-909a-33dd5fb46538)


- Hình ảnh diff khi ArgoCD phát hiện thay đổi ở file config của App

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/aad10095-9b9f-41de-baa1-caff728780b5)



### Hình ảnh event diễn ra trong các deployment

- Web:

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/b7bc2df6-c6ba-4993-8f50-bfcec8df2344)

- App:

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/9a6388f6-f728-4b87-a857-706dcc9c1040)


## IV. Monitoring

### File setup để triển khai Prometheus lên Kubernetes Cluster

- Link: https://github.com/BaoICTHustK67/prometheus_k8s_setup

### Hình ảnh khi truy cập vào Prometheus UI thông qua trình duyệt

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/7af0101a-8d82-4618-87d5-26b86882099d)


### Hình ảnh danh sách target của Web Deployment và API Deployment được giám sát bởi Prometheus thông qua Service Monitor

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/ce61f008-ffb8-4543-8936-237c2c30152b)


## V. Logging

### Cài đặt triên khai fluentbit lên Kubernetes

- Link các file triển khai fluentbit: https://github.com/BaoICTHustK67/Logging

- Tạo namespace phục vụ riêng cho việc logging bằng câu lệnh :
```
kubectl apply -f namespace.yaml
```

- Tạo serviceaccount với với clusterrole tương ứng để trao quyền cho fluentbit giám sát các pod của web service và api service :
```
kubectl apply -f serviceaccount.yaml
```

- Tạo config map với các config cho DaemonSet khi triển khai fluentbit để có thể ghi nhận log và bắn lên server ElasticSearch:
```
kubectl apply -f configmap.yaml
```

- Triển khai fluentbit với DaemonSet để theo dõi logging :
```
kubectl apply -f daemonset.yaml
```

### Hình ảnh chụp màn hình Kibana log của Service Api

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/614ac424-25f0-46d3-bc81-93564e3d6311)

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/91a7283b-8ae6-41f3-a7b6-bd2e20ddc12f)




### Hình ảnh chụp màn hình Kibana log của Service Web

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/5a6d3ce2-fd72-45ed-8cc2-719837b5dbb1)


## VI. Security

### Yêu cầu 1:

- Vào VM mới tạo và cài đặt HAProxy bằng câu lệnh sau:

```
sudo apt-get update
sudo apt-get install haproxy
```

- Tự tạo một self-signed certificate và key

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/haproxy-selfsigned.key -out /etc/ssl/certs/haproxy-selfsigned.crt -subj "/CN=example.com/O=example.com"

```

- Lưu key và cert sinh ra vào cùng 1 file

```
sudo bash -c 'cat /etc/ssl/private/haproxy-selfsigned.key /etc/ssl/certs/haproxy-selfsigned.crt > /etc/ssl/private/haproxy-selfsigned.pem'
```

- Cấu hình file /etc/haproxy/haproxy.cfg như sau:

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

    # Default SSL material locations
    ca-base /etc/ssl/certs
    crt-base /etc/ssl/private

    # See: https://ssl-config.mozilla.org/#server=haproxy&server-version=2.0.3&config=intermediate
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000ms
    timeout client  50000ms
    timeout server  50000ms
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 403 /etc/haproxy/errors/403.http
    errorfile 408 /etc/haproxy/errors/408.http
    errorfile 500 /etc/haproxy/errors/500.http
    errorfile 502 /etc/haproxy/errors/502.http
    errorfile 503 /etc/haproxy/errors/503.http
    errorfile 504 /etc/haproxy/errors/504.http

frontend web_front
    bind *:443 ssl crt /etc/ssl/private/haproxy-selfsigned.pem
    mode http
    default_backend web_back

frontend api_front
    bind *:444 ssl crt /etc/ssl/private/haproxy-selfsigned.pem
    mode http
    default_backend api_back

backend web_back
    mode http
    balance roundrobin
    server web1 18.209.152.139:31000 check

backend api_back
    mode http
    balance roundrobin
    server api1 18.209.152.139:32552 check

```

- Khởi động lại HAProxy

```
sudo systemctl restart haproxy
sudo systemctl enable haproxy
```

- File cấu hình ingress hoặc file cấu hình deployment sau khi thêm HAProxy sidecar container vào Deployment
- Web:
  - Deployment: https://github.com/BaoICTHustK67/VDT_frontend/blob/main/frontend/templates/1-deployment.yaml
  - Service: https://github.com/BaoICTHustK67/VDT_frontend/blob/main/frontend/templates/2-service.yaml
- Api:  
  - Deployment: https://github.com/BaoICTHustK67/VDT_backend/blob/main/backend/templates/1-deployment.yaml
  - Service: https://github.com/BaoICTHustK67/VDT_backend/blob/main/backend/templates/2-service.yaml 


- Truy cập trang Web sử dụng https

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/bc2fd260-af4e-4014-857a-29a770ad1aee)

- Truy cập Api sử dụng https

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/14ed1bc4-f12a-4a5c-b8ee-ae34f485e9eb)





### Yêu cầu 3:

- Với backend sử dụng Flask, ta có thể đơn giản hóa việc Rate Limit bằng cách sử dụng thư viện Flask-Limiter

```
pip install Flask-Limiter

```

- Import những hàm cần thiết để setup Limiter

```
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
```

- Thiết lập Limiter 10 request/ phút

```
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["10 per minute"]
)
```

- Trả về HTTP Response 409 khi gọi quá 10 lần request / phút

```
@app.errorhandler(429)
def ratelimit_error(e):
    return jsonify(error="ratelimit exceeded", message=str(e.description)), 409
```

- Kết quả thử nghiệm khi gọi quá 10 request trong 1 phút vào Endpoint của API Service trên Local

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/95a1118b-57c4-4f89-9701-21f10d8b589e)


- Kết quả thử nghiệm khi gọi vào publicIP

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/0ca6e387-c639-4cef-9158-e9a5a8594e2b)

![image](https://github.com/BaoICTHustK67/VDT_Final/assets/123657319/063f9bfe-8d80-4b90-9767-8702e1a0448f)




 

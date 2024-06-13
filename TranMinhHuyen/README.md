# VDT Final Project

## Name: Tran Minh Huyen

## I. Triển khai Kubernetes

### Request: cài đặt Kubernetes thông qua công cụ kubeadm với 1 master node VM + 1 worker node VM

### Các bước cài đặt và tài liệu

#### 1. Chuẩn bị và setup máy ảo trước khi cài đặt Kubernetes

- Tạo 2 máy ảo ubuntu Virtual Machine (VM) trên Azure đảm bảo:
    - 2 VM ở cùng một Virtual Network để đảm bảo các lợi ích về hiệu suất, bảo mật, quản lý tài nguyên và tính khả dụng của hệ thống.
    - Tải xuống file SSH key (*.pem)
    - SSH vào máy ảo
    ```
    chmod 400 k8s-worker-01_key.pem 
    ssh -i k8s-worker-01_key.pem azureuser@20.2.222.236
    ```

    - 20.2.222.236 là Public IP address của VM k8s-worker-01
![Azure Authentication & SSH to VM](images/azure-auth.png)

- NOTE: Do Azure không thể đổi tên services sau khi tạo, em lỡ init cluster ở VM tên worker, nên VM `k8s-worker-01` sẽ là `master node`, VM `k8s-master` sẽ là `worker node` (Tên bị ngược so với vai trò thực tế à :< )

- Disable Swap bởi vì bộ nhớ swap có thể ảnh hưởng đến scheduling decisions của k8s vì tốc độ đọc viết và truy cập khác biệt với RAM
- Thay đổi file fstab để đảm bảo rằng những thay đổi này được lâu dài   

```
sudo swapoff -a
```

- Đảm bảo rằng tất cả package đều up-to-date trước khi cài đặt Kubernetes

```
sudo apt-get update && sudo apt-get upgrade -y 
```

#### 2. Cài đặt container runtime trên cả 2 VM
Tham khảo: https://kubernetes.io/docs/setup/production-environment/container-runtimes/

1.1 Install and configure prerequisites
Enable IPv4 packet forwarding
To manually enable IPv4 packet forwarding:

- sysctl params required by setup, params persist across reboots

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

- Apply sysctl params without reboot

sudo sysctl --system

Verify that net.ipv4.ip_forward is set to 1 with:

sysctl net.ipv4.ip_forward

1.2 Cài đặt container runtimes
In this case, I use `containerd`
Getting started with containerd:
https://github.com/containerd/containerd/blob/main/docs/getting-started.md

Step 1: Installing containerd

Download the containerd archive:

```
wget https://github.com/containerd/containerd/releases/download/v1.6.32/containerd-1.6.32-linux-amd64.tar.gz

```

Verify the sha256sum:

```
wget https://github.com/containerd/containerd/releases/download/v1.6.32/containerd-1.6.32-linux-amd64.tar.gz.sha256sum

sha256sum -c containerd-1.6.32-linux-amd64.tar.gz.sha256sum

```

Extract the archive under `/usr/local`. This will extract the contents of the archive into /usr/local, including the bin directory containing the containerd binaries:

```
sudo tar Cxzvf /usr/local containerd-1.6.32-linux-amd64.tar.gz

```

- Install `systemd`
If you intend to start containerd via systemd, you should also download the containerd.service unit file from https://raw.githubusercontent.com/containerd/containerd/main/containerd.service into /usr/local/lib/systemd/system/containerd.service, and run the following commands:

```

sudo mkdir -p /usr/local/lib/systemd/system/
sudo wget -O /usr/local/lib/systemd/system/containerd.service https://raw.githubusercontent.com/containerd/containerd/main/containerd.service
sudo systemctl daemon-reload
sudo systemctl enable --now containerd

```

Step 2: Installing runc
Download the runc.<ARCH> binary from https://github.com/opencontainers/runc/releases , verify its sha256sum, and install it as /usr/local/sbin/runc.

```

wget https://github.com/opencontainers/runc/releases/download/v1.1.5/runc.amd64

wget https://github.com/opencontainers/runc/releases/download/v1.1.5/runc.sha256sum

sha256sum --check runc.sha256sum

sudo install -m 755 runc.amd64 /usr/local/sbin/runc

```

Step 3: Installing CNI plugins
Download the cni-plugins-<OS>-<ARCH>-<VERSION>.tgz archive from https://github.com/containernetworking/plugins/releases , verify its sha256sum, and extract it under /opt/cni/bin:

```

wget https://github.com/containernetworking/plugins/releases/download/v1.5.0/cni-plugins-linux-amd64-v1.5.0.tgz

wget https://github.com/containernetworking/plugins/releases/download/v1.5.0/cni-plugins-linux-amd64-v1.5.0.tgz.sha256

sha256sum --check cni-plugins-linux-amd64-v1.5.0.tgz.sha256

```

Extract file:

```

mkdir -p /opt/cni/bin
sudo tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.5.0.tgz

```

#### 3. Configuring a cgroup driver (after install the containerd)
Generate config.toml file:

```

sudo containerd config default > /tmp/config.toml
sudo cp /tmp/config.toml /etc/containerd/config.toml

```

Config:

```

sudo vi /etc/containerd/config.toml

```

To use the `systemd` cgroup driver in /etc/containerd/config.toml with runc, set

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
...
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
SystemdCgroup = true

Overriding the sandbox (pause) image:

[plugins."io.containerd.grpc.v1.cri"]
sandbox_image = "registry.k8s.io/pause:3.2"

If you apply this change, make sure to restart containerd:

```
sudo systemctl restart containerd

```

Check containerd version:

```
containerd --version

```

Check containerd status:

```
systemctl status containerd.service

```

#### 4. Cài đặt kubeadm, kubelet and kubectl trên cả 2 VM

These instructions are for Kubernetes v1.30.

- Update the apt package index and install packages needed to use the Kubernetes apt repository:

```
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

```

- Download the public signing key for the Kubernetes package repositories. The same signing key is used for all repositories so you can disregard the version in the URL:

- NOTE: for Ubuntu 22.04, create /etc/apt/keyrings beforehand

```
sudo mkdir -p -m 755 /etc/apt/keyrings

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

```


- This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list

```
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

```

- Update the apt package index, install kubelet, kubeadm and kubectl, and pin their version:

```

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

```

- (Optional) Enable the kubelet service before running kubeadm:

```
sudo systemctl enable --now kubelet

```


#### 5. Tạo Cluster trên master node
Tham khảo:
https://www.densify.com/kubernetes-tools/kubeadm/?fbclid=IwZXh0bgNhZW0CMTAAAR0nEJWFmNuP7G_wf4mpgUiF_BUHCOos_cItsYZ4gTm6A3s-bexVo66X9sU_aem_AZACSsvKVPVhBFnq79GCQ7qbmODpnr85eXFLC8M7aXyxwd5RWmvYsmTYiC9uP7EyegVGnrmu9_1wojXezAwOLRzg

- First, we’ll initialize the control plane node and specify a network range for the pods using CIDR notation:

```
   sudo kubeadm init --pod-network-cidr=10.244.0.0/16

```

- Note: This command prints very important information which will be used later by worker nodes to join the master and form a cluster. The output should look something like this:
'kubeadm join 10.0.1.101:6443 --token mgvt0h.3ui2w5lkjkcphc2x ....

![Master Successfully Join](images/kubeadm-master-join-result.png)

- Note: if get error `..multiple CRI`, try to remove all other CRIs except for `containerd`, try:

![Bug while initing cluster](images/kubeadm-init-bug.png)


    - Stop and Disable Services:
    
    sudo systemctl stop docker
    sudo systemctl disable docker

    sudo systemctl stop crio
    sudo systemctl disable crio



    - Then try again:

    
    sudo kubeadm init --pod-network-cidr=10.244.0.0/16

    

- Next, we’ll configure the kubeconfig file:


    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config


- Run the `kubectl version` command on the Kube master node to verify it is up and running:


kubectl version



![Master Successfully Init Output](images/kubeadm-master-node.png)



- Next, we’ll check the nodes in the cluster with `kubectl get nodes`. At this point there should be only 1 node (the master node). Here’s an example of the expected output (don’t worry about the “NotReady” status, we’ll get to that soon!):

```
kubectl get nodes

```
![Master Successfully Init Output](images/kubeadm-master-node.png)


#### 6. Worker node tham gia vào cụm cluter


- With the master node created, we can add our worker node to the cluster.
Use `kubeadm join` command on the `worker node`

- Generate token dùng để join vào cụm bằng câu lệnh sau ở `master node` (do lỗi không thể đổi tên, master node có tên là k8s-worker-01) và sử dụng token này để add worker node vào cụm

```
sudo kubeadm token create --print-join-command
```

![image](images/kubeadm-master-token.png)

- Dán phần token vừa tạo vào câu lệnh

sudo kubeadm join 10.0.1.101:6443 --token mgvt0h.3ui2w5lkjkcphc2x
--discovery-token-ca-cert-hash sha256:4e6be4e531e704e7b919a97a3b3359896b00faf3853c6d4240bf46d3a1eb990d


#### 7. Kiểm tra Cluster từ Master node và set up Networking
- After running join command on both the worker nodes, go to `master nodes` and run the kubectl get nodes command to verify that worker nodes have joined the cluster:

kubectl get nodes


- Once the worker nodes are in the cluster, we need to configure the network settings.
- Turn on iptables bridge calls on all three nodes:


echo "net.bridge.bridge-nf-call-iptables=1" |
sudo tee -a /etc/sysctl.conf
sudo sysctl -p

- Note: if get error "sysctl: cannot stat /proc/sys/net/bridge/bridge-nf-call-iptables: No such file or directory"

    - try:
            sudo modprobe br_netfilter
            lsmod | grep br_netfilter

            echo "br_netfilter" | sudo tee -a /etc/modules

            echo "net.bridge.bridge-nf-call-iptables=1" |
            sudo tee -a /etc/sysctl.conf
            sudo sysctl -p

- Verify that the setting has been applied:

sudo sysctl net.bridge.bridge-nf-call-iptables

- Next, run this command on `only the master node`:

kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/bc79dd1505b0c8681ece4de4c0d86c5cd2643275/Documentation/kube-flannel.yml

- Wait a few seconds run kubectl get nodes and all the nodes should have a “Ready” status:

kubectl get nodes


- Note: if error, or still not ready

git clone https://github.com/coreos/flannel.git

kubectl apply -f flannel/Documentation/kube-flannel.yml

kubectl get nodes

That’s it! We now have a working K8s cluster!

### Output Triển khai Kubernetes - Kubeadm
- Log của lệnh kiểm tra hệ thống: kubectl get nodes - o wide

    ![image](images/get-nodes-o.png)



## II. Triển khai web application sử dụng các DevOps tools & practices

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

![image](images/svc-argocd.png)

### Output K8S Helm Chart - Yêu cầu 1
- Link File Manifest để triển khai ArgoCD lên K8S: https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

- Ảnh chụp giao diện màn hình khi đã deploy thành công và expose qua NodePort

![Giao diện ArgoCD](images/argo-1.png)


### Request 2:

#### Repo chứa Helm Chart và values.yaml (2 repo Helm Chart, 2 repo config values.yaml) cho web và api

- Helm Chart sử dụng để triển khai web Deployment: https://github.com/DI-huyentm/VDT_frontend/tree/main/frontend

- Repo chứa file values.yaml của web: https://github.com/DI-huyentm/web_values
    

- Helm Chart sử dụng để triển khai api Deployment : https://github.com/DI-huyentm/VDT_backend/tree/main/backend

- Repo chứa file values.yaml của api: https://github.com/DI-huyentm/api_values




### Output K8S Helm Chart - Yêu cầu 2

- Các Helm Chart sử dụng để triển khai web Deployment và api Deployment lên K8S Cluster:
    - Link: https://github.com/DI-huyentm/prometheus_k8s_setup
- Các file values.yaml trong 2 config repo của  của web service và api service
    - api: https://github.com/DI-huyentm/api_values
    - web: https://github.com/DI-huyentm/web_values

- Manifest của ArgoCD Application
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
    - repoURL: 'https://github.com/DI-huyentm/VDT_frontend'
        path: frontend
        targetRevision: HEAD
        helm:
        valueFiles:
            - $values/values.yaml
    - repoURL: 'https://github.com/DI-huyentm/web_values'
        targetRevision: HEAD
        ref: values
    ```


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
    - repoURL: 'https://github.com/DI-huyentm/VDT_backend'
        path: backend
        targetRevision: HEAD
        helm:
        valueFiles:
            - $values/values.yaml
    - repoURL: 'https://github.com/DI-huyentm/api_values'
        targetRevision: HEAD
        ref: values

    ```
   

    ![Manifest ArgoCD](images/manifest-api.png)




- Ảnh chụp giao diện màn hình hệ thống ArgoCD trên trình duyệt
![Giao diện ArgoCD](images/argo-2.png)


- Ảnh chụp giao diện màn hình trình duyệt khi truy cập vào Web URL, API URL
    - Giao diện api url
![Giao diện api url](images/argo-api-url.png)

    - Giao diện web url
![Giao diện web url](images/argo-web-url.png)


## III. Continuous Delivery
### Output Continuous Delivery

- Các file setup công cụ của 2 luồng CD:
    - File Setup CD cho web: https://github.com/DI-huyentm/VDT_frontend/blob/main/.github/workflows/deploy.yml

    ```
    name: Deploy

    on:
    push:
        tags:
        - "*"

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
            docker build -t huyencnh70/vdt-web:${{ env.TAG }} .
            docker push huyencnh70/vdt-web:${{ env.TAG }}

        - name: Checkout config repository
            uses: actions/checkout@v3
            with:
            repository: DI-huyentm/web_values
            token: ${{ secrets.GITHUB_TOKEN }}
            path: .

        - name: Commit and push changes
            run: |
            git clone https://user:$GITHUB_TOKEN@github.com/DI-huyentm/web_values
            cd web_values

            git config --global user.name 'GitHub Actions'
            git config --global user.email 'huyen.cnh70@gmail.com'

            sed -i "s/^  tag: .*/  tag: ${{ env.TAG }}/" values.yaml

            git add values.yaml
            git commit -m "Update image version to ${{ env.TAG }}"

            git remote -v

            git push --set-upstream origin main
            git push --set-upstream https://user:$GITHUB_TOKEN@github.com/DI-huyentm/web_values main
            env:
            GITHUB_TOKEN: ${{ secrets.WEB_TOKEN }}

    ```

    - File Setup CD cho api: https://github.com/DI-huyentm/VDT_backend/blob/main/.github/workflows/deploy.yml

    ```
    name: Deploy

    on:
    push:
        tags:
        - "*"

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
            docker build -t huyencnh70/vdt-app:${{ env.TAG }} .
            docker push huyencnh70/vdt-app:${{ env.TAG }}

        - name: Checkout config repository
            uses: actions/checkout@v3
            with:
            repository: DI-huyentm/api_values
            token: ${{ secrets.GITHUB_TOKEN }}
            path: .

        - name: Commit and push changes
            run: |
            git clone https://user:$GITHUB_TOKEN@github.com/DI-huyentm/api_values
            cd api_values

            git config --global user.name 'GitHub Actions'
            git config --global user.email 'huyen.cnh70@gmail.com'

            sed -i "s/^  tag: .*/  tag: ${{ env.TAG }}/" values.yaml

            git add values.yaml
            git commit -m "Update image version to ${{ env.TAG }}"

            git remote -v

            git push --set-upstream origin main
            git push --set-upstream https://user:$GITHUB_TOKEN@github.com/DI-huyentm/api_values main
            env:
            GITHUB_TOKEN: ${{ secrets.WEB_TOKEN }}
    ```

- Output log của 2 luồng CD khi tạo tag mới trên repo web và repo api
    - api:

    ![Output log CD api](images/log-cd-api.png)

    - web:

    ![Output log CD web](images/log-cd-web.png)


- Hình ảnh app triển khai argoCD, hình ảnh diff khi argoCD phát hiện thay đổi ở config repo tương tự hình ảnh sau
    - api:
    ![diff api](images/dif-api.png)

    - web:
    ![diff web](images/dif-web.png)


- Các hình ảnh demo khác như danh sách event trong app
    - api:
    ![events api](images/events-api.png)

    - web:
    ![events web](images/events-web.png)

## IV. Monitoring
### Output Monitoring

- Các file setup để triển khai Prometheus lên Kubernetes Cluster: 
    - Link: https://github.com/DI-huyentm/prometheus_k8s_setup
- Hình ảnh khi truy cập vào Prometheus UI thông qua trình duyệt
    ![Prometheus](images/prom-browser.png)


- Hình ảnh danh sách target của Web Deployment và API Deployment được giám sát bởi Prometheus thông qua Service Monitor:
    ![target api](images/prom-target-api.png)
    ![target web](images/prom-target-web.png)



## VI. Security

### Yêu Cầu 1:

- Vào VM mới tạo và cài đặt HAProxy bằng câu lệnh sau:

```
sudo apt-get update
sudo apt-get install haproxy
```

- Tự tạo một self-signed certificate và key

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/haproxy-selfsigned.key -out /etc/ssl/certs/haproxy-selfsigned.crt -subj "/CN=example.com/O=example.com"

```

- Lưu key và cert được sinh ra vào file /etc/ssl/private/haproxy-selfsigned.pem

```
sudo bash -c 'cat /etc/ssl/private/haproxy-selfsigned.key /etc/ssl/certs/haproxy-selfsigned.crt > /etc/ssl/private/haproxy-selfsigned.pem'
```

- Chỉnh lại cấu hình file /etc/haproxy/haproxy.cfg như sau:

    - Điều chỉnh địa chỉ ip theo ip public của VM Azure (của node master) và port của từng services tương ứng

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

    ...

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
    server web1 20.2.222.236:31000 check

backend api_back
    mode http
    balance roundrobin
    server api1 20.2.222.236:32223 check

```

- Khởi động lại HAProxy

```
sudo systemctl restart haproxy
sudo systemctl enable haproxy
```
### Output Security - Yêu cầu 1
- File cấu hình của HAProxy Loadbalancer cho web port và api port:

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
        server web1 20.2.222.236:31000 check

    backend api_back
        mode http
        balance roundrobin
        server api1 20.2.222.236:32223 check

    ```

- File cấu hình ingress hoặc file cấu hình deployment sau khi thêm HAProxy sidecar container vào Deployment
- Web:
  - Deployment: https://github.com/DI-huyentm/VDT_frontend/blob/main/frontend/templates/1-deployment.yaml
  - Service: https://github.com/DI-huyentm/VDT_frontend/blob/main/frontend/templates/2-service.yaml
- Api:  
  - Deployment: https://github.com/DI-huyentm/VDT_backend/blob/main/backend/templates/1-deployment.yaml
  - Service: https://github.com/DI-huyentm/VDT_backend/blob/main/backend/templates/2-service.yaml 


- Kết quả truy cập api sử dụng `https`

    ![API HAproxy](images/ha-api.png)



### Yêu cầu 3:

#### Trình bày giải pháp

- Với backend sử dụng Flask, sử dụng thư viện Flask-Limiter để thực hiện Rate Limit
    - cài đặt thư viện Flask-Limiter 

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

### Output Security - Yêu cầu 3

- File tài liệu trình bày giải pháp: 
    - Link: https://github.com/DI-huyentm/VDT_backend/blob/main/app.py

- Kết quả thử nghiệm khi gọi quá 10 request trong 1 phút vào Endpoint của API Service trên Local

![Rate Limit](images/sec-3.png)








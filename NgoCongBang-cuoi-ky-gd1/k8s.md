# Tài liệu cài đặt Kubernetes
### Update và cài các package cần thiết
```
sudo apt-get update
sudo apt install apt-transport-https curl
```
### Cài đặt docker
```
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
```
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
### Tạo cấu hình cho containerd
```
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml
```
### Cấu hình và khỏi động lại containerd
```
sudo nano /etc/containerd/config.toml
```
thay đổi giá trị SystemdCgroup = true
```
sudo systemctl restart containerd
```
### Cài kubernetes
```
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add
```
```
sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
```
```
sudo apt install kubeadm kubelet kubectl kubernetes-cni
```
### Tắt swap
```
sudo swapoff -a
```
### Tạo cluster bằng kubeadm 
chỉ thực hiện trên node master
```
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```
```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
### Join vào cluster từ node worker 
sau khi tạo xong cluster, sẽ có output lênh để join từ node worker như sau, ta copy lệnh vào node worker chạy
```
sudo kubeadm join 192.168.182.133:6443 --token xxocp5.p57kn8c9cv94srni -- discovery-token-ca-cert-hash sha256:86d78bebc191b3ce79733946e11cdae4d59462f1c9bcbb362339edc5c69ed111
```
### Cài đặt Flannel
```
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/v0.20.2/Documentation/kube-flannel.yml
```
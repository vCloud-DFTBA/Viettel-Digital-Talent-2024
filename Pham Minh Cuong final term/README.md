# Bài tập lớn cuối kỳ chương trình VDT 2024 lĩnh vực Cloud - GĐ 1

## I. Triển khai Kubernetes
###  Triển khai được Kubernetes thông qua công cụ kubeadm  lên 1 master node VM + 2 worker node VM
nguồn: [https://www.youtube.com/watch?v=Cz7hSJNq2GU&t=38s](https://www.youtube.com/watch?v=Cz7hSJNq2GU&t=38s)
### Các bước cài đặt và tài liệu
#### 1. Chuẩn bị máy ảo
- Tạo 3  instance amazon linux 2 bằng ec2 trên AWS 
 
#### 2. Cài đặt
- Cài Docker và khởi động Docker
![image](https://github.com/cuongphama1/1234/assets/74636566/c1c3089e-b432-4af3-8e1f-223cdca51d76)
- đặt SELinux về permissive mode
```
_# Set SELinux in permissive mode (effectively disabling it)_

sudo setenforce 0

sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
```
- Tiếp theo dùng đoạn lệnh sau

  
```
# This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.26/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.26/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
EOF
```

- Cài kubelet, kubeadm và kubectl
  
```
sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
```

- Enable the kubelet service before running kubeadm
```
sudo systemctl enable --now kubelet
```
- Khởi tạo kubeadm (đối với master)
![image](https://github.com/cuongphama1/1234/assets/74636566/56f0d4b5-b8af-4982-a995-7dc0e08873b2)
- Nhập các lệnh sau từ log của kubeadm init
![image](https://github.com/cuongphama1/1234/assets/74636566/5fdff58f-4646-4330-b4c1-07f00239a07a)

- Nhập lệnh join từ log của kubeadm init (đối với worker)
![image](https://github.com/cuongphama1/1234/assets/74636566/f1090de7-0020-4da4-9734-4c3a51f11396)
- cài calico trên master node
```
curl https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml -O
```
```
kubectl apply -f calico.yaml
```
#### 3. Log của các lệnh kiểm tra hệ thống
```
 kubectl get nodes - o wide
 ```
![image](https://github.com/cuongphama1/1234/assets/74636566/014d3b61-524e-41de-9ed8-b3a24619e233)




# II. Triển khai web application sử dụng các DevOps tools & practices

## K8S Helm Chart

### Y/c 1:

- Cài đặt ArgoCD lên Kubernetes Cluster, expose được ArgoCD qua NodePort
- cài helm theo doc
```
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```
- tạo namespace cho argocd
```
- kubectl create namespace argocd
```
- cài argocd bằng helm
```
helm install argocd argo/argo-cd  --namespace argocd
```
- sử dụng lệnh sau để chuyển từ ClusterIP thành NodePort
```
kubectl edit svc argocd-server -n argocd
```
- edit ở đoạn này
```
 selector:
    app.kubernetes.io/instance: argocd
    app.kubernetes.io/name: argocd-server
  sessionAffinity: None
  type: NodePort
```
- sử dụng lệnh sau để thêm `- --insecure`
```
kubectl -n argocd edit deployments.app argocd-server 
```
- edit ở đoạn sau
```
containers:
      - args:
        - /usr/local/bin/argocd-server
        - --port=8080
        - --metrics-port=8083
        - --insecure
        env:
        - name: ARGOCD_SERVER_NAME
          value: argocd-server
        - name: ARGOCD_SERVER_INSECURE
```
- kết quả
![image](https://github.com/cuongphama1/1234/assets/74636566/a338dbc4-678f-4872-ab6e-77f8ddf88697)


```
kubectl proxy
```
![image](https://github.com/cuongphama1/1234/assets/74636566/c1445c85-af4f-454d-920e-ffd53312ff4d)

![image](https://github.com/cuongphama1/1234/assets/74636566/3b8deff1-e140-4a67-8e33-d5f4a6d87e9f)
![image](https://github.com/cuongphama1/1234/assets/74636566/362fc60c-14dd-4a8b-8aba-0121b0efcc68)

![image](https://github.com/cuongphama1/1234/assets/74636566/423ac487-399b-41e8-b73c-c817cab0132b)

# Giải pháp sử dụng để authen/authorization cho các service

## 1. HAProxy

- Guideline

```bash
// 1. Gen cert and apply cert to k8s
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
kubectl create secret tls mycert --key=/home/lmhinnoc/Documents/code/server.key --cert=/home/lmhinnoc/Documents/code/server.crt


// 2. Install haproxy
helm repo add haproxytech https://haproxytech.github.io/helm-charts
helm repo update
helm uninstall haproxy // only if you have installed haproxy before
helm install haproxy-kubernetes-ingress \
haproxytech/kubernetes-ingress \
--create-namespace \
--namespace haproxy-controller \
--set controller.service.type=LoadBalancer \
--set-string "controller.defaultTLSSecret.secret=go-go/mycert"


// 3. Install metallb
// install metallb for external ip in cluster
helm repo add metallb https://metallb.github.io/metallb
helm install metallb metallb/metallb
// get nodes ip range
kubectl get nodes -o jsonpath='{range .items[*]}{.status.addresses[*].address}{"\n"}'
// config metallb file
kubectl apply -f https://raw.githubusercontent.com/lmhuong711/go-go-charts/main/haproxy/metallb.yaml


// 4. Install helm app
helm install be [./go-go-be](https://github.com/lmhuong711/go-go-be/tree/main/argocd)
helm install be [./go-go-fe](https://github.com/lmhuong711/go-go-fe/tree/main/argocd)


// 5. Config host
sudo nano /etc/hosts
192.168.11.240  go-go.com
192.168.11.240  go-go-hehe.com
```

- Demo
![6.1-1](./images/6.1-1.png)

## 2. JWT

### 2.1. Solution

- Set up middleware cho việc phân quyền bằng jwt
- Decode token và check role thuộc [user, admin]
- Sử dụng các package để detect auth: golang-jwt/jwt/v5, gofiber/contrib/jwt

### 2.2. Source code

- [middlewares/jwt.go](https://github.com/lmhuong711/go-go-be/blob/main/middlewares/jwt.go)

### 2.3. Output

- ![invalid role](./images/6.2-1.png)
- ![role_user_get](./images/6.2-2.png)
- ![role_user_post](./images/6.2-3.png)
- ![role_admin](./images/6.2-4.png)

## 3. Rate limit
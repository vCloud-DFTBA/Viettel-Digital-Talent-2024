
## Cài đặt Argo CD
```
kubectl create namespace argocd
```
```
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
File cấu hình service Argo CD expose NodePort

```
apiVersion: v1
kind: Service
metadata:
  name: argocd-server-nodeport
  namespace: argocd
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30000
  selector:
    app.kubernetes.io/name: argocd-server
```


# Continuous Delivery
* Tạo tag trên repo source code front end (VDT WEB)
![alt text](./images/cd/vdt-web/vdt-web-create-git-tag.png)
![alt text](./images/cd/vdt-web/vdt-web-trigger-webhook.png)
![alt text](./images/cd/vdt-web/vdt-web-trigger-jenkins.png)
![alt text](./images/cd/vdt-web/vdt-web-jenkins-build.png)
![alt text](./images/cd/vdt-web/vdt-web-docker-hub.png)
![alt text](./images/cd/vdt-web/vdt-web-config-commit.png)
![alt text](./images/cd/vdt-web/vdt-web-diff-version.png)


API

![alt text](./images/cd/vdt-api/vdt-api-create-tag.png)
![alt text](./images/cd/vdt-api/vdt-api-git-trigger.png)
![alt text](./images/cd/vdt-api/vdt-api-jenkins-trigger.png)
![alt text](./images/cd/vdt-api/vdt-api-argo-diff.png)
![alt text](./images/cd/vdt-api/vdt-api-docker-hub.png)
![alt text](./images/cd/vdt-api/vdt-api-jenkins-success.png)
![alt text](./images/cd/vdt-api/vdt-api-argo-success.png)

# Monitoring
## API Django prometheus Metrics
![alt text](./images/monitoring/django-metrics.png)
## API Nginx prometheus Metrics (thông qua Nginx Exporter - port 30113 là port của service Nginx Exporter)
![alt text](./images/monitoring/nginx-exporter-metrics.png)

![alt text](./images/monitoring/prometheus-targets.png)

# Logging

#### Các log được tạo bởi API service, Web service: đã có đầy đủ 3 thành phần quan trọng:

- Request Path (được đặt tên key là 'request_path')
- HTTP Method (được đặt tên key là 'http_method')
- Response Code (được đặt tên key là 'response_code')

![alt text](./images/logging/vdt-api-log.png)
[Log khi có request /api/students/?query=VINH vào service API](./logs/logging/vdt-api-log.md)

### metrics
![alt text](./images/logging/vdt-web-log-metrics.png)
[Log khi có request /metrics vào service Web](./logs/logging/vdt-web-log.md)

### 404 not found
![alt text](./images/logging/vdt-web-log-404.png)
[Log khi có request /demo-404-notfound vào service Web](./logs/logging/vdt-web-log-404.md)

### Thông tin của một số container trong cụm K8s
![alt text](./images/logging/container-k8s-log.png)
[Log của một số container trong cụm K8s](./logs/logging/container-k8s-log.md)

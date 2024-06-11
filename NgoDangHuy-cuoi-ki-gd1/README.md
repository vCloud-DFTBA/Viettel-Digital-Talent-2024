# Triển khai Kubernetes (1 điểm)
- Triển khai bằng kubespray: Tài liệu cài đặt và output.
https://docs.google.com/document/d/17i4Onbad68IETwcYjpCN2JbjtYsUtpzH9PoEgZsmJnc/edit?usp=sharing

# Triển khai web application sử dụng các DevOps tools & practices
## K8S Helm Chart (1.5đ)
- Yêu cầu 1: Cài đặt ArgoCD lên Kubernetes Cluster, expose được ArgoCD qua NodePort.
- Output:
  - Tài liệu cài đặt: Chạy các lệnh sau:
    - kubectl create namespace argocd
    - kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    - kubectl edit svc/argocd-server -n argocd : Sau khi chạy lệnh này, ta sửa file đoạn ClusterIP sang NodePort và điền port vào để expose.
    - <img width="406" alt="Screenshot 2024-06-11 at 15 08 25" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1dd5d82c-c053-4618-8aa7-fa20611035d0">
    - ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/cf73562f-a1a7-49d7-9b36-543da2fd4c71)
- Yêu cầu 2:
  - Viết 2 Helm Chart cho web Deployment và api Deployment, để vào 1 folder riêng trong repo web và repo api
  - Tạo 2 Repo Config cho web và api, trong các repo này chứa các file values.yaml với nội dung của cá file values.yaml là các config cần thiết để chạy web và api trên k8s bằng Helm Chart 
  - Sử dụng tính năng multiple sources của ArgoCD để triển khai các service web và api service lên K8S Cluster  theo hướng dẫn của ArgoCD, expose các service này dưới dạng NodePort
- Output:
  - [File helm cho frontend](https://github.com/ngodanghuy162/vdt-front/tree/main/helm-chart)
  - [File config frontend](https://github.com/ngodanghuy162/config-front/blob/main/values.yaml)
  - [File helm cho backend](https://github.com/ngodanghuy162/vdt-back/tree/main/back/helm)
  - [File config backend](https://github.com/ngodanghuy162/config-back/blob/main/values.yaml)
  - File manifest: ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/4efc57d5-888b-4db5-a1b6-6cc6713f67ef)
  - Ảnh chụp argocd, truy cập vào từ url frontend và backend.
  - <img width="1498" alt="Screenshot 2024-06-11 at 15 14 38" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1e7ed0c1-540f-464a-ab77-a2200e860147">
  - ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/46d62332-edea-4415-abe9-9f22d229196d)
  - ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ddf5867f-5d11-429e-b6d9-c7c916a0b360)
 
# Continuous Delivery (1.5đ)
- Yêu cầu:
- Viết 2 luồng CD cho 2 repo web và api, khi có 1 tag mới được tạo ra trên trên 1 trong 2 repo này thì luồng deploy tương ứng của repo đó thực hiện các công việc sau:
  - Build docker image với image tag là tag name đã được tạo ra trên gitlab và push docker image sau khi build xong lên Docker Hub
  - Sửa giá trị Image version trong file values.yaml  trong config repo và push thay đổi lên config repo. Tham khảo: https://stackoverflow.com/a/72696837
  - Cấu hình ArgoCD tự động triển khai lại web Deployment và api Deployment khi có sự thay đổi trên config repo.

-Output:
  - [File CD Frontend](https://github.com/ngodanghuy162/vdt-front/blob/main/.github/workflows/CD.yml)
  - [File CD Backtend](https://github.com/ngodanghuy162/vdt-back/blob/main/.github/workflows/CD.yml)
  - Luồng CD frontend khi có tag mới:<img width="1340" alt="Screenshot 2024-06-11 at 15 17 04" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/90fa0379-f90b-4129-a75d-ca29f76d6ae7">
  - Luồng CD backend khi có tag mới:<img width="1330" alt="Screenshot 2024-06-11 at 15 19 22" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/803191e3-31bb-4834-a6e2-a8887e23b28b">
  <img width="1461" alt="Screenshot 2024-06-11 at 15 19 55" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/134a4592-9b57-47fd-923c-b46084a04e8d">
  <img width="1512" alt="Screenshot 2024-06-11 at 15 20 42" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/edded461-a114-4a67-bfe9-21f2c9bb79aa">
 - Tự thay đổi images tag repo config:
<img width="1448" alt="Screenshot 2024-06-11 at 21 48 15" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ac9c03bd-2171-4d15-bf6a-e36b80a57f5c">
<img width="1449" alt="Screenshot 2024-06-11 at 21 48 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/eed6fbf4-c2f7-4c37-83ec-92df57591edd">


  


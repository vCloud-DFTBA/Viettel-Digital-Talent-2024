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
  ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/59105c6a-010d-4150-8670-80f731669b9e)

  - Luồng CD backend khi có tag mới:
    <img width="1330" alt="Screenshot 2024-06-11 at 15 19 22" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/803191e3-31bb-4834-a6e2-a8887e23b28b">
    <img width="1162" alt="Screenshot 2024-06-13 at 13 56 21" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/3a0ef8c2-4112-4e75-8026-ba192b364f49">
    <img width="892" alt="Screenshot 2024-06-13 at 13 57 11" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/b01062d1-c707-4c20-a27c-67e45ffbb5c1">
    <img width="1474" alt="Screenshot 2024-06-13 at 13 53 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/9190969a-50e5-4929-ad48-5b91a715358e">
    <img width="1474" alt="Screenshot 2024-06-13 at 13 53 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/91ede620-52c7-4d2b-9faa-e90addd76a44">
    <img width="1461" alt="Screenshot 2024-06-11 at 15 19 55" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/134a4592-9b57-47fd-923c-b46084a04e8d">
    <img width="1512" alt="Screenshot 2024-06-11 at 15 20 42" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/edded461-a114-4a67-bfe9-21f2c9bb79aa">
 - Tự thay đổi images tag repo config:
 - <img width="1512" alt="Screenshot 2024-06-13 at 14 00 54" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1190172f-0c44-405d-a5c8-c9986b27c289">
 - <img width="1448" alt="Screenshot 2024-06-11 at 21 48 15" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ac9c03bd-2171-4d15-bf6a-e36b80a57f5c">
 - <img width="1449" alt="Screenshot 2024-06-11 at 21 48 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/eed6fbf4-c2f7-4c37-83ec-92df57591edd">
 - ArgoCD tự đồng bộ khi có thay đổi:
   - Trước: ( Ở đây, phía frontend em dùng pod tên: helm-chart có 2 replica ở dưới) </br>
   - <img width="1449" alt="Screenshot 2024-06-11 at 21 48 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/61e519be-08c9-4b51-a3cf-120d78af0618">
   - <img width="1449" alt="Screenshot 2024-06-11 at 21 48 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/3e5ce7df-cb14-4b32-8572-d40499fe1df4">
   - <img width="1449" alt="Screenshot 2024-06-11 at 21 48 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/d139626a-787a-463c-a33b-34c02c79f040">
   - Sau khi thay đổi:</br>
   - <img width="1449" alt="Screenshot 2024-06-11 at 21 48 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/4c7efd03-7981-4b64-a36a-864b31638df4">
   - <img width="1449" alt="Screenshot 2024-06-11 at 21 48 39" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/8a5c611c-5de1-492f-8dd0-fc6506fd0f10">
# Monitoring (1.5đ)
- Yêu cầu:
    - Expose metric của web service và api service ra 1 http path. 
    - Triển khai Prometheus lên Kubernetes Cluster thông qua Prometheus Operator, phơi ra ngoài dưới dạng NodePort: 
    - Expose Prometheus dưới dạng Nodeport
    - Sử dụng Service Monitor của Prometheus Operator để giám sát Web Deployment và API Deployment
- Output:
    - Triển khai promethus operator. Ở đây em triển khai thông qua kube-prometheus với promethus operator là 1 phần trong kube-prometheus. Promethus operator là quản lí các thành phần của promethus.Ngoài ra, ta có thể sử dụng helm triển khai cũng được.
    - <img width="1473" alt="Screenshot 2024-06-12 at 09 53 58" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/fc2af8c6-93d7-46b1-a9aa-89f83b582763">
    - [Các file setup để triển khai Prometheus lên Kubernetes Cluster](https://github.com/ngodanghuy162/promethus-install.git)
    - Hướng dẫn các câu lệnh đã ở repo ạ.
      Ảnh truy cập prometheus và giám sát metrics cho backend:
      ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/6ee4ccdb-b4ba-4180-b4d1-7f86c0430a73)
      ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/6a36d36d-834e-4f82-8a84-4333ec2d3522)
      ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/580d2b3e-15d8-48ad-9463-e49d43107b5c)
      File service monitor dùng giám sát
      ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1a547fd5-24e6-4d89-9134-d0573b336c58)

        

# Secutiry

### Yêu cầu 2
-Đảm bảo 1 số URL của api service  khi truy cập phải có xác thực thông qua 1 trong số các phương thức cookie, basic auth, token auth, nếu không sẽ trả về HTTP response code 403. (0.5)
- Thực hiện phân quyền cho 2 loại người dùng trên API:
  - Nếu người dùng có role là user thì truy cập vào GET request trả về code 200, còn truy cập vào POST/DELETE thì trả về 403
  - Nếu người dùng có role là admin thì truy cập vào GET request trả về code 200, còn truy cập vào POST/DELETE thì trả về 2xx

- Giải pháp: Em sử dụng Spring secutiry cho backend. Ở đây, e có thể yêu cầu phân quyền cho từng endpoint, từng role. Như đề yêu cầu thì em sử dụng 2 role admin và user. Em dùng JWT để phân quyền và xác thực. Đầu tiên, em tạo 1 table lưu lại các tài khoản người dùng và vai trò người dùng, mật khẩu đã được mã hóa trong CSDL. Để có thể lấy token, người dùng cần gửi request đăng nhập với usename và password, và sẽ nhận được lại respone là JWT (trường user là em để thêm cho dễ thấy thông tin tài khoản - có thể xóa và chỉ trả duy nhất JWT được)
  ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/d1dd8190-224e-4921-8f13-3e80643faf61)
- Sau khi nhận token, người dùng sẽ dùng nó chèn vào các request đằng sau dưới hạng header/cookies tùy chỉnh (em dùng cookie). Sau khi nhận, bên server sẽ phân tích JWT và xem user role cũng như thông tin của JWT (có thể set expire, các trường khác thêm của JWT). Người dùng phải authenticate mới gửi được request đến các chức năng CRUD.
  ![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/0aad5f6f-3af0-4169-8593-4b07df344127)
- Phân quyền với người dùng role User: Chỉ gửi xem được đến request Read (vdt/all) , delete-post-update bị chặn.
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/10dcc96d-3369-455b-a43e-9ba0a8195417)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/c58bd842-6938-4c2e-a2b8-199e6810320f)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/571d6917-a2d1-475b-b06b-b0cc18cfad8b)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/8cf1be6b-9f80-4ec5-9c05-8723748d28d5)
- Phân quyền với người dùng role Admin: Không bị chặn với các request.
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/0a6de9ba-df53-4e70-a2a0-454b509a6895)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/6068244a-1e0c-492a-a302-39ab935d535f)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/68f71e5d-5d25-4641-8447-f395d4a012eb)

### Yêu cầu 3 (1đ): Sử dụng 1 trong số các giải pháp để ratelimit cho Endpoint của api Service, sao cho nếu có  quá 10 request trong 1 phút gửi đến Endpoint của api service thì các request sau đó bị trả về HTTP Response 409 

- Giải pháp: Sử dụng Bucket4j - một library hỗ trợ trong spring boot cho việc Ratelimit - dựa trên thuật toán token-bucket. Bucket4j là một thư viện an toàn theo luồng có thể được sử dụng trong ứng dụng JVM độc lập hoặc môi trường nhóm.
- Thuật toán token-bucket:Các yếu tố cơ bản của thuật toán bao gồm một "bucket" có khả năng lưu trữ các "token", mỗi token đại diện cho một quyền truy cập vào API endpoint. Khi một yêu cầu được gửi đến, hệ thống sẽ kiểm tra xem có token nào còn trong bucket hay không. Nếu có, một token sẽ được xóa khỏi bucket và yêu cầu được chấp nhận. Ngược lại, nếu bucket không còn token, yêu cầu sẽ bị từ chối cho đến khi bucket được nạp lại đủ token. Nghĩa là mỗi request rẽ lấy đi 1 token. Ví dụ, nếu một API có giới hạn 100 yêu cầu mỗi phút, ta có thể tạo một bucket có khả năng 100 token và tốc độ nạp lại là 100 token mỗi phút.
- Cài đặt: Khai báo 1 bucket có 10 token. Khả năng nạp 10 token mỗi phút + khai báo trong file pom.xml. [Source code được lưu tại repo backend.](https://github.com/ngodanghuy162/vdt-back)
<img width="824" alt="Screenshot 2024-06-13 at 17 20 40" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/e743d7cd-e8fc-4cc4-91d5-71ee5981f6c6">
<img width="367" alt="Screenshot 2024-06-13 at 17 21 49" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/9eee7a1a-3034-4c4d-8d39-59c5fced32aa">
-Output khi gửi request:
<img width="1146" alt="Screenshot 2024-06-13 at 17 24 05" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ce07188f-2e12-4fd7-aaef-2428ce23cfcb">
- Ta có thể thấy request thứ 11 respone 409.
<img width="1222" alt="Screenshot 2024-06-13 at 17 25 17" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/3da598b6-c08e-4cf5-8754-ce13a4ee6f31">
Khi ta chạy colection, ta thấy 5 request sau bị 409, 10 request đầu không bị.
<img width="1197" alt="Screenshot 2024-06-13 at 17 37 21" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/321bb343-c5ae-4e2a-9fa1-a9802eccfbc3">
<img width="1183" alt="Screenshot 2024-06-13 at 17 35 53" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/b52a06c6-abbf-427f-821a-eeea4ae7e583">
Ngoài ra, em có thử chạy lệnh: </br>
 `for i in {1..1000}; do response=$(curl -X GET -s -w "%{http_code}" http://localhost:8080/vdt/); echo "$i: $response" >> responses.log; done` </br>
[Output là file responeses.log](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/blob/CK/NgoDangHuy-cuoi-ki-gd1/responses.log) </br>
<img width="354" alt="Screenshot 2024-06-13 at 17 41 10" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1c5e0b9c-d964-4dea-96df-02c927e86b3d"> </br>





  


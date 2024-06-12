|PS: Đây là lần đầu tiên em làm việc với keycloak cũng như biết và làm việc với OpenID, nên nếu có thông tin gì sai sót trong lúc tìm hiểu xin các anh góp ý!
# Keycloak
## 1. Giới thiệu
Keycloak là một giải pháp mã nguồn mở  IAM (Identity và access management) cho việc quản lý xác thực và ủy quyền trong ứng dụng. Nó cung cấp các tính năng bảo mật như đăng nhập đơn giản, quản lý người dùng, quản lý quyền truy cập và quản lý phiên. Trong project này, em sẽ sử dụng Keycloak như một giải pháp cho việc xác thực và uỷ quyền người dùng.
## 2. OpenID connect
### 2.1 Một số thông tin về OpenID Connect
[OpenID Connect](https://openid.net/developers/how-connect-works/) (OIDC) là một protocol xác thực mà được gọi là phần mở rộng của OAuth2.0.
OAuth2.0 là framework cho việc xây dựng các protocol uỷ quyền và chưa được hoàn thiện. Tuy nhiên, OIDC là một protocol hỗ trợ cả cho việc xác thực và uỷ quyền người dùng sử dụng các tiêu chuẩn của [Json Web Token](https://jwt.io/). 

OIDC thường được dùng trong hai trường hợp. Trường hợp đầu tiên dùng để cho một ứng dụng khác yêu cầu đến server của OIDC để xác thực người dùng. Khi mà đăng nhập thành công thì ứng dụng đó nhận một `identity token` và `access token`. `Indentity token` chưa thông tin của người dùng bao gồm tên, tuổi và các thông tin cá nhân khác. [Realm](https://stackoverflow.com/a/56562384), sẽ ký số vào access token, token này sẽ chứa các thông tin gồm các thông tin về quyền truy cập mà ứng dụng có thể dùng để xác định xem các tài nguyên trong ứng dụng mà người dùng có thể truy cập

Trường hợp thứ 2 là phía client truy cập vào một dịch vụ từ xa.
- client yêu cầu một mã truy cập từ OIDC server để truy cập các dịch vụ từ xa thay mặt cho người dùng.
- OIDC server xác thực người dùng và yêu cầu người dùng đồng ý cấp quyền truy cập cho khách hàng yêu cầu.
- client nhận được mã truy cập được ký số bởi realm.
- client gửi các yêu cầu REST tới các dịch vụ từ xa bằng mã truy cập này.
- Dịch vụ REST từ xa trích xuất mã truy cập.
- Dịch vụ REST từ xa xác minh chữ ký của mã truy cập.
- Dịch vụ REST từ xa quyết định, dựa trên thông tin truy cập trong mã, để xử lý hoặc từ chối yêu cầu.
### 2.2 Resource owner password credentials grant (Direct Access Grants)
Đây là một trông số các auth flows được keycloak hỗ trợ, flow này hoạt động như hình dưới đây
![](attachs/Pasted%20image%2020240612000022.png)

Cách thức này sẽ sử dụng một lời gọi POST bao gồm:
- credentials của người dùng được gửi trong form của request
- ID của client 
- Secret của client
Request trả về của lời trên bao gồm identity, access token và refresh token
# Cài đặt keycloak và thiết lập authen và authorization cho bằng keycloak.
## Cài đặt keycloak
- Cài đặt ingress từ file manifesst
```bash
kubectl create -f https://raw.githubusercontent.com/keycloak/keycloak-quickstarts/latest/kubernetes/keycloak.yaml
```
- setup ingress cho keycloak![](../../../attachs/Pasted%20image%2020240610104240.png)
- Nếu gặp lỗi này, xoá pod calico-node-xxxx đang chạy trên node mà keycloak đang chạy![](../../../attachs/Pasted%20image%2020240610105231.png)
- Kết quả![](../../../attachs/Pasted%20image%2020240610110016.png)
## Tạo user và thiết lập authen + authorization bằng kety cloak
- Tạo client cho project vdt ![](../../../attachs/Pasted%20image%2020240611003506.png)
- Tích chọn Direct access grant và Athorization để bật tính năng authorized![](../../../attachs/Pasted%20image%2020240611003554.png)
- Tạo người dùng![](attachs/Pasted%20image%2020240612015556.png)
- Tạo resource cho path api![](../../../attachs/Pasted%20image%2020240611003744.png)
- Tạo 4 scope tương ứng với 4 method GET, POST, PUT, DELETE.![](../../../attachs/Pasted%20image%2020240611004103.png)
- Các thiết lập trong mục policy. Ở đây đề bài yêu cầu admin có quyền truy cập đến api với đủ quyền còn user chỉ có quyền truy cập vào get request vì vậy ta tạo 2 policy là ``admin and user`` bao gồm role ``admin và user`` còn policy ``admin-policy`` chỉ có ``role admin``![](../../../attachs/Pasted%20image%2020240611004153.png)
- Sau khi đã tạo policy ta sẽ bắt đầu tạo quyền ở tab permission, ở đây ta có 2 permission với permission ``Get all data`` và ``admin-only-permission`` ta sẽ gắn policy tương ứng![](../../../attachs/Pasted%20image%2020240611004654.png)
# Kết quả
## Kết quả khi test thử permission ở keycloak
1. Role admin![](../../../attachs/Pasted%20image%2020240611020034.png)
2. Role user![](../../../attachs/Pasted%20image%2020240611020115.png)
## Các kết quả trả về nếu không có token và auth
1. Lấy tất cả users![](../../../attachs/Pasted%20image%2020240611014225.png)
2. Lấy users theo id![](../../../attachs/Pasted%20image%2020240611014342.png)
3. Tạo người dùng![](../../../attachs/Pasted%20image%2020240611014502.png)
4. Sửa thông tin người dùng![](../../../attachs/Pasted%20image%2020240611014530.png)
5. Xoá người dùng![](../../../attachs/Pasted%20image%2020240611014602.png)
## ROLE ADMIN
1. Tạo bearer token bằng tài khoản admin![](../../../attachs/Pasted%20image%2020240611013134.png)
2. GET API với token vừa tạo
	- Lấy tất cả users![](../../../attachs/Pasted%20image%2020240611013255.png)
	- Lấy theo id![](../../../attachs/Pasted%20image%2020240611013317.png)
3. Tạo người dùng ![](../../../attachs/Pasted%20image%2020240611013636.png)![](../../../attachs/Pasted%20image%2020240611013959.png)
4. Cập nhật thông tin người dùng![](../../../attachs/Pasted%20image%2020240611013928.png)![](../../../attachs/Pasted%20image%2020240611013943.png)
5. Xoá người dùng![](../../../attachs/Pasted%20image%2020240611014101.png)
## Role users
1. Lấy bearer token bằng tài khoản thông thường![](../../../attachs/Pasted%20image%2020240611015541.png)
2. Lấy tất cả người dùng![](../../../attachs/Pasted%20image%2020240611015613.png)
3. Lấy người dùng theo id![](../../../attachs/Pasted%20image%2020240611015646.png)
4. Tạo người dùng![](../../../attachs/Pasted%20image%2020240611015710.png)
5. Cập nhật thông tin![](../../../attachs/Pasted%20image%2020240611015821.png)
6. Xoá người dùng.![](../../../attachs/Pasted%20image%2020240611015842.png)

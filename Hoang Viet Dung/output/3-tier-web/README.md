# Phát triển một 3-tier web application đơn giản

## 1. Mô tả

3-tier web application sử dụng 3 dịch vụ gồm: web, api và database.

Để quản lý mã nguồn cho API và trang web, chúng ta sử dụng hai kho lưu trữ riêng biệt. Mỗi tính năng mới sẽ được thực hiện qua một pull request. Cả hai kho lưu trữ này đều tuân theo quy trình git flow, bao gồm các nhánh chính là main, release, và develop. Khi phát triển 1 tính năng mới sẽ thực hiện checkout ra và tạo pull request vào nhánh khác, cụ thể đây là nhánh sẽ được mang tên của chức năng đó. Từ các nhánh đó sẽ được merge vào release rồi sau đó đến main. Các phiên bản sẽ được gắn tag từ nhánh main để đánh dấu các phiên bản triển khai. Trong 2 repo `VDT_Lab_backend` và `VDT_Lab_Frontend`, Các commit gửi lên sẽ được tuân theo 1 Commit convention. Nó sẽ giúp các thành viên trong nhóm hiểu rõ hơn về nội dung của mỗi commit và dễ dàng theo dõi lịch sử thay đổi của dự án.

<div align="center">
  <img width="600" src="./assets/images/gitflow.svg" alt="gitflow">
</div>

<div align="center">
  <i><a href=https://medium.com/@yanminthwin/understanding-github-flow-and-git-flow-957bc6e12220>
         Understanding GitHub Flow and Git Flow
        </a></i>
</div>
<br>

### 1.1 Ứng dụng web

Phát triển dịch vụ web sử dụng thư viện ReactJS

ReactJS là một thư viện JavaScript phổ biến để xây dựng giao diện người dùng. Nó cho phép tạo ra các thành phần UI tái sử dụng và hiệu quả, giúp phát triển các ứng dụng web trở nên nhanh chóng và dễ dàng hơn. 

<div align="center">
  <img width="600" src="./assets/images/react.png">
</div>

<div align="center">
  <i> ReactJs</i>
</div>

### 1.2 Dịch vụ api của ứng dụng

Phát triển dịch vụ api sử dụng framework [ExpressJs] của Nodejs.

Node.js là một môi trường runtime cho JavaScript, cho phép thực thi mã JavaScript trên phía máy chủ. Điều này mở ra khả năng xây dựng các ứng dụng web có hiệu suất cao và khả năng mở rộng tốt. Express.js là một framework web phổ biến cho Node.js, cho phép tạo ra các ứng dụng web và API một cách nhanh chóng và dễ dàng.

<div align="center">
  <img width="600" src="./assets/images/node.png">
</div>

<div align="center">
  <i>Nodejs + ExpressJs </i>
</div>

### 1.3 Database

Phát triển dịch vụ cơ sở dữ liệu dựa trên PostgreSQL.

PostgreSQL là một cơ sở dữ liệu quan hệ mã nguồn mở, cho phép lưu trữ và truy vấn dữ liệu dưới dạng bảng với các mối quan hệ phức tạp. Được thiết kế để mở rộng và hỗ trợ tính toàn vẹn dữ liệu và các truy vấn SQL mạnh mẽ, PostgreSQL là một lựa chọn phổ biến cho các ứng dụng web hiện đại và yêu cầu tính bền vững cao.

<div align="center">
  <img width="600" src="./assets/images/sql.png">
</div>
<div align="center">
  <i>PostgreSQL</i>
</div>

## 2. Output

<div >
  <i><a href=https://github.com/dungbun31/VDT_Lab_Frontend.git>
         VDT_Lab_Frontend
        </a></i>
</div>
<br>
Demo web
<div align="center">
  <img width="600" src="./assets/images/get3.png">
</div>
<div align="center">
  <i>Get list users</i>
</div>
<br>
<div align="center">
  <img width="600" src="./assets/images/post3.png">
</div>
<div align="center">
  <i>Create user</i>
</div>
<br>
<div align="center">
  <img width="600" src="./assets/images/update3.png">
</div>
<div align="center">
  <i>Update user</i>
</div>
<br>
<div align="center">
  <img width="600" src="./assets/images/info1.png">
</div>
<div align="center">
  <i>Show more info</i>
</div>
<br>
<div align="center">
  <img width="600" src="./assets/images/delete3.png">
</div>
<div align="center">
  <i>Delete user</i>
</div>
<br>

<div >
  <i><a href=https://github.com/dungbun31/VDT_Lab_backend.git>
         VDT_Lab_backend
        </a></i>
</div>
<br>
Test Api trên postman

<div align="center">
  <img width="600" src="./assets/images/get1.png">
</div>
<div align="center">
  <i>Api get list users</i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/post1.png">
</div>
<div align="center">
  <img width="600" src="./assets/images/post2.png">
</div>
<div align="center">
  <i>Api create user</i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/update1.png">
</div>
<div align="center">
  <img width="600" src="./assets/images/update2.png">
</div>
<div align="center">
  <i>Api update user</i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/delete1.png">
</div>
<div align="center">
  <img width="600" src="./assets/images/delete2.png">
</div>
<div align="center">
  <i>Api delete user</i>
</div>
<br>

#### Kết quả khi chạy các test cases

<div align="center">
  <img width="600" src="./assets/images/test.png" alt="Result of test cases">
</div>
<div align="center">
  <i>Result of test cases</i>
</div>
<br>

#### Kết quả hiển thị trên browser

<div align="center">
  <img width="600" src="./assets/images/web.png" alt="user table">
</div>
<div align="center">
  <i>Bảng danh sách các users</i>
</div>
<br>
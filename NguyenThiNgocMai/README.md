# Bài tập lớp giữa kỳ Viettel Digital Talent 2024 
Nguyễn Thị Ngọc Mai

## A. Phát triển một 3-tier web application đơn giản 
### 1. Hình ảnh thể hiện kết quả đạt được

- Hiển thị danh sách sinh viên dưới dạng bảng
<img src="./Images/data-table.png">

- Xóa thông tin sinh viên khi bấm vào biểu tượng thùng rác

- Cho phép xem chi tiết, cập nhật thông tin sinh viên khi bấm vào biểu tượng bút chì
    <img src="./Images/showInfo-update-data.png">

- Cho phép thêm mới một sinh viên
  <img src="./Images/add-data.png">

- API unit test: Pass all tests
  <img src="./Images/api-tests.png">
  

### 2. Mã nguồn:
  + Web: https://github.com/maintn24/vdtweb-app.git
  + API: https://github.com/maintn24/vdtweb-api.git

## B. Triển khai web application sử dụng các DevOps tools & practices
### 1. Containerization
Sử dụng Docker và Docker Compose
- Dockerfile cho dịch vụ Web: https://github.com/maintn24/vdtweb-app/blob/master/Dockerfile
- Dockerfile cho dịch vụ API: https://github.com/maintn24/vdtweb-api/blob/master/Dockerfile
- Dockerfile cho dịch vụ DB:
- 
- Output câu lệnh build: [build-output.txt](Docs%2Fbuild-output.txt)
- 
- Docker history của web: [docker-history-web.txt](Docs%2Fdocker-history-web.txt)
- Docker history của api: [docker-history-api.txt](Docs%2Fdocker-history-api.txt)
- Docker history của db: 

### 2. Continuous Integration
Sử dụng Github Action
- File setup công cụ CI: https://github.com/maintn24/vdtweb-api/blob/master/.github/workflows/CI.Node.js.yml
- Output log của luồng CI: 
- Hình ảnh demo:
  <img src="./Images/CI.png">
  <img src="./Images/CI-2.png">

### 3. Automation
Sử dụng Ansible
- Mã nguồn Ansible: 

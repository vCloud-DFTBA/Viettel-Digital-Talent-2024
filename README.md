# Viettel-Digital-Talent-2024

## Phát triển một 3-tier web application đơn giản

### Yêu cầu:
Phát triển web application có các chức năng sau:
- Hiển thị danh sách sinh viên tham gia chương trình VDT2024 dưới dạng bảng với các thông tin sau: Họ và tên, Giới tính, trường đang theo học.
- Cho phép xem chi tiết/thêm/xóa/cập nhật thông tin sinh viên.

### Thiết kế hệ thống:
Hệ thống được thiết kế với ba dịch vụ sử dụng các công nghệ sau:
- **Web:** React.js + Vite.
- **API:** Java Spring Boot.
- **Database:** MySQL.

### Hình ảnh kết quả:
- **Trang chính:**
  ![Trang chính](https://github.com/ligmaDbolzz/HoangMinhTuan/assets/104216461/7275b0c9-011d-4a6c-90a7-27dd1996923e)

- **Trang thêm:**
  ![Trang thêm](https://github.com/ligmaDbolzz/HoangMinhTuan/assets/104216461/04bcfcc4-cae2-4435-b2e4-3e332266aac8)

- **Trang sửa:**
  ![Trang sửa](https://github.com/ligmaDbolzz/HoangMinhTuan/assets/104216461/829109ae-ff35-4d8f-83ea-033943b6e050)

### Source code:
- [API Repository](https://github.com/ligmaDbolzz/vdt_mid_BE)
- [Web Repository](https://github.com/ligmaDbolzz/vdt_mid_FE/tree/main/student-web)

## Triển khai web application sử dụng các DevOps tools & practices

### Containerization

#### Yêu cầu:
Viết Dockerfile để ở từng repo để đóng gói các dịch vụ trên thành các container image. Yêu cầu image đảm bảo tối ưu thời gian build và kích thước chiếm dụng, khuyến khích sử dụng các thủ thuật build image đã được giới thiệu (layer-caching, optimized RUN instructions, multi-stage build, etc.)

#### Dockerfiles:
- [Web Dockerfile](https://github.com/ligmaDbolzz/vdt_mid_FE/blob/main/student-web/Dockerfile)
- [API Dockerfile](https://github.com/ligmaDbolzz/vdt_mid_BE/blob/main/Dockerfile)
- [Database Dockerfile](https://github.com/ligmaDbolzz/vdt_mid/blob/main/mysql/Dockerfile)

#### Ảnh Docker History:
- **Database Docker History:**
  ![Database Docker History](https://github.com/ligmaDbolzz/HoangMinhTuan/assets/104216461/6a77586b-cdd5-497b-af3c-9412709e0217)

- **Web Docker History:**
  ![Web Docker History](https://github.com/ligmaDbolzz/HoangMinhTuan/assets/104216461/7daa9421-a308-488b-ac89-e51a0b507f59)

- **API Docker History:**
  ![API Docker History](https://github.com/ligmaDbolzz/HoangMinhTuan/assets/104216461/035f74c7-8a9c-43a8-8411-2cc837493319)

### CI

### Tìm hiểu về một vấn đề đã học

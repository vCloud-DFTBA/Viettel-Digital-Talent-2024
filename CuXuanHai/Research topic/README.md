# Docker Security

## Giới thiệu

Docker là một trong những nền tảng container hóa phổ biến nhất hiện nay. Với khả năng tách biệt phần mềm và các phụ thuộc của nó thành các đơn vị độc lập, Docker cho phép chạy ứng dụng một cách độc lập trên cùng một máy chủ.
![docker1](./images/docker1.png)
Mô hình cách ly của Docker mang lại một lớp bảo mật bổ sung cho các khối lượng công việc trong container. Bằng cách phân chia các ứng dụng thành các container riêng biệt, Docker giúp giảm thiểu tác động của các lỗi và vấn đề phát sinh giữa chúng. Tuy nhiên, việc sử dụng Docker cũng mang lại những rủi ro bảo mật mới nếu không triển khai và cấu hình môi trường một cách cẩn thận.

Vậy làm thế nào để đảm bảo tính bảo mật của Docker? Hãy cùng khám phá các biện pháp bảo mật và các chiến lược phòng ngừa để tối ưu hóa an ninh cho môi trường Docker của bạn.

## Docker hoạt động như thế nào ?

![docker2](./images/dockerwork.gif)

- **Docker là một hệ điều hành dành cho vùng chứa:**

  - Cung cấp cách tiêu chuẩn để chạy mã.
  - Bộ chứa ảo hóa hệ điều hành của máy chủ và Docker được cài đặt trên mỗi máy chủ để cung cấp các lệnh đơn giản.

- **Chạy ứng dụng trong vùng chứa:**

  - Docker cho phép đóng gói và chạy ứng dụng trong các container.
  - Mỗi container chứa mọi thứ cần thiết để ứng dụng hoạt động và chia sẻ dịch vụ của một hệ điều hành cơ bản.

- **Cơ chế cách ly tài nguyên:**

  - Docker sử dụng cách ly tài nguyên trong kernel của hệ điều hành để chạy nhiều container trên cùng một hệ điều hành.

- **Quản lý nhiều container:**

  - Có thể chạy nhiều container cùng lúc trên một máy chủ và chia sẻ chúng giữa các môi trường làm việc khác nhau.

- **Giảm độ trễ:**

  - Docker giúp giảm đáng kể độ trễ giữa việc viết mã và chạy mã trong môi trường sản xuất.

- **Sử dụng hình ảnh và vùng chứa:**

  - Hình ảnh Docker chứa tất cả các phần phụ thuộc cần thiết để thực thi mã bên trong vùng chứa.

- **Kiến ​​trúc client-server:**

  - Docker sử dụng kiến ​​trúc client-server, với máy khách gửi lệnh tới daemon Docker để quản lý các đối tượng Docker.

- **Sổ đăng ký Docker:**

  - Cơ quan đăng ký Docker lưu trữ hình ảnh Docker, ví dụ như Docker Hub, cho phép bạn tìm kiếm và chia sẻ hình ảnh.

- **Vùng chứa và điều khiển:**

  - Vùng chứa là phiên bản có thể chạy được của một hình ảnh, có thể tạo, di chuyển hoặc xóa chúng bằng API Docker hoặc CLI.

- **Ứng dụng Docker Desktop:**
  - Có thể cài đặt Docker Desktop để dễ dàng sử dụng và quản lý các môi trường Docker trên máy tính.

## Tại sao bảo mật container Docker lại là một thách thức

1. **Sự đơn giản của máy ảo và máy chủ truyền thống trong việc bảo mật:**

   - Trước khi Docker trở nên phổ biến, các tổ chức thường sử dụng máy ảo hoặc máy chủ cơ bản để lưu trữ ứng dụng.
   - Từ góc độ bảo mật, các công nghệ này tương đối đơn giản vì chỉ cần tập trung vào hai lớp: môi trường máy chủ và ứng dụng.

2. **Sự phức tạp của bảo mật Docker:**

   - Bảo mật vùng chứa Docker phức tạp hơn do môi trường Docker có nhiều bộ phận chuyển động hơn cần được bảo vệ.
   - Các phần đó bao gồm:
     - Thùng chứa Docker: Cần bảo mật và giám sát từng hình ảnh và phiên bản container riêng biệt.
     - Daemon Docker: Cần được bảo mật để đảm bảo an toàn cho các container.
     - Máy chủ lưu trữ: Có thể là máy chủ hoặc máy ảo.
     - Lớp mạng và API: Để hỗ trợ giao tiếp giữa các container.
     - Khối lượng dữ liệu hoặc hệ thống lưu trữ bên ngoài vùng chứa.

3. **Khó khăn trong việc bảo mật Docker:**
   - Việc học cách bảo mật các vùng chứa Docker là một thách thức do tính phức tạp và đa dạng của các yếu tố cần được bảo mật và giám sát.

## Giải pháp

1. **Limiting container privileges**: Sử dụng cẩn thận các quyền và chế độ cô lập để giảm thiểu nguy cơ tấn công.

2. **Image scanning**: Sử dụng các công cụ quét hình ảnh để phát hiện và loại bỏ các lỗ hổng bảo mật từ các hình ảnh Docker.

3. **Least privilege principle**: Áp dụng nguyên tắc ít quyền nhất cho các container và ứng dụng.

4. **Network segmentation**: Phân chia mạng Docker để giảm thiểu khả năng tấn công mạng.

## Kết luận

Bảo mật trong Docker đòi hỏi sự cân nhắc và triển khai cẩn thận để đảm bảo an toàn cho hệ thống. Bằng cách hiểu rõ các thách thức và áp dụng các biện pháp phòng ngừa phù hợp, chúng ta có thể tăng cường bảo mật cho môi trường Docker của mình.

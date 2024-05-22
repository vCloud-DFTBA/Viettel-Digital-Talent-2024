# Giải quyết vấn đề security trong Docker
Docker là công nghệ container hóa phổ biến nhất. Khi sử dụng đúng cách,
nó có thể nâng cao tính bảo mật so với việc chạy ứng dụng trực tiếp trên
hệ thống máy chủ. Tuy nhiên, một số cấu hình sai có thể làm giảm mức độ
bảo mật hoặc gây ra các lỗ hổng mới

## **Bảo vệ Docker daemon** 

> Docker daemon là một dịch vụ chạy bên trong Docker, nó là một phần của
> Docker engine. Docker daemon đóng vai trò như cầu nối giữa client và
> các objects trong Docker như image, container, volume, network, …
> Docker nhận API request từ client và gọi đến Docker object tương ứng.
>
> Vì là một phần quan trọng trong kiến trúc của Docker, việc bảo mật và
> cấu hình Docker daemon đúng đắn là một việc rất quan trọng. Các tiêu
> chí để đảm bảo bảo mật cho Docker daemon:

- Không expose Docker daemon socket cho bên ngoài. Không expose
  /var/run/docker.socker cho các container khác. Không sử dụng Docker
  với việc mount docker daemon socket bằng volume ( -v
  /var/run/docker.sock:/var/run/docker.sock)

- Docker daemon có thể lắng nghe các yêu cầu API của Docker Engine thông
  qua ba loại socket khác nhau: unix, tcp và fd. Mặc định, domain socket
  unix (IPC socket) được tạo ở /var/run/docker.sock, yêu cầu quyền root
  hoặc nằm trong group docker. Docker socket /var/run/docker.sock là
  socket UNIX mà Docker đang lắng nghe. Đây là cổng vào cho API Docker.
  Cấp cho ai đó quyền truy cập vào nó tương đương với việc cấp quyền
  truy cập root không hạn chế vào máy chủ của chúng ta.

<!-- -->

- Không kích hoạt tcp Docker daemon socket. Giao tiếp này không được mã
  hóa mặc định và do đó, kẻ tấn công có thể thực hiện cuộc tấn công
  MITM - Man in the middle và có thể chặn các lệnh được gửi từ xa từ
  Docker client đến Docker daemon

<!-- -->

- Nếu chúng ta đang chạy docker daemon với -H tcp://0.0.0.0:XXX hoặc
  tương tự, chúng ta đang để lộ quyền truy cập trực tiếp không được mã
  hóa và không được xác thực vào Docker daemon, nếu máy chủ được kết nối
  internet, điều này có nghĩa là docker daemons trên máy tính của chúng
  ta có thể được sử dụng bởi bất cứ ai từ internet công cộng. Nếu thực
  sự phải làm điều này, chúng ta phải bảo mật nó.

> Một số phương pháp được sử dụng để bảo vệ Docker daemon

### **Sử dụng SSH để bảo vệ Docker daemon socket**

> Tạo docker context để kết nối đến docker daemon từ xa sử dụng SSH
>
> Ví dụ ở đây chúng ta muốn kết nối vào docker daemon trên
> host1.example.com và kết nối vào user “docker-user". User này phải có
> quyền truy cập vào docker socket trên thiết bị remote.
>
> <span class="mark">docker context create \\</span>
>
> <span class="mark">--docker host=ssh://docker-user@host1.example.com
> \\</span>
>
> <span class="mark">--description="Remote engine" \\</span>
>
> <span class="mark">my-remote-engine</span>
>
> <span class="mark">my-remote-engine</span>
>
> <span class="mark">Successfully created context
> "my-remote-engine"</span>
>
> Sau khi tạo context, chúng ta sử dụng “docker context use" để chuyển
> sang docker CLI và sử dụng nó, và để kết nối đến thiết bị remote  
> <span class="mark">docker context use my-remote-engine</span>
>
> <span class="mark">my-remote-engine</span>
>
> <span class="mark">Current context is now "my-remote-engine"</span>
>
> <span class="mark">Ngoài ra, hãy sử dụng biến môi trường DOCKER_HOST
> để tạm thời chuyển CLI của docker để kết nối với máy chủ từ xa bằng
> SSH. Điều này không yêu cầu tạo context và có thể hữu ích để tạo kết
> nối đặc biệt với một công cụ khác:</span>
>
> <span class="mark">export
> DOCKER_HOST=ssh://[<u>docker-user@host1.example.com</u>](mailto:docker-user@host1.example.com)</span>

### **Sử dụng TLS(HTTPS) để bảo vệ Docker daemon socket**

> <span class="mark">2.1 Tổng quan về Certificate Authority (CA) và
> Self-signed Certificate</span>
>
> <span class="mark">SSL là viết tắt của Secure Sockets Layer và TLS là
> viết tắt của Transport Layer Security. Đây là các giao thức và tiêu
> chuẩn nhằm đảm bảo an ninh và thiết lập các kết nối được mã hóa giữa
> các máy tính trong kết nối mạng. Điều này ngăn chặn việc truy cập trái
> phép vào thông tin và dữ liệu.</span>
>
> <span class="mark">Chức năng chính của chứng chỉ SSL là thiết lập giao
> tiếp được mã hóa và xác thực người dùng hoặc tổ chức. Một trang web
> hoặc máy tính nối mạng không có chứng chỉ SSL sẽ dễ bị tấn công mạng.
> Ngoài ra, người dùng kết nối với một trang web hoặc máy tính như vậy
> có nguy cơ bị tội phạm mạng đánh cắp thông tin.</span>

<span class="mark">2.1.1 CA</span>

> <span class="mark">Certificate Authority (hay còn gọi là nhà cung cấp
> chứng chỉ số – CA) là một tổ chức đóng vai trò là nhà phát hành và
> chứng thực các loại chứng chỉ số như: chứng thư cho máy chủ, người
> dùng cá nhân, doanh nghiệp, mã nguồn và phần mềm. Certificate
> Authority đóng vai trò là vị trí trung gian nhằm hỗ trợ quá trình trao
> đổi thông tin trên môi trường internet được an toàn, bảo mật
> hơn.</span>
>
> <span class="mark">Hiểu một cách đơn giản nhất, CA chính là cơ quan
> cung cấp chứng chỉ số. Nó là một tập hợp các dữ liệu dùng chứa các
> thông tin xác minh, nhận dạng để các thiết bị, website, người dùng
> hiển thị danh tính xác thực trực tuyến.</span>
>
> <span class="mark">Certificate Authority giữ một vai trò đặc biệt quan
> trọng trong các hoạt động và giao dịch trên internet. Mỗi năm, CA phát
> hành rất nhiều chứng chỉ số với chức năng bảo vệ dữ liệu, mã hóa các
> giao dịch, đồng thời tạo nên môi trường an toàn cho mọi hoạt động trực
> tuyến.</span>
>
> <span class="mark">2.1.2 Self-singed Certificate</span>
>
> <span class="mark">Ngược lại với CA, chứng chỉ tự ký được tạo và xác
> thực bởi chính cá nhân hoặc tổ chức mà không có sự tham gia của bên
> thứ ba như CA. Do không có CA nên chứng chỉ tự ký thường được ký bằng
> private key của người dùng. Chủ sở hữu chỉ biết các private key này và
> không được xác minh.</span>
>
> <span class="mark">Đặc điểm đáng chú ý nhất của chứng chỉ tự ký là
> chúng được tự cấp. Người dùng tạo chứng chỉ của họ và tự xác nhận nó.
> Do đó, các loại chứng chỉ SSL này không có giá trị tin cậy. Ngay cả
> các hacker cũng có thể tự tạo chứng chỉ và xác thực chúng.</span>
>
> <span class="mark">Việc không có bên thứ ba cấp chứng chỉ SSL ở đây
> cũng có nghĩa là người dùng có thể dễ dàng tạo và cấp chứng chỉ SSL.
> Trong hầu hết các trường hợp, có các chương trình ứng dụng hỗ trợ
> người dùng tạo và xác thực chứng chỉ SSL của họ. Chẳng hạn, OpenSSL
> cho phép người dùng tạo chứng chỉ SSL của họ bằng một vài dòng
> code.</span>
>
> <span class="mark">2.2 Sử dụng TLS để bảo vệ Docker daemon
> socket</span>
>
> <span class="mark">Nếu chúng ta cần có thể truy cập Docker thông qua
> HTTP thay vì SSH một cách an toàn, chúng ta có thể bật TLS (HTTPS)
> bằng cách chỉ định tlsverify flag và trỏ tlscacert flag của Docker tới
> CA(certificate authority) đáng tin cậy. Ở chế độ daemon, nó chỉ cho
> phép kết nối từ các client được xác thực bằng chứng chỉ do CA đó ký. Ở
> chế độ client, nó chỉ kết nối với các máy chủ có chứng chỉ được CA đó
> ký.</span>

<span class="mark">Dưới đây là file bash để tự động phục vụ việc tự tạo
CA, server key, client key thông qua OpenSSL. Vì đây chỉ là demo nên
chúng ta sẽ sử dụng chứng chỉ tự ký.</span>

><span class="mark">secure-docker-daemon.sh</span>
>
><span class="mark">\#!/bin/bash</span>
>
><span class="mark">\# Bật tùy chọn "-e" và "-u" để dừng kịp thời khi có
l>ỗi và kiểm tra biến chưa được định nghĩa.</span>
><span class="mark">set -eu</span>
>
><span class="mark">cd ~</span>
>
><span class="mark">echo " \$PWD"</span>
>
><span class="mark">\# Kiểm tra xem thư mục ".docker/" có tồn tại không.
Nếu không, tạo mới nó.</span>
>
><span class="mark">if \[ ! -d ".docker/" \]; then</span>
>
><span class="mark">echo "Thư mục .docker/ không tồn tại"</span>
>
><span class="mark">echo "Đang tạo thư mục"</span>
>
><span class="mark">mkdir .docker</span>
>
><span class="mark">fi</span>
>
><span class="mark">\# Di chuyển vào thư mục ".docker/" và yêu cầu nhập
mật khẩu cho chứng chỉ (không hiển thị ký tự).</span>
>
><span class="mark">cd .docker/</span>
>
><span class="mark">echo "Vui lòng nhập mật khẩu cho chứng chỉ (ký tự sẽ
không được hiển thị):"</span>
>
><span class="mark">read -p '\>' -s PASSWORD</span>
>
><span class="mark">\# Yêu cầu nhập tên máy chủ sẽ được sử dụng để kết
nối tới máy chủ Docker.</span>
>
><span class="mark">read -p '\>' SERVER</span>
>
><span class="mark">\# Tạo một khóa CA RSA 2048-bit được mã hóa bằng
AES256.</span>
>
><span class="mark">openssl genrsa -aes256 -passout pass:\$PASSWORD -out
ca-key.pem 2048</span>
>
><span class="mark">\# Tạo một chứng chỉ tự ký với thời hạn một
năm.</span>
>
><span class="mark">openssl req -new -x509 -days 365 -key ca-key.pem
-passin pass:\$PASSWORD -sha256 -out ca.pem -subj
"/C=TR/ST=./L=./O=./CN=\$SERVER"</span>
>
><span class="mark">\# Tạo một khóa cho server với thuật toán mã hóa RSA
2048-bit.</span>
>
><span class="mark">openssl genrsa -out server-key.pem 2048</span>
>
><span class="mark">\# Tạo yêu cầu chứng chỉ (CSR) cho khóa của server
với tên của server.</span>
>
><span class="mark">openssl req -new -key server-key.pem -subj
"/CN=\$SERVER" -out server.csr</span>
>
><span class="mark">\# Ký khóa của server với chứng chỉ tự ký cho thời
hạn một năm.</span>
>
><span class="mark">openssl x509 -req -days 365 -in server.csr -CA ca.pem
-CAkey ca-key.pem -passin "pass:\$PASSWORD" -CAcreateserial -out
server-cert.pem</span>
>
><span class="mark">\# Tạo một khóa client và yêu cầu chứng chỉ cho
client.</span>
>
><span class="mark">openssl genrsa -out key.pem 2048</span>
>
><span class="mark">openssl req -subj '/CN=client' -new -key key.pem -out
client.csr</span>
>
><span class="mark">\# Tạo một file cấu hình mở rộng cho chứng chỉ client
để chỉ định rằng nó chỉ được sử dụng cho xác thực client.</span>
>
><span class="mark">echo "extendedKeyUsage = clientAuth" \>
extfile.cnf</span>
>
><span class="mark">\# Ký khóa khách hàng với chứng chỉ tự ký cho thời
hạn một năm.</span>
>
><span class="mark">openssl x509 -req -days 365 -in client.csr -CA ca.pem
-CAkey ca-key.pem -passin "pass:\$PASSWORD" -CAcreateserial -out
cert.pem -extfile extfile.cnf</span>
>
><span class="mark">\# Xóa các file tạm thời không cần thiết sau khi đã
tạo chứng chỉ.</span>
>
><span class="mark">rm client.csr extfile.cnf server.csr</span>
>
><span class="mark">\# Đặt quyền truy cập chỉ đọc cho các file khóa
server và khóa client.</span>
>
><span class="mark">chmod 0400 ca-key.pem key.pem server-key.pem</span>
>
><span class="mark">\# Đặt quyền truy cập chỉ đọc cho các file chứng chỉ
của server và client.</span>
>
><span class="mark">chmod 0444 ca.pem server-cert.pem cert.pem</span>
>
><span class="mark">echo "Finish"</span>
>
<span class="mark">Sau khi tạo chứng chỉ TLS, bây giờ chúng ta cần tạo
file cấu hình systemd tùy chỉnh cho daemon Docker. File cấu hình này sẽ
được sử dụng để kích hoạt TLS và chỉ định chứng chỉ TLS</span>

<span class="mark">sudo mkdir
/etc/systemd/system/docker.service.d/</span>

<span class="mark">sudo vim
/etc/systemd/system/docker.service.d/override.conf</span>

<span class="mark">Nội dung file cấu hình</span>

><span class="mark">\[Service\]</span>
>
><span class="mark">ExecStart=</span>
>
><span class="mark">ExecStart=/usr/bin/dockerd -D -H
unix:///var/run/docker.sock</span>
>
><span class="mark">--tlsverify
--tlscert=/home/\<user\>/.docker/server-cert.pem</span>
>
><span class="mark">--tlscacert=/home/\<user\>/.docker/ca.pem
--tlskey=/home/\<user\>/.</span>
>
><span class="mark">docker/server-key.pem -H tcp://0.0.0.0:2376</span>
>
<span class="mark">Khởi động lại Docker service</span>

><span class="mark">sudo systemctl restart docker</span>

<span class="mark">Bây giờ chúng ta có thể sao chép chứng chỉ client TLS
sang máy Docker client để xác thực</span>

## **II. Cài đặt user**

<span class="mark">Cấu hình container sử dụng user không có đặc quyền là
cách tốt nhất để ngăn chặn các cuộc tấn công leo thang đặc quyền
(escalation attack). Có 3 cách để thực hiện việc này</span>

1.  <span class="mark">Trong giai đoạn run time sử dụng ‘-u' khi sử dụng
    “docker run":</span>

> <span class="mark">docker run -u 4000 nginx</span>

2.  <span class="mark">Trong giai đoạn build time. Sử dụng lệnh thêm
    user ở Dockerfile và sử dụng user này. Ví dụ:</span>

> <span class="mark">FROM alpine</span>
>
> <span class="mark">RUN groupadd -r myuser && useradd -r -g myuser
> myuser</span>
>
> <span class="mark">\<Thực thi các đặc quyền của root user\></span>
>
> <span class="mark">USER myuser // Chuyển đổi sang sử dụng với vai trò
> user</span>

3.  <span class="mark">Sử dụng namespace (--userns-remap=default) trong
    Docker daemon</span>

> <span class="mark">Linux namespace là một tính năng giúp chúng ta tạo
> ra một hệ thống các môi trường ảo hóa, giống với các máy ảo. Đây là
> tính năng giúp các process nào đó tách biệt so với các process
> khác.</span>
>
> <span class="mark">Linux namespace gồm các thành phần nhỏ hơn
> như:</span>

- <span class="mark">PID namespace cho phép ta tạo các process tách
  biệt.</span>

- <span class="mark">Networking namespace cho phép ta chạy chương trình
  trên bất kì port nào mà không bị xung độ với các process khác chạy
  trên server.</span>

- <span class="mark">Mount namespace cho phép ta mount và unmount
  filesystem mà không ảnh hưởng gì tới host filesystem.</span>

> <span class="mark">Cách tốt nhất để ngăn chặn các cuộc tấn công leo
> thang đặc quyền (privilege escalation) từ bên trong container là cấu
> hình các ứng dụng trong container của chúng ta để chạy với tư cách
> người dùng không có đặc quyền (unprivileged user). Đối với các
> container có tiến trình phải chạy với tư cách là người dùng root trong
> container, chúng ta có thể ánh xạ lại người dùng này tới người dùng có
> ít đặc quyền hơn trên máy chủ Docker. Người dùng được ánh xạ được chỉ
> định một phạm vi UID hoạt động trong không gian tên như các UID thông
> thường từ 0 đến 65536, nhưng không có đặc quyền trên chính máy
> chủ.</span>

## **III. Giới hạn các khả năng - capabilities (chỉ cấp một số khả năng nhất định phục vụ cho container)**

<span class="mark">Các khả năng của Linux kernal là một tập hợp các đặc
quyền có thể được sử dụng bởi những người có đặc quyền. Mặc định Docker
chỉ chạy với một tập hợp con các khả năng. Chúng ta có thể thay đổi nó
và loại bỏ một số khả năng (sử dụng **--cap-drop**) để giới hạn docker
container của chúng ta hoặc thêm một số khả năng (sử dụng **--cap-add**)
nếu cần. Không chạy các container có flag **--privileged** - điều này sẽ
thêm TẤT CẢ các khả năng của Linux kernal vào container.</span>

<span class="mark">Cách thiết lập an toàn nhất là loại bỏ tất cả các khả
năng --cap-drop all và sau đó chỉ thêm những khả năng được yêu cầu. Ví
dụ:</span>

<span class="mark">docker run --cap-drop all --cap-add CHOWN
alpine</span>

## **IV. Ngăn chặn việc leo thang đặc quyền trong container**

<span class="mark">Luôn run docker image của chúng at với
**--security-opt=no-new-privileges** để ngăn chặn việc leo thang đặc
quyền. Điều này sẽ ngăn container có được các đặc quyền mới thông qua
các binary file như setuid hoặc setgid.</span>

## **V. Các kết nối inter-container**

<span class="mark">Mặc định các container sẽ được kết nối vào bridge
network mặc định tên là default. Các container sẽ giao tiếp với nhau
thông qua interface docker0. Bridge network</span>

### **Giải thích về bridge network và bridge network trong Docker**

> <span class="mark">Trong networking, bridge network là một thiết bị ở
> tầng liên kết dữ liệu chuyển tiếp dữ liệu giữa các network segments.
> Một bridge có thể là một thiết bị phần cứng hoặc một thiết bị phần mềm
> chạy trong kernel của server.</span>
>
> <span class="mark">Trong Docker, bridge network sử dụng một phần mềm
> cho phép các container kết nối với nhau trong cùng một bridge network,
> đồng thời cung cấp sự cô lập với các container không kết nối với
> bridge network đó. Docker bridge driver tự động cài đặt các quy tắc
> trên server để các container trên các bridge network khác nhau không
> thể kết nối trực tiếp với nhau.</span>
>
> <span class="mark">Bridge network áp dụng cho các container chạy trên
> cùng một Docker daemon host. Đối với việc kết nối giữa các container
> chạy trên các Docker host khác nhau, chúng ta có thể quản lý định
> tuyến ở mức hệ điều hành hoặc chúng ta có thể sử dụng một mạng
> overlay. Mạng overlay là một loại mạng trong hệ thống Docker cho phép
> các container chạy trên các Docker host khác nhau kết nối với nhau
> nhưng vẫn giữ được sự cô lập (độc lập về các biến môi trường, dữ
> liệu). Mạng overlay tạo ra một lớp mạng ảo chồng lên các mạng vật lý
> đã có, cho phép các container kết nối và giao tiếp như thể chúng đang
> chạy trên cùng một network.</span>
>
> <span class="mark">Khi chúng ta khởi động Docker, một bridge network
> default được tạo tự động, và các container mới khởi động kết nối đến
> nó trừ khi được chỉ rõ cụ thể. Chúng ta cũng có thể tạo các bridge
> network tùy chỉnh do user định nghĩa ra. Các bridge network do user
> định nghĩa vượt trội hơn so với bridge network mặc định về khả năng
> bảo mật.</span>

### **Kết nối vào mạng user tự định nghĩa:** 

> <span class="mark">Thay vì sử dụng cờ **--icc=false** với Docker
> daemon, cờ này sẽ vô hiệu hóa hoàn toàn giao tiếp giữa các container,
> hãy xem xét việc xác định các cấu hình mạng cụ thể. Điều này có thể
> đạt được bằng cách tạo các Docker network do người dùng tự định nghĩa
> và chỉ định những container nào sẽ được gắn vào chúng. Phương pháp này
> cung cấp khả năng kiểm soát chi tiết hơn đối với giao tiếp
> container.</span>

- <span class="mark">Tạo mạng user tự định nghĩa</span>

> <span class="mark">docker network create my-net</span>

- <span class="mark">Chạy container, chỉ định kết nối với mạng đã
  tạo</span>

> <span class="mark">docker run --name my-nginx \\</span>
>
> <span class="mark">--network my-net \\</span>
>
> <span class="mark">--publish 8080:80 \\</span>
>
> <span class="mark">nginx:latest</span>

- <span class="mark">Chúng ta có thể kết nối một container đang chạy
  trước đó vào mạng đã tạo</span>

> <span class="mark">docker network connect my-net my-nginx</span>

## **VI. Giới hạn tài nguyên (memory, CPU)**

<span class="mark">Chúng ta đã biết, DoS hay DDoS đã là một vấn đề
nghiêm trọng trong lĩnh vực công nghệ bằng cách làm cho các hệ thống và
tài nguyên IT hiệu quả trở nên quá tải bằng cách tạo vô số request ở
tầng ứng dụng hoặc sâu hơn nữa nó có thể tấn công vào transport layer
bằng SYN Flood can thiệp vào quá trình bắt tay ba bước của TCP protocol.
Do vậy những client khác không thể truy cập được vào ứng dụng của chúng
ta nữa do hệ thống đã quá tải. Các container cũng không ngoại lệ và do
đó có sự cần thiết cho các giải pháp hiệu quả để né tránh các cuộc tấn
công DoS. Một phương pháp thiết thực để giải quyết các cuộc tấn công DoS
là giới hạn lượng tài nguyên truy cập của container</span>

### **Giới hạn memory** 

> <span class="mark">docker run -it -m=512mb ubuntu:lastest
> /bin/bash</span>
>
> <span class="mark">Khi lệnh này được thực thi, Docker daemon sẽ chạy
> để tạo container có bộ nhớ RAM tối đa là 512 MB được xây dựng trên
> Ubuntu image. Trong trường hợp này, ngay cả khi một chương trình sử
> dụng hoàn toàn bộ nhớ được chạy trong container, nó chỉ sử dụng hết bộ
> nhớ 512 MB và do đó hệ thống không thể ngừng hoạt động</span>

### **Giới hạn CPU** 

> <span class="mark">Nếu chúng ta có 1 CPU, mỗi lệnh sau sẽ đảm bảo
> container sử dụng tối đa 50% CPU mỗi giây</span>
>
> <span class="mark">docker run -it --cpus=".5" ubuntu /bin/bash</span>
>
> <span class="mark">Tương đương với việc chỉ định --cpu-period và
> --cpu-quota:</span>
>
> <span class="mark">docker run -it --cpu-period=100000
> --cpu-quota=50000 ubuntu /bin/bash</span>

### **Giới hạn số lần restart tối đa**

> <span class="mark">docker run --restart=on-failure:5 -d
> my_image:latest</span>
>
> <span class="mark">Đây là tùy chọn để Docker tự động khởi động lại
> container nếu nó thoát với trạng thái không thành công (exit code khác
> 0), với số lần khởi động tối đa là 5.</span>

### **Giới hạn số lượng file descriptors**

> <span class="mark">docker run --ulimit nofile=1000 -d
> my_image:latest</span>

<span class="mark">Đây là tùy chọn để giới hạn số lượng file mà
container có thể mở. Trong trường hợp này, số lượng file mở tối đa là
1000.</span>

### **Giới hạn số lượng tiến trình** 

> <span class="mark">docker run --ulimit nproc=200 -d
> my_image:latest</span>

<span class="mark">Đây là tùy chọn để giới hạn số lượng quy trình
(processes) mà container có thể tạo ra. Trong trường hợp này, số lượng
quy trình tối đa là 200.</span>

## **VII. Cài đặt filesystem và volumes ở chế độ read-only**

<span class="mark">Chạy các container có filesystem ở chế độ read-only
bằng cờ --read-only. Ví dụ:</span>

<span class="mark">docker run --read-only alpine sh -c 'echo "whatever"
\> /tmp'</span>

<span class="mark">Nếu một ứng dụng bên trong container phải lưu trạng
thái tạm thời, kết hợp --read-only và --tmpfs như thế này:</span>

<span class="mark">docker run --read-only --tmpfs /tmp alpine sh -c
'echo "whatever" \> /tmp/file'</span>

<span class="mark">Ngoài ra, nếu ổ đĩa chỉ được gắn để đọc, hãy gắn
chúng ở dạng chỉ đọc. Có thể thực hiện bằng cách thêm :ro vào -v như thế
này:</span>

<span class="mark">docker run -v volume-name:/path/in/container:ro
alpine</span>

<span class="mark">Hoặc bằng cách sử dụng --mount:</span>

<span class="mark">docker run --mount
source=volume-name,destination=/path/in/container,readonly alpine</span>

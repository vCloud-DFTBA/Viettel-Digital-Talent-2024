# Các cách tối ưu hóa tốc độ thực thi của Ansible playbook
## 1. Phát hiện các task bị chậm với **callback plugins**
Trong Ansible, một task nào đó nhìn thì có vẻ đơn giản, nhưng có thể nó được thực thi cực kỳ chậm. Bạn có thể sử dụng các **callback plugins** như `timer`, `profile_tasks`, `profile_rules` để biết thời gian thực thi của các task và tìm ra các công việc làm chậm **play** của bạn.

Cấu hình `ansible.cfg` với các plugin:
```
[defaults]
inventory = ./hosts
callbacks_enabled = timer, profile_tasks, profile_roles
```

Ta có thể thực thi `playbook` như bình thường:
```cmd
$ ansible-playbook site.yml
PLAY [Deploying Web Server] ************
 
TASK [Gathering Facts] **********************
Thursday 23 December 2021  22:55:58 +0800 (0:00:00.055)   0:00:00.055
Thursday 23 December 2021  22:55:58 +0800 (0:00:00.054)   0:00:00.054
ok: [node1]
 
TASK [Deploy Web service] *******************
Thursday 23 December 2021  22:56:00 +0800 (0:00:01.603)  0:00:01.659
Thursday 23 December 2021  22:56:00 +0800 (0:00:01.603)  0:00:01.658
.........
.........
.........
PLAY RECAP **********************************
node1: ok=9  changed=4  unreachable=0  failed=0
       skipped=0  rescued=0  ignored=0

Playbook run took 0 days, 0 hours, 0 minutes, 14 seconds
Thursday 23 December 2021  22:56:12 +0800 (0:00:00.541)       0:00:14.100 ***** 
=============================================================================== 
deploy-web-server : Install httpd and firewalld ------- 5.42s
deploy-web-server : Git checkout ---------------------- 3.40s
Gathering Facts --------------------------------------- 1.60s
deploy-web-server : Enable and Run Firewalld ---------- 0.82s
deploy-web-server : firewalld permitt httpd service --- 0.72s
deploy-web-server : httpd enabled and running --------- 0.55s
deploy-web-server : Set Hostname on Site -------------- 0.54s
deploy-web-server : Delete content & directory -------- 0.52s
deploy-web-server : Create directory ------------------ 0.41s
Deploy Web service ------------------------------------ 0.04s
Thursday 23 December 2021  22:56:12 +0800 (0:00:00.541) 0:00:14.099
===================================================================== 
deploy-web-server ------------------------- 12.40s
gather_facts ------------------------------- 1.60s
include_role ------------------------------- 0.04s
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
total ------------------------------------- 14.04s
```
Từ thông tin ouput, ta có thể dễ dàng biết được thời gian thực hiện các task, các role và nhiều hơn nữa. Từ những thông đó, có thể giúp bạn biết được các task chạy chậm và thực hiện các tối ưu hóa khác phù hợp.
## 2. Tắt nhiệm vụ **Gathering Facts**
Khi một playbook thực thi, mỗi **play** sẽ chạy một nhiệm vụ ẩn, được gọi là **Gathering Facts**, sử dụng mô-đun **setup**. Nhiệm vụ này thu thập thông tin về host từ xa mà bạn đang tự động hóa và các thông tin thu thập được được lưu trong biến `ansible_facts`. Nhưng nếu bạn không cần những thông tin này trong playbook thì việc thu thập là lãng phí thời gian. Bạn có thể tắt thao tác này bằng cách đặt `gather_facts: False` trong **play**.

Khi chưa tắt **Gathering Facts**:
```cmd
$ time ansible-playbook site.yml
 
PLAY [Deploying Web Server] *********************
 
TASK [Gathering Facts] **************************
ok: [node1]
.........
.........
.........

PLAY RECAP **************************************
node1: ok=9  changed=4  unreachable=0  failed=0  skipped=0  rescued=0  ignored=0
 
ansible-playbook site.yml  3.03s user 0.93s system 25% cpu 15.526 total
```

Khi tắt **Gathering Facts** bằng `gather_facts: False`, hiệu năng đã tăng lên:
```cmd
$ time ansible-playbook site.yml
 
PLAY [Deploying Web Server] ****************
.........
.........
.........
 
PLAY RECAP **************************************
node1: ok=8  changed=4  unreachable=0  failed=0  skipped=0    rescued=0    ignored=0
 
ansible-playbook site.yml 2.96s user 1.00s system 26% cpu 14.992 total
```
Càng có nhiều node thì ta càng tiết kiệm được nhiều thời gian hơn khi tắt **Gathering Facts**.

## 3. Cấu hình sự song hành (parallelism)
Ansible thực thi các nhiệm vụ theo lô, và được điều khiển bởi một tham số là `forks`. Giá trị mặc định của `forks` là 5, nghĩa là Ansible thực thi một nhiệm vụ trên 5 host đầu, đợi khi 5 host này thực hiện xong thì đến lô 5 host tiếp theo thực hiện task đấy, cứ thế đến lúc xong. Khi tất cả các host thực hiện xong task, Ansible chuyển sang task tiếp theo và lại bắt đầu với lô 5 host đầu tiên.

Ta có thể tăng giá trị của `forks` trong `ansible.cfg`, cho phép Ansible thực thi một task trên nhiều host đồng thời.

```
[defaults]
inventory = ./hosts
forks=50
```

Ta cũng có thể thay đổi giá trị của `forks` trong lúc thực thi playbook bằng cách sử dụng tùy chọn `--forks` (viết tắt là`-f`):

```cmd
$ ansible-playbook site.yaml --forks 50
```

Tuy nhiên cần lưu ý, khi Ansible điều khiển càng nhiều **managed node**, Ansible sử dụng càng nhiều tài nguyên (CPU và bộ nhớ). Dựa vào khả năng của máy **control node** Ansible để có thể chọn được cấu hình hợp lý nhất.

## 4. SSH Multiplexing (ControlPersist)

Ansible sử dụng SSH làm cơ chế truyền tải chính để giao tiếp với các server. Đặc biệt, Ansible mặc định là sử dụng chương trình SSH hệ thống.

Bởi vì giao thức SSH chạy dựa trên giao thức TCP, khi ta kết nối với server từ xa bằng SSH, ta cần phải thiết lập một kết nối TCP mới. Hai máy tính cần phải có thời gian thiết lập kết nối trước khi chúng ta có thể bắt đầu làm việc. Việc thiết lập kết nối tốn một khoảng thời gian nhỏ.

Khi Ansible chạy một playbook, nó sẽ tạo ra rất nhiều kết nối SSH để có thể làm vài thứ như sao chép file hoặc chạy các câu lệnh. Và mỗi lần tạo một kết nối SSH tới máy host thì lại cũng mất một chút thời gian để thiết lập kết nối.

OpenSSH là chương trình cài đặt SSH phổ biến nhất và gần như chắc chắn là SSH client được cài đặt sẵn trên máy bạn nếu hệ điều hành máy tính là Linux hoặc macOS. OpenSSH hỗ trợ một cách tối ưu hóa gọi là **SSH multiplexing**, cũng được biết tới như **ControlPersist**. Khi sử dụng **SSH multiplexing**, các phiên SSH kết nới tới cũng một host sử dụng chung một kết nối TCP. Vậy nên chỉ tốn thời gian thiết lập TCP đúng một lần duy nhất lúc đầu.

Mặc định thì Ansible đã sử dụng **SSH multiplexing** rồi. Một vài tham số cấu hình **SSH multiplexing** (trong file `ansible.cfg`, mục `ssh_connection`) cho Ansible như sau:
- **ControlMaster**: Cho phép các phiên SSH đồng thời với cùng host từ xa sử dụng chung một kết nối mạng
- **ControlPersist**: Chỉ định SSH sẽ giữ kết nối nhàn rỗi trong nền bao lâu. Ví dụ `ControlPersist=60s` nghĩa là giữ kết nối nhàn rỗi trong 60 giây.
```
[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
```

## 5. Tắt kiểm tra **host key** trong môi trường linh hoạt
Mặc định, Ansible kiểm tra và xác nhận các SSH host key để bảo vệ máy chủ khỏi các cuộc tấn công giả mạo máy chủ và **man-in-the-middle attacks**. Việc kiểm tra cũng tốn một chút thời gian. Nếu môi trường của bạn gồm các **managed node** bất biến (các máy ảo hoặc các container) thì key sẽ bị thay đổi khi máy host được cài đặt lại hoặc được tạo lại. Bạn có thể tắt kiểm tra **host key** cho các môi trường như thế bằng cách thêm tham số `host_key_checking` vào file `ansible.cfg` và cho nó bằng `False`:
```
[defaults]
host_key_checking = False
```
Điều này không được khuyến khích bên ngoài các môi trường được kiểm soát. Hãy đảm bảo rằng bạn hiểu rõ những ảnh hưởng của hành động này trước khi sử dụng nó trong những môi trường quan trọng.

## 6. Pipelining
Ta biết rằng, Ansible thực thi các task như sau:
- Khởi tạo một script **python** dựa vào mô-đun được thực thi.
- Copy script **python** vào máy host
- Thực thi script đó

Khi Ansible sử dụng SSH, rất nhiều thao tác SSH xảy ra trong nền dành cho copy file, script, và các câu lệnh thực thi khác. Ansible hỗ trợ một cách tối ưu gọi là **pipelining**, giúp giảm số kết nối SSH. Để làm điều này, hãy gán `True` cho tham số `pipelining` (mặc định bị tắt) trong file `ansible.cfg`:
```
# ansible.cfg 
pipelining = True
```

## 7. Sử dụng các chiến lược thực thi
Mặc định, Ansible đợi tất cả các host xong các task trước khi cùng chuyển sang task tiếp theo. Nó được gọi là **linear strategy**.

Nếu bạn không có sự phụ thuộc vào các task hoặc các **managed node**, bạn có thể chuyển `strategy` thành `free`. Điều này cho phép Ansible thực thi các task trên các **managed node** cho tới khi kết thúc **play** mà không cần phải đợi các host khác hoàn thành các task của họ.

```
- hosts: production servers
  strategy: free
  tasks:
```

Bạn có thể phát triển hoặc sử dụng các **strategy plugins** nếu cần thiết. Ví dụ như [Mitogen](https://mitogen.networkgenomics.com/ansible_detailed.html), nó sử dụng các thực thi và kết nối dựa trên python.

## 8. Sử dụng các async task (task bất đồng bộ)
Khi một task được thực thi, Ansible đợi cho tới khi nó hoàn thành trước khi đóng kết nối tới **managed node**. Nó có thể trở thành một **bottleneck** (nút cổ chai) nếu bạn có những task có thời gian thực thi lâu (chẳng hạn như backup ổ đĩa, cài đặt các package, ...) bởi vì nó tăng thời gian thực thi toàn cục. Nếu các task phía sau không phụ thuộc vào task chạy lâu thì bạn có thể sử dụng chế độ `async` với khoảng thời gian `poll` hợp lý để yêu cầu Ansible không đợi và thực thi task tiếp theo:
```
​​​​---
- name: Async Demo
  hosts: nodes
  tasks:
    
    - name: Initiate custom snapshot
      shell:
        "/opt/diskutils/snapshot.sh init"
      async: 120 # Maximum allowed time in Seconds
      poll: 05 # Polling Interval in Seconds
```

## 9. Fact Caching
Như đã nói, bạn có thể tắt **Gathering Fact** task cho một **play**. Tuy nhiên nếu bạn viết các **play** có tham chiếu đến **facts**, bạn có thể sử dụng **fact caching**, nhờ đó Ansible có thể thu thập các **fact** từ một host duy nhất một lần. Thậm chí kể cả khi bạn thoát playbook hoặc chạy một playbook khác với điều kiện là kết nối tới cùng host.

Nếu **fact caching** được mở, Ansible sẽ lưu  các fact ở cache vào lần đầu tiên nó kết nối tới các host. Khi các playbook được chạy sau này, Ansible sẽ tìm kiếm các fact ở trong cache thay vì thu thập lại từ các host ở xa, trừ khi cache hết hạn.

Dưới đây bao gồm đoạn cấu hình bạn cần thêm vào file **ansible.cfg** để mở **fact caching**. Giá trị `fact_caching_timeout` có đơn vị giây và ví dụ này sự dùng giá trị 24h (86400 giây) hết hạn.
```
[defaults]
gathering = smart
# 24-hour timeout, adjust if needed
fact_caching_timeout = 86400

# You must specify a fact caching implementation
fact_caching = ...
```
Cài đặt cấu hình tùy chọn **gathering** thành **smart** để yêu cầu Ansible sử dụng chế độ **smart gathering**. Nghĩa là Ansible sẽ thu thập các **fact** chỉ khi chúng không xuất hiện trong cache hoặc cache hết hạn.

Bạn phải chỉ định 1 cài đặt của `fact_caching` trong file `ansible.cfg`, nếu không thig Ansible sẽ không cache các fact giữa các lần chạy playbook. Hiện tại, có 3 cài đặt fact-caching:
- JSON files
- Redis
- Memcached

# 1. Tắt swap (thực hiện trên tất cả các node)
![](../attachs/Pasted%20image%2020240606010011.png)

# 2. Chạy thiết lập kernel module (thực hiện trên tất cả các node)
``` bash
sudo tee /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

sudo tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

sudo sysctl --system
```
# 3. Cài đặt docker (thực hiện trên tất cả các node)
![](../attachs/Pasted%20image%2020240606002032.png)
# 4. Bật containerd cri (thực hiện trên tất cả các node)
- Xoá cri khỏi disabled_plugins trong file `/etc/containerd/config.toml`, đổi systemdgroup thành true và khởi động lại service containerd![](../attachs/Pasted%20image%2020240606002325.png)![](../attachs/Pasted%20image%2020240606002939.png)![](../attachs/Pasted%20image%2020240606002408.png)
# 5. Cài đặt kubeadm, kubelet and kubectl (thực hiện trên tất cả các node)
![](../attachs/Pasted%20image%2020240606003339.png)
# 6. Khởi tạo master node
- Khởi tạo masternode với cri là containerd và pod cidr là 192.168.0.0/16
![](../attachs/Pasted%20image%2020240606004310.png)
- Chạy lệnh dưới để set up kubectl với user thường![](../attachs/Pasted%20image%2020240606004436.png)
# 7. Cài đặt CNI calico
![](../attachs/Pasted%20image%2020240606005508.png)

![](../attachs/Pasted%20image%2020240606005656.png)
# 8. Join Workernode
![](../attachs/Pasted%20image%2020240606011840.png)
# 9. Kết quả cuối cùng
![](../attachs/Pasted%20image%2020240606012208.png)
# NGINX rate limit
Rate limite trong nginx hoạt động sử dụng thuật toán "leaky bucket", thuật toán được sử dụng rộng rãi trong viễn thông và chuyển mạch gói trong mạng máy tính.
Thuật toán này hoạt động như một cái xô nước mà khi nước được đổ ở phía trên xuống và chảy ra ngoài bởi những cái lỗ dưới xô với tốc độ cố định. Nếu nước đổ vào quá nhanh và làm cho xô nước bị đầy thì phần nước sau đó sẽ bị tràn ra ngoài.
Từ mô tả trên, ta có thể thấy:
- Nước tượng trưng cho số lượng request đổ vào
- Xô tượng trưng cho queue, chứa các request đang cần được xử lý.
- Nước chảy ở đáy xô tượng trưng cho các request được xử lý.
- Tốc độ nước chảy ra tượng trưng cho tốc độ xử lý (rate).
# Cấu hình giới hạn trong nginx
`linmit_req`: bao gồm một tham số **bắt buộc** là zone và hai tham số **tuỳ chọn** là brust và nodelay
- zone ở đây chính là cái xô trong mô tả vừa rồi, nó như là một không gian chia sẻ chung dùng để đếm các request đến. Tất cả các request gửi đến cùng 1 bucket sẽ có cùng một rate limit. Việc này giúp cho việc limit theo URL hoặc IP
- brust là số lượng request vượt yêu cầu mà chúng ta có thể chấp nhận được
`limit_req_zone`: đây là khối giúp cho việc định nghĩa một "bucket" hay zone, ví dụ
	- `limit_req_zone $binary_remote_addr zone=zone1:10m rate=300r/m;`
Ở ví dụ trên chúng ta định nghĩa một zone có tên là zone1, zone này có 10mb ổ đĩa để lưu trạng thái các request, tốc độ xử lý trung bình không được vượt quá 5 request mỗi giây hay 300 request trên phút.

# Thực hiện rate limiting bằng ingress nginx
Sau khi đã tìm hiểu các điều trên, chúng ta có thể bắt đầu còn config resource ingress của ứng dụng api để có thể sử dụng rate limit.

Tạo config map cho ingress nginx như dưới đây
```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
data:
  allow-snippet-annotations: "true" # phải set thành true thì mới làm được
  proxy-connect-timeout: "10s"
  proxy-read-timeout: "10s"
  client-max-body-size: "2m"
  http-snippet: |
    limit_req_zone $binary_remote_addr zone=zone_api:10m rate=9r/m
```
- allow-snippet-annotations: theo mặc định ingress-nginx không cho phép tạo các snippet configuration vì thế chúng ta phải set thành true để có thể thêm các phần custom
- ở phần http-snippet chính là nơi chúng ta định nghĩa zone của chúng ta

Sau khi đã tạo config map chúng ta sẽ chỉnh sửa ingress gốc của ứng dụng api như ảnh dưới đây:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
  annotations:
    nginx.ingress.kubernetes.io/configuration-snippet: |
      limit_req zone=zone_api burst=5 nodelay;
      limit_req_status 409;
spec:
  ingressClassName: nginx
  tls:
  - hosts:
      - api.dotv.home.arpa
    secretName: self-signed-tls
  rules:
  - host: api.dotv.home.arpa
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vdt-api
            port:
              number: 3000
```
- limit_req_status: status code trả về khi vượt qua ratelimit

![](attachs/Pasted%20image%2020240612155647.png)

![](attachs/Pasted%20image%2020240612155718.png)

# Kết quả test sử dụng ab test tool của apache và k6
- Kết quả report lần 1![](attachs/Pasted%20image%2020240612160832.png)
- Kết quả report lần 2![](attachs/Pasted%20image%2020240612161902.png)
- Kết quả lần 3 ![](attachs/Pasted%20image%2020240612165001.png)
- Kết quả sử dụng k6 để benchmark![](attachs/Pasted%20image%2020240612173719.png)
- Sử dụng k6 để benchmark lần 2![](attachs/Pasted%20image%2020240612174336.png)
- Code js dùng để sử dụng k6 cho kiểm thử
```js

import http from 'k6/http'
import { Httpx } from 'https://jslib.k6.io/httpx/0.1.0/index.js';

const session = new Httpx({ baseURL: 'https://api.dotv.home.arpa' });
const token = "<điền token vào>"

session.addHeader('Authorization', `Bearer ${token} `);

export const options = {
        vus: 1,
        duration: '60s',
        thresholds: {
        // Some dummy thresholds that are always going to pass.
        'http_req_duration{status:200}': ['max>=0'],
        'http_req_duration{status:409}': ['max>=0'],
        },
    'summaryTrendStats': ['min', 'med', 'avg', 'p(90)', 'p(95)', 'max', 'count'],
}

export default function () {
  session.get('/api/v1/users');
```
- Hình ảnh mã 409 trả về![](attachs/Pasted%20image%2020240612162720.png)
- Logs của ingress nginx trả về mã lỗi 409 khi thực hiện stress tess![](attachs/Pasted%20image%2020240612164502.png)



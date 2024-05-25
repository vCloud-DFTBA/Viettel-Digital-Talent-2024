# Containerization
* Đường đẫn mã nguồn ứng dụng web: [Web](https://github.com/DoTruong1/vdt-frontend)
* Đường dẫn dockerhub: [Dockerhub](https://hub.docker.com/repository/docker/dotruong1910/frontend/general)
# Đóng gói ứng dụng api
### Nội dung Dockerfile

- Image này sử dụng kỹ thuật multi stage để giảm kích thước của image. Bằng các sử dụng image dầy đủ node:18.20.2 để tải các dependencies và sử dụng image nhẹ hơn là node:18.20.2-alpine3.19 để khởi chạy ứng dụng. 
- Ngoài kỹ thuật trên thì trên luồng cicd của ứng dụng có sử dụng thêm `cache repo` để giảm thời gian build của image. Dưới đây là nội dung `Dockerfile` của ứng dụng api


```dockerfile
FROM node:18.20.2 as build
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --only=production


FROM node:18.20.2-alpine3.19
RUN apk add dumb-init
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app


CMD [ "dumb-init", "node", "index.js" ]

```

### Output câu lệnh build và docker history

#### Thông tin của câu lệnh

![](https://i.ibb.co/Jmxkrkf/image.png)

![](https://i.ibb.co/34XQf2X/image.png)

#### Output cậu lệnh build `api image` trên môi trường máy ảo `chưa được cache` lại, chạy giả lập x64 trên kiến trúc arm

![](https://i.ibb.co/ct9h8jK/image.png)

#### Output cậu lệnh build trên môi trường máy ảo `đã được cache` lại, chạy giả lập x64 trên kiến trúc arm

[![Screenshot-2024-05-26-at-01-34-13.png](https://i.postimg.cc/4yLVX2Kg/Screenshot-2024-05-26-at-01-34-13.png)](https://postimg.cc/QK7Hbbk4)

#### Output thời gian build của image trên github action

![](/Users/dotruong/Library/Application%20Support/marktext/images/2024-05-25-01-52-45-image.png)

#### Output thời gian build của image trên github action sau khi có cache repo

#### Hình ảnh image trên docker hub
[![Screenshot-2024-05-26-at-00-49-28.png](https://i.postimg.cc/dVY2N511/Screenshot-2024-05-26-at-00-49-28.png)](https://postimg.cc/rKfRKC5X)
----------------------------
# Đóng gói ứng dụng web
### Nội dung Dockerfile

- Tương tự như api, ứng dụng web sử dụng kỹ thuật multi stage để giảm kích thước của image. Bằng các sử dụng image dầy đủ node:18.20.2 để tải các dependencies và sử dụng image nhẹ hơn là nginx:1.26-alpine3.19 để khởi chạy ứng dụng. 

- Ngoài kỹ thuật trên thì trên luồng ci của ứng dụng có sử dụng thêm `cache repo` để giảm thời gian build của image. Dưới đây là nội dung `Dockerfile` của ứng dụng api

- Bên cạnh đó, khi cái đặt các dependency thì em sử dụng `npm ci` thay vì `npm install` và trước khi build em đã thay môi trường của node thành `production` do ứng dụng web tĩnh nên các biến môi trường ở stage build không thể thay đổi thông qua cách thông thường vì vậy em đã thêm 1 script để có thể thay thế lại giá trị biến môi trường trước image chạy. 


```dockerfile
FROM node:18.20.2 as build
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci


COPY . .
ENV NODE_ENV production

RUN npm run build



FROM nginx:1.26-alpine3.19 as production-stage

COPY --from=build --chown=nginx:nginx  /usr/src/app/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /usr/src/app/dist /usr/share/nginx/html
COPY config/env.sh /docker-entrypoint.d/env.sh
EXPOSE 80
RUN chmod +x /docker-entrypoint.d/env.sh
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Output câu lệnh build và docker history

#### Thông tin của câu lệnh

[![Screenshot-2024-05-26-at-01-25-04.png](https://i.postimg.cc/mZVzHnm3/Screenshot-2024-05-26-at-01-25-04.png)](https://postimg.cc/Rq6Zrg5q)

[![Screenshot-2024-05-26-at-01-26-46.png](https://i.postimg.cc/43h2KVZt/Screenshot-2024-05-26-at-01-26-46.png)](https://postimg.cc/kVqvzV2X)

#### Output cậu lệnh build `web image` trên môi trường máy ảo `chưa được` cache lại, chạy giả lập x64 trên kiến trúc arm

[![Screenshot-2024-05-26-at-01-28-28.png](https://i.postimg.cc/9XJ3HPfF/Screenshot-2024-05-26-at-01-28-28.png)](https://postimg.cc/qghD83n9)
#### Output cậu lệnh build `web image` trên môi trường máy ảo chưa `đã được` cache lại, chạy giả lập x64 trên kiến trúc arm
[![Screenshot-2024-05-26-at-01-31-40.png](https://i.postimg.cc/j2sLw6VS/Screenshot-2024-05-26-at-01-31-40.png)](https://postimg.cc/bDBz4tN7)
#### Output thời gian build của image trên github action

![](/Users/dotruong/Library/Application%20Support/marktext/images/2024-05-25-01-52-45-image.png)

#### Output thời gian build của image trên github action sau khi có cache repo

#### Hình ảnh image trên docker hub
[![Screenshot-2024-05-26-at-01-29-29.png](https://i.postimg.cc/mg3NKjbm/Screenshot-2024-05-26-at-01-29-29.png)](https://postimg.cc/4Yd99zHc)


---------------

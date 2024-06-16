# Triển khai web application sử dụng các DevOps tools & practices
## 1. Mô tả

<div align="center">
  <img width="600" src="./assets/images/9.png">
</div>

### Giới thiệu về GitLab CI/CD

GitLab CI/CD là một phần của nền tảng DevOps toàn diện được cung cấp bởi GitLab, giúp tự động hóa các quy trình phát triển phần mềm từ việc lập trình đến triển khai. GitLab CI/CD hỗ trợ các đội ngũ phát triển trong việc tích hợp liên tục (CI - Continuous Integration) và triển khai liên tục (CD - Continuous Deployment) một cách hiệu quả và nhất quán. Dưới đây là một số điểm nổi bật về GitLab CI/CD:

#### 1. **Tích hợp Liên tục (Continuous Integration - CI)**

GitLab CI cho phép các nhà phát triển tự động hóa quy trình kiểm tra mã nguồn sau mỗi lần commit. Khi một đoạn mã mới được đẩy lên kho lưu trữ, GitLab CI sẽ tự động chạy các bài kiểm tra để đảm bảo rằng mã nguồn mới không gây ra lỗi hoặc làm hỏng hệ thống. Quy trình này giúp:

- **Phát hiện lỗi sớm**: Giúp phát hiện và sửa lỗi ngay khi chúng xuất hiện, tránh việc lỗi tích lũy và trở nên phức tạp hơn.
- **Tiết kiệm thời gian**: Tự động hóa kiểm tra giúp tiết kiệm thời gian cho các nhà phát triển, cho phép họ tập trung vào viết mã hơn là kiểm tra thủ công.
- **Nâng cao chất lượng mã nguồn**: Đảm bảo rằng mã nguồn luôn trong tình trạng tốt nhất trước khi được triển khai.

#### 2. **Triển khai Liên tục (Continuous Deployment - CD)**

GitLab CD mở rộng khả năng của CI bằng cách tự động hóa việc triển khai mã nguồn đến môi trường sản xuất sau khi các kiểm tra đã hoàn thành thành công. Điều này giúp:

- **Đảm bảo tính nhất quán**: Mã nguồn được triển khai theo một quy trình nhất quán và được kiểm soát chặt chẽ, giảm thiểu rủi ro.
- **Rút ngắn thời gian triển khai**: Tự động hóa quy trình triển khai giúp giảm thiểu thời gian từ khi hoàn thành mã nguồn đến khi nó được triển khai lên môi trường sản xuất.
- **Nâng cao khả năng phản ứng**: Giúp các đội ngũ phản ứng nhanh hơn với các yêu cầu thay đổi và cập nhật, giúp duy trì và cải thiện liên tục sản phẩm.

#### 3. **Pipeline Tùy Biến**

GitLab CI/CD sử dụng các pipeline để định nghĩa và quản lý các quy trình CI/CD. Một pipeline bao gồm nhiều giai đoạn (stage) và công việc (job) được định nghĩa trong tệp `.gitlab-ci.yml`. Các pipeline có thể được tùy chỉnh để phù hợp với bất kỳ quy trình phát triển nào, từ đơn giản đến phức tạp, bao gồm:

- **Xây dựng (Build)**: Tạo các phiên bản phần mềm từ mã nguồn.
- **Kiểm tra (Test)**: Chạy các bài kiểm tra đơn vị, tích hợp và chức năng.
- **Triển khai (Deploy)**: Đẩy mã nguồn lên các môi trường staging, production.

#### 4. **Tích hợp Dễ Dàng với Các Công Cụ Khác**

GitLab CI/CD tích hợp tốt với các công cụ và dịch vụ khác như Docker, Kubernetes, và các dịch vụ đám mây như AWS, Azure, Google Cloud. Điều này giúp các đội ngũ dễ dàng xây dựng và triển khai ứng dụng trên nhiều nền tảng khác nhau.

## 2. Output

CD web 
```
stages:
  - build
  - deploy

variables:
  DOCKER_IMAGE: "dungxbuns/vdt-lab-frontend"
  DOCKER_TLS_CERTDIR: ""

image: ubuntu:18.04

services:
  - docker:19.03.12-dind

before_script:
  - apt-get update
  - apt-get install -y curl jq python3-pip apt-transport-https ca-certificates gnupg-agent software-properties-common
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
  - add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  - apt-get update
  - apt-get install -y docker-ce docker-ce-cli containerd.io
  - service docker start
  - docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

build:
  stage: build
  script:
    - |
      # Fetch current tags from Docker Hub
      TAGS=$(curl -s -u "$DOCKER_USERNAME:$DOCKER_PASSWORD" "https://hub.docker.com/v2/repositories/$DOCKER_IMAGE/tags" | jq '.count')
      echo "Current tags count: $TAGS"
      
      # Calculate new tag
      NEW_TAG="v$((TAGS + 1))"
      echo "New tag: $NEW_TAG"

      # Build and push Docker image
      docker build --platform linux/arm64 -t $DOCKER_IMAGE:$NEW_TAG .
      docker push $DOCKER_IMAGE:$NEW_TAG
      echo "NEW_TAG=$NEW_TAG" > .env

  artifacts:
    reports:
      dotenv: .env
  only:
    refs:
      - develop
      - merge_requests

deploy:
  stage: deploy
  script:
    - export $(cat .env | xargs)
    - git clone https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dungbun31/ks8-config-web.git
    - cd ks8-config-web
    - |
      echo "New tag: $NEW_TAG"
    - pip3 install -r requirements.txt
    - python3 config.py
    - git config --global user.email "gitlab-ci@your-domain.com"
    - git config --global user.name "GitLab CI"
    - git add values.yaml
    - git commit -m "Update image tag to $NEW_TAG"
    - git push https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dungbun31/ks8-config-web.git main
  only:
    refs:
      - develop
      - merge_requests
```

CD api
```
stages:
  - build
  - deploy

variables:
  DOCKER_IMAGE: "dungxbuns/vdt-lab-backend"
  DOCKER_TLS_CERTDIR: ""

image: ubuntu:18.04

services:
  - docker:19.03.12-dind

before_script:
  - apt-get update
  - apt-get install -y curl jq python3-pip apt-transport-https ca-certificates gnupg-agent software-properties-common
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
  - add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  - apt-get update
  - apt-get install -y docker-ce docker-ce-cli containerd.io
  - service docker start
  - docker info
  - docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

build:
  stage: build
  script:
    - |
      # Fetch current tags from Docker Hub
      TAGS=$(curl -s -u "$DOCKER_USERNAME:$DOCKER_PASSWORD" "https://hub.docker.com/v2/repositories/$DOCKER_IMAGE/tags" | jq '.count')
      echo "Current tags count: $TAGS"
      
      # Calculate new tag
      NEW_TAG="v$((TAGS + 1))"
      echo "New tag: $NEW_TAG"

      # Build and push Docker image
      docker build --platform linux/arm64 -t $DOCKER_IMAGE:$NEW_TAG .
      docker push $DOCKER_IMAGE:$NEW_TAG
      echo "NEW_TAG=$NEW_TAG" > .env

  artifacts:
    reports:
      dotenv: .env
  only:
    refs:
      - develop
      - merge_requests

deploy:
  stage: deploy
  script:
    - export $(cat .env | xargs)
    - git clone https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dungbun31/ks8-config-api.git
    - cd ks8-config-api
    - |
      echo "New tag: $NEW_TAG"
    - pip3 install -r requirements.txt
    - python3 config.py
    - git config --global user.email "gitlab-ci@your-domain.com"
    - git config --global user.name "GitLab CI"
    - git add values.yaml
    - git commit -m "Update image tag to $NEW_TAG"
    - git push https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/dungbun31/ks8-config-web.git main
  only:
    refs:
      - develop
      - merge_requests

```

<div align="center">
  <img width="600" src="./assets/images/1.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/2.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>


<div align="center">
  <img width="600" src="./assets/images/5.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>
<div align="center">
  <img width="600" src="./assets/images/4.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>

Hình ảnh app triển khai argoCD
<div align="center">
  <img width="600" src="./assets/images/4.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/4.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/4.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>
Hình ảnh app triển khai argoCD
<div align="center">
  <img width="600" src="./assets/images/6.jpg">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/7.png">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>

<div align="center">
  <img width="600" src="./assets/images/8.png">
</div>

<div align="center">
  <i> 
        </i>
</div>
<br>
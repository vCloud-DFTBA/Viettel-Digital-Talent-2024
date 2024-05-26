# 2. Continous integration
- CI setup backend: [ci-backend](https://github.com/DoTruong1/vdt-backend/blob/main/.github/workflows/ci-test.yml)
- CI setup frontend: [ci-frontend](https://github.com/DoTruong1/vdt-frontend/blob/main/.github/workflows/publish-image.yml)
- backend dockerhub: [backend](https://hub.docker.com/repository/docker/dotruong1910/backend/general)
- frontend dockerhub: [frontend](https://hub.docker.com/repository/docker/dotruong1910/frontend/general)

- Actions có 2 jobs là tests code và publish docker.
  -  tests code sẽ được chạy khi có sự kiện push code vào nhánh và có pull request vào nhánh main.
  - publish docker sẽ được chạy sau khi code được merge vào main và sẽ chạy test lại 1 lần nữa nếu thành công thì sẽ tiền hành đẩy docker image mới lên docker hub.
## Chạy unit test khi có code push vào nhánh và có khi có pull request vào nhánh main
[![Screenshot-2024-05-26-at-14-02-11.png](https://i.postimg.cc/P5nKXx36/Screenshot-2024-05-26-at-14-02-11.png)](https://postimg.cc/1fMDM9Z6)
[![Screenshot-2024-05-26-at-19-11-14.png](https://i.postimg.cc/fW0z0Mjn/Screenshot-2024-05-26-at-19-11-14.png)](https://postimg.cc/z38ZsZc0)
## Chạy unit test và build docker image mới vào nhánh main
[![Screenshot-2024-05-26-at-14-10-05.png](https://i.postimg.cc/brBnZ690/Screenshot-2024-05-26-at-14-10-05.png)](https://postimg.cc/8fLc3m3s)

## Test output khi chạy unit test
[![Screenshot-2024-05-26-at-14-12-16.png](https://i.postimg.cc/pdz3k49T/Screenshot-2024-05-26-at-14-12-16.png)](https://postimg.cc/5H9P2PSd)

## Các step khi chạy jobs publish docker
[![Screenshot-2024-05-26-at-14-13-16.png](https://i.postimg.cc/qBbDc4mw/Screenshot-2024-05-26-at-14-13-16.png)](https://postimg.cc/DmGcnk34)
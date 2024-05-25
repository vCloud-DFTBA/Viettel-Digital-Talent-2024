# Phát triển một 3-tier web application đơn giản
## Web application
### Mô tả chung về ứng dụng web
Ứng dụng được viết bằng [Node.js](https://nodejs.org/) ở phiên bản v18.12.0, kêt hợp với công nghệ ORM là [Sequelize](https://sequelize.org/docs/v7/databases/mariadb/) với database phía sau là [MariaDB](https://mariadb.org).

![](https://www.google.com/url?sa=i&url=https%3A%2F%2Fmherman.org%2Fblog%2Fnode-postgres-sequelize%2F&psig=AOvVaw3TwE6unN9byROjsL6x5YmR&ust=1716741250664000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOCDw9WdqYYDFQAAAAAdAAAAABAw)

Ứng dụng được settings thông qua các biến môi trường sau
| Tên biến        | Mô tả                                  |
| --------------- |:-------------------------------------- |
| **DB_USER**     | Tên người người dùng của cơ sở dữ liệu |
| **DB_PASSWORD** | Mật khẩu người dùng cơ sở dữ liệu      |
| **DB_NAME**     | Tên của cơ sở dữ liệu                  |
| **DB_HOST**     | Địa chỉ của cơ sở dữ liệu              |
| **DB_PORT**     | Cổng triển khai của cơ sở dữ liệu      |
| **API_PATH**    | Path của API VD: api/v1                |
### Các đầu api của ứng dụng

| Method   | URL                      | Description                                    |
| -------- | ------------------------ | ---------------------------------------------- |
| `GET`    | `/api/v1/users`          | Lấy danh sách users                            |
| `POST`   | `/api/v1/posts`          | Tạo một user mới                               |
| `GET`    | `/api/v1/users/{userID}` | Lấy thông tin của user có Id là {userID}       |
| `PUT`  | `/api/v1/users/{userID}` | Cập nhật thông tin của user có id là {userId}. |
| `DELETE` | `/api/v1/users/{userID}`   | Xoá user có id là {userId}.                    |

### Unit test
Các test của ứng dụng API được nằm trong thư mục tests của mã nguồn ứng dụng. Dưới đây là nội dụng bộ test suit dùng cho đầu api `users`
```Js
describe('User APIs Testing...', () => {
  test('List Users API...', async () => {
    const res = await request.get(USERS_API_PATH)
    expect(res.statusCode).toBe(200);
  });

  test('Create User API...', async () => {
    const res = await request.post(USERS_API_PATH)
      .send({
        name: 'Ramdom Name',
        school: 'Random School',
        gender: 'mail',
        email: "ramdom email",
        birthDay: "11/11/2222",
        phone: 11011,
        nation: "VN"
      });
    UserData = res.body.data
    console.log(res.body)
    expect(res.statusCode).toBe(200);
  });

  test('Create User API Missing required field...', async () => {
    const res = await request.post(USERS_API_PATH)
      .send({
        name: 'Ramdom Name',
        school: 'Random School',
      });
    expect(res.statusCode).toBe(400);
  });


  test('Get one user by Existed Id API...', async () => {
    const res = await request.get(USERS_API_PATH + `/${UserData.id}`)
    expect(res.statusCode).toBe(200);
  });

  test('Get one user by Not existewd Id API...', async () => {
    const dummyUserId = "aa1a"
    const res = await request.get(USERS_API_PATH + `/${dummyUserId}`)
    expect(res.statusCode).toBe(404);
  });

  test('Update user info API', async () => {
    const res = await request.put(USERS_API_PATH + `/${UserData.id}`)
      .send({
        "name": "New Name",
        "school": "Dai hoc cong nghe",
        "gender": "male",
        "email": "ramdom email",
        "birthDay": "11/11/2222",
        "phone": 11011,
        "nation": "VN"
      })
    // expect(UserData.name).toEqual(res.body.data.name);
    expect(res.statusCode).toBe(200);
  })

  test('Update user info API with woring id', async () => {
    const dummyUserId = "aa1a"
    const res = await request.put(USERS_API_PATH + `/${dummyUserId}`)
      .send({
        "name": "New Name",
        "school": "Dai hoc cong nghe",
        "gender": "Nam",
        "email": "ramdom email",
        "birthDay": "11/11/2222",
        "phone": 11011,
        "nation": "VN"
      })
    expect(res.statusCode).toBe(500);
  });

  test('Delete user API', async () => {
    const res = await request.delete(USERS_API_PATH + `/${UserData.id}`)

    expect(res.statusCode).toBe(200);
  });

  test('Delete user API failed with wrong usẻ id', async () => {
    const dummyUserId = "aa1a"
    const res = await request.delete(USERS_API_PATH + `/${dummyUserId}`)
    expect(res.statusCode).toBe(500);
  });
});
```
### Cách chạy thử image của ứng dụng
Tạo một file `docker-compose.yaml` với nội dung dưới đây(thay thế các giá trị nằm trong dấu `< >` bằng giá trị của mình).
```yaml
version: "3"
services:
  db:
    image: mariadb:lts
    restart: always
    environment:
      MARIADB_ROOT_PASSWORD: <Điền mật khẩu của người dùng root>
      MARIADB_USER: <tên người dùng db>
      MARIADB_PASSWORD: <mật khẩu của người dùng db>
      MARIADB_DATABASE: <tên database sẽ chứa bảng Users chửa thông tin của các thí sinh>
    networks: 
     - backend
    volumes:
      - db:/backup
    ports:
      - <Cổng expose database>:3306

  api:
    image: <image api của ứng dụng>:<tag>
    depends_on:
    - db
    restart: always
    environment:
    -  DB_USER=<tên người dùng db>
    -  DB_PASSWORD=<mật khẩu của người dùng db>
    -  DB_NAME=<tên database sẽ chứa bảng Users chửa thông tin của các thí sinh>
    -  DB_PORT=3306
    -  DB_HOST=db
    -  API_PATH=/api/v1
    -  PORT=3000
    ports:
    - <Cổng expose api>:3000
    networks: 
     - backend
networks:
  backend:
volumes:
  db:
```
Sau đó tại thư mục chứa file `docker-compose.yaml` chạy lệnh sau
```bash
docker compose up
```
### Kết quả thu được thông qua postman
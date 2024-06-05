# Viettel-Digital-Talent-2024
# Everything VDT2024
# Bài tập giữa kỳ:

## I.Phát triển một 3-tier web application đơn giản (3đ)
<img width="1478" alt="Screenshot 2024-05-27 at 21 45 14" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ca800ce8-d05c-4ef5-87af-3a32792a55ba">
<img width="1369" alt="Screenshot 2024-05-23 at 16 16 53" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/395e2dea-d74c-4f75-a7c4-30c3079151d7">
<img width="1417" alt="Screenshot 2024-05-23 at 16 17 14" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ee4b79eb-8559-4352-bd24-046b787f6bd5">
<img width="1457" alt="Screenshot 2024-05-27 at 21 36 18" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/eb8fbb0c-f4f6-40fe-80d2-d82253879b46">
<img width="1464" alt="Screenshot 2024-05-27 at 21 58 14" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/b3de8a17-612e-4f2e-b3a2-e2f646f8652f">

 - Mã nguồn của từng dịch vụ:
   [i.Web](https://github.com/ngodanghuy162/vdt-front)  
   [ii.API](https://github.com/ngodanghuy162/vdt-back/tree/main/back) 
   [iii.Database](https://github.com/ngodanghuy162/vdt-back/tree/main/back/dtb) 
   - Tất cả Dockerfile, file CD đều nằm trong các repo.
   - [File chứa unit test cho các api](https://github.com/ngodanghuy162/vdt-back/blob/main/back/src/test/java/appbackend/back/service/UserServiceTest.java) : Có 9 unit test với các trường hợp thành công, thất bại cho mỗi Case của API.
## Triển khai web application sử dụng các DevOps tools & practices (5đ)
# 1. Containerization(2d)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/fe9838a5-e64c-4edd-ab6a-751f0134ddbb)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/baca470b-5dc0-4214-ba2e-a8a6f1a1a65a)
<img width="775" alt="Screenshot 2024-05-27 at 22 44 28" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/2ce76e86-6d6c-4d3b-bf7b-bacdd4020043">

  - [Dockerfile cho backend:](https://github.com/ngodanghuy162/vdt-back/blob/main/back/Dockerfile)
     - Ở đây, với Dockerfile của backend-api đã sử dụng kĩ thuật multi-stage chia bước build và run --> giúp giảm kích thước của image cuối cùng và giữ lại chỉ những thành phần cần thiết để chạy ứng dụng.
       <img width="523" alt="Screenshot 2024-05-27 at 22 16 56" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/dd8a2ff9-843f-4264-a883-0f724c5c2a07">
  - [Dockerfile cho frontend:](https://github.com/ngodanghuy162/vdt-front/blob/main/Dockerfile)            
           <img width="454" alt="Screenshot 2024-05-23 at 16 14 08" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/9e70e722-ffff-4dd6-9668-3f7631a94090">
 - [Dockerfile cho database:](https://github.com/ngodanghuy162/vdt-back/blob/main/back/dtb/Dockerfile)          
           <img width="330" alt="Screenshot 2024-05-27 at 22 16 40" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/c798572e-1ddd-46f4-b2e4-5020ca5b9611">
 - [Docker compose:](https://github.com/ngodanghuy162/vdt-back/blob/main/back/compose.yaml)                       
            <img width="438" alt="Screenshot 2024-05-27 at 22 18 59" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/4546b905-88b7-433b-917d-fc2917256e7c">
        --> em chỉ dùng docker compose ở bước ban đầu chạy 3 container 1 lúc, sau khi deploy lên nhiều host em không dùng docker compose nữa.
 - Images history             
        i.Frontend                                              
       <img width="873" alt="Screenshot 2024-05-23 at 13 09 13" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/879beb8f-60f7-41db-9755-feefabac15d3">
        ii.Backend                                            
       <img width="893" alt="Screenshot 2024-05-23 at 13 10 12" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1dbe3bb3-cb15-4b42-ae49-f143a16b8235">
        iii.Database                                            
       <img width="904" alt="Screenshot 2024-05-23 at 13 10 55" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/7f150f51-edf5-4ff7-ac3d-57fc0eee200f">
# 2. CI (1.5đ)
Yêu cầu:
Tự động chạy unit test khi tạo PR vào branch main (0.5đ)
Tự động chạy unit test khi push commit lên một branch (1đ)

- [File setup công cụ (Github Acions)](https://github.com/ngodanghuy162/vdt-back/blob/main/.github/workflows/CI.yml)
- Tự động chạy luồng CI khi có push hoặc PR vào branch main.
<img width="1053" alt="Screenshot 2024-05-24 at 09 19 13" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ab1b8bf8-c458-43d5-9876-ba356b52b4b4">
<img width="1053" alt="Screenshot 2024-05-24 at 09 24 13" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1e3deed4-63c4-442e-a42d-209a0451b490">
<img width="1064" alt="Screenshot 2024-05-24 at 09 41 37" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/07c1a725-d649-4091-88c4-8ca5ca26bad9">
<img width="1050" alt="Screenshot 2024-05-24 at 09 41 51" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/f4f5b13b-dee3-4869-9c4c-befab4d66017">
<img width="1142" alt="Screenshot 2024-05-24 at 09 59 03" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/50354bff-4291-4528-9cf2-e65b2a489988">

# CD Tự động push images lên docker hub khi có tag mới                  
- [File CD Front-end:](https://github.com/ngodanghuy162/vdt-front/blob/main/.github/workflows/CD.yml)
- [File CD Back-end:](https://github.com/ngodanghuy162/vdt-back/blob/main/.github/workflows/CD.yml)
<img width="1438" alt="Screenshot 2024-05-24 at 18 01 29" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/c0b094af-b8af-4530-8c20-88e83f89bb34">
<img width="1418" alt="Screenshot 2024-05-24 at 18 02 12" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/fea415e7-c8ec-4e9a-a8ce-c350980db21f">
<img width="1256" alt="Screenshot 2024-05-27 at 21 50 18" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/bb1d477c-216e-48db-b10b-5859dcbb8a67">
<img width="1027" alt="Screenshot 2024-05-27 at 21 30 23" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/c6e0f0a9-ba60-497a-b08b-af4e0f2e235e">
<img width="1119" alt="Screenshot 2024-05-27 at 21 30 43" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/8b520902-e1af-476a-a0ac-0f471cf4eb92">

# 3. Ansible
- Yêu cầu:</br>
1.Viết ansible playbooks để triển khai các image docker của các dịch vụ web, api, db, mỗi dịch vụ 1 role (0.5đ).                                       
      - Link playbook:https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/blob/midterm/ansible/playbook.yml</br>
2.Trong từng role cho phép tuỳ biến cấu hình của các dịch vụ thông qua các variables (0.5đ).</br>
      - Các biến cấu hình nằm trong các tệp vars. [Link roles](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/tree/midterm/ansible/roles)</br>
3.Cho phép triển khai các dịch vụ trên các host khác nhau thông qua file inventory (0.5đ).: Triển khai trên 3 con VM, 1 con triển khai frontend, 1 con backend và 1 con db.
      - [Link file source code ansible:](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/edit/midterm)
<img width="1461" alt="Screenshot 2024-05-27 at 21 30 06" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/8c0d76fc-f468-4372-87c6-7a0ee7e95aaf">
<img width="1384" alt="Screenshot 2024-05-27 at 21 34 49" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/4855ca17-991e-4a21-88ef-d3ca1b86a361">
<img width="1056" alt="Screenshot 2024-05-27 at 21 35 31" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/57f1eaf8-647f-4828-88e2-be5494f149f8">
<img width="1500" alt="Screenshot 2024-05-27 at 22 52 55" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/4f928edd-57e5-4c1b-b491-d5348645b966">

#  4. Viết về 1 chủ đề chuyên sâu:
[Link báo cáo](https://docs.google.com/document/d/1d8KX6el_ChEPDU77t-f6Bkc8lnYHihWJPAxc4XXedO4/edit?usp=sharing)

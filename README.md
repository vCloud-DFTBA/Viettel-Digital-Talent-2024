# Viettel-Digital-Talent-2024
# Everything VDT2024
# Bài tập giữa kỳ:

## I.Phát triển một 3-tier web application đơn giản (3đ)
<img width="1289" alt="Screenshot 2024-05-23 at 15 36 35" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ff72d5a1-78cc-4a97-8989-96c0a9d30dd6">
<img width="1369" alt="Screenshot 2024-05-23 at 16 16 53" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/395e2dea-d74c-4f75-a7c4-30c3079151d7">
<img width="1417" alt="Screenshot 2024-05-23 at 16 17 14" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ee4b79eb-8559-4352-bd24-046b787f6bd5">

 - Mã nguồn của từng dịch vụ:
           [i.Web](https://github.com/ngodanghuy162/vdt-front/tree/main)
           [ii.API](https://github.com/ngodanghuy162/vdt-back)
                    - [File chứa unit test cho các api](https://github.com/ngodanghuy162/vdt-back/blob/main/back/src/test/java/appbackend/back/service/UserServiceTest.java)
           [iii.Database]()      
    ->> Dockerfile nằm trong các mục này luôn.
   
## Triển khai web application sử dụng các DevOps tools & practices (5đ)
# 1. Containerization(2d)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/fe9838a5-e64c-4edd-ab6a-751f0134ddbb)
![image](https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/baca470b-5dc0-4214-ba2e-a8a6f1a1a65a)
 - Dockerfile cho backend:
    - Ở đây, với Dockerfile của backend-api đã sử dụng kĩ thuật multi-stage chia bước build và run --> giúp giảm kích thước của image cuối cùng và giữ lại chỉ những thành phần cần thiết để chạy ứng dụng.
<img width="597" alt="Screenshot 2024-05-23 at 16 09 17" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/8ad9916d-ecac-4243-af08-3bd522c4227a">
 - Dockerfile cho frontend:
<img width="454" alt="Screenshot 2024-05-23 at 16 14 08" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/9e70e722-ffff-4dd6-9668-3f7631a94090">
 - Dockerfile cho database:
<img width="371" alt="Screenshot 2024-05-23 at 16 14 50" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1509bc47-97ae-400b-8a04-30ea42da96ef">
 - Docker compose:
<img width="648" alt="Screenshot 2024-05-23 at 16 15 35" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/75d10f75-23e8-4bb9-b7fd-9967cabf4d3c">

 - Images history             
        i.Frontend
<img width="873" alt="Screenshot 2024-05-23 at 13 09 13" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/879beb8f-60f7-41db-9755-feefabac15d3">
        ii.Backend
<img width="893" alt="Screenshot 2024-05-23 at 13 10 12" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1dbe3bb3-cb15-4b42-ae49-f143a16b8235">
        iii.Database
<img width="904" alt="Screenshot 2024-05-23 at 13 10 55" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/7f150f51-edf5-4ff7-ac3d-57fc0eee200f">
# 2. CI
- [File setup công cụ (Github Acions)] (https://github.com/ngodanghuy162/vdt-back/blob/main/.github/workflows/CI.yml)
<img width="1053" alt="Screenshot 2024-05-24 at 09 19 13" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/ab1b8bf8-c458-43d5-9876-ba356b52b4b4">
<img width="1053" alt="Screenshot 2024-05-24 at 09 24 13" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/1e3deed4-63c4-442e-a42d-209a0451b490">
<img width="1064" alt="Screenshot 2024-05-24 at 09 41 37" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/07c1a725-d649-4091-88c4-8ca5ca26bad9">
<img width="1050" alt="Screenshot 2024-05-24 at 09 41 51" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/f4f5b13b-dee3-4869-9c4c-befab4d66017">
<img width="1142" alt="Screenshot 2024-05-24 at 09 59 03" src="https://github.com/ngodanghuy162/Viettel-Digital-Talent-2024/assets/100140595/50354bff-4291-4528-9cf2-e65b2a489988">


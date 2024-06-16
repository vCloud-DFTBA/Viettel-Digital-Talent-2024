# Giải pháp ratelimit cho Endpoint của Django Api servie

## Đặt vấn đề
Sử dụng 1 trong số các giải pháp để ratelimit cho Endpoint của api Service, sao cho nếu có  quá 10 request trong 1 phút gửi đến Endpoint của api service thì các request sau đó bị trả về HTTP Response 409 

## Giải pháp thực hiện
Django framework hỗ trợ thư viện django_ratelimit trong việc giới hạn số lượng request trong một khoảng thời gian

django_ratelimit yêu cầu phụ trợ bộ đệm cache:
- Có thể được chia sẻ giữa các worker threads, tiến trình và máy chủ ứng dụng.
- Có thể cài đặt tăng nguyên tử (atomic increment)

- Redis và Memcached có những tính năng này và được hỗ trợ chính thức. Các phần phụ trợ như local memory và filesystem không được chia sẻ giữa các tiến trình hoặc máy chủ

Giải pháp trình bày sử dụng Redis là bộ nhớ cache phụ trợ


Tiến hành cài đặt service redis sử dụng manifests:
- [Configmap](https://github.com/Vinh1507/vdt-db/blob/main/postgres-chart/templates/redis-configmap.yaml)
- [Deployment](https://github.com/Vinh1507/vdt-db/blob/main/postgres-chart/templates/redis-deployment.yaml)
- [Service Node Port](https://github.com/Vinh1507/vdt-db/blob/main/postgres-chart/templates/redis-service.yaml)

### Cài đặt django_ratelimit trong Django Rest API
#### Bổ sung các thư viện cần thiết:
```
# requirement.txt

django-redis==5.4.0
redis==5.0.5
```

#### Cấu hình thêm trong file settings.py
```
# settings.py

INSTALLED_APPS = [
   …
   'django_ratelimit',
]
```
```
CACHES = {
   'default': {
       'BACKEND': 'django_redis.cache.RedisCache',
       'LOCATION': 'redis://<redis-service-name>:6379/1',
       'OPTIONS': {
           'CLIENT_CLASS': 'django_redis.client.DefaultClient',
       }
   }
}
```
#### Trong file views.py, xử lý các request tới endpoint:

Trong các method xử lý endpoint thêm annotation @ratelimit, trong giải pháp này sử dùng @ratelimit(key='ip', rate='10/m', block=True) cho việc giới hạn 10 request trong 1 phút tới endpoint

#### Ví dụ cấu hình rate limit cho endpoint [GET] /api/students/

```
# views.py

from django.http import JsonResponse
from django.http import HttpResponse
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='10/m', block=True)
@api_view(['GET'])
def getStudents(request):
   query = request.GET.get('query')
   if query is None:
       query = ''
   students = Student.objects.filter(Q(full_name__icontains=query)).order_by('id')
   serializer = StudentSerializer(students, many=True)
   return Response(serializer.data)
```

### Nếu vượt quá giới hạn sẽ tự động trả về lỗi 403 Forbiden, custom để trả về response code 409
Để custom response trả về này, thực hiện:

Trong file urls.py của app chính tiến hành customize lại hàm hanlder403 mặc định của Django

```
#urls.py

from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited
from django.http import HttpResponse

def handler403_func(request, exception=None):
   if isinstance(exception, Ratelimited):
       return HttpResponse('Sorry you are blocked', status=409)
   return HttpResponse('Forbidden')

handler403 = handler403_func
```

incase update ip db or be => update docker file

```
docker login

docker build -t vdt-db -f dockerfile.postgres .

docker tag vdt-db  lmhinnoc/vdt-db

docker push lmhinnoc/vdt-db
```

kubectl
```
kubectl apply -f <filename>
kubectl delete -f <filename> 
```

pod

```
kubectl get svc -A
kubectl exec --stdin --tty postgres-go-5456cb9fdf-qwz6x -- /bin/bash

```

fluentbit

```
helm install fluent-bit fluent/fluent-bit -n go-go
KUBE_EDITOR="nano" kubectl edit cm fluent-bit                                                                                               
kubectl get pods -n go-go
kubectl delete -n go-go pod <pod name>
kubectl logs -n go-go --tail=10  fluent-bit-nwhps      
```

haproxy
```
```

prometheus https://spacelift.io/blog/prometheus-operator#what-is-the-prometheus-operator

argocd https://youtu.be/8AJlVQy6Cx0

haproxy https://youtu.be/BRiRMd3dE5A
https://www.haproxy.com/blog/use-helm-to-install-the-haproxy-kubernetes-ingress-controller


vagrant snapshot list
11062024_183921780 : initialize
12062024_023619819 : argocd + prometheus
12062024_023619819 : argocd + auth
13062024_001713162 : argocd + auth + kibana

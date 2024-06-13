# Viettel Digital Talent 2024 - Mini Project
Author: **Đinh Việt Quang**

## Table of Contents 
- [0. Requirements](#0-requirements)
- [1. Kubernetes deployment](#1-kubernetes-deployment)
- [2. K8S helm chart](#2-k8s-helm-chart)
- [3. Continuous delivery](#3-continuous-delivery)
- [4. Monitoring](#4-monitoring)
- [5. Logging](#5-logging)
- [6. Security](#6-security)

## 0. Requirements
- For more information about the project, please take a look at this [link](https://docs.google.com/document/d/1giXBr97e0GVec3Ch18ElYiI_PrbTTqXu6NlX6VnF6v0/edit#heading=h.d18cfdd4km1o).

## 1. Kubernetes deployment
Minikube is used for the following tasks of the mini project thanks to the convenience setup. 
- First of all, install `kubectl`:
```shell
# Download the latest release
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
# Validate the binary
curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
# Install kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Check the version after installed:
```shell
kubectl version --client
```

The output:

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/4.1_k8s_kubectl.jpg)

Next, setup the Minikube
```shell
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

To start the Minikube:
```shell
minikube start
```
To identify the Minikube ip:
```shell
minikube ip
```
The result after successfully installing Minikube:

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/4.2_minikube_complete.jpg)

Minikube ip: [http://192.168.49.2](http://192.168.49.2).
## 2. K8S helm chart
### ArgoCD
First, set up the workspace for the ArgoCD
```shell
kubectl create namespace argocd
kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
To switch into NodePort service
```shell
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```

After that, obtain the password for ArgoCD service
```shell
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
``` 

- All the instructions and command to install the ArgoCD can be found in this [link](https://github.com/argoproj/argo-helm)
- Manifest file can be found [here](https://github.com/helloitsurdvq/VDT2024project/blob/main/argoCDinstall.yml)

The interface of ArgoCD:

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/5.1_argocd_ui.jpg)
### Helm Chart

The helm chart to deploy web and api service is here:
- [web](https://github.com/helloitsurdvq/VDT2024-webFrontend/tree/main/charts)
- [api](https://github.com/helloitsurdvq/VDT2024-api/tree/main/charts)

The config repository for web and api service:
- [web config](https://github.com/helloitsurdvq/VDT2024-web-config)
- [api config](https://github.com/helloitsurdvq/VDT2024-api-config)

The manifest file for web and api service:
- [web manifest](https://github.com/helloitsurdvq/VDT2024project/blob/main/app/web/charts/manifest.yaml)
- [api manifest](https://github.com/helloitsurdvq/VDT2024project/blob/main/app/api/charts/manifest.yaml)

The Screenshot of the ArgoCD system interface on the browser

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/5.2_argo_web.jpg)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/5.3_argo_api.jpg)


- The website can be accessed at [http://192.168.49.2:30080/](http://192.168.49.2:30080/).
- The api can be accessed at [ http://192.168.49.2:30081/]( http://192.168.49.2:30081/).

Small screenshot of browser screen when accessing Web URL, API URL at [http://192.168.49.2:30080/](http://192.168.49.2:30080/) and [http://192.168.49.2:30081/api/trainee](http://192.168.49.2:30081/api/trainee):

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/5.2_argo_web_demo.jpg)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/5.6_argo_api_ui.png)

## 3. Continuous delivery 
GitHub Action CD setup file for web and api service can be found here:
- [webCD.yaml](https://github.com/helloitsurdvq/VDT2024-webFrontend/blob/main/.github/workflows/cd.yaml)
- [apiCD.yaml](https://github.com/helloitsurdvq/VDT2024-api/blob/main/.github/workflows/cd.yaml)

Output log of the CD workflow:
- [webCD.log](https://github.com/helloitsurdvq/VDT2024-webFrontend/blob/main/.github/workflows/webCD.log)
- [apiCD.log](https://github.com/helloitsurdvq/VDT2024-api/blob/main/.github/workflows/apiCD.log)

Here is the web config repo and api config repo:
- [web config](https://github.com/helloitsurdvq/VDT2024-web-config)
- [api config](https://github.com/helloitsurdvq/VDT2024-api-config)

ArgoCD's history image when there are changes in web config repo and api config repo:

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/5.7_argo_diff_web.png)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/5.8_argo_diff_api.png)

## 4. Monitoring
**Overview**: Prometheus is an open-source monitoring and alerting toolkit, which is designed for reliability and scalability. By using the Prometheus Operator, we can simplify the deployment and management of Prometheus in a Kubernetes cluster.

**Prerequisites**
- A running Kubernetes cluster.
- kubectl command-line tool configured to interact with your cluster.
- helm package manager installed.
- minikube for local Kubernetes development (optional).

**Set up source code**

- [prometheus](https://github.com/helloitsurdvq/VDT2024project/tree/main/prometheus)
- [prometheus-operator](https://github.com/helloitsurdvq/VDT2024project/tree/main/prometheus-operator)

**Deployment steps**
```shell
# 1. Add the Prometheus Helm Repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
# 2. Install Prometheus
helm install prometheus prometheus-community/prometheus
# 3. Install Prometheus Operator which will manage the Prometheus instances 
helm install prometheus-operator prometheus-community/kube-prometheus-stack
# 4. Expose the Prometheus service
kubectl apply -f prometheus-operator/namespace.yaml 
kubectl apply --server-side -f prometheus-operator/crds  
kubectl apply --server-side -f prometheus-operator/rbac  
kubectl apply  -f prometheus
```
The outcome of the Prometheus setup:

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/7.1_prometheus_ui.png)

Prometheus website is set up at [http://192.168.49.2:32694](http://192.168.49.2:32694).

This is the result when successfully deploy the web and api monitor service:
![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/7.3_prometheus_deploy.png)

*Note*: Since the default port for nginx web service is 80, and I switched the metrics port to 8081, it caused the downgrade for web service monitor on Prometheus.

=> *Proposed solution*: Change the listening port for nginx to 8081. 
 
## 5. Logging
(To be continued)
## 6. Security
### HAProxy Load balancer
The first thing to do is create a Self-Signed Certificate to use https instead of http 
```shell
# Generate a Self-Signed Certificate
openssl req -x509 -newkey rsa:2048 -nodes -keyout example.com.key -out example.com.crt -days 365

# Create the Directory 
sudo mkdir -p /etc/ssl/private

# Move the Certificate and Key Files
sudo mv example.com.key /etc/ssl/private/
sudo mv example.com.crt /etc/ssl/private/

# Combine Certificate and Key into a PEM File
sudo sh -c 'cat /etc/ssl/private/example.com.crt /etc/ssl/private/example.com.key > /etc/ssl/private/example.com.pem'

# Set Permissions
sudo chmod 640 /etc/ssl/private/example.com.pem
sudo chown root:haproxy /etc/ssl/private/example.com.pem

# Run service
systemctl restart haproxy.service

# Check status
systemctl status haproxy.service
```

The HAproxy config file can be found [here](https://github.com/helloitsurdvq/VDT2024project/blob/main/haproxy/haproxy.cfg).

The address to access the website will be:
- web: [https://192.168.227.48:3001/](https://192.168.227.48:3001/)
- api: [https://192.168.227.48:8081/](https://192.168.227.48:8081/) 

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.1.1_security_haproxy_web.jpg)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.1.2_security_haproxy_api.png)
### Authentication
All the work is located in [api repository](https://github.com/helloitsurdvq/VDT2024-api).

The documentation for this issue can be found [here](https://github.com/helloitsurdvq/VDT2024-api/blob/main/authentication.md).

HTTP Response results when using postman to call URLs when not passing authentication (without jwt):

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.7_security_notoken.jpg)

Login process and HTTP Response results when using postman to call URLs when passing authentication (with jwt):

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.1_security_login_admin.jpg)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.8_security_withtoken.jpg)

Route authorization details can be summarized as followed:
- Admin gains full access to all CRUD operations, while Trainee is strictly limited to read-only access (GET requests) and forbidden from creating, updating, or deleting resources.
- `authMiddleware`: Must be authenticated.
- `roleMiddleware`: Requires role-based authorization.
- GET `/` (Get all trainees): Accessible to everyone without authentication.
- GET `/:id` (Get one trainee): Requires the user to be authenticated (logging in), no role-specific restrictions are applied; both trainee and admin roles can access this endpoint.
- POST `/` (Create a new trainee), PUT `/:id` (Update a trainee), DELETE `/:id` (Delete a trainee): Requires the user to be authenticated, allows `admin` to create, update, delete a new trainee and forbids `trainee` from doing these things.

```javascript
const express = require('express');
const traineeController = require("../controllers/traineeController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const router = express.Router();

router.use(rateLimitMiddleware);

router.get("/", traineeController.getAllTrainees);
router.get("/:id", authMiddleware, traineeController.getOneTrainee);
router.post("/", authMiddleware, roleMiddleware, traineeController.saveTrainee);
router.put("/:id", authMiddleware, roleMiddleware, traineeController.updateTrainee);
router.delete("/:id", authMiddleware, roleMiddleware, traineeController.deleteTrainee);

module.exports = router;
```
Some examples:
- Everyone can view trainee list

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.2_security_getall.jpg)

- Only admin can add new trainee

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.4_security_savetrainee_fail.jpg)

- Trainee can view a trainee.

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.5_security_gettrainee_success.jpg)

- Trainee are not alllowed to delete resources

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.2.6_security_deletetrainee_fail.jpg)
### Endpoint rate limitation
The documentation for this issue can be found [here](https://github.com/helloitsurdvq/VDT2024-api/blob/main/rateLimitation.md).

To implement rate limiting strategy for the api service, the `express-rate-limit` are used. This package primarily uses implementation that can be considered as a combination of the **token bucket** and **leaky bucket** algorithms. It provides the following features:

- *Fixed Window Counter*: tracks the number of requests in a fixed time window (e.g., 1 minute). When the window expires, the count resets.
- *Sliding Window Counter*: can be configured to track requests in a sliding window, providing a more dynamic view of the request rate.
- *Burst Handling*: by setting the 'max' value, the middleware can handle bursts of traffic up to the specified limit within the given time window (windowMs).

This middleware allows to set up rate limiting rules easily, helps to ensure that the application can handle a high volume of requests without getting overwhelmed.

```shell
# Install package
npm install express-rate-limit
```

The source code to deal with the issue can be found [here](https://github.com/helloitsurdvq/VDT2024-api).

```javascript
const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  handler: (req, res) => {
    res.status(409).send({ message: 'Too many requests, please try again later.' });
  },
});

module.exports = rateLimitMiddleware;
```
Explain:
- `windowMs` specifies the duration of the time window.
- `max` specifies the maximum number of requests allowed within the time window.
- `handler` is a custom response when the rate limit is exceeded.
- Usage: The configured middleware is exported and can be applied to the application or specific routes to enforce rate limiting.

```javascript
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const router = express.Router();

router.use(rateLimitMiddleware);

module.exports = router;
```

If the limit is exceeded, the client will receive a `409 Conflict` response. This helps in preventing abuse and managing traffic effectively.

The outcome when testing on Postman:

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.3_security_manyreqs.jpg)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.4_security_manyreqs_log.png)
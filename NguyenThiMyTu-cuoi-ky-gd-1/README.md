# Implementation of Kubernetes

## Requirements:
- Successfully deploy Kubernetes using **kubeadm** on MacOS : 1 master node VM + 1 worker node VM

## Output:

### Installation Documentation:
Vagrantfile script and YAML settings file are used to set up a Kubernetes cluster using **Vagrant** and **VMware Fusion Tech Preview 2023** as the virtualization provider. Here's a detailed explanation:

**common.sh**: For both Master Node and Worker Node:
```sh
#!/bin/bash
#
# Common setup for all servers (Control Plane and Nodes)

set -euxo pipefail

# Variable Declaration

# DNS Setting
if [ ! -d /etc/systemd/resolved.conf.d ]; then
	sudo mkdir /etc/systemd/resolved.conf.d/
fi
cat <<EOF | sudo tee /etc/systemd/resolved.conf.d/dns_servers.conf
[Resolve]
DNS=${DNS_SERVERS}
EOF

sudo systemctl restart systemd-resolved

# disable swap
sudo swapoff -a

# keeps the swaf off during reboot
(crontab -l 2>/dev/null; echo "@reboot /sbin/swapoff -a") | crontab - || true
sudo apt-get update -y


# Create the .conf file to load the modules at bootup
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system

## Install CRIO Runtime

sudo apt-get update -y
apt-get install -y software-properties-common curl apt-transport-https ca-certificates

curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/ /" |
    tee /etc/apt/sources.list.d/cri-o.list

sudo apt-get update -y
sudo apt-get install -y cri-o

sudo systemctl daemon-reload
sudo systemctl enable crio --now
sudo systemctl start crio.service

echo "CRI runtime installed susccessfully"

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v$KUBERNETES_VERSION_SHORT/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v$KUBERNETES_VERSION_SHORT/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list


sudo apt-get update -y
sudo apt-get install -y kubelet="$KUBERNETES_VERSION" kubectl="$KUBERNETES_VERSION" kubeadm="$KUBERNETES_VERSION"
sudo apt-get update -y
sudo apt-get install -y jq

local_ip="$(ip --json a s | jq -r '.[] | if .ifname == "eth1" then .addr_info[] | if .family == "inet" then .local else empty end else empty end')"
cat > /etc/default/kubelet << EOF
KUBELET_EXTRA_ARGS=--node-ip=$local_ip
${ENVIRONMENT}
EOF
```

**controlplane.sh**: Setup for Master servers
```sh
set -euxo pipefail

NODENAME=$(hostname -s)

sudo kubeadm config images pull

echo "Preflight Check Passed: Downloaded All Required Images"

sudo kubeadm init --apiserver-advertise-address=$CONTROL_IP --apiserver-cert-extra-sans=$CONTROL_IP --pod-network-cidr=$POD_CIDR --service-cidr=$SERVICE_CIDR --node-name "$NODENAME" --ignore-preflight-errors Swap

mkdir -p "$HOME"/.kube
sudo cp -i /etc/kubernetes/admin.conf "$HOME"/.kube/config
sudo chown "$(id -u)":"$(id -g)" "$HOME"/.kube/config

# Save Configs to shared /Vagrant location

# For Vagrant re-runs, check if there is existing configs in the location and delete it for saving new configuration.

config_path="/vagrant/configs"

if [ -d $config_path ]; then
  rm -f $config_path/*
else
  mkdir -p $config_path
fi

cp -i /etc/kubernetes/admin.conf $config_path/config
touch $config_path/join.sh
chmod +x $config_path/join.sh

kubeadm token create --print-join-command > $config_path/join.sh

# Install Calico Network Plugin

curl https://raw.githubusercontent.com/projectcalico/calico/v${CALICO_VERSION}/manifests/calico.yaml -O

kubectl apply -f calico.yaml

sudo -i -u vagrant bash << EOF
whoami
mkdir -p /home/vagrant/.kube
sudo cp -i $config_path/config /home/vagrant/.kube/
sudo chown 1000:1000 /home/vagrant/.kube/config
echo "alias k='kubectl'" >> ~/.bashrc
EOF

# Install Metrics Server

kubectl apply -f https://raw.githubusercontent.com/techiescamp/kubeadm-scripts/main/manifests/metrics-server.yaml

```

**node.sh**: Setup for Node server
```sh
set -euxo pipefail

config_path="/vagrant/configs"

/bin/bash $config_path/join.sh -v

sudo -i -u vagrant bash << EOF

whoami
mkdir -p /home/vagrant/.kube
sudo cp -i $config_path/config /home/vagrant/.kube/
sudo chown 1000:1000 /home/vagrant/.kube/config
NODENAME=$(hostname -s)

kubectl label node $(hostname -s) node-role.kubernetes.io/worker=worker

EOF

```
**Vagrantfile**:
```sh
require "yaml"
vagrant_root = File.dirname(File.expand_path(__FILE__))
settings = YAML.load_file "#{vagrant_root}/settings.yaml"

IP_SECTIONS = settings["network"]["control_ip"].match(/^([0-9.]+\.)([^.]+)$/)
# First 3 octets including the trailing dot:
IP_NW = IP_SECTIONS.captures[0]
# Last octet excluding all dots:
IP_START = Integer(IP_SECTIONS.captures[1])
NUM_WORKER_NODES = settings["nodes"]["workers"]["count"]

Vagrant.configure("2") do |config|
  config.vm.provision "shell", env: { "IP_NW" => IP_NW, "IP_START" => IP_START, "NUM_WORKER_NODES" => NUM_WORKER_NODES }, inline: <<-SHELL
      apt-get update -y
      echo "$IP_NW$((IP_START)) controlplane" >> /etc/hosts
      for i in `seq 1 ${NUM_WORKER_NODES}`; do
        echo "$IP_NW$((IP_START+i)) node0${i}" >> /etc/hosts
      done
  SHELL

  config.vm.box = settings["software"]["box"]

  config.vm.box_check_update = true

  config.vm.define "controlplane" do |controlplane|
    controlplane.vm.hostname = "controlplane"
    controlplane.vm.network "private_network", ip: settings["network"]["control_ip"]
    if settings["shared_folders"]
      settings["shared_folders"].each do |shared_folder|
        controlplane.vm.synced_folder shared_folder["host_path"], shared_folder["vm_path"]
      end
    end
    controlplane.vm.provider "vmware_fusion" do |vb|
        vb.cpus = settings["nodes"]["control"]["cpu"]
        vb.memory = settings["nodes"]["control"]["memory"]
    end
    controlplane.vm.provision "shell",
      env: {
        "DNS_SERVERS" => settings["network"]["dns_servers"].join(" "),
        "ENVIRONMENT" => settings["environment"],
        "KUBERNETES_VERSION" => settings["software"]["kubernetes"],
        "KUBERNETES_VERSION_SHORT" => settings["software"]["kubernetes"][0..3],
        "OS" => settings["software"]["os"]
      },
      path: "scripts/common.sh"
    controlplane.vm.provision "shell",
      env: {
        "CALICO_VERSION" => settings["software"]["calico"],
        "CONTROL_IP" => settings["network"]["control_ip"],
        "POD_CIDR" => settings["network"]["pod_cidr"],
        "SERVICE_CIDR" => settings["network"]["service_cidr"]
      },
      path: "scripts/controlplane.sh"
  end

  (1..NUM_WORKER_NODES).each do |i|

    config.vm.define "node0#{i}" do |node|
      node.vm.hostname = "node0#{i}"
      node.vm.network "private_network", ip: IP_NW + "#{IP_START + i}"
      if settings["shared_folders"]
        settings["shared_folders"].each do |shared_folder|
          node.vm.synced_folder shared_folder["host_path"], shared_folder["vm_path"]
        end
      end
      node.vm.provider "vmware_fusion" do |vb|
          vb.cpus = settings["nodes"]["workers"]["cpu"]
          vb.memory = settings["nodes"]["workers"]["memory"]
      end
      node.vm.provision "shell",
        env: {
          "DNS_SERVERS" => settings["network"]["dns_servers"].join(" "),
          "ENVIRONMENT" => settings["environment"],
          "KUBERNETES_VERSION" => settings["software"]["kubernetes"],
          "KUBERNETES_VERSION_SHORT" => settings["software"]["kubernetes"][0..3],
          "OS" => settings["software"]["os"]
        },
        path: "scripts/common.sh"
      node.vm.provision "shell", path: "scripts/node.sh"

      # Only install the dashboard after provisioning the last worker (and when enabled).
      if i == NUM_WORKER_NODES and settings["software"]["dashboard"] and settings["software"]["dashboard"] != ""
        node.vm.provision "shell", path: "scripts/dashboard.sh"
      end
    end

  end
end 
```
**settings.yaml**:
```sh
# cluster_name is used to group the nodes in a folder within VirtualBox:
cluster_name: Kubernetes Cluster
# Uncomment to set environment variables for services such as crio and kubelet.
# For example, configure the cluster to pull images via a proxy.
# environment: |
#   HTTP_PROXY=http://my-proxy:8000
#   HTTPS_PROXY=http://my-proxy:8000
#   NO_PROXY=127.0.0.1,localhost,master-node,node01,node02,node03
# All IPs/CIDRs should be private and allowed in /etc/vbox/networks.conf.
network:
  # Worker IPs are simply incremented from the control IP.
  control_ip: 10.0.0.10
  dns_servers:
  - 8.8.8.8
  - 1.1.1.1
  pod_cidr: 172.16.1.0/16
  service_cidr: 172.17.1.0/18
nodes:
  control:
    cpu: 2
    memory: 4096
  workers:
    count: 1
    cpu: 1
    memory: 2048
# Mount additional shared folders from the host into each virtual machine.
# Note that the project directory is automatically mounted at /vagrant.
# shared_folders:
#   - host_path: ../images
#     vm_path: /vagrant/images
software:
  box: bento/ubuntu-22.04
  calico: 3.26.0
  # To skip the dashboard installation, set its version to an empty value or comment it out:
  dashboard: 2.7.0
  kubernetes: 1.29.0-*
```
**Bring Up the Cluster**: To provision the cluster, execute the following command.
```sh
sudo vagrant up
sugo vagrant ssh controlplane
```

### Logs of System Check Commands:
<img src= images/setup-k8s/masterNode-workerNode.png>

# K8S Helm Chart

## Requirements:

### Requirement 1:
- Install ArgoCD on the Kubernetes Cluster, and expose ArgoCD through NodePort.
  ## Output:
  ### Manifest file used to deploy ArgoCD to K8S Cluster: [here](https://github.com/jasmine150720/output/blob/main/images/argo-cd/setup/values.yaml)
  **Expose ArgoCD through NodePort: 30080**
    <img src= images/argo-cd/setup/set_NodePort.png>

  **Sucessfully deploy ArgoCD on K8s Cluster**:
  <img src= images/argo-cd/setup/successfull_deployment.png>

  **Get all objects**:
  <img src= images/argo-cd/setup/allObjects.png>

  **ArgoCD homesreen on NodePort 30080**:
  <img src= images/argo-cd/setup/homescreen-ArgoCD.png>
  
### Requirement 2:
  - Write 2 Helm Charts for web Deployment and api Deployment, each in their own folder within the web and api repos.
  - Create 2 Config Repos for web and api, containing values.yaml files with configurations needed to run web and api on Kubernetes using Helm Charts.
  - Utilize Argo CD's multiple sources feature to deploy these web and api services to the Kubernetes Cluster.

  ## Output:
  ### Helm chart for api deployment: [here](https://github.com/jasmine150720/vdt2024-api/tree/main/api-helm-chart)
  ### helm chart for web deployment: [here](https://github.com/jasmine150720/vdt2024-web/tree/main/web-helm-chart)
  ### Api config repo: [here](https://github.com/jasmine150720/api-config-repo)
  ### Web config repo: [here](https://github.com/jasmine150720/web-config-repo)
  ### Manifest files to Utilize Argo CD's multiple sources feature:
  `api-multisource.yaml`:
```sh
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: helm-api-multisource
  namespace: argocd
spec:
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
  destination:
    server: https://kubernetes.default.svc
    namespace: helm-web-multisource
  sources:
    - repoURL: https://github.com/jasmine150720/vdt2024-api
      path: api-helm-chart
      targetRevision: HEAD
      helm:
        valueFiles:
          - $values/values.yaml
    - repoURL: 'https://github.com/jasmine150720/api-config-repo'
      targetRevision: HEAD
      ref: values
```
  `web-multisource.yaml`:
```sh
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: helm-web-multisource
  namespace: argocd
spec:
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
  destination:
    server: https://kubernetes.default.svc
    namespace: helm-web-multisource
  sources:
    - repoURL: https://github.com/jasmine150720/vdt2024-web
      path: web-helm-chart
      targetRevision: HEAD
      helm:
        valueFiles:
          - $values/values.yaml
    - repoURL: 'https://github.com/jasmine150720/web-config-repo'
      targetRevision: HEAD
      ref: values
```
  
  ### Screenshot of ArgoCD interface on the browser:
  **Api Deployment**:
  <img src= images/argo-cd/deploying-app/argocd-api.png>
  **Web Deployment**:
  <img src= images/argo-cd/deploying-app/argocd-web.png>
  ### Screenshot of browser  when accessing Web URL, API URL:
  **Api Deployment on NodePort 30101**:
  <img src= images/argo-cd/deploying-app/api-deployment.png>
  **Web Deployment on NodePort 30100**:
  <img src= images/argo-cd/deploying-app/web-deployment.png>
  
# Continuous Delivery
## Requirements: 
Create 2 CI/CD pipelines for the web and api repos. When a new tag is created in one of these repos, the corresponding deployment pipeline should perform the following tasks:
- Build the Docker image with the image tag set to the tag name created on GitLab, and push the built Docker image to Docker Hub.
- Update the image version in the values.yaml file in the config repo and push the changes to the config repo.
- Configure ArgoCD to automatically redeploy the web Deployment and api Deployment when changes are detected in the config repo.
## Output:
### CD set up files: 
**Note:** Remember to set up the SSH key to access the server remotely.

`.gitlab-ci.yml`: For api repo
```sh
stages:
  - build
  - update_helm_chart

variables:
  APP_NAME: "api"
  IMAGE_TAG: "registry.gitlab.com/jasmine150720/vdt2024-api/$APP_NAME:$CI_COMMIT_SHORT_SHA"

build_image:
  image: docker
  stage: build
  services:
    - docker:dind
  script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - docker build -t "$IMAGE_TAG" .
    - docker push "$IMAGE_TAG"

update_helm_chart:
  stage: update_helm_chart
  image: ubuntu:22.04
  before_script:
    - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client git -y )'
    - mkdir -p /root/.ssh
    - echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa
    - chmod 600 /root/.ssh/id_rsa
    - ssh-keyscan -H gitlab.com >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
    # run ssh-agent
    - eval $(ssh-agent -s)
    # add ssh key stored in SSH_PRIVATE_KEY variable to the agent store
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    # Git
    - git config --global user.email "gitlab-ci@gmail.com"
    - git config --global user.name "gitlab-ci"
    - git clone git@gitlab.com:jasmine150720/api-config-repo.git
    - cd api-config-repo
    - ls -latr
  script:
    # Update Image TAG
    - sed -i "s/api:.*/api:${CI_COMMIT_SHORT_SHA}/g" values.yaml
    - git add values.yaml
    - git commit -am "Update Image"
    - git push
```
`.gitlab-ci.yml`: For web repo
```sh
stages:
  - build
  - update_helm_chart

variables:
  APP_NAME: "web"
  IMAGE_TAG: "registry.gitlab.com/jasmine150720/vdt2024-web/$APP_NAME:$CI_COMMIT_SHORT_SHA"

build_image:
  image: docker
  stage: build
  services:
    - docker:dind
  script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - docker build -t "$IMAGE_TAG" .
    - docker push "$IMAGE_TAG"

update_helm_chart:
  stage: update_helm_chart
  image: ubuntu:22.04
  before_script:
    - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client git -y )'
    - mkdir -p /root/.ssh
    - echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa
    - chmod 600 /root/.ssh/id_rsa
    - ssh-keyscan -H gitlab.com >> ~/.ssh/known_hosts
    - chmod 644 ~/.ssh/known_hosts
    # run ssh-agent
    - eval $(ssh-agent -s)
    # add ssh key stored in SSH_PRIVATE_KEY variable to the agent store
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    # Git
    - git config --global user.email "gitlab-ci@gmail.com"
    - git config --global user.name "gitlab-ci"
    - git clone git@gitlab.com:jasmine150720/web-config-repo.git
    - cd web-config-repo
    - ls -latr
  script:
    # Update Image TAG
    - sed -i "s/web:.*/web:${CI_COMMIT_SHORT_SHA}/g" values.yaml
    - git add values.yaml
    - git commit -am "Update Image"
    - git push
```
### Logs of CD piplines when creating new tags on web repo and api repo:
#### Api Logs:
<img src= images/CI-CD/api.png>
<img src= images/CI-CD/api-build-image.png>
<img src= images/CI-CD/api-update-helmchart.png>
<img src= images/CI-CD/api-images.png>
<img src= images/CI-CD/api-tagname.png>

#### Web Logs:
<img src= images/CI-CD/web_build_image.png>
<img src= images/CI-CD/web_update_helm_chart.png>
<img src= images/CI-CD/web-images.png>
<img src= images/CI-CD/web-tagname.png>

# Monitoring
## Requirements:
- Expose metrics of web service and API service via one HTTP path
- Deploy Prometheus on Kubernetes Cluster using Prometheus Operator, exposing it as NodePort
- Utilize Prometheus Operator's Service Monitor to monitor Web Deployment and API Deploymen

## Output:
### Api get metrics:
**Install Required Packages**:
First, Install prometheus-fastapi-instrumentator package, which simplifies the integration of Prometheus metrics into FastAPI.
```sh
pip install prometheus-fastapi-instrumentator
```
**Import Required Modules**:
```sh
from prometheus_fastapi_instrumentator import Instrumentator
```
**Configure Prometheus Instrumentator**:
```sh
instrumentator = Instrumentator()
instrumentator.instrument(app)
```
**Define Metrics Endpoint**:
```sh
@app.get("/metrics")
async def get_metrics():
    from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
    from starlette.responses import Response

    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
```
### Web get metrics:
**Change Nginx configuration**:
```sh
server {
    listen 8888;

    location / {
        proxy_pass http://react:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /metrics {
        stub_status on;
        access_log off;
        allow 127.17.29.120;  
        deny all;
    }
}
```
### Deploy Prometheus on Kubernetes Cluster
**Installing the operator**:
Run the following commands to install the Custom Resource Definitions and deploy the operator in the default namespace:
```sh
LATEST=$(curl -s https://api.github.com/repos/prometheus-operator/prometheus-operator/releases/latest | jq -cr .tag_name)
curl -sL https://github.com/prometheus-operator/prometheus-operator/releases/download/${LATEST}/bundle.yaml | kubectl create -f -
```

It can take a few minutes for the operator to be up and running. Check for completion with the following command:
```sh
kubectl wait --for=condition=Ready pods -l  app.kubernetes.io/name=prometheus-operator -n default
```
### Monitoring Web Deployment and API Deployment
<img src= images/monitoring.png>

# Logging & Security: 
Unfortunately, I don't have enough time to complete those parts, so I just simply leave my prayer here.
<img src= images/praygecover.jpg>


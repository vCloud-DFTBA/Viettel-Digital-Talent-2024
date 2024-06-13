Started by user Bui Hoang Vinh
Replayed #63
09:03:22 Connecting to https://api.github.com using Vinh1507/****** (github-acc)
Obtained Jenkinsfile from acec88b641613af8e7f26ebb8db30d2f34ceed12
[Pipeline] Start of Pipeline
[Pipeline] echo
env.CHANGE_TARGET: null
[Pipeline] echo
env.BRANCH_NAME: main
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/vdt_api_main
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Declarative: Checkout SCM)
[Pipeline] checkout
Selected Git installation does not exist. Using Default
The recommended git tool is: NONE
using credential e1915343-3fda-44a9-a636-a8a8406f7777
Cloning the remote Git repository
Cloning with configured refspecs honoured and without tags
Cloning repository https://github.com/Vinh1507/vdt-api.git
 > git init /var/jenkins_home/workspace/vdt_api_main # timeout=10
Fetching upstream changes from https://github.com/Vinh1507/vdt-api.git
 > git --version # timeout=10
 > git --version # 'git version 2.39.2'
using GIT_ASKPASS to set credentials github-acc
 > git fetch --no-tags --force --progress -- https://github.com/Vinh1507/vdt-api.git +refs/heads/main:refs/remotes/origin/main # timeout=10
 > git config remote.origin.url https://github.com/Vinh1507/vdt-api.git # timeout=10
 > git config --add remote.origin.fetch +refs/heads/main:refs/remotes/origin/main # timeout=10
Avoid second fetch
Checking out Revision acec88b641613af8e7f26ebb8db30d2f34ceed12 (main)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f acec88b641613af8e7f26ebb8db30d2f34ceed12 # timeout=10
Commit message: "Update service.yaml"
 > git rev-list --no-walk acec88b641613af8e7f26ebb8db30d2f34ceed12 # timeout=10
[Pipeline] }
[Pipeline] // stage
[Pipeline] withEnv
[Pipeline] {
[Pipeline] withEnv
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Checkout)
[Pipeline] script
[Pipeline] {
[Pipeline] echo
Clone code from branch main
[Pipeline] git
Selected Git installation does not exist. Using Default
The recommended git tool is: NONE
No credentials specified
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/vdt_api_main/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/Vinh1507/vdt-api # timeout=10
Fetching upstream changes from https://github.com/Vinh1507/vdt-api
 > git --version # timeout=10
 > git --version # 'git version 2.39.2'
 > git fetch --tags --force --progress -- https://github.com/Vinh1507/vdt-api +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/main^{commit} # timeout=10
Checking out Revision acec88b641613af8e7f26ebb8db30d2f34ceed12 (refs/remotes/origin/main)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f acec88b641613af8e7f26ebb8db30d2f34ceed12 # timeout=10
 > git branch -a -v --no-abbrev # timeout=10
 > git checkout -b main acec88b641613af8e7f26ebb8db30d2f34ceed12 # timeout=10
Commit message: "Update service.yaml"
[Pipeline] }
[Pipeline] // script
[Pipeline] script
[Pipeline] {
[Pipeline] sh
+ git describe --tags --abbrev=0
[Pipeline] echo
Tag version: v2.12
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build Image)
[Pipeline] script
[Pipeline] {
[Pipeline] echo
Image version: vinhbh/vdt_api:v2.12
[Pipeline] sh
+ docker build -t vinhbh/vdt_api:v2.12 ./vdt_api
#0 building with "default" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 177B done
#1 DONE 0.0s

#2 [internal] load metadata for docker.io/library/python:3.11
#2 DONE 1.2s

#3 [internal] load .dockerignore
#3 transferring context: 2B done
#3 DONE 0.0s

#4 [internal] load build context
#4 transferring context: 29.47kB done
#4 DONE 0.0s

#5 [1/5] FROM docker.io/library/python:3.11@sha256:916df9a923e94407113e1a40ba20acf4f6c3ec56147cb9ba19a2f7e4499dfbde
#5 resolve docker.io/library/python:3.11@sha256:916df9a923e94407113e1a40ba20acf4f6c3ec56147cb9ba19a2f7e4499dfbde 0.0s done
#5 DONE 0.0s

#6 [2/5] WORKDIR /app
#6 CACHED

#7 [3/5] COPY requirements.txt /app/
#7 CACHED

#8 [4/5] RUN pip install --no-cache-dir -r requirements.txt
#8 CACHED

#9 [5/5] COPY . /app/
#9 CACHED

#10 exporting to image
#10 exporting layers done
#10 writing image sha256:1775ae97224b7c810f1f3e4db2ad1b266b463943743853675ea69db684f35844 done
#10 naming to docker.io/vinhbh/vdt_api:v2.12 done
#10 DONE 0.0s
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Run Tests)
[Pipeline] script
[Pipeline] {
[Pipeline] isUnix
[Pipeline] withEnv
[Pipeline] {
[Pipeline] sh
+ docker inspect -f . vinhbh/vdt_api:v2.12
.
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] withDockerContainer
Jenkins seems to be running inside container 2b360feb04b4bae507ee4f6ffdd6eee9744e47145fa42d7cd9bea7b610232937
$ docker run -t -d -u 0:0 -e DATABASE_NAME=vdt_db -e DATABASE_USER=vinhbh -e DATABASE_PASSWORD=123456789 -e DATABASE_HOST=192.168.144.143 -e DATABASE_PORT=31495 -w /var/jenkins_home/workspace/vdt_api_main --volumes-from 2b360feb04b4bae507ee4f6ffdd6eee9744e47145fa42d7cd9bea7b610232937 -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** -e ******** vinhbh/vdt_api:v2.12 cat
$ docker top e09a8c7c472cc8a6c04c5d3160107c19ee9bedcdb2201c85075a350cd8dd5a5d -eo pid,comm
[Pipeline] {
[Pipeline] sh
+ cd /app
+ python manage.py test -v 2
Creating test database for alias 'default' ('testing_vdt_db')...
Found 9 test(s).
Operations to perform:
  Synchronize unmigrated apps: corsheaders, django_prometheus, messages, rest_framework, staticfiles
  Apply all migrations: admin, auth, base, contenttypes, sessions
Synchronizing apps without migrations:
  Creating tables...
    Running deferred SQL...
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying base.0001_initial... OK
  Applying base.0002_alter_student_table... OK
  Applying base.0003_alter_student_gender_alter_student_school... OK
  Applying base.0006_insert_student_table... OK
  Applying sessions.0001_initial... OK
System check identified some issues:

WARNINGS:
?: (urls.W002) Your URL pattern '/' [name='api_list'] has a route beginning with a '/'. Remove this slash as it is unnecessary. If this pattern is targeted in an include(), ensure the include() pattern has a trailing '/'.

System check identified 1 issue (0 silenced).
test_create_invalid_student (base.tests.StudentAPITest.test_create_invalid_student) ... ok
test_create_valid_student (base.tests.StudentAPITest.test_create_valid_student) ... ok
test_delete_invalid_student (base.tests.StudentAPITest.test_delete_invalid_student) ... ok
test_delete_valid_student (base.tests.StudentAPITest.test_delete_valid_student) ... ok
test_get_all_students (base.tests.StudentAPITest.test_get_all_students) ... ok
test_get_detail_invalid_student (base.tests.StudentAPITest.test_get_detail_invalid_student) ... ok
test_get_detail_valid_student (base.tests.StudentAPITest.test_get_detail_valid_student) ... ok
test_update_invalid_student (base.tests.StudentAPITest.test_update_invalid_student) ... ok
test_update_valid_student (base.tests.StudentAPITest.test_update_valid_student) ... ok

----------------------------------------------------------------------
Ran 9 tests in 0.139s

OK
Destroying test database for alias 'default' ('testing_vdt_db')...
144
[Pipeline] }
$ docker stop --time=1 e09a8c7c472cc8a6c04c5d3160107c19ee9bedcdb2201c85075a350cd8dd5a5d
$ docker rm -f --volumes e09a8c7c472cc8a6c04c5d3160107c19ee9bedcdb2201c85075a350cd8dd5a5d
[Pipeline] // withDockerContainer
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Push to Docker Hub)
[Pipeline] withCredentials
Masking supported pattern matches of $DOCKER_PASSWORD
[Pipeline] {
[Pipeline] sh
+ docker login -u hoangvinh1577@gmail.com -p ****
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
[Pipeline] }
[Pipeline] // withCredentials
[Pipeline] sh
+ docker push vinhbh/vdt_api:v2.12
The push refers to repository [docker.io/vinhbh/vdt_api]
fe5bf90d2a3c: Preparing
01cfd77808ea: Preparing
5387d20f9f40: Preparing
ce6e05e52fa2: Preparing
4a40ad7ca2cf: Preparing
064ffeaf7830: Preparing
28f8d0721800: Preparing
cbe4fb5e267b: Preparing
734c0f0b65c2: Preparing
8845ab872c1c: Preparing
d7d4c2f9d26b: Preparing
bbe1a212f7e9: Preparing
28f8d0721800: Waiting
064ffeaf7830: Waiting
734c0f0b65c2: Waiting
8845ab872c1c: Waiting
cbe4fb5e267b: Waiting
d7d4c2f9d26b: Waiting
bbe1a212f7e9: Waiting
fe5bf90d2a3c: Layer already exists
4a40ad7ca2cf: Layer already exists
ce6e05e52fa2: Layer already exists
01cfd77808ea: Layer already exists
5387d20f9f40: Layer already exists
28f8d0721800: Layer already exists
064ffeaf7830: Layer already exists
cbe4fb5e267b: Layer already exists
734c0f0b65c2: Layer already exists
8845ab872c1c: Layer already exists
d7d4c2f9d26b: Layer already exists
bbe1a212f7e9: Layer already exists
v2.12: digest: sha256:ce0fd1ee0573791c9403ea7608a67562790e5ac3cf3c06d83edfc96842d3700f size: 2840
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Clone Repo Config)
[Pipeline] echo
Clone code from branch main
[Pipeline] git
The recommended git tool is: NONE
using credential github-token-v3
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/vdt_api_main/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/Vinh1507/vdt-api-config # timeout=10
Fetching upstream changes from https://github.com/Vinh1507/vdt-api-config
 > git --version # timeout=10
 > git --version # 'git version 2.39.2'
using GIT_ASKPASS to set credentials github-token-v3
 > git fetch --tags --force --progress -- https://github.com/Vinh1507/vdt-api-config +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/main^{commit} # timeout=10
Checking out Revision efd1a7c1824aa4d3e90fc0b713d1ba00e1108519 (refs/remotes/origin/main)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f efd1a7c1824aa4d3e90fc0b713d1ba00e1108519 # timeout=10
 > git branch -a -v --no-abbrev # timeout=10
 > git branch -D main # timeout=10
 > git checkout -b main efd1a7c1824aa4d3e90fc0b713d1ba00e1108519 # timeout=10
Commit message: "Update values-prod.yaml"
 > git rev-list --no-walk 4f0688c467a3240ec02a257750fa807e4919b69d # timeout=10
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Modify file helm values)
[Pipeline] script
[Pipeline] {
[Pipeline] sh
+ sed -i s/^  tag.*/  tag: "v2.12"/ helm-values/values-prod.yaml
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Push changes to config repo)
[Pipeline] sh
+ git add .
[Pipeline] sh
+ git commit -m Update helm values with new image version
[main 8d9bc57] Update helm values with new image version
 1 file changed, 1 insertion(+), 1 deletion(-)
[Pipeline] sh
+ git config --global user.email hoangvinh1577@gmail.com
[Pipeline] sh
+ git config --global user.name VinhBh
[Pipeline] withCredentials
 > git --version # timeout=10
 > git --version # 'git version 2.39.2'
Masking supported pattern matches of $GIT_PASSWORD or $GIT_ASKPASS
[Pipeline] {
[Pipeline] sh
+ git push -u origin main
To https://github.com/Vinh1507/vdt-api-config
   efd1a7c..8d9bc57  main -> main
branch 'main' set up to track 'origin/main'.
[Pipeline] }
[Pipeline] // withCredentials
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Declarative: Post Actions)
[Pipeline] cleanWs
[WS-CLEANUP] Deleting project workspace...
[WS-CLEANUP] Deferred wipeout is used...
[WS-CLEANUP] done
[Pipeline] echo
All tests passed!
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline

Could not update commit status, please check if your scan credentials belong to a member of the organization or a collaborator of the repository and repo:status scope is selected


GitHub has been notified of this commit’s build result

Finished: SUCCESS
Branch indexing
05:22:11 Connecting to https://api.github.com using hoangvinh1577@gmail.com/******
Obtained Jenkinsfile from 921d7bf17a57b380692947d43444f36359512d23
[Pipeline] Start of Pipeline
[Pipeline] echo
env.CHANGE_TARGET: null
[Pipeline] echo
env.BRANCH_NAME: main
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/vdt-web_main
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Declarative: Checkout SCM)
[Pipeline] checkout
The recommended git tool is: NONE
using credential github_Vinh1507
Cloning the remote Git repository
Cloning with configured refspecs honoured and without tags
Cloning repository https://github.com/Vinh1507/vdt-web.git
 > git init /var/jenkins_home/workspace/vdt-web_main # timeout=10
Fetching upstream changes from https://github.com/Vinh1507/vdt-web.git
 > git --version # timeout=10
 > git --version # 'git version 2.39.2'
using GIT_ASKPASS to set credentials 
 > git fetch --no-tags --force --progress -- https://github.com/Vinh1507/vdt-web.git +refs/heads/main:refs/remotes/origin/main # timeout=10
 > git config remote.origin.url https://github.com/Vinh1507/vdt-web.git # timeout=10
 > git config --add remote.origin.fetch +refs/heads/main:refs/remotes/origin/main # timeout=10
Avoid second fetch
Checking out Revision 921d7bf17a57b380692947d43444f36359512d23 (main)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 921d7bf17a57b380692947d43444f36359512d23 # timeout=10
Commit message: "Update Jenkinsfile"
 > git rev-list --no-walk c1fc18220c6a6fa6b15572218d0dd021c6e35b5d # timeout=10
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
The recommended git tool is: NONE
No credentials specified
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/vdt-web_main/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/Vinh1507/vdt-web # timeout=10
Fetching upstream changes from https://github.com/Vinh1507/vdt-web
 > git --version # timeout=10
 > git --version # 'git version 2.39.2'
 > git fetch --tags --force --progress -- https://github.com/Vinh1507/vdt-web +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/main^{commit} # timeout=10
Checking out Revision 921d7bf17a57b380692947d43444f36359512d23 (refs/remotes/origin/main)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 921d7bf17a57b380692947d43444f36359512d23 # timeout=10
 > git branch -a -v --no-abbrev # timeout=10
 > git checkout -b main 921d7bf17a57b380692947d43444f36359512d23 # timeout=10
Commit message: "Update Jenkinsfile"
[Pipeline] }
[Pipeline] // script
[Pipeline] script
[Pipeline] {
[Pipeline] sh
+ git describe --tags --abbrev=0
[Pipeline] echo
Tag version: v2.7
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Build Image)
[Pipeline] script
[Pipeline] {
[Pipeline] echo
Image version: vinhbh/vdt_web:v2.7
[Pipeline] sh
+ docker build -t vinhbh/vdt_web:v2.7 .
#0 building with "default" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 314B done
#1 DONE 0.0s

#2 [internal] load metadata for docker.io/library/node:18
#2 ...

#3 [auth] library/node:pull token for registry-1.docker.io
#3 DONE 0.0s

#4 [auth] library/nginx:pull token for registry-1.docker.io
#4 DONE 0.0s

#5 [internal] load metadata for docker.io/library/nginx:alpine
#5 DONE 2.2s

#2 [internal] load metadata for docker.io/library/node:18
#2 DONE 2.3s

#6 [internal] load .dockerignore
#6 transferring context: 2B done
#6 DONE 0.0s

#7 [build 1/6] FROM docker.io/library/node:18@sha256:b08b1356559e2e9945f47ded630c9eb9d4e3ca04f111ab20d55652442cf14aee
#7 DONE 0.0s

#8 [stage-1 1/2] FROM docker.io/library/nginx:alpine@sha256:69f8c2c72671490607f52122be2af27d4fc09657ff57e42045801aa93d2090f7
#8 DONE 0.0s

#9 [internal] load build context
#9 transferring context: 1.06MB 0.0s done
#9 DONE 0.0s

#10 [build 3/6] COPY package.json package-lock.json ./
#10 CACHED

#11 [build 2/6] WORKDIR /app
#11 CACHED

#12 [build 4/6] RUN npm install
#12 CACHED

#13 [build 5/6] COPY . .
#13 DONE 0.1s

#14 [build 6/6] RUN npm run build
#14 0.523 
#14 0.523 > vdt-web@0.1.0 build
#14 0.523 > react-scripts build
#14 0.523 
#14 2.230 Creating an optimized production build...
#14 5.703 [0;33mOne of your dependencies, babel-preset-react-app, is importing the
#14 5.703 "@babel/plugin-proposal-private-property-in-object" package without
#14 5.703 declaring it in its dependencies. This is currently working because
#14 5.703 "@babel/plugin-proposal-private-property-in-object" is already in your
#14 5.703 node_modules folder for unrelated reasons, but it [1mmay break at any time[0;33m.
#14 5.703 
#14 5.703 babel-preset-react-app is part of the create-react-app project, [1mwhich
#14 5.703 is not maintianed anymore[0;33m. It is thus unlikely that this bug will
#14 5.703 ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to
#14 5.703 your devDependencies to work around this error. This will make this message
#14 5.703 go away.[0m
#14 5.703   
#14 14.31 Compiled with warnings.
#14 14.31 
#14 14.31 [eslint] 
#14 14.31 src/App.jsx
#14 14.31   Line 32:13:   'result' is assigned a value but never used                                                                                                                                                                                                                                                                                                                        no-unused-vars
#14 14.31   Line 42:13:   'result' is assigned a value but never used                                                                                                                                                                                                                                                                                                                        no-unused-vars
#14 14.31   Line 52:13:   'result' is assigned a value but never used                                                                                                                                                                                                                                                                                                                        no-unused-vars
#14 14.31   Line 61:6:    React Hook useEffect has a missing dependency: 'getStudentListApi'. Either include it or remove the dependency array                                                                                                                                                                                                                                               react-hooks/exhaustive-deps
#14 14.31   Line 271:9:   The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value. If you cannot provide a valid href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
#14 14.31   Line 279:15:  The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value. If you cannot provide a valid href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
#14 14.31 
#14 14.31 Search for the keywords to learn more about each warning.
#14 14.31 To ignore, add // eslint-disable-next-line to the line before.
#14 14.31 
#14 14.31 File sizes after gzip:
#14 14.31 
#14 14.32   69.25 kB  build/static/js/main.f36b6cdd.js
#14 14.32   1.77 kB   build/static/js/453.177366fc.chunk.js
#14 14.32   263 B     build/static/css/main.e6c13ad2.css
#14 14.32 
#14 14.32 The project was built assuming it is hosted at /.
#14 14.32 You can control this with the homepage field in your package.json.
#14 14.32 
#14 14.32 The build folder is ready to be deployed.
#14 14.32 You may serve it with a static server:
#14 14.32 
#14 14.32   npm install -g serve
#14 14.32   serve -s build
#14 14.32 
#14 14.32 Find out more about deployment here:
#14 14.32 
#14 14.32   https://cra.link/deployment
#14 14.32 
#14 DONE 14.4s

#15 [stage-1 2/2] COPY --from=build /app/build /usr/share/nginx/html
#15 CACHED

#16 exporting to image
#16 exporting layers done
#16 writing image sha256:fcdea1347a7d860a3f7a549c8cc5a8268c7acb4d51ecb63c494ccc8cce7fc611 done
#16 naming to docker.io/vinhbh/vdt_web:v2.7 0.0s done
#16 DONE 0.0s
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
+ docker push vinhbh/vdt_web:v2.7
The push refers to repository [docker.io/vinhbh/vdt_web]
960fb88b99dc: Preparing
9cba8117003a: Preparing
b6d04dc5ecf7: Preparing
d38ed9b519d2: Preparing
3b4115e2edd1: Preparing
8d720e2faad3: Preparing
7b87df18a0ed: Preparing
a05d3326ce5a: Preparing
d4fc045c9e3a: Preparing
7b87df18a0ed: Waiting
8d720e2faad3: Waiting
a05d3326ce5a: Waiting
d4fc045c9e3a: Waiting
d38ed9b519d2: Layer already exists
960fb88b99dc: Layer already exists
b6d04dc5ecf7: Layer already exists
9cba8117003a: Layer already exists
3b4115e2edd1: Layer already exists
8d720e2faad3: Layer already exists
a05d3326ce5a: Layer already exists
7b87df18a0ed: Layer already exists
d4fc045c9e3a: Layer already exists
v2.7: digest: sha256:5be66491a23ff5c5ede955f2cc1e6dc47881467b19dd193be78e0513a025beb6 size: 2199
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Clone Repo Config)
[Pipeline] echo
Clone code from branch main
[Pipeline] git
The recommended git tool is: NONE
using credential github-token-v3
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/vdt-web_main/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/Vinh1507/vdt-web-config # timeout=10
Fetching upstream changes from https://github.com/Vinh1507/vdt-web-config
 > git --version # timeout=10
 > git --version # 'git version 2.39.2'
using GIT_ASKPASS to set credentials github-token-v3
 > git fetch --tags --force --progress -- https://github.com/Vinh1507/vdt-web-config +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/main^{commit} # timeout=10
Checking out Revision e77a78299f808dc09bf5d986e48b4af1188c2dd2 (refs/remotes/origin/main)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f e77a78299f808dc09bf5d986e48b4af1188c2dd2 # timeout=10
 > git branch -a -v --no-abbrev # timeout=10
 > git branch -D main # timeout=10
 > git checkout -b main e77a78299f808dc09bf5d986e48b4af1188c2dd2 # timeout=10
Commit message: "Update vdt-web helm values with new image version"
 > git rev-list --no-walk 17a15c46313c25e047653b45dae832556bcdd585 # timeout=10
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Modify file helm values)
[Pipeline] script
[Pipeline] {
[Pipeline] sh
+ sed -i s/^  tag.*/  tag: "v2.7"/ helm-values/values-prod.yaml
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Push changes to config repo)
[Pipeline] sh
+ git add .
[Pipeline] sh
+ git commit -m Update vdt-web helm values with new image version
[main 1a0dc44] Update vdt-web helm values with new image version
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
To https://github.com/Vinh1507/vdt-web-config
   e77a782..1a0dc44  main -> main
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


# Project

Frontend is map to localhost:80, which we can access to see the frontend and the connection to backend

![alt text](imgs/index.png)

![alt text](imgs/view.png)

![alt text](imgs/compose-frontend-and-backend.png)

Backend, which is based on the FastAPI library, is mapped to localhost:8000, which we can directly access in browser, or via `curl` to quickly check if our implementation is correct. Furthermore, because we setup the docker-compose.yml of both frontend and backend repository to use the same external network `vdt_network`, which was created before hand using the command
```
docker network create -d bridge vdt_network
```

Both services can talk to each other using the service names defined in the compose file, instead of through localhost if run outside container.

![alt text](imgs/curl.png)

Database is based on Postgres image, with neccesary environment variables provided based on the Dockerhub documentation in order to initialise our target database and table. We also mount the `/var/lib/postgresql/data` folder, so that the container can retain the data between multiple runs.

Using Github Actions, we are able to automatically build and push a new Docker image to Dockerhub if we detect any changes happend to a designated branch, which in this case is the branch `main`

For example, when we add a minor commit, adding another H1 header to the frontend like this

![alt text](imgs/tiny_commit.png)

The GitHub Actions will automatically run the workflow located at `.github/workflows`, and thus will build and then push the new frontend image `qdgiang/vdt_frontend` to Dockerhub on our behalf. By using GitHub secrets, out login credentials will not be revealed after running our workflow.

Finally, using Watchtower, we are able to automatically detact the latest change in the Docker image. 

![alt text](imgs/watchtower.png)

To be more specific, the frontend is based on our own image `qdgiang/vdt_frontend`, which the Watchtower container will try to keep track of. When it detects a new version of `qdgiang/vdt_frontend` on Dockerhub, which happens as a result of our previous Github Actions workflow run, it will pull the latest image, resulting in a new frontend UI as below

![alt text](imgs/updated_frontend.png)

Frontend code: https://github.com/qdgiang/vdt-midterm-frontend


Backend code: https://github.com/qdgiang/vdt-midterm-backend

# Docker
## What is Docker

Docker is an open-source platform that automates the deployment, scaling, and management of applications. It uses containerization technology to package an application along with its runtime environment into a container, which can then be run on any system that supports Docker - "Build once, run anywhere".

## What is the difference between container and virtual environment

A container and a virtual machine (VM) are both methods to isolate an application and its dependencies into a self-contained unit that can run anywhere. However, they work at different levels and provide different degrees of isolation.

### Container

A container packages an application along with its runtime environment. This includes the application's code, runtime, system tools, libraries, and settings. **Containers share the host system's OS kernel and do not require a full OS per application**, making them lightweight and fast.

Key features of containers:

- Share the host system's OS kernel
- Start up quickly
- Use less memory

### Virtual Machine:

A VM emulates a complete computer system, with a full guest operating system, along with the associated overhead of the binaries and libraries of the guest OS. **Each VM runs not just a full copy of an operating system, but a virtual copy of all the hardware that the operating system needs to run**.

Key features of virtual machines:

- Run a complete OS stack, including the kernel
- Provide strong isolation
- Use more system resources
- Take longer to start up

In summary, while both containers and VMs provide isolation, containers are lighter weight and more portable, while VMs are more powerful and provide stronger isolation.

Note: As a direct rsult of containers having a direct access to your own Operating Systems kernel and resources, the resource usage overhead of using containers is **minimized**, and as Docker is using Linux kernels, Mac and Windows can't run it without a few hoops and each have their own solutions on how to run Docker. For example, in Windows, Docker will run based on Windows Subsystem for Linux (WSL)

## Some useful Docker commands
`docker image prune` removes dangling images. Dangling images are images that do not have a name and are not used

`docker container prune` removes dangling/stopped container

`docker system prune` removes almost everything

`docker run -[FLAG] [IMAGE] [COMMAND TO RUN INSIDE CONTAINER]`
- `-t` tty
- `-i` interactive
- `-d` detached
- `--name [NAME]` set container name as `[NAME]`
- `--rm` ensures that there are no garbage containers left behind. → `docker start` cannot start container after it has exited.

Some notable differences between `docker run` and `docker start`:
1. Run: create a new container of an image, and execute the container. You can create N clones of the same image. The command is: `docker run IMAGE_ID` **and not** `docker run CONTAINER_ID`
2. Start: Launch a container previously stopped. For example, if you had stopped a database with the command `docker stop CONTAINER_ID`, you can relaunch the same container with the command `docker start CONTAINER_ID`, and the data and settings will be the same.

We can then exec into a running container `docker exec -it [CONTAINER_NAME] /bin/sh`, for example to debug an application while it's running inside the container.

And finally we want to stop a container, we have 2 choices between `stop` and `kill`
1. Stop: When you issue a `docker stop` command a hardware signal is sent to the process inside of that container. In the case of docker stop we send a **SIGTERM** message which is short for terminate signal. It's a message that's going to be received by the process telling it essentially to shut down on its own time.

**SIGTERM** is used any time that you want to stop a process inside of your container and shut the container down, and you want to give that process inside there a little bit of time to shut itself down and do a little bit of clean up.

2. Kill: the `docker kill` command issue is a **SIGKILL** or kills signal to the primary running process inside the container, so kill it essentially means you have to shut down right now and you do not get to do any additional work. 

So ideally we always stop a container with the docker stop command in order to get the running process inside of it a little bit of time to shut itself down, otherwise if it feels like the container has locked up and it's not responding to the docker stop command then we could issue docker kill instead.

These are simple commands that interact directly with containers itself. The Docker Engine CLI also provides us with many other tools such as `network`, `volume`, `image`... in order to deal with a large variety of tasks related to running container according to our specification (running inside a pre-defined network, mounting volume for subsequent runs, running based on different versions of images)

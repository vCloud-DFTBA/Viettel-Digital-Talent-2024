# Midterm assignment for VDT Cloud 2024

## I. Develop a simple 3-tier web application

### Requirements:

-   #### Develop a web application with the following features :
    -   Display a list of students in VDT2024 in a table with the following information: Full name, Gender, and School they are attending.

    - Allow viewing details, adding, deleting, and updating student information.

- ### Design web application:
    - Web Interface: **ReactJs** - Create flexible and responsive user interfaces.
    - API: **FastAPI** - Develop high-performance, easy-to-build and integrate RESTful APIs.
    - Database: **MongoDB** - Flexible NoSQL database, scalable and capable of handling large volumes of data.
    - Web application architecture:
    <img src= images/3tier-architecture.png>

- ### Output :
    - vdt2024-web source code: [here](https://github.com/jasmine150720/vdt2024-web)
    - vdt2024-api source code: [here](https://github.com/jasmine150720/vdt2024-api)
    - unit-test source code: [here](https://github.com/jasmine150720/vdt2024/tree/main/api/test)
    - Demo web application:
        - `List of VDT2024 Cloud students`:
            <img src= images/list-students.png>
        - `Detele student from the list`:
            <img src= images/delete-students.png>
        - `Add student to the list`:
             <img src= images/add-student.png>
             <img src= images/add-sucessfully.png>
        - `Modify student infomation`:
            <img src= images/modify-student.png>


## II. Triển khai web application sử dụng các DevOps tools & practices

### 1. Containerization

Requirements:

-   Write a Dockerfile for each repository to package the services into container images.
-   The image should ensure optimized build time and minimal disk space usage, utilizing recommended image building techniques (layer-caching, optimized RUN instructions, multi-stage build, etc.)

Output:

-   Dockerfile for each service in the three-service system:
    -   **api** : Here is Dockerfile with optimized techniques used:
      ```
      # Use Python 3.9 slim base image for a lightweight starting point
      FROM python:3.9-slim AS builder

      WORKDIR /code

      # Copy the entire application code into the container's working directory
      COPY . /code

      # Use --no-cache-dir to avoid caching downloaded packages, reducing image size
      RUN pip install --no-cache-dir --upgrade -r requirements.txt

      CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
      ```
    -   **frontend** : Here is Dockerfile with optimized techniques used:
      ```
      FROM node:18.2.0-alpine

      # Set the working directory inside the container
      WORKDIR /app

      # Copy the entire application code to the container
      COPY . .

      # Copy package.json and package-lock.json files separately to utilize layer caching
      COPY package.json package-lock.json ./

      # Install dependencies using npm ci for faster and more reliable builds
      RUN npm ci

      # Build the application
      RUN npm run build

      CMD ["npm", "start"]
      ```
    -   **docker-compose** :[here](https://github.com/jasmine150720/vdt2024/blob/main/docker-compose.yml) . Here's a brief summary of the provided Docker Compose configuration:
        - Three services are defined: `react`, `fastapi`, and `mongodb`.
        - `react` service:
          - Builds the frontend container.
          - Maps port 3000 of the host to port 3000 of the container.
          - Links to the fastapi service.          
        - `fastapi` service:
          - Builds the API container.
          - Maps port 80 of the host to port 80 of the container.
          - Depends on the `mongodb` service.
        - `mongodb` service:
          - Uses the mongo:5.0 image.
          - Maps port 27017 of the host to port 27017 of the container.
          - Initializes a MongoDB database named vdt2024.
        - Each service has a specified restart policy **unless-stopped** to ensure availability.
          
-   Build command:
  ```
  docker-compose -f docker-compose.yml up --build
  ```  
-   Docker history information of each image:
    - Docker images:
      <img src= images/docker-images.png>
    - Docker histoty information:
      - `react`
        <img src= images/log-react.png>
      - `fastapi`
        <img src= images/log-api.png>
      - `mongodb`
        <img src= images/log-mongo.png>

### 2. Continuous Integration

Requirements:

-   Automatically run unit test when creating a PR on the main branch.
-   Automatically run unit tests when pushing a commit to a branch.

Output:
-   CI tool setup file: [here](https://github.com/jasmine150720/vdt2024/blob/main/.github/workflows/ci.yml)
-   Output log of CI stream:
    <img src= images/log-ci.png>
-   Other demo images:
    - Automatically run unit test when creating a PR on the main branch
        <img src= images/ci-2.png>
    - Automatically run unit tests when pushing a commit to a branch
        <img src= images/ci-1.png>

### 3. Automation
Requirements:
- Write ansible playbooks to deploy docker images of web services, api, db, each role for each service.
- In each role, it is possible to customize the configuration of services through variables.
- Allows deploying services on different hosts through the inventory file.

Ouput:
- Source code of Ansible: [here](https://github.com/jasmine150720/vdt2024/tree/main/ansible)
- Successfully deploy on 2 different hosts:
    <img src= images/ansible.png>
### 4. Research topic : WHO ARE YOU, PLATFORM ENGINEERING
Thank to KOL Nguyen Hoai Nam for introducing a fresh concept, which sparked inspiration for me to write this topic. For full details: [here](https://github.com/jasmine150720/vdt2024/blob/main/report.pdf) 

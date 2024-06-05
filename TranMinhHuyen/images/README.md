# Midterm assignment for VDT Cloud 2024

## I. Develop a simple 3-tier web application

### Requirements:

-   #### Develop a web application with the following features :
    -   Display a list of students in VDT2024 in a table with the following information: Full name, Gender, and School they are attending.

    - Allow viewing details, adding, deleting, and updating student information.

- ### Design web application:
    - Web Interface: **ReactJs** - Create flexible and responsive user interfaces.
    - API: **NodeJS** - Develop high-performance, easy-to-build and integrate RESTful APIs.
    - Database: **MySQL** - Flexible SQL database, scalable and capable of handling large volumes of data.

- ### Write Unit Tests for each API:
    - Use Jest and Supertest to test NodeJS api.

- ### Output :
    - vdt2024-web source code: [here](https://github.com/DI-huyentm/VDT_FE)
    - vdt2024-api source code: [here](https://github.com/DI-huyentm/VDT_BE)
    - unit-test source code: [here](https://github.com/DI-huyentm/VDT_BE/tree/main/test)
    - Demo web application:
        - `List of VDT2024 Cloud students`:
            <img src= images/view.png>
        - `Detele student from the list`:
            <img src= images/delete.png>
        - `Add student to the list`:
             <img src= images/add.png>
             <img src= images/add-02.png>
        - `Modify student infomation`:
            <img src= images/edit.png>
    - Output Unit Test:
             <img src= images/unit-test-pass.png>


## II. Triển khai web application sử dụng các DevOps tools & practices

### 1. Containerization

Requirements:

-   Write a Dockerfile for each repository to package the services into container images.
-   The image should ensure optimized build time and minimal disk space usage, utilizing recommended image building techniques (layer-caching, optimized RUN instructions, multi-stage build, etc.)

Output:

-   Dockerfile for each service in the three-service system:
    -   **api** : Here is Dockerfile with optimized techniques used:
      ```
      # Use Node 22 slim base image for a lightweight starting point
      FROM node:22-slim
      
      WORKDIR /app
      
      COPY package*.json ./
      
      RUN npm install
      
      COPY . .
      
      EXPOSE 3001
      
      CMD ["npm", "start"]

      ```
    -   **web** : Here is Dockerfile with optimized techniques used:
      ```
        # Use the official Node.js image as base
        FROM node:latest

        # Set the working directory inside the container
        WORKDIR /app

        # Copy package.json and package-lock.json files to the working directory
        COPY package*.json ./

        # Install dependencies
        RUN npm install

        # Copy the rest of the frontend files to the working directory
        COPY . .

        # Expose the port on which the React development server will run
        EXPOSE 3000

        # Command to run the React development server
        CMD ["npm", "start"]

      ```
    -   **docker-compose** :[here](https://github.com/DI-huyentm/Compose-V1/blob/main/docker-compose.yml) . Here's a brief summary of the provided Docker Compose configuration:
        - Three services are defined: `frontend`, `backend`, and `mysql`.
        - `frontend` service:
          - Builds the frontend container.
          - Maps port 3000 of the host to port 3000 of the container.
          - Depends on the `backend` service.
        - `backend` service:
          - Builds the API container.
          - Maps port 3001 of the host to port 3001 of the container.
          - Depends on the `mysql` service.
        - `mysql` service:
          - Uses the mysql:5.7 image.
          - Maps port 3306 of the host to port 3306 of the container.
          - Initializes a database named vdt.
        - service `mysql` and service `backend` use **healthcheck** to ensure that service `backend` only run after `mysql` has already run.
          
-   Build command:
  ```
  docker compose up --build
  ```  
-   Docker history information of each image:
    
### 2. Continuous Integration

Requirements:

-   Automatically run unit test when creating a PR on the main branch.
-   Automatically run unit tests when pushing a commit to a branch.

Output:
-   CI tool setup file: [here](https://gitlab.com/DI-huyentm/VDT_BE/-/blob/main/.gitlab-ci.yml)
-   Output log of CI stream:
    <img src= images/log-ci.png>
-   Other demo images:
    - Automatically run unit test when creating a PR on the main branch
        <img src= images/merge-request-to-main.png>
        <img src= images/merge-request-to-main-02.png>

    - Automatically run unit tests when pushing a commit to a branch
        <img src= images/pull-request-to-a-branch.png>
        <img src= images/pull-request-to-a-branch-02.png>
        <img src= images/pull-request-to-a-branch-03.png>
        


### 4. Research topic : WHO ARE YOU, PLATFORM ENGINEERING
Thank to KOL Nguyen Hoai Nam for introducing a fresh concept, which sparked inspiration for me to write this topic. For full details: report.pdf

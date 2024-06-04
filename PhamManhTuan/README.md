# <a name="_fe63hmglxj7j"></a>Midterm assignment for VDT Cloud 2024
## <a name="_esz32254sy5h"></a>I. Web development
Display a list of students in VDT2024 in a table with the following information: Full name, Gender, and School they are attending.

**Source code:**

Allow viewing details, adding, deleting, and updating student information.

- web: ReactJs <https://github.com/smugikity/vie-front> 
- api: Flask <https://github.com/smugikity/vie-back> 
- db: MongoDB

Web application architecture:

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.001.png)

**Demo web application:**


![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.002.png)![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.003.png)
## <a name="_sg08kynbbt1r"></a>II. DevOps tools implementations
### <a name="_3sx8y9ucx8ik"></a>1. Containerization
Requirements:

-   Write a Dockerfile for each repository to package the services into container images.
-   The image should ensure optimized build time and minimal disk space usage, utilizing recommended image building techniques (layer-caching, optimized RUN instructions, multi-stage build, etc.)

Output:
**Dockerfile backend:**

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.004.png)

**Dockerfile frontend:**

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.005.png)

**Docker compose file:**

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.006.png)

**Docker history information of each image:**

` `- Docker images:

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.007.png)

` `- Docker history information:

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.008.png)

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.009.png)

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.010.png)
### <a name="_38c1v14xj2hc"></a>2. Continuous Integration
Requirements:

-   Automatically run unit test when creating a PR on the main branch.
-   Automatically run unit tests when pushing a commit to a branch.

Output:
**Workflow github actions:**

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.011.png)

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.012.png)

**Workflow log:**

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.013.png)

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.014.png)
### <a name="_txo1armpbj5t"></a>3. Automation
Requirements:
- Write ansible playbooks to deploy docker images of web services, api, db, each role for each service.
- In each role, it is possible to customize the configuration of services through variables.
- Allows deploying services on different hosts through the inventory file.

Ouput:
**Source code of Ansible:** <https://github.com/smugikity/Viettel-Digital-Talent-2024/tree/main/PhamManhTuan/ansible> 

**Deployment:**

![](images/Aspose.Words.affa24cd-09cf-48c6-aae8-712a18075a94.015.png)
## <a name="_vx3ebma9nfar"></a>III. Article research
**Article:** <https://github.com/smugikity/Viettel-Digital-Talent-2024/blob/main/PhamManhTuan/article.pdf> 

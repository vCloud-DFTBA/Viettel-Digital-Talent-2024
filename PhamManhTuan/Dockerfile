FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get install -y \
    sudo \
    python3 \
    python3-pip \
    openssh-server \
    && apt-get clean

# Install Ansible using pip
RUN pip3 install --break-system-packages ansible 

RUN useradd -m -s /bin/bash nadeko \
    && echo "nadeko:1111" | chpasswd \
    && usermod -aG sudo nadeko \
    && echo "nadeko ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

RUN mkdir /var/run/sshd \
    && echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config \
    && echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config \
    && service ssh start

RUN mkdir -p /home/nadeko/.ssh \
    && chown -R nadeko:nadeko /home/nadeko/.ssh

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
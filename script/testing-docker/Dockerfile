FROM ubuntu:latest

RUN apt-get -y update
RUN apt-get -y install git make g++ curl libsecret-1-dev libnss3 libdbus-1-3 libatk1.0 libatk-bridge2.0-dev libcups2-dev libdrm-dev libgtk-3-dev libasound2-dev

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get -y install nodejs
RUN corepack enable

# Disable git dubious ownership checks
RUN echo "[safe]\n\tdirectory = /app" >> ~/.gitconfig
RUN cp ~/.gitconfig /etc/gitconfig

COPY ./entrypoint.sh /entrypoint.sh

# To allow the image to run without internet connection
RUN corepack pack yarn@1.22.19

CMD ["/entrypoint.sh"]

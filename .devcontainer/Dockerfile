# set the base image to mcr.microsoft.com/azure-functions/powershell:4-powershell7.2-core-tools
# https://github.com/Azure/azure-functions-docker/blob/dev/host/4/bullseye/amd64/powershell/powershell72/powershell72-core-tools.Dockerfile
FROM mcr.microsoft.com/azure-functions/powershell:4-powershell7.2-core-tools

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

RUN mkdir /usr/local/nvm

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.20.4

# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl --silent -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# use a user called spfx with sudo access
# VOLUME /usr/app/spfx
# WORKDIR /usr/app/spfx
# RUN useradd --create-home --shell /bin/bash spfx && \
#     usermod -aG sudo spfx && \
#     chown -R spfx:spfx /usr/app

# USER spfx

# Install SPFx development toolchain prerequisites
RUN npm i --location=global gulp-cli yo @microsoft/generator-sharepoint spfx-fast-serve

# Start bash
CMD /bin/bash
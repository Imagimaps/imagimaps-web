FROM node:20-slim
RUN useradd -m -s /bin/bash -u 1001 -g users -G sudo ghActionUser
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y git awscli ansible curl tree
RUN curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh && \
    chmod +x install-opentofu.sh && \
    ./install-opentofu.sh --install-method deb && \
    rm install-opentofu.sh
WORKDIR /action
COPY  package.json package-lock.json ./
RUN npm ci --only=production
COPY src/ ./
ENTRYPOINT node /action/index.js

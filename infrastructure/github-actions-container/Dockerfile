FROM docker:25-dind
RUN adduser --disabled-password --gecos "" --uid 1001 --ingroup users --shell /bin/bash ghActionUser
RUN apk update && apk upgrade
RUN apk add git ansible curl aws-cli bash tree nodejs npm
RUN npm install -g corepack && \
    corepack enable && corepack prepare pnpm@8 --activate
RUN curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh && \
    chmod +x install-opentofu.sh && \
    ./install-opentofu.sh --install-method apk && \
    rm install-opentofu.sh
RUN cat /etc/os-release

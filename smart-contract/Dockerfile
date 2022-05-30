FROM node:16.13.1

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install --non-interactive --frozen-lockfile

EXPOSE 8545:8545

COPY $PWD/entrypoint.sh /usr/local/bin

ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]
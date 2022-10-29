FROM python:3.9-buster

# get node
ADD https://nodejs.org/dist/v18.12.0/node-v18.12.0-linux-x64.tar.xz /tmp/
RUN cd /tmp && tar -xf node-v18.12.0-linux-x64.tar.xz
ENV PATH="${PATH}:/tmp/node-v18.12.0-linux-x64/bin"

RUN node --version

WORKDIR /opt

COPY ./*.json ./
COPY ./*.lock ./
COPY ./*.js ./

COPY ./lib ./lib
COPY ./public ./public
COPY ./routes ./routes

RUN npm install yarn -g 
RUN yarn install

ENTRYPOINT ["yarn", "start"]


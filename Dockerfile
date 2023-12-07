FROM node:18.12.0

WORKDIR /src/app

COPY package*.json .

RUN npm install

RUN apt-get -y update

RUN apt-get -y upgrade

RUN apt-get install -y ffmpeg

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
FROM node:18.0.0

WORKDIR /src/app

COPY package*.json /src/app

RUN npm install

COPY . /src/app

EXPOSE 8000

CMD ["sh", "-c", "node scripts/createGenres && node scripts/createAdmin && npm start"]
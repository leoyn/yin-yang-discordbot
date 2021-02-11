FROM node:15-alpine

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY tsconfig.json /app/tsconfig.json
COPY src /app/src
RUN npm run build

ENV PGHOST="database"
ENV PGUSER="app"
ENV PGDATABASE="app"
ENV PGPASSWORD="qJZSzd8z45VZ3UCCSqPNpbSUm8Xv5mrk"
ENV PGPORT=5432

ENTRYPOINT ["npm", "start"]
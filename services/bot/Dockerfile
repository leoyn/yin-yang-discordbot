FROM node:14

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY tsconfig.json /app/tsconfig.json
COPY src /app/src

ENTRYPOINT ["npm", "start"]
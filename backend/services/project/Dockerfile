FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./services/project/package*.json ./services/project/
RUN cd services/project && npm install

COPY services/project ./services/project
COPY shared ./shared

WORKDIR /app/services/project

CMD ["npm","start"]
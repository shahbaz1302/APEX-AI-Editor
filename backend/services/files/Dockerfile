FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./services/files/package*.json ./services/files/
RUN cd services/files && npm install

COPY services/files ./services/files
COPY shared ./shared

WORKDIR /app/services/files

CMD ["npm","start"]
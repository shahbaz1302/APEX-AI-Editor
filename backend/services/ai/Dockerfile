FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./services/ai/package*.json ./services/ai/
RUN cd services/ai && npm install

COPY services/ai ./services/ai
COPY shared ./shared

WORKDIR /app/services/ai

CMD ["npm","start"]
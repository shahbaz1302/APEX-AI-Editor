FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./services/terminal/package*.json ./services/terminal/
RUN cd services/terminal && npm install

COPY services/terminal ./services/terminal
COPY shared ./shared

WORKDIR /app/services/terminal

CMD ["npm","start"]
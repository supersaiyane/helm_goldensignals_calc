FROM node:18-alpine
WORKDIR /rum
COPY rum.js .
RUN npm init -y && npm install express prom-client
EXPOSE 8080
CMD ["node", "rum.js"]
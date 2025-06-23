FROM node:18-alpine
WORKDIR /app
COPY backend.js .
RUN npm init -y && npm install express prom-client
EXPOSE 3000
CMD ["node", "backend.js"]
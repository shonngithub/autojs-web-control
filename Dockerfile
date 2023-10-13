FROM shonnz/node-nginx:alpine

WORKDIR /app

COPY ./web/dist /app/web

COPY ./server /app/server

RUN cd /app/server && npm run build

EXPOSE 9317

CMD nginx && cd ./server && npm run start
# CMD ["nginx", "-g", "daemon off;"]
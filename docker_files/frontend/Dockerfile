FROM node:18.16.0-alpine3.17 AS builder

WORKDIR /app
COPY package*.json ./

RUN apk add --update \
        git \
    && npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

RUN sed -i 's/listen[[:space:]]*80;/listen 3001;/g' /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
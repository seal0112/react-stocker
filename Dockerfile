FROM node AS builder
WORKDIR /app
ENV REACT_APP_HOST_DOMAIN=seal0112.ngrok.io
COPY . .
RUN npm install && \
    npm run build


FROM nginx:mainline-alpine-slim
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .
EXPOSE 80 
ENTRYPOINT ["nginx", "-g", "daemon off;"]
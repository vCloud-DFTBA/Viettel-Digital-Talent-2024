#1. Build
FROM node:lts-alpine as builder
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chmod=node:node . .
RUN npm run build
CMD ["node"]
#2. Serve - production
FROM nginx:stable-alpine
COPY --chmod=node:node --from=builder /app/build /usr/share/nginx/html
COPY --chmod=node:node --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
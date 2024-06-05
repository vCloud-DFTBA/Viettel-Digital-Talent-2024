FROM node:lts-alpine as builder
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./
RUN npm i --production
COPY --chmod=node:node . .
FROM node:lts-alpine
WORKDIR /app
COPY --chmod=node:node --from=builder /app ./
EXPOSE 5000
CMD ["node", "index.js"]
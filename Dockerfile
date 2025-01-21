FROM node:20-alpine AS base

FROM base AS build

WORKDIR /app

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install

COPY ./frontend ./
RUN npm run build

FROM base AS final

WORKDIR /app

COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install --only=production

COPY ./backend ./

COPY --from=build /app/dist ./public

CMD ["npm", "start"]

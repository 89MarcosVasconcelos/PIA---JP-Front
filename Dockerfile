FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN CI=false npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Remova ou ajuste conforme necessário
# COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

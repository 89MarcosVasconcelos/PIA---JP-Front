# Etapa de build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de produção com NGINX
FROM nginx:alpine

# Remove o default.conf original da imagem
RUN rm /etc/nginx/conf.d/default.conf

# Copia seu arquivo personalizado
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

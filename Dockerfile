# Etapa 1: Build da aplicação
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servindo com NGINX
FROM nginx:alpine

# Remove o default.conf original para evitarmos sobrescrever manualmente depois
RUN rm /etc/nginx/conf.d/default.conf

# Copia o build do React para o diretório público do NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Copia o arquivo NGINX configurado corretamente para Single Page App
COPY default.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

# servir a aplicação com nginx
FROM nginx:alpine

# Copia o build para o diretório do nginx
COPY --from=build /app/build /usr/share/nginx/html

# Substitui a config padrão do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM node:latest as build
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app
RUN npm run build

FROM nginx:latest
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

COPY mime.types /etc/nginx/mime.types

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
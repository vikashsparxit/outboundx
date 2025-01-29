# Stage 1: Build the React App
FROM node:22.9.0 AS build
LABEL maintainer="abhishek@sparxit.com"

WORKDIR /usr/local/frontend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -g npm@latest && npm install -f

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the Built App with Nginx
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/local/frontend/dist /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]

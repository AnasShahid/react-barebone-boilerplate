# Stage 1: Build the React Vite project
FROM node:24 AS build

# Set the working directory
WORKDIR /usr/src/app

# Define build-time variables
ARG VITE_APP_ENV
ARG VITE_API_URL
ARG VITE_APP_TITLE
ARG VITE_CLERK_PUBLISHABLE_KEY

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Pass build-time environment variables to Vite
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Increase memory size
ENV NODE_OPTIONS="--max_old_space_size=8096"

# Build the Vite project
RUN npm run build

# Stage 2: Serve the built files using Nginx
FROM nginx:stable-alpine

# Copy the built files from the first stage to Nginx's HTML directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if needed (required)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set Nginx to listen on port 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Expose the default Nginx HTTP port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

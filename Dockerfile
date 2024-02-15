# FROM nginx

# # Set the working directory inside the container
# WORKDIR /usr/share/nginx/html

# # Remove the default NGINX index.html file
# RUN rm -f /usr/share/nginx/html/index.html

# # Copy your project files into the container's working directory
# COPY ./default.conf /etc/nginx/conf.d/

# COPY .output/public .

# # Expose port 80 to allow external access
# EXPOSE 80


# Use an official Node.js image as the base image
FROM node:18.12.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY .output/ .


# Expose the port that the application will run on
EXPOSE 80

# Set the command to run the application
CMD ["node", "/app/server/index.mjs"]
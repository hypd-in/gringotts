FROM nginx

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove the default NGINX index.html file
RUN rm -f /usr/share/nginx/html/index.html

# Copy your project files into the container's working directory
COPY ./default.conf /etc/nginx/conf.d/

COPY ./dist/ .

# Expose port 80 to allow external access
EXPOSE 80

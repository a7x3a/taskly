# Use a base Node.js image from Docker Hub
FROM node:14

# Set working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Environment variables
ENV PORT=8080
ENV CONNECTION_STRING="mongodb+srv://a7x3a:ahmad123@mongodb.dyxueco.mongodb.net/todo_list?retryWrites=true&w=majority&appName=mongodb"
ENV EMAIL_USER="taskly.dev@outlook.com"
ENV EMAIL_PASSWORD="taskly.password"

# Expose the port your app runs on (if applicable)
EXPOSE $PORT

# Command to run your server
CMD ["npm", "start"]

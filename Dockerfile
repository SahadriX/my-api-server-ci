# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose your server port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]

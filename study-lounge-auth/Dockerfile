# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Install netcat so that "nc" is available
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your server is running on (change if needed)
EXPOSE 3000

# Start the Node.js server
# CMD ["npm", "start"]
# CMD ["node", "server.js"]
# filepath: /Users/namnguyenvu/Downloads/seng-513-project/study-lounge-auth/Dockerfile

# Add the wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Update the CMD to use the wait-for-it script
CMD ["/wait-for-it.sh", "db", "3306", "--", "node", "server.js"]


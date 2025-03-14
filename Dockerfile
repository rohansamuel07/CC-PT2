# Use Ubuntu as base image
FROM ubuntu:latest

# Install required dependencies
RUN apt update && apt install -y \
    gcc g++ \
    python3 python3-pip \
    nodejs npm \
    openjdk-17-jdk \
    && apt clean

# Set default working directory
WORKDIR /usr/src/app

# Copy package.json & package-lock.json
COPY server/package.json server/package-lock.json ./

# Install dependencies
RUN npm install --unsafe-perm

# Copy the rest of the server code
COPY server/ .

# Set execution permissions
RUN chmod -R 777 /usr/src/app

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

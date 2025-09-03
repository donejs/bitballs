FROM node:8.17.0

WORKDIR /app

# Copy package.json and package-lock.json first for better Docker layer caching
COPY package*.json ./

# Install production dependencies first
RUN npm install

# Copy the rest of the application code
COPY . .

# Install dependencies for the public directory
WORKDIR /app/public
RUN npm install --build-from-source=false --python="/dev/null" || npm install --ignore-scripts

# Go back to the main app directory
WORKDIR /app

# Copy and make the entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "index.js"]

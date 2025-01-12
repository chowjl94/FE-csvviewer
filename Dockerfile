FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Add build argument for the environment variable
ARG VITE_API_BASE_URL

# Set the environment variable inside the container
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy application files into the container
COPY . .

RUN npm run build

# vite preview uses 4173
EXPOSE 4173

CMD ["npm", "run", "preview"]

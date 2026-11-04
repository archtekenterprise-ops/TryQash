FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Force rebuild to include latest code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

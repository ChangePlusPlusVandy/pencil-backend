# IGNORE

FROM node:16

FROM mysql:8.0
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Run SQLDB
RUN create-sqldb.sh

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

#TO RUN:
# docker build . -t <your username>/penciltechbackend
# docker run -d -p 8080:8080 <your username>/penciltechbackend
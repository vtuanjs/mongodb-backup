# Build from node 
FROM node

# Install mongo
RUN apt-get update -y
RUN apt-get install gnupg apt-transport-https -y
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update -y
RUN apt-get install -y mongodb-org-tools=4.4.2

# Handle nodeapp 
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install --production
COPY . .
EXPOSE 5050
CMD npm start

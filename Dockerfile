# Build from mongo 
FROM mongo:4.2.5-bionic

# Install nodejs
RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install npm -y

# Handle nodeapp 
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install --production
COPY . .
CMD npm start

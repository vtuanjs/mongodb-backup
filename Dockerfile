FROM mongo:4.2.5-bionic

RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install npm -y
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install --production
COPY . .
CMD npm start

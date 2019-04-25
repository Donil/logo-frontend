FROM node
RUN apt-get update -y
RUN apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ -y

WORKDIR /usr/src/app
COPY . .

RUN npm i
ENTRYPOINT ["npm", "run", "start", "--", "--env=docker", "--host=0.0.0.0"]

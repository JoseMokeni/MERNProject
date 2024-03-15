FROM node:slim

WORKDIR /

COPY . .

RUN npm i

ENV NODE_ENV=development
ENV PORT=5000
ENV JWT_SECRET=jose123
ENV MONGO_URI=mongodb+srv://admin:admin@mycluster.vj2jb.mongodb.net/mernapp?retryWrites=true&w=majority
ENV SUPER_SECRET_KEY=ab12cd34e5
ENV CLOUD_NAME=ds0bippxb
ENV API_KEY=387896359672695
ENV API_SECRET=czAmjov7q2-qAvJV4B8q6XQHYWk

WORKDIR /frontend

RUN npm i

WORKDIR /

CMD [ "npm", "run", "dev" ]

EXPOSE ${PORT}

EXPOSE 3000
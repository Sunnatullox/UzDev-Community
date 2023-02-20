FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN  npm install
COPY ./ ./

CMD ["npm", "start"]


# bu faqatgina tushuncha uchun imageni real projectda ishlatilmaydi ( docker build . ) buyrug'i beriladi dockerda yangi image yasash
# ( docker build -t [image nomi misol uchun: sunnatullox/posts:0.0.1] . ) Dockerfile dagi bergan puyruqlarimiz asnosida docker image yasash uchun ushbu buyruqni beramiz va image ga bergan nom va : datan keyingi versiya bi juda muhumdir chunkiy keyinchalik containerni ichidagi imageni almashtirganimizda yokiy dockerhubga joylaganimizda shu versiyadan ham farqlab topib oladi.
# docker image yasalgandan so'ng ( docker run [image id yokiy image tags] ) buyrug'i bilan docker containerni create qilib ishga tushuramiz 
# docker conatinerni boshqarish uchun dockerni create qilayotganda shell cmd ga ulanish uchun ( docker run -it [ image id yokiy image tag ] sh ) buyrug'ini beramiz
# docker conatinerni iishga tushgan yo'qligini bilish uchun( docker container ls yokiy docker ps ) dockerdagi barcha ishlamay turgan containerlarni ham ko'rish uchun ( docker container ls -a)
# docker conatinerga bosg'lanish uchun id dan foydalangan holda ( docker exec -it [container id] sh )
# docker containeri ishlab turgan yokiy ishlamayotganini va qanday hatolik berganini hohlagan terminalda turib ko'rishimiz mumkun ( docker logs [container id]) buyrug'ini beramiz

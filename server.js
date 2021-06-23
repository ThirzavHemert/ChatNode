const MongoClient = require('mongodb').MongoClient;
const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);
app.get('/', (req, res) => {


// const uri = "mongodb+srv://admin:admin@cluster0.cdxaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     client.connect(err => {
//       console.log(err)
//       console.log("Connected to MongoDB")
//       // const collection = client.db().collection("message");
//       const collection = client.db("circle").collection("messages");
//     // perform actions on the collection object
//     // client.close();
//     console.log('function saveMessage called.')

//     let json = {
//         msg: "He",
//         // nickName: senderNickname,
//         // time: timeStamp,
//         // sig: signature
//     }; 

//    collection.save(json);
    
//     });


    
res.send('Chat Server is running on port 3000')
});
io.on('connection', (socket) => {

console.log('user connected')

socket.on('join', function(userNickname, chatroom) {

        socket.join(chatroom);
        console.log(userNickname + ' joined the room : ' + chatroom)
        socket.broadcast.to(chatroom).emit('new user joined', {user:userNickname, message:'has joined this room.'});

        // console.log(userNickname +" : has joined the chat "  );

        // socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
    });


    //Attempt 3
    socket.on('new-message', (message, room)=>{
      console.log('new-message called', message, room);
      io.in(room).emit('goMessage', message);
    })





    socket.on('message',function(data){
      console.log('message called',data);

      io.in(data.room).emit('new-message', {user:data.user, message:data.message});
    })

socket.on('messagedetection', (messageContent,senderNickname, timeStamp, signature) => {
       
       //log the message in console 
      console.log(signature)

       console.log(senderNickname+" :" +messageContent)
        //create a message object 
       let  message = {"message":messageContent, "senderNickname":senderNickname, "timeStamp": timeStamp}
       let sign = {"signature":signature}
       console.log(signature)
          // send the message to the client side  
          // console.log("test")
      //  saveMessage(messageContent, senderNickname, timeStamp, signature);

       io.emit('message', message, sign);
    
     
      });
      
  
 socket.on('disconnect', function() {
    console.log( ' user has left ')
    socket.broadcast.emit("userdisconnect"," user has left ") 

});



});


// async function saveMessage(messageContent,senderNickname, timeStamp, signature) {
//     console.log('function saveMessage called.')
//     // const collection = client.db("circle").collection("messages");

//     let json = {
//         msg: "He",
//         nickName: senderNickname,
//         time: timeStamp,
//         sig: signature
//     }; 

//    collection.save(json);
// }


server.listen(3000,()=>{
    var ip = require("ip");
    console.log(ip.address());
console.log('Node app is running on port 3000');

});

var mongo = require("mongodb").MongoClient,
  client = require("socket.io").listen(8080).sockets;

  mongo.connect("mongodb://127.0.0.1/chat",function(err,db){
    if(err) throw err;

    client.on("connection",function(socket){
      //wait for the connection
          var col = db.collection("messages"),
              sendStatus = function(s){
                socket.emit("status",s);
              };

              //meit all messages
              col.find().limit(100).sort({_id:1}).toArray(function(err,res){
                if(err) throw err;
                socket.emit("output",res);
              });
              //wait for input
      socket.on("input",function(data){


        var name = data.name,
            message = data.message,
            whitespacesPattern = /^\s*$/;

            if(whitespacesPattern.test(name) || whitespacesPattern.test(message)){
              sendStatus("Name and messages required");
            }else{
              console.log("Messaeg send");
              col.insert({name:name,message:message},function(){

                client.emit("output",[data])
                sendStatus({
                  message: "Message sent",
                  clear: true
                });
              });
            }


      });
    });

  });

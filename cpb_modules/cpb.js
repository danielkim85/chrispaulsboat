function cpb(server){

  var redis = require("redis"),
      client = redis.createClient();

  var io = require('socket.io')(server);
  io.on('connection', function(socket){

    socket.on('uploadCategories', function(appId, categories){
      console.info(categories);
      client.set(appId + '.categories', categories);
    });

    socket.on('uploadQuestion', function(appId, category, amount, question){
      console.info(question);
      client.set(appId + '.question.' + category + '.' + amount, question);
    });

    socket.on('getCategories', function(appId){
      client.get(appId + '.categories', function (err, reply) {
        socket.emit('returnCategories',reply);
      });
    });

    socket.on('getQuestion', function(appId,category, amount){
      client.get(appId + '.question.' +  category + '.' + amount, function (err, reply) {
        socket.emit('returnQuestion',reply);
      });
    });

    socket.on('checkAnswer', function(appId,category,amount,answer){
      client.get(appId + '.question.' +  amount, function (err, reply) {
        reply = JSON.parse(reply);
        socket.emit('returnAnswer',{
          amount:amount,
          result:answer === reply.correct
        });
      });
    });
  });
}

module.exports = cpb;
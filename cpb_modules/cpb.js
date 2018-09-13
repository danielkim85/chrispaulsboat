const mysql = require('mysql');
const db = require('../cpb_modules/db.js');
const {OAuth2Client} = require('google-auth-library');
const FB = require('fb');

const CLIENT_ID = '519191212714-1qav99v7gaaj78ab1j2khllbqbst0suq.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

var userMap = {};

const MAX_INTERACTIONS = 30;

async function verify(accessToken,callback) {
  if(accessToken.type === 'google'){
    const ticket = await client.verifyIdToken({
      idToken: accessToken.token,
      audience: CLIENT_ID
    });
    var payload = ticket.getPayload();
    callback(payload.email);
  } else if(accessToken.type === 'fb'){
    const fb = FB.withAccessToken(accessToken.token);
    fb.api('/me?fields=email', function (res) {
      if(res && res.error) {
        throw res.error;
      }
      else{
        callback(res.email);
      }
    });
  }
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function getScore(connection, socket, sessionID, callback){
  connection.query(
    'select sessionID, SUM(amount * (dailyDouble + 1)) as amount from \n' +
    '(select * from interactions where sessionID = ? order by timestamp asc LIMIT 30) i \n' +
    'join questions q on i.questionID = q.id \n' +
    'join answers a on i.answerID = a.id AND a.correct = 1 \n' +
    'where sessionID = ?',
    [sessionID, sessionID],
    function (error, results) {
      if (error) return;
      if(results.length > 0){
        if(callback){
          callback(connection,socket,sessionID,results[0].amount);
        }
        else{
          socket.emit('returnScore',results[0].amount);
        }
      }
    });
}

function getSession(connection, socket, playerID,email){
  connection.query(
    'SELECT id from sessions \n' +
    'where playerID = ? order by timestamp desc LIMIT 1',
    [playerID],
    function (error, results) {
      if (error) return;
      if(results.length > 0){
        var sessionID = results[0].id;
        if(!userMap[email] || userMap[email].socketID !== socket.id){
          return;
        }
        userMap[email].sessionID = sessionID;
        socket.emit('returnSession',sessionID);
      }
    });
}

function insertSession(connection, socket, playerID,email){
  connection.query(
    'INSERT INTO sessions(playerID) values(?)',
    [playerID],
    function (error) {
      if (error) return;
      getSession(connection,socket,playerID,email);
    });
}

function getLeaderboard(connection,socket){
  connection.query(
    'select name,amount from leaderboard l \n' +
    'join sessions s on l.sessionID = s.id \n' +
    'join players p on s.playerID = p.id \n' +
    'order by amount desc LIMIT 10;',
    function (error, results, fields) {
      if (error) return;
      socket.emit('returnLeaderboard',results);
    });
}

function insertLeaderboard(connection,socket,sessionID,amount){
  connection.query(
    'INSERT INTO leaderboard(sessionID,amount) values(?,?)',
    [sessionID,amount],
    function (error) {
      if (error) return;
      getLeaderboard(connection,socket);
    });
}

function markCompleted(connection,socket,sessionID){
  connection.query(
    'update sessions set active = 0 \n' +
    'where id = ?',
    [sessionID],
    function (error) {
      if (error) return;
      getScore(connection,socket,sessionID,insertLeaderboard);
    });
}

function checkCompletion(connection, socket, sessionID, callback){
  connection.query(
    'select count(i.id) as count, active from interactions i \n' +
    'join sessions s on i.sessionID = s.id \n' +
    'where sessionID = ? \n' +
    'group by sessionID',
    [sessionID],
    function (error, results) {
      if (error) return;
      if(results.length > 0){
        if(!callback){
          socket.emit('returnCompletion', {
            count : results[0].count,
            max : MAX_INTERACTIONS
          });
        }

        if(results[0].active && results[0].count === MAX_INTERACTIONS && !callback){
            markCompleted(connection, socket, sessionID);
        }
        else if(results[0].count === MAX_INTERACTIONS && callback){
          callback();
        }
      }
    });
}

function insertInteraction(connection, socket, email, questionID, answerID, results){
  if(!userMap[email] || userMap[email].socketID !== socket.id){
    return;
  }
  var sessionID = userMap[email].sessionID;
  var playerID = userMap[email].playerID;
  if(!playerID || !sessionID){
    return;
  }

  connection.query(
    'INSERT INTO interactions(playerID,sessionID,questionID,answerID) values(?,?,?,?)',
    [playerID,sessionID,questionID,answerID],
    function (error) {
      if (error) return;
      socket.emit('returnAnswer',results.length > 0);
      checkCompletion(connection,socket,sessionID);
    });
}

function getPlayer(connection, socket, email, forceNewSession){
  connection.query(
    'SELECT p.id as playerID, sprite, s.id as sessionID from players p \n' +
    'left join sessions s on p.id = s.playerID \n' +
    'where email = ? LIMIT 1',
    [email],
    function (error, results) {
      if (error) return;
      if(results.length > 0){

        var playerID = results[0].playerID;
        userMap[email] = {
          socketID : socket.id,
          playerID : playerID
        };

        if(!results[0].sessionID){
          insertSession(connection,socket,playerID,email);
        }
        else if(forceNewSession && results[0].sessionID){
          console.warn('force new session');
          checkCompletion(connection,socket,results[0].sessionID,function(){
            console.warn('check completion passed');
            insertSession(connection,socket,playerID,email);
          });
        }
        else{
          getSession(connection,socket,playerID,email);
        }
        socket.emit('returnUser', {
          sprite:results[0].sprite
        });
      }
    });
}

function cpb(server){

  var connection = mysql.createConnection(db);
  connection.connect();
  var io = require('socket.io')(server);

  io.on('connection', function(socket){

    socket.on('getPlayer', function(token){
      if(!token){
        return;
      }
      verify(token,function(email){
        getPlayer(connection,socket,email);
      }).catch(console.error);
    });

    socket.on('createNewGame', function(gameID, token){
      if(!token){
        return;
      }
      verify(token,function(email){
        getPlayer(connection,socket,email,true);
      }).catch(console.error);

    });

    socket.on('insertPlayer', function(gameID, name, sprite, token){
      if(!token){
        return;
      }
      verify(token,function(email){
        connection.query(
          'INSERT INTO players(email,name,sprite,gameID) values(?,?,?,?)',
          [email,name,sprite,gameID],
          function (error) {
            if (error) return;
            getPlayer(connection,socket,email);
          });
      }).catch(console.error);

    });

    socket.on('getProgress', function(sessionID,token){
      verify(token,function(){
        connection.query(
          'select i.questionID,categoryID,amount,correct from interactions i \n' +
          'join questions q on q.id = i.questionID \n' +
          'join answers a on i.answerID = a.ID \n' +
          'where sessionId = ?',
          [sessionID],
          function (error, results, fields) {
            if (error) return;
            socket.emit('returnProgress',results);
          });
      }).catch(console.error);
    });

    socket.on('getCategories', function(gameID){
      console.info('getCategories');
      connection.query(
        'SELECT id, name from categories where gameID = ?',
        [gameID],
        function (error, results) {
        if (error) {
          console.error(error);
          return;
        }
        console.info('returning categories');
        socket.emit('returnCategories',results);
      });
    });

    socket.on('getQuestion', function(categoryID, amount){
      connection.query(
        'select q.id as questionID, a.id as answerID, q.text as question, a.text as answer, dailyDouble from questions q \n' +
        'join answers a on a.questionID = q.id \n' +
        'where categoryId = ? AND amount = ?;',
        [categoryID,amount],
        function (error, results) {
        if (error) return;
        results = shuffle(results);
        socket.emit('returnQuestion',results);
      });
    });

    socket.on('checkAnswer', function(questionID,answerID,token){
      verify(token,function(email){
        connection.query(
          'select a.id from questions q \n' +
          'join answers a on a.questionID = q.id \n' +
          'where a.correct = TRUE AND q.id = ? AND a.id = ?;',
          [questionID, answerID],
          function (error, results) {
            if (error) return;
            insertInteraction(connection,socket,email,questionID,answerID,results);
          });
      }).catch(console.error);
    });

    socket.on('getScore', function(sessionID,token){
      verify(token,function(){
        getScore(connection,socket,sessionID);
      }).catch(console.error);
    });

    socket.on('checkCompletion', function(sessionID,token){
      verify(token,function(){
        checkCompletion(connection,socket,sessionID);
      }).catch(console.error);
    });

    socket.on('getLeaderboard', function(){
      getLeaderboard(connection,socket);
    });

    //admin
    socket.on('uploadQuestion', function(text, amount, categoryID){
      connection.query(
        'INSERT INTO questions(text,amount,categoryID) values(?,?,?)',
        [text,amount,categoryID],
        function (error) {
          if (error) return;
        });
    });

    socket.on('uploadAnswer', function(text, correct, questionID){
      connection.query(
        'INSERT INTO answers(text,correct,questionID) values(?,?,?)',
        [text,correct,questionID],
        function (error) {
          if (error) return;
        });
    });
  });
}

module.exports = cpb;
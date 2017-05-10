/////////////////////////////////////////////////////////////////////////////////////
//Smart learning dice 
//Application server



//MongoDB Connection
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); 

var mongoose = require("mongoose");
mongoose.connect("mongodb://shouqdarwish:Mais1996@ds015899.mlab.com:15899/smartlearningdice");


var db = mongoose.connection;
 
 db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connected to MongoDB");
 });
 


var diceSchema = mongoose.Schema({
  score: String
});

var Dice = mongoose.model('Dice', diceSchema);

var userSchema = mongoose.Schema({
  wispid: String,
  wispname: String
});

var User = mongoose.model('User', userSchema);


var quesSchema = mongoose.Schema({
  q: String
});

var Question = mongoose.model('Question', quesSchema);


var scoreSchema = mongoose.Schema({
wisp1id: String,
wisp2id: String,
gamemode: String,
t1: String,
t2: String,
t3: String,
t4: String
});

var Score = mongoose.model('Score', scoreSchema);

var registrationSchema = mongoose.Schema({
  wisp1id: String,
  wisp2id: String,
  username: String,
  password: String
});

var Registration = mongoose.model('Registration', registrationSchema);

/////////////////////////////////////////////////////////////////////////
//MQTT Connection
var mqtt = require('mqtt');
var fs = require('fs');
var KEY = __dirname + '/tls-key.pem';
var CERT = __dirname + '/tls-cert.pem';
var TRUSTED_CA_LIST = [__dirname + '/crt.ca.cg.pem'];
 
var PORT = 1883;
var HOST = 'broker.hivemq.com';
 
 
var options = {
  port: PORT,
  host: HOST,
  keyPath: KEY,
  certPath: CERT,
  rejectUnauthorized : true, 
  //The CA list will be used to determine if server is authorized
  ca: TRUSTED_CA_LIST
};
 
var client = mqtt.connect(options);
client.on('connect', function(){
    console.log('Connected to MQTT');
});



////////////////////////////////////////////////////////////////////////////////
//a simple publish-subscribe

var lastmsg;
client.subscribe('gamescore');
//client.publish('testtopic/smartlearningdice', '6');

//client.publish('testtopic/smartlearningdice/game1score', '20');

client.on('message', function(topic, message) {
  lastmsg = message.toString();
  var fields = lastmsg.split("_");
  var s = new Score
  ({
  wisp1id: fields[0],
  wisp2id: fields[1],
  gamemode: fields[2],
  t1: fields[3],
  t2: fields[4],
  t3: fields[5],
  t4: fields[6]
  });
   s.save(function(error) 
   {
     console.log("Your score has been saved!");
  if (error) {
     console.error(error);
  }
 });

});

 


////////////////////////////////////////////////////////////////////////////////



//NewCode



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

 
var d1 = new Dice({
  score: 2
});
 
 d1.save(function(error) {
     console.log("Your score has been saved!");
 if (error) {
     console.error(error);
  }
 });



Dice.find(function (err, d) {
  if (err) return console.error(err);
  console.log(d);
})

var u1 = new User({
  wispid: "456",
  wispname: "anora"
});
 
 u1.save(function(error) {
     console.log("Your account has been saved!");
 if (error) {
     console.error(error);
  }
 });

 User.find(function (err, u) {
  if (err) return console.error(err);
  console.log(u);
})




//  var q1 = new Question({
//   q: " 14 birds were sitting in a tree. 21 more birds flew up to the tree. How many birds were there altogether in the tree?"
// });
 
//  q1.save(function(error) {
//      console.log("Your account has been saved!");
//  if (error) {
//      console.error(error);
//   }
//  });

//  Question.find(function (err, q) {
//   if (err) return console.error(err);
//   console.log(q);
// })


var s1 = new Score({
wisp1id: "1",
wisp2id: "2",
gamemode: "seq",
t1: "1",
t2: "1",
t3: "0",
t4: "1"
});

 s1.save(function(error) {
     console.log("Your account has been saved!");
 if (error) {
     console.error(error);
  }
 });


  Score.find({wisp1id: s1.wisp1id, wisp2id: s1.wisp2id}, function (err, u) {
  if (err) return console.error(err);
  console.log(u);
})

//GET
app.get('/dice', function(req, res){
  Dice.find(function(err,dices){
    var context = {
      dices: dices.map(function(dice){
        return{
          score: dice.score,
        }
      })
    };
    res.render('dices', context);
    console.log(dices);
  });

    
  });



 app.get('/questions', function(req, res) {
 
       // console.log("fetching dice");
 
        // use mongoose to get all reviews in the database
        Question.find(function(err, d) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(d); // return all reviews in JSON format
      console.log(d);
        });
    });


  app.get('/users', function(req, res) {
 
       // console.log("fetching dice");
 
        // use mongoose to get all reviews in the database
        User.find(function(err, d) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(d); // return all reviews in JSON format
      console.log(d);
        });
    });

//POST

app.post('/newquestion', function(req, res) {
 
        console.log("creating question");
 
 console.log(req.body.q);
        // create a review, information comes from request from Ionic
        Question.create({
            q : req.body.q
        }, function(err, review) {
            if (err)
                res.send(err);
 
            // get and return all the reviews after you create another
            Question.find(function(err, reviews) {
                if (err)
                    res.send(err)
                res.json(reviews);
            });
        });
 
    });




app.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/adduser', function(req, res) {

  var r1 = new Registration({
  wisp1id: req.body.wisp1id,
  wisp2id: req.body.wisp2id,
  username: req.body.username,
  password: req.body.password
});
 
 r1.save(function(error) {
     console.log("Your account has been saved!");
 if (error) {
     console.error(error);
  }
 });

 Registration.find(function (err, u) {
  if (err) return console.error(err);
  console.log(u);
})


});



app.post('/addscore', function(req, res) {

  var s = new Score({
  wisp1id: req.body.wisp1id,
  wisp2id: req.body.wisp2id,
  gamemode: req.body.gamemode,
  t1: req.body.t1,
  t2: req.body.t2,
  t3: req.body.t3,
  t4: req.body.t4,
});
 
 s.save(function(error) {
     console.log("Your score has been saved!");
 if (error) {
     console.error(error);
  }
 });

 Score.find(function (err, u) {
  if (err) return console.error(err);
  console.log(u);
})

});


app.get('/gamescore', function(req, res) {
// console.log(req.param('wisp1id'));
 // console.log(req.params.wisp2id);
 Score.find({wisp1id: "1", wisp2id: "2"}, function (err, u) {
     if (err)
                res.send(err)
 
            res.json(u); // return all reviews in JSON format
      console.log(u);
})

});





////////////////////////////////////////////////////////////////////////////////


//NewCode

 
//  var d1 = new Dice({
//  	score: lastmsg
// });

//  var d2 = new Dice({
//  	score: 56
// });
//  var d3 = new Dice({
//  	score: 57
// });
 
 // d1.save(function(error) {
 //     console.log("Your score has been saved!");
 // if (error) {
 //     console.error(error);
 //  }
 // });

// d2.save(function(error) {
//      console.log("Your score has been saved!");
//  if (error) {
//      console.error(error);
//   }
//  });
// d3.save(function(error) {
//      console.log("Your score has been saved!");
//  if (error) {
//      console.error(error);
//   }
//  });





// var index = require('./routes/index');
// var users = require('./routes/users');

// var app = express();


// Dice.find(function (err, d) {
//   if (err) return console.error(err);
//   console.log(d);
// })



// app.get('/dices', function(req, res){
// 	Dice.find({score: 2}, function(err,dices){
// 		var context = {
// 			dices: dices.map(function(vacation){
// 				return{
// 					score: dice.score,
// 				}
// 			})
// 		};
// 		res.render('dices', context);
// 		console.log(dices.score);
// 	});

    
// });



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});



app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = Dice;
module.exports = app;

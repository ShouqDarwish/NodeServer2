var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET MYBUGS page. */
router.get('/dices', function(req, res) {
    var db = req.db;
    var collection = db.get('dices');
    collection.find({},{},function(e,docs){
        res.render('dices', {
            "dices" : docs
        });
    });
});

router.get('/questions', function(req, res) {
    var db = req.db;
    var collection = db.get('Question');
    collection.find({},{},function(e,docs){
        res.render('questions', {
            "questions" : docs
        });
    });
});

router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});







router.get('/users', function(req, res) {
    var db = req.db;
    var collection = db.get('User');
    collection.find({},{},function(e,docs){
        res.render('users', {
            "users" : docs
        });
    });
});

router.get('/gamescore', function(req, res) {
    var db = req.db;
    var collection = db.get('Score');
   // console.log(req.param('wisp1id'));

    collection.find({wisp1id: "1", wisp2id: "2"},{},function(e,docs){
        res.render('score', {
            "score" : docs
        });
    });
});





/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

module.exports = router;

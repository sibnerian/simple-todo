
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/test');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/todo', function(req, res){
    db.collection('todos').find({}).toArray(function(err, response){
        res.render('todo', {title: "Todo", todos: response})
    })
    
})

app.post('/todo', function(req, res){
    console.log(req.body);
    db.collection('todos').insert({todo: req.body.todo}, function(err, response){
        if(err)
            console.log(err);
        else{
            res.redirect('/todo');
        }
    })
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var mongoose=require('mongoose');
mongoose.connect('mongodb+srv://anything30005:F5Nruod8fTvdNTCz@info30005-1.xpxvw.mongodb.net/Login')
var db=mongoose.connection;

db.on('open',function(){
    console.log('MongoDB connection Successed');
})
db.on('error',function(){
    console.log('MongoDB connection Error');
})


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    defaultLayout: 'home',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

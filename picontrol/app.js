var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gpio = require("pi-gpio");
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

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

app.use('/', routes);
app.use('/users', users);

function activateGpio() {

  var motor1A = 16;
  var motor1B = 18;
  var motor1C = 22;

  function piStart (pinNumber) {
    gpio.open(pinNumber, "output", function(err) {		// Open pin XX for output 
      gpio.write(pinNumber, 1, function() {			// Set pin XX high (1) 
          gpio.close(pinNumber);						// Close pin XX 
      });
    });
  }

  piStart(motor1A);
  piStart(motor1B);
  piStart(motor1C);

  gpio.open(16, "output", function(err) {		// Open pin 16 for output 
    gpio.write(16, 1, function() {			// Set pin 16 high (1) 
        gpio.close(16);						// Close pin 16 
    });
  });
  for (var i = 0; i < 10; i++) {
    console.log('the function was hit');
    console.log(i);
  }
  return 'the function was hit';
}

app.get('/hits', function (req, res) {
  res.send(activateGpio());
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

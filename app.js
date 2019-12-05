var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const app = require("express")();
const stripe = require("stripe")(keySecret);

app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) =>
  res.render("index.pug"));

app.get("/pay", (req, res) =>
  res.render("pay.pug", {keyPublishable}));

app.post("/charge", (req, res) => {
  let amount = 100000;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount: amount,
      description: "A 1 year subsciption to our amazing product!",
         currency: "usd",
         customer: customer.id
    }))
  .then(charge => res.render("charge.pug"));
});

app.listen(4567);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

function paymentInfo(){
  console.log("TEST")
}


module.exports = app;
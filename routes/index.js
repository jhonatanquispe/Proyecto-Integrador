var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});
/* GET login page. */
router.get('/tienda', function(req, res, next) {
  res.render('tienda');
});

/* GET login page. */
router.get('/registrase', function(req, res, next) {
  res.render('registrase');
});
/* POST login page. */
router.post('/dashboard', function(req, res, next) {
  email=req.body.email;
  password=req.body.password;
  dbConn.query("SELECT * FROM usuarios WHERE email='"+email+"' AND password='"+password+"' ",function(err,rows){
    console.log(rows);
    if(err){
      req.flash('error',err);
      console.log(err);
    }else{
      if(rows.length && rows[0]["nivel"]=='admin'){
        req.session.idu=rows[0]["id"];
        req.session.email=rows[0]["email"];
        req.session.loggedin=true;
        res.redirect('/dashboard');
      }else{
        if(rows.length && rows[0]["nivel"]=='trabajador'){
          req.session.idu=rows[0]["id"];
          req.session.email=rows[0]["email"];
          req.session.loggedin=true;
          res.redirect('/dashboard2');
        }else{
        req.flash('error','El usuario no existe...');
        res.redirect('/')
      }
    } 
    }
  });
});

/* GET login page. */
router.get('/dashboard', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/login');
  }else{
    dbConn.query('SELECT count(id) as cantidad FROM categorias',function(err,rows)     {
      if(err) {
          req.flash('error', err); 
      } else {
        res.render('dashboard',{data:rows});
      }
    });
  }
});

router.get('/dashboard2', function(req, res, next) {
  if(!req.session.loggedin){
    res.redirect('/login');
  }else{
    dbConn.query('SELECT count(id) as cantidad FROM categorias',function(err,rows)     {
      if(err) {
          req.flash('error', err); 
      } else {
        res.render('dashboard2',{data:rows});
      }
    });
  }
});
router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;

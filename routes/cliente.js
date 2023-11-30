var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');


/* LISTAR */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM clientes ORDER BY id desc',function(err,rows)     {
      if(err) {
          req.flash('error', err);
          res.render('cliente/index',{data:''});   
      } else {
          res.render('cliente/index',{data:rows});
      }
    });
  });
  
  /* VER FORMULARIO ADD */
  router.get('/add', function(req, res, next) {    
    res.render('cliente/add', {
        razonsocial: ''       
    })
  })
  
  /* INSERTAR EN BASE DE DATOS */
  router.post('/add', function(req, res, next) {    
    let nombre = req.body.razonsocial;
    let errors = false;
  
    if(razonsocial.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('cliente/add', {
            razonsocial : razonsocial
    })
}
    // if no error
    if(!errors) {
        var form_data = {
            razonsocial: razonsocial
        }
        dbConn.query('INSERT INTO clientes SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('cliente/add', {
                    name: form_data.razonsocial                   
                })
            } else {                
                req.flash('success', 'cliente successfully added');
                res.redirect('/cliente');
            }
        })
    }
  })
  
  /* VER FORMULARIO EDITAR */
  router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('SELECT * FROM clientes WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Registro not found with id = ' + id)
            res.redirect('/cliente')
        }
        else {
            res.render('cliente/edit', {
                id: rows[0].id,
                razonsocial: rows[0].razonsocial
            })
        }
    })
  })
  
  /* ACTUALIZAR FORMULARIO BASE DE DATOS */
  router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let nombre = req.body.razonsocial;
    let errors = false;
  
    if(nombre.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('cliente/edit', {
            id: req.params.id,
            razonsocial: razonsocial
        })
    }
  
    if( !errors ) {   
        var form_data = {
            razonsocial: razonsocial
        }
        dbConn.query('UPDATE clientes SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('cliente/edit', {
                    id: req.params.id,
                    razonsocial: form_data.razonsocial
                })
            } else {
                req.flash('success', 'Registro successfully updated');
                res.redirect('/cliente');
            }
        })
    }
  })
  
  /* ELIMINAR REGISTRO BASE DE DATOS */
  router.get('/delete/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('DELETE FROM clientes WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/cliente')
        } else {
            req.flash('success', 'REGISTRO successfully deleted! ID = ' + id)
            res.redirect('/cliente')
        }
    })
  })
  
  
  module.exports = router;
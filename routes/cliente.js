var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');


/* LISTAR */
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM cliente ORDER BY id desc',function(err,rows)     {
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
        razonsocial: '',
        correo: '',
        direccion: '',
        celular: ''                                                                                             
    })
  })
  
  /* INSERTAR EN BASE DE DATOS */
  router.post('/add', function(req, res, next) {    
    let razonsocial = req.body.razonsocial;
    let correo = req.body.correo;
    let direccion = req.body.direccion;
    let celular = req.body.celular;
    let errors = false;
  
    if(razonsocial.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('cliente/add', {
            razonsocial:razonsocial,
            correo:correo,
            direccion:direccion,
            celular:celular
    })
}
    // if no error
    if(!errors) {
        var form_data = {
            razonsocial: razonsocial,
            correo:correo,
            direccion:direccion,
            celular:celular
        }
        dbConn.query('INSERT INTO cliente SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('cliente/add', {
                    name: form_data.razonsocial,   
                    name: form_data.correo ,
                    name: form_data.direccion,
                    name: form_data.celular                 
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
    dbConn.query('SELECT * FROM cliente WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Registro not found with id = ' + id)
            res.redirect('/cliente')
        }
        else {
            res.render('cliente/edit', {
                id: rows[0].id,
                razonsocial: rows[0].razonsocial,
                correo: rows[0].correo,
                direccion: rows[0].direccion,
                celular: rows[0].celular
            })
        }
    })
  })
  
  /* ACTUALIZAR FORMULARIO BASE DE DATOS */
  router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let razonsocial = req.body.razonsocial;
    let correo = req.body.correo;
    let direccion = req.body.direccion;
    let celular = req.body.celular;
    let errors = false;
  
    if(razonsocial.length === 0) {
        errors = true;
        req.flash('error', "Please enter name");
        res.render('cliente/edit', {
            id: req.params.id,
            razonsocial: razonsocial,
            correo:correo,
            direccion:direccion,
            celular:celular
            
        })
    }
  
    if( !errors ) {   
        var form_data = {
            razonsocial: razonsocial,
            correo:correo,
            direccion:direccion,
            celular:celular
        }
        dbConn.query('UPDATE cliente SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('cliente/edit', {
                    id: req.params.id,
                    razonsocial: form_data.razonsocial,
                    correo: form_data.corre,
                    direccion: form_data.direccion,
                    celular: form_data.celular
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
    dbConn.query('DELETE FROM cliente WHERE id = ' + id, function(err, result) {
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
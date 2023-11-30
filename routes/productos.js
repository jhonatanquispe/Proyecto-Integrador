var express=require('express');
var router=express.Router();
var dbConn=require('../lib/db');

/* LISTAR */
router.get('/', function(req, res, next) {
  dbConn.query('SELECT * FROM productos ORDER BY id desc',function(err,rows)     {
    if(err) {
        req.flash('error', err);
        res.render('productos/index',{data:''});   
    } else {
        res.render('productos/index',{data:rows});
    }
  });
});

/* VER FORMULARIO ADD */
router.get('/add', function(req, res, next) {    
  res.render('productos/add', {
      Nombre: ''       
  })
})

/* INSERTAR EN BASE DE DATOS */
router.post('/add', function(req, res, next) {    
  let nombre = req.body.Nombre;
  let errors = false;

  if(nombre.length === 0) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('productos/add', {
        nombre: Nombre
      })
  }

  // if no error
  if(!errors) {
      var form_data = {
        nombre: Nombre
      }
      dbConn.query('INSERT INTO productos SET ?', form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('productos/add', {
                  name: form_data.Nombre                   
              })
          } else {                
              req.flash('success', 'productos successfully added');
              res.redirect('/productos');
          }
      })
  }
})

/* VER FORMULARIO EDITAR */
router.get('/edit/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('SELECT * FROM productos WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err
      if (rows.length <= 0) {
          req.flash('error', 'Registro not found with id = ' + id)
          res.redirect('/productos')
      }
      else {
          res.render('productos/edit', {
              id: rows[0].id,
              nombre: rows[0].Nombre
          })
      }
  })
})

/* ACTUALIZAR FORMULARIO BASE DE DATOS */
router.post('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let nombre = req.body.nombre;
  let errors = false;

  if(nombre.length === 0) {
      errors = true;
      req.flash('error', "Please enter name");
      res.render('productos/edit', {
          id: req.params.id,
          nombre: Nombre
      })
  }

  if( !errors ) {   
      var form_data = {
        nombre: Nombre
      }
      dbConn.query('UPDATE productos SET ? WHERE id = ' + id, form_data, function(err, result) {
          if (err) {
              req.flash('error', err)
              res.render('productos/edit', {
                  id: req.params.id,
                  nombre: form_data.Nombre
              })
          } else {
              req.flash('success', 'Registro successfully updated');
              res.redirect('/productos');
          }
      })
  }
})

/* ELIMINAR REGISTRO BASE DE DATOS */
router.get('/delete/(:id)', function(req, res, next) {
  let id = req.params.id;
  dbConn.query('DELETE FROM productos WHERE id = ' + id, function(err, result) {
      if (err) {
          req.flash('error', err)
          res.redirect('/productos')
      } else {
          req.flash('success', 'REGISTRO successfully deleted! ID = ' + id)
          res.redirect('/productos')
      }
  })
})


module.exports = router;
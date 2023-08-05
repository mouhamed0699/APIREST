const express = require('express');


var ControUser=require('../controllers/contro1')

exports.router=(function(){
  const router = express.Router();

  router.route('/updatevol/:id').put(ControUser.UpdateVol)
  router.route('/updatevoiture/:id').put(ControUser.UpdateVoiture)
  router.route('/updatechambre/:id').put(ControUser.UpdateChambre)
  router.route('/updateUser/:id').put(ControUser.UpdateUser)
  return router
})();

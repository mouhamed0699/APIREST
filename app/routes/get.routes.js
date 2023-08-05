const express = require('express');


var ControUser=require('../controllers/contro1')

exports.router=(function(){
  const router = express.Router();

  router.route('/chambre').get(ControUser.recupereChambre)
  router.route('/users').get(ControUser.recupereUser)
  router.route('/voiture').get(ControUser.recupereVoiture)
  router.route('/vol').get(ControUser.recupereVol)
  router.route('/vol/:id').get(ControUser.recupereUneVol)
  router.route('/voiture/:id').get(ControUser.recupereUneVoiture)
  router.route('/chambre/:id').get(ControUser.recupereUneChambre)
  router.route('/RecupereCompagnie').get(ControUser.recupereCategoriCompgnie)
  router.route('/recupereCategoriModele').get(ControUser.recupereCategoriModele)
  return router
})();

const express = require('express');


var ControUser=require('../controllers/contro1')

exports.router=(function(){
  const router = express.Router();

  router.route('/inscription').post(ControUser.inscrire);
  router.route('/connection').post(ControUser.connection)
  router.route('/InsertChambre').post(ControUser.InserChambre)
  router.route('/InsertVoiture').post(ControUser.InserVoiture)
  router.route('/InsertVols').post(ControUser.InserVol)
  router.route('/InsertUser').post(ControUser.InserUser)
  router.route('/InserChambreTampo').post(ControUser.InserChambreTampo)
  router.route('/SuprimeChambreTampo').post(ControUser.SuprimeChambreTampo)
  return router
})();



























// router.get('/', (req, res, next) => {
//   res.json({ message: 'Voici les données des articles' });
// });

// router.post('/', (req, res, next) => {
//     res.json({ message: req.body.message });
//   });

// router.put('/:id', (req, res, next) => {
// res.json({ message: req.params.id });
// });

// router.delete('/:id', (req, res, next) => {
//     res.json({ message: req.params.id });
//   });


// module.exports = router;

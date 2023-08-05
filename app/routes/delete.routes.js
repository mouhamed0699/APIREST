const express = require('express');


var ControUser=require('../controllers/contro1')

exports.router=(function(){
  const router = express.Router();

  router.route('/Deletevol/:id').delete(ControUser.DeleteVol)
  router.route('/Deletevoiture/:id').delete(ControUser.DeleteVoiture)
  router.route('/Deletechambre/:id').delete(ControUser.DeleteChambre)
  router.route('/Deleteuser/:id').delete(ControUser.DeleteUsers)
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

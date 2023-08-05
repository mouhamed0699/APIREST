const express=require("express")
const axios = require('axios');
const pool = require('./db/db1');
const port=5200
const app=express()
var ApiPostRouter=require('./app/routes/post.routes').router
var ApiGetRouter=require('./app/routes/get.routes').router
var ApiDeleteRouter=require('./app/routes/delete.routes').router
var ApiUpdateRouter=require('./app/routes/update.routes').router
var bodyPraser=require('body-parser')

app.use(bodyPraser.urlencoded({extended:false}));

app.use(express.json())
app.use(express.urlencoded())
app.set('view engine', 'ejs');

// app.use("/post",require("./app/routes/post.routes"))


// midellewares  les sessions

var session = require('express-session');
const { render } = require("ejs");
app.set('trust proxy', 1) 
app.use(session({
  secret: 'mou1234ZRD',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


//


app.use(express.static('public'))
app.use('/api/',ApiPostRouter)
app.use('/api/',ApiGetRouter)
app.use('/api/',ApiDeleteRouter)
app.use('/api/',ApiUpdateRouter)

app.get('/', (req, res) => {
    res.render('./index',{loggedIn:req.session.loggedIn,userId:req.session.userId});
  });

  
  app.get('/voiture', (req, res) => {
    const loggedIn = req.session.loggedIn
    const userId=req.session.userId;
    const status=req.session.status;
    res.render('voiture', {loggedIn,userId,status});
  })

app.post('/recherchervol', (req, res) => {
    const depart = req.body.depart;
    const destination = req.body.destination;
    const loggedIn = req.session.loggedIn;
    const userId = req.session.userId;
    const status = req.session.status;

    const selectQuery = 'SELECT * FROM modificationvol';
    pool.query(selectQuery, (err, resultats) => {
      if (err) {
        console.error('Erreur lors de la récupération des données :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        return;
      }
  
    // Appel de votre API pour obtenir les résultats de recherche de vol en utilisant les données destination et date
    axios.get('http://localhost:5200/api/vol', {
        params: {
        aeroportdep: depart,
        aeroportarr: destination,
        }
    })
    .then(function (response) {
      var results = response.data; // Supposons que la réponse de votre API renvoie un tableau de résultats de recherche
      if (depart) {
        results = results.filter(vols => vols.aeroportdep.toLowerCase().includes(depart.toLowerCase()));
      }
      if (destination) {
        results = results.filter(vols => vols.aeroportarr.toLowerCase().includes(destination.toLowerCase()));
      }
      // Rendu de la vue EJS "rechercher-vol" avec les résultats de recherche
      res.render('recherchervol', { depart: depart, destination: destination, results: results, loggedIn, userId, status, resultats: resultats.rows });
    })
    .catch(function (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la recherche de vol');
    });
  });
});
  app.post('/recherchevoiture', (req, res) => {
    const modele = req.body.modele;
    const prixSelectionne = req.body.prixSelectionne;
    const loggedIn = req.session.loggedIn;
    const userId = req.session.userId;
    const status = req.session.status;

    // Vérification supplémentaire : s'assurer que l'utilisateur a saisi un modèle et un prix pour effectuer la recherche
    if (!modele || !prixSelectionne) {
        return res.status(400).send("Veuillez saisir à la fois le modèle et le prix pour effectuer la recherche.");
    }

    // Supposons que la valeur de prixSelectionne est au format "min-max", par exemple "50-70"
    // Vous pouvez maintenant séparer la valeur pour obtenir la fourchette de prix minimale et maximale
    const [prixMin, prixMax] = prixSelectionne.split('-');

    // Appel de votre API pour obtenir les résultats de recherche de voiture en utilisant les données modèle et prix
    axios.get('http://localhost:5200/api/voiture', {
        params: {
            modele: modele,
            prixMin: prixMin,
            prixMax: prixMax
        }
    })
    .then(function (response) {
        let results = response.data; // Supposons que la réponse de votre API renvoie un tableau de résultats de recherche
        
        // Filtrez les résultats en fonction du modèle et du prix
        if (modele) {
            results = results.filter(voiture => voiture.modele.toLowerCase().includes(modele.toLowerCase()));
        }

        if (prixSelectionne) {
            results = results.filter(voiture => voiture.prix >= prixMin && voiture.prix <= prixMax);
        }

        // Rendu de la vue EJS "recherchevoiture" avec les résultats de recherche
        res.render('recherchevoiture', { modele: modele, prixSelectionne: prixSelectionne, results: results, loggedIn, userId, status });
    })
    .catch(function (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la recherche de voiture');
    });
});


app.post('/modifier/:vin', (req, res) => {
    const vin = req.params.vin;
    const { modele, prix} = req.body;
    const modif = "Modification";

  
    const insert = 'INSERT INTO modificationvoiture (vin1, modele, prix,statut) VALUES ($1, $2, $3, $4)';
    pool.query(insert, [vin, modele, prix, modif], (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour dans la base de données :', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour dans la base de données' });
        return;
      }
    })
  });
 
app.get('/chambre', (req, res) => {
res.render('chambre');
});

app.post('/rechercheChambre', (req, res) => {
    const status = req.session.status;
    const hotel = req.body.hotel;
    const ville = req.body.ville;
    const prix = req.body.prix;
    const ListPrix=prix.split("-")
    const min=ListPrix[0]
    const max=ListPrix[1]
    const v="$100";

    const selectQuery = 'SELECT * FROM modificationchambre';
    pool.query(selectQuery, (err, resultats) => {
      if (err) {
        console.error('Erreur lors de la récupération des données :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        return;
      }
    
    axios.get('http://localhost:5200/api/chambre', {
        params: {
            Hotel: hotel,
            ville: ville,
            prix: prix,
        }
    })
    .then(function (response) {
        const results = response.data;
        let donnee = [];
        donnee=results.filter(element=> element.ville===ville && element.nom_hotel===hotel && parseFloat(element.prix.substr(1))>=min && parseFloat(element.prix.substr(1))<max)

        console.log(resultats.rows[0])
        res.render('recherchechambre', { hotel: hotel, ville: ville, prix: prix, donnee: donnee,status:status,resultats:resultats.rows });
    })
    .catch(function (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la recherche de vol');
    });
  })
});

// mise a jour:


// page d'accueil

app.set('view engine','ejs')

app.get('/index', (req, res) => {
    console.log(req.session.loggedIn)
    console.log(req.session.userId)
    res.render('./index', { loggedIn:req.session.loggedIn,userId:req.session.userId });
});

app.get('/', (req, res) => {
    res.render('./index', { loggedIn:req.session.loggedIn,userId:req.session.userId});
});
app.get('/vol', (req, res) => {
    const loggedIn = req.session.loggedIn;
    const userId = req.session.userId;
    const status = req.session.status;
    console.log(loggedIn ,userId, status)

    res.render('vol', {loggedIn,userId,status});
  });

  
app.get('/visualisation', (req, res) => {
    Promise.all([
        axios.get('http://localhost:5200/api/voiture'),
        axios.get('http://localhost:5200/api/chambre'),
        axios.get('http://localhost:5200/api/vol'),
        axios.get('http://localhost:5200/api/users'),
        axios.get('http://localhost:5200/api/RecupereCompagnie'),
      ])
      .then(function (responses) {
        const results = responses[0].data;
        const resultsC = responses[1].data;
        const resultsV = responses[2].data;
        const resultsU = responses[3].data;
        const Compagnie= responses[4].data;
  
        res.render('./dash', { results: results, resultsC: resultsC, resultsV: resultsV,resultsU: resultsU,Compagnie:Compagnie});
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la recherche des données');
      });
});
// dashborde

app.get('/dashbord', (req, res) => {
    Promise.all([
      axios.get('http://localhost:5200/api/voiture'),
      axios.get('http://localhost:5200/api/chambre'),
      axios.get('http://localhost:5200/api/vol'),
      axios.get('http://localhost:5200/api/users'),
    ])
      .then(function (responses) {
        const results = responses[0].data;
        const resultsC = responses[1].data;
        const resultsV = responses[2].data;
        const resultsU = responses[3].data;
  
        res.render('./table', { results: results, resultsC: resultsC, resultsV: resultsV,resultsU: resultsU});
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la recherche des données');
      });
  });
  


// page pour la connexion


app.get('/connexion', (req, res) => {
    const message = 'Hello, world!';
    res.render('./connexion', { message });
});

app.get('/inscription', (req, res) => {
    const message = 'Hello, world!';
    
    res.render('./inscription', { message });
});

app.post('/modifier/:id', (req, res) => {
  const id = req.params.id;
  const { compagnie, aeroportdep, heuredep, aeroportarr, heurearr, prix } = req.body;
  console.log(id,compagnie,aeroportarr,aeroportdep,heurearr,heuredep)
  const modif = "Modification";

  const insert = 'INSERT INTO modificationvol (id_corr, compagnie, aeroportdep, heuredep, aeroportarr, heurearr, prix, statut) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  pool.query(insert, [id, compagnie, aeroportdep, heuredep, aeroportarr, heurearr, prix, modif], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour dans la base de données :', err);
      res.status(500).json({ error: 'Erreur lors de la mise à jour dans la base de données' });
      return;
    }

    console.log('Modification enregistrée dans la base de données');
    res.json({ message: 'Modification enregistrée avec succès' });
  });
});

app.post('/supprimer/:id', (req, res) => {
  const id = req.params.id;
  // const { compagnie, aeroportdep, heuredep, aeroportarr, heurearr, prix } = req.body;
  const modif = "Suppression";

  const selectQuery = 'SELECT * FROM vols WHERE id=$1';
  pool.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      return;
    }

    const insertQuery = 'INSERT INTO modificationvol (id_corr, compagnie, aeroportdep, heuredep, aeroportarr, heurearr, prix, statut) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    pool.query(insertQuery, [result.rows[0].id, result.rows[0].compagnie, result.rows[0].aeroportdep, result.rows[0].heuredep, result.rows[0].aeroportarr, result.rows[0].heurearr, result.rows[0].prix, modif], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans une autre table :', err);
        res.status(500).json({ error: 'Erreur lors de l\'insertion dans une autre table' });
        return;
      }

      console.log('Données sauvegardées dans la table temporaire');
      res.json({ message: 'Données sauvegardées dans la table temporaire' });
    });
  });
}),

app.post('/api', ApiPostRouter);



app.listen(port,()=> console.log("le server a demarer au port " + port))

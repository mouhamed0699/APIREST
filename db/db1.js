const {Pool}=require('pg')

const pool= new Pool({
    user: 'tonnomusers',
    host: 'localhost',
    database: 'cmd_service',
    password: '*******',
    port: 5432, // le port par défaut de PostgreSQL est 5432
})

pool.connect((error, client, release) => {
    if (error) {
      console.error('Erreur lors de la connexion à la base de données :', error);
    } else {
      console.log('Connexion à la base de données réussie !');
  
      // Vous pouvez exécuter d'autres opérations ici
      // ...
  
      release(); // Libérer le client de la base de données
    }
  });

  module.exports=pool;
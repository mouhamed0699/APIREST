var bcrypt=require('bcrypt')
var jwt=require('jsonwebtoken')

const pool=require('../../db/db1')

var jwtUtil=require('../../utils/jwt.utlis');

const EMAIL_regax=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const decription_Password='Le premier caractère du mot de passe doit être une lettre, il doit contenir au moins 4 caractères et pas plus de 15 caractères et aucun caractère autre que des lettres, des chiffres et le trait de soulignement ne peut être utilisé';

const Passwor_Regex=/^[a-zA-Z]\w{3,14}/

module.exports={
    inscrire: async function(req, res) {
        try {
            const email=req.body.email;
            const nom=req.body.nom;
            const prenom=req.body.prenom;
            const password=req.body.password1;
           
         
          const query = "SELECT * FROM users WHERE email = $1";
          const value = [email];
          const resultats = await pool.query(query, value);
          if(!EMAIL_regax.test(email)){
            console.log('votre mail est invalide')
            return res.status(400).json({'error':'votre mail est invalide'})
          }

          if(!Passwor_Regex.test(password)){
            return res.status(400).json({'erreur':' le mot de passe est incorrect: (' +(decription_Password) + ')'})
          }
          if (resultats.rows.length > 0) {
            console.log('Ce mail existe déjà dans la base de données');
            return res.status(400).json({ message: 'Ce mail existe déjà dans la base de données' });
          }
    
          
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
    
         
          const insert = "INSERT INTO users (prenom, nom, email, password) VALUES ($1, $2, $3, $4)";
          const values = [prenom, nom, email, hashedPassword];
          await pool.query(insert, values);
    
          console.log('Données insérées avec succès');
          res.redirect('/connexion');
        
        } catch (error) {
          console.error('Erreur lors de l\'inscription :', error);
          return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        }
      },
    
    connection: async function(req, res) {
        try {
          const { email, password } = req.body;
    
          // Récupération des données de l'users depuis la base de données
          const query = "SELECT * FROM users WHERE email = $1";
          const value = [email];
          const result = await pool.query(query, value);

          if (result.rows.length === 0) {
            console.log('Email non trouvé');
            return res.status(400).json({ message: 'Email non trouvé' });
          }
    
          const hashedPassword = result.rows[0].password;
    
          // Comparaison du mot de passe fourni avec le mot de passe haché enregistré dans la base de données
          const isMatch = await bcrypt.compare(password, hashedPassword);
    
          if (isMatch) {
            console.log('Mot de passe correct');

            req.session.loggedIn=true;
            req.session.userId=result.rows[0].prenom;
            req.session.status=result.rows[0].statut;
            res.redirect('/')
            // return res.status(200).json({
            //      'usersId': 'Mot de passe correct',
            //      'token':jwtUtil.genereToken(result.rows[0])
            //     });
          } else {

            console.log('Mot de passe incorrect');
            return res.status(400).json({ message: 'Mot de passe incorrect' });
          }
        } catch (error) {
          console.error('Erreur lors de la connexion :', error);
          return res.status(500).json({ message: 'Erreur lors de la connexion' });
        }
      },
      InserChambre: async function(req,res){
        try{
          const { hotel,Prix ,Note, ville,  localisation,image} = req.body;
          console.log(hotel,ville)
          var query="INSERT INTO chambre(ville, nom_hotel,prix,note,localisation,image) VALUES($1,$2,$3,$4,$5,$6)";
          const Val=[ville,hotel,Prix,Note,localisation,image]
          await pool.query(query,Val);
          console.log('insertion reussi')
          return res.status(200).json({message:'reussi'})
        }catch(error){
          console.log(error)
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      InserChambreTampo: async function(req,res){
        try{
          const { hotel,Prix ,Note, ville,  localisation,image,id_corr} = req.body;
          const statut="Modification"
          console.log(hotel,ville)
          var query="INSERT INTO modificationchambre(id_corr,ville, nom_hotel,prix,statut,note,localisation,image) VALUES($1,$2,$3,$4,$5,$6,$7,$8)";
          const Val=[id_corr,ville,hotel,Prix,statut,Note,localisation,image]
          await pool.query(query,Val);
          console.log('insertion reussi')
          return res.status(200).json({message:'reussi'})
        }catch(error){
          console.log(error)
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },

      SuprimeChambreTampo: async function(req,res){
        try{
          const {id_corr} = req.body;
          const statut="Supression"

          const selectElementId="SELECT * FROM chambre WHERE id=$1"
          const result=pool.query(selectElementId,[id_corr])
          console.log((await result).rows[0])
          const ville=(await result).rows[0].ville
          const nom_hotel=(await result).rows[0].nom_hotel
          const prix=(await result).rows[0].prix
          const note=(await result).rows[0].note
          const localisation=(await result).rows[0].localisation
          const image=(await result).rows[0].image
          console.log(nom_hotel,ville)
          var query="INSERT INTO modificationchambre(id_corr,ville, nom_hotel,prix,statut,note,localisation,image) VALUES($1,$2,$3,$4,$5,$6,$7,$8)";
          const Val=[id_corr,ville,nom_hotel,prix,statut,note,localisation,image]
          await pool.query(query,Val);
          console.log('insertion reussi')
          return res.status(200).json({message:'reussi'})
        }catch(error){
          console.log(error)
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      InserVoiture: async function(req,res){
        try{
          const { modele,Prix ,image} = req.body;
          console.log(modele,Prix,image)
          var query="INSERT INTO voiture(modele, prix,image) VALUES($1,$2,$3)";
          const Val=[modele,Prix,image]
          await pool.query(query,Val);
          console.log('insertion reussi')
          return res.status(200).json({message:'reussi'})
        }catch(error){
          console.log(error)
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      InserVol: async function(req,res){
        try{
          const {compagnie,aerodep,heuredep,heurearr,aeroportarr, prix} = req.body;
          
          var query="INSERT INTO vols(compagnie, heuredep,aeroportdep,heurearr,aeroportarr,prix) VALUES($1,$2,$3,$4,$5,$6)";
          const Val=[compagnie,heuredep,aerodep,heurearr,aeroportarr,prix]
          await pool.query(query,Val);
          console.log('insertion reussi')
          return res.status(200).json({message:'reussi'})
        }catch(error){
          console.log(error)
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      InserUser: async function(req,res){
        try{
          const {nom,prenom,email,password} = req.body;
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          var query="INSERT INTO users(nom, prenom,email,password) VALUES($1,$2,$3,$4)";
          const Val=[nom,prenom,email,hashedPassword]
          await pool.query(query,Val);
          console.log('insertion reussi')
          return res.status(200).json({message:'reussi'})
        }catch(error){
          console.log(error)
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereChambre: async function(req,res){
        try{
          var query="SELECT * FROM chambre";
          var data= await pool.query(query);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereUser: async function(req,res){
        try{
          var query="SELECT * FROM users";
          var data= await pool.query(query);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereVoiture: async function(req,res){
        try{
          var query="SELECT * FROM voiture";
          var data= await pool.query(query);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereVol: async function(req,res){
        try{
          var query="SELECT * FROM vols";
          var data= await pool.query(query);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereUneVol: async function(req,res){
        try{
          const id =req.query.id
          var query="SELECT * FROM vols WHERE id=$1";
          var value=[id]
          console.log(value)
          var data= await pool.query(query,value);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereUneVoiture: async function(req,res){
        try{
          const id =req.query.id
          var query="SELECT * FROM voiture WHERE vin=$1";
          var value=[id]
          console.log(value)
          var data= await pool.query(query,value);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereUneChambre: async function(req,res){
        try{
          const id =req.query.id
          var query="SELECT * FROM chambre WHERE id=$1";
          var value=[id]
          console.log(value)
          await pool.query(query,value);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereCategoriCompgnie: async function(req,res){
        try{
          var query="select DISTINCT compagnie as Compagnie,count(*) from vols group by Compagnie";
          var data= await pool.query(query);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      recupereCategoriModele: async function(req,res){
        try{
          var query="select DISTINCT modele as Modele,count(*) from voiture group by Modele";
          var data= await pool.query(query);
          return res.status(200).json(data.rows)
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      DeleteChambre: async function(req,res){
        try{
          const id =req.body.id
          var query="DELETE FROM chambre where id=$1";
          var value=[id]
          console.log(value)
          await pool.query(query,value);
          return res.status(200).json({message:'supression de chambre reussi'})
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      DeleteVoiture: async function(req,res){
        try{
          const id =req.body.id
          var query="DELETE FROM voiture WHERE vin=$1";
          var value=[id]
          console.log(value)
          await pool.query(query,value);
          return res.status(200).json({message:'supression de voiture reussi'})
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      DeleteVol: async function(req,res){
        try{
          const id =req.body.id
          var query="DELETE FROM vols WHERE id=$1";
          var value=[id]
          console.log(value)
          await pool.query(query,value);
          console.log('supression ruissi')
          return res.status(200).json({message:'supression de vol reussi'})
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      DeleteUsers: async function(req,res){
        try{
          const id =req.body.id
          var query="DELETE FROM users WHERE id=$1";
          var value=[id]
          console.log(value)
          await pool.query(query,value);
          console.log('supression ruissi')
          return res.status(200).json({message:'supression d users reussi'})
        }catch(error){
          return res.status(500).json({ message: 'Erreur ' });
        }
        
      },
      UpdateChambre: async function (req, res) {
        try {
          const id = req.body.id; 
          const { hotel, ville, note, prix } = req.body;
          console.log(ville,hotel,prix,note,id)
      
          var query = "UPDATE chambre SET nom_hotel=$1, ville=$2, note=$3, prix=$4 WHERE id=$5";
          var values = [hotel, ville, note, prix, id];
      
          await pool.query(query, values);
      
          return res.status(200).json({ message: 'Mise à jour réussie' });
        } catch (error) {
          return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
        }
      },
      UpdateVoiture: async function(req, res) {
        try {
          const id = req.query.id;
          const { modele, prix } = req.body; 
      
          var query = "UPDATE voiture SET modele=$1, prix=$2 WHERE vin=$3";
          var values = [modele, prix, id];
      
          await pool.query(query, values);
      
          return res.status(200).json({ message: 'Mise à jour réussie' });
        } catch (error) {
          return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
        }
      },
      UpdateVol: async function (req, res) {
        try {
          const id = req.body.id; 
          const { compagnie,aerodep,heuredep,heurearr } = req.body;
          console.log(compagnie,aerodep,heurearr,heuredep,id)
          var query = "UPDATE vols SET compagnie=$1, aeroportdep=$2, heuredep=$3, heurearr=$4 WHERE id=$5";
          var values = [compagnie,aerodep,heuredep,heurearr, id];
      
          await pool.query(query, values);
      
          return res.status(200).json({ message: 'Mise à jour réussie' });
        } catch (error) {
          return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
        }
      },
      UpdateUser: async function (req, res) {
        try {
          const id = req.body.id; 
          const nom = req.body.nom;
          const {prenom,email,statut} = req.body;
      
          var query = "UPDATE users SET nom=$1, prenom=$2, email=$3, statut=$4  WHERE id=$5";
          var values = [nom,prenom,email,statut,id];
      
          await pool.query(query, values);
      
          return res.status(200).json({ message: 'Mise à jour réussie' });
        } catch (error) {
          console.log(error)
          return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
        }
      },
      
}

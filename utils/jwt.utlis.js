var jwt=require('jsonwebtoken');
const secret="abdhhdhddjjdjd1234dhdhdhdjerhddjdjdç"
module.exports={
    genereToken: function(data){
        return jwt.sign({
            userid:data.id,
            userNom:data.mail
        },
        secret,
        {
            expiresIn:"1h"
        }
        )
    }
}
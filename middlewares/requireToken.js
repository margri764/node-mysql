
import jwt from 'jsonwebtoken';
import  { pool }  from "../db/config.db.js";



export const requireToken = async ( req, res, next ) => {

    try {

        let token = req.headers?.authorization;

        if(!token){
            return res.status(401).json({
                message:'There is no token in the header. Please log in again with your credentials'
            })
        }

        token = token.split(" ")[1];

        // console.log('desde require token: ', token);
      

        const  { userName }  = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        let userAuth = null;

        const [rows] = await pool.execute('SELECT * FROM users WHERE userName = ? LIMIT 1', [userName]);
         userAuth = rows.length > 0 ? rows[0] : null;
    


        if(userAuth == null ){
              return res.status(400).json({
                  message:'Invalid Token'
              })
        }
        req.userAuth= userAuth;

        
  
        next();
        
    } catch (error) {
        console.log('requireToken Error: ', error);
        return res.status(401).json({
            success: false,
            error : "Token Error",
        })

    }

}



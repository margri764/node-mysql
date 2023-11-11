import express from 'express';
import cors from 'cors';
import path from "path";
import morgan from "morgan";
import authRoutes from '../routes/auth.routes.js';
import userRoutes from '../routes/user.routes.js';

class Server{

        constructor(){
            this.app = express();
            this.port = process.env.PORT;
            this.middlewares();
            this.routes();
        }

    middlewares(){
        this.app.use(cors());
        this.app.use (express.json());
        this.app.use(morgan('dev'));
        this.app.use(express.static('public'));
    }    

    routes(){

        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/user', userRoutes);
     

        this.app.get('*', (req, res) => { 
            res.sendFile( path.resolve( __dirname,'../public/index.html') )
            });
              
    }

    listen(){
        this.app.listen(this.port)
        console.log('servidor corriendo en puerto', this.port)
    }



}

export default Server ;
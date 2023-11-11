import { Router } from 'express';
import {check} from 'express-validator';
const router =  Router();
import { login } from '../controllers/auth.controllers.js';

router.post('/login',[
    
], login);  




export default router;

import { Router } from 'express';
import {check} from 'express-validator';
import { createUser, editUserById, getAllUsers } from '../controllers/user.controllers.js';
import { requireToken } from '../middlewares/requireToken.js';
import { validateUserMiddleware } from '../middlewares/validateUserMiddleware.js';
import { adminRole } from '../helpers/check-role.js';
const router =  Router();


router.post('/createUser',[
    validateUserMiddleware
], createUser);

router.get('/getAllUsers',[
    requireToken,
], getAllUsers);

router.put('/updateUser/:id',[
    requireToken,
    adminRole,
], editUserById);


export default router;

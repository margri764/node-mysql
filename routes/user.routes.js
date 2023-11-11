import { Router } from 'express';
import {check, query} from 'express-validator';
import { createUser, deleteUserById, editUserById, getAllUsers, getUserById, searchUser } from '../controllers/user.controllers.js';
import { requireToken } from '../middlewares/requireToken.js';
import { validateUserMiddleware } from '../middlewares/validateUserMiddleware.js';
import { adminRole } from '../helpers/check-role.js';
import { checkFields } from '../middlewares/check-fields.js';
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

router.get('/getUser/:id',[
    requireToken,
], getUserById);

router.patch('/deleteUser/:id',[
    requireToken,
], deleteUserById);

router.get('/searchUser',[
    requireToken,
    query('querySearch').trim().escape().notEmpty() .withMessage('query to search is required'),
    checkFields 
], searchUser);




export default router;

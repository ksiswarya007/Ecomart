import express from 'express'
import { isAuth, login, logout, Register } from '../controllers/UserController.js';
import authUser from '../middleware/authUser.js';

const userRouter=express.Router();

userRouter.post('/register',Register)
userRouter.post('/login',login)
userRouter.get('/is-auth',authUser,isAuth)
userRouter.get('/logout',authUser,logout)



export default userRouter;
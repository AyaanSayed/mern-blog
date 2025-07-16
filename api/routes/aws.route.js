import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {create } from '../controllers/aws.controller.js';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();

router.post("/create", verifyToken, create);

export default router;
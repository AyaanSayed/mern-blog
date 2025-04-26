import express from 'express';
import { create, getposts, deletepost, updatepost } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/create", verifyToken, create);

router.get("/getposts", getposts)

router.delete("/delete/:postId/:userId", verifyToken, deletepost)
router.put("/update/:postId/:userId", verifyToken, updatepost)


export default router;
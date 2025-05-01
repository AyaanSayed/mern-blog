import express from "express";
const router = express.Router();
import { createComment, getPostComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);

export default router;
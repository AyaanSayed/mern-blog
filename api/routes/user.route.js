import express from "express";
const router = express.Router();
import { deleteUser, signout, test, updateUser , getusers, getuser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getusers);
router.get("/:userId", getuser);

export default router;
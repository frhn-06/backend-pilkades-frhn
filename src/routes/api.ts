import express from "express"
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import aclMiddleware from "../middleware/acl.middleware";
import tpsController from "../controllers/tps.controller";

const router = express.Router();


router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

router.get("/auth/me", [authMiddleware], authController.FindMeByToken);





router.post("/tps", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.create);

router.get("/all-tps", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.findAll);

router.get("/tps/:id/admin", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.findByIdForAdmin);

router.get("/tps/petugas", [authMiddleware, aclMiddleware(["PETUGAS"])], tpsController.findByPetugas);



export default router;
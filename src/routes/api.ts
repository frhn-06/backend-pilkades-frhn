import express from "express"
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import aclMiddleware from "../middleware/acl.middleware";
import tpsController from "../controllers/tps.controller";
import electionController from "../controllers/election.controller";
import mediaMiddleware from "../middleware/media.middleware";
import mediaController from "../controllers/media.controller";
import petugasController from "../controllers/petugas.controller";

const router = express.Router();


router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

router.get("/auth/me", [authMiddleware], authController.FindMeByToken);



router.post("/election", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], electionController.create);

router.get("/election", electionController.findOne);

router.patch("/election/:id/update",  [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], electionController.update);

router.delete("/election/:id/delete",  [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], electionController.delete);




router.post("/tps", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.create);

router.get("/all-tps", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.findAll);

router.get("/tps/:id/admin", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.findByIdForAdmin);

router.get("/tps/petugas", [authMiddleware, aclMiddleware(["PETUGAS"])], tpsController.findByPetugas);

router.patch("/tps/:id", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.update);

router.delete("/tps/:id", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.delete);



router.post("/media/upload-single", [authMiddleware, aclMiddleware(["SUPER_ADMIN"]), mediaMiddleware.single("file")], mediaController.uploadSingle);

router.delete("/media/delete-single", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], mediaController.removeSingle);




router.post("/petugas", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.create);

router.get("/petugas", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.findAll);

router.get("/petugas/:id", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.findOne);

router.patch("/petugas/:id", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.update);

router.delete("/petugas/:id", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.delete);

export default router;
import express from "express"
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import aclMiddleware from "../middleware/acl.middleware";
import tpsController from "../controllers/tps.controller";
import electionController from "../controllers/election.controller";
import mediaMiddleware from "../middleware/media.middleware";
import mediaController from "../controllers/media.controller";
import petugasController from "../controllers/petugas.controller";
import electionMiddleware from "../middleware/election.middleware";
import candidateController from "../controllers/candidate.controller";

const router = express.Router();


router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

router.get("/auth/me", [authMiddleware], authController.FindMeByToken);



router.post("/election", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], electionController.create);

router.get("/election", [authMiddleware], electionController.findOne);

router.patch("/election",  [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], electionController.update);

router.delete("/election",  [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], electionController.delete);

router.patch("/election/status",  [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], electionController.status);




router.post("/tps", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.create);

router.get("/tps", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.findAll);

router.get("/tps/:id/admin", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.findByIdForAdmin);

router.get("/tps/petugas", [authMiddleware, electionMiddleware, aclMiddleware(["PETUGAS"])], tpsController.findByPetugas);

router.patch("/tps/:id", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.update);

router.delete("/tps/:id", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], tpsController.delete);



router.post("/media/upload-single", [authMiddleware, aclMiddleware(["SUPER_ADMIN"]), mediaMiddleware.single("file")], mediaController.uploadSingle);

router.delete("/media/delete-single", [authMiddleware, aclMiddleware(["SUPER_ADMIN"])], mediaController.removeSingle);




router.post("/petugas", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.create);

router.get("/petugas", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.findAll);

router.get("/petugas/:id", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.findOne);

router.patch("/petugas/:id", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.update);

router.delete("/petugas/:id", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.delete);

router.patch("/petugas/:id/non-active", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.nonActive);

router.patch("/petugas/:id/active", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], petugasController.active);




router.post("/candidate", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], candidateController.create);

router.get("/candidate", [authMiddleware, electionMiddleware], candidateController.findAll);

router.get("/candidate/:id", [authMiddleware, electionMiddleware], candidateController.findOne);

router.patch("/candidate/:id", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], candidateController.update);

router.delete("/candidate/:id", [authMiddleware, electionMiddleware, aclMiddleware(["SUPER_ADMIN"])], candidateController.delete);

export default router;
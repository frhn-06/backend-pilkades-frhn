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
import voterController from "../controllers/voter.controller";
import { ElectionStatus, UserRole } from "@prisma/client";
import electionStatusMiddleware from "../middleware/electionstatus.middleware";
import tokenVoteController from "../controllers/tokenvote.controller";
import voteController from "../controllers/vote.controller";

const router = express.Router();


router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

router.get("/auth/me", [authMiddleware], authController.FindMeByToken);

router.get("/auth/find-me", [authMiddleware], authController.findMe);



router.post("/election", [authMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], electionController.create);

router.get("/election", [authMiddleware], electionController.findOne);

router.patch("/election",  [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING]), electionController.update);

router.delete("/election",  [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.FINISHED])], electionController.delete);

router.patch("/election/status",  [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], electionController.status);




router.post("/tps", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], tpsController.create);

router.get("/tps", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], tpsController.findAll);

router.get("/tps/:id/admin", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], tpsController.findByIdForAdmin);

router.get("/tps/petugas", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS])], tpsController.findByPetugas);

router.patch("/tps/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], tpsController.update);

router.delete("/tps/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], tpsController.delete);



router.post("/media/upload-single", [authMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), mediaMiddleware.single("file")], mediaController.uploadSingle);

router.delete("/media/delete-single", [authMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], mediaController.removeSingle);




router.post("/petugas", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], petugasController.create);

router.get("/petugas", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], petugasController.findAll);

router.get("/petugas/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], petugasController.findOne);

router.patch("/petugas/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], petugasController.update);

router.delete("/petugas/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], petugasController.delete);

router.patch("/petugas/:id/non-active", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING, ElectionStatus.ONGOING])], petugasController.nonActive);

router.patch("/petugas/:id/active", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING, ElectionStatus.ONGOING])], petugasController.active);




router.post("/candidate", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], candidateController.create);

router.get("/candidate", [authMiddleware, electionMiddleware], candidateController.findAll);

router.get("/candidate/:id", [authMiddleware, electionMiddleware], candidateController.findOne);

router.patch("/candidate/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]),  electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], candidateController.update);

router.delete("/candidate/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]),  electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], candidateController.delete);






router.post("/voter", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], voterController.create);

router.get("/all-voter", [authMiddleware, electionMiddleware], voterController.findAll);

router.get("/voter", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS])], voterController.findAllPerTps);

router.get("/voter/:id", [authMiddleware, electionMiddleware], voterController.findOne);

router.patch("/voter/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], voterController.update);

router.patch("/voter/:id/present", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], voterController.present);

router.patch("/voter/:id/voted", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], voterController.voted);

router.delete("/voter/:id", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], voterController.delete);







router.post("/token-vote/:voterId/create", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], tokenVoteController.create);

router.get("/token-vote", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], tokenVoteController.findAll);

router.get("/token-vote/:id/find", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], tokenVoteController.findOne);

router.post("/token-vote/validation", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], tokenVoteController.validation)







router.post("/vote", [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], voteController.create);

export default router;
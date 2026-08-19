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
import dashboardController from "../controllers/dashboard.controller";
import monitoringController from "../controllers/monitoring.controller";
import exportController from "../controllers/export.controller";

const router = express.Router();







//////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/auth/register", authController.register
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/RegisterRequest'
          }
        }
      }
    }
 */
);

router.post("/auth/login", authController.login
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/LoginRequest'
          }
        }
      }
    }
 */
);

router.get("/auth/me", 
    [authMiddleware], 
    authController.FindMeByToken
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

router.get("/auth/find-me", 
    [authMiddleware], 
    authController.findMe
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

router.post("/auth/forget-password", authController.forgetPassword
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ForgetPasswordRequest'
          }
        }
      }
    }
 */
);

router.post("/auth/verify-otp", authController.verifyOtp
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/VerifyOtpRequest'
          }
        }
      }
    }
 */
);

router.patch("/auth/reset-password", authController.resetPassword
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ResetPasswordRequest'
          }
        }
      }
    }
 */
);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/election", 
    [authMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
    electionController.create
/**
    #swagger.tags = ["Election"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ElectionRequest'
          }
        }
      }
    }
 */
);

router.get("/election", 
    [authMiddleware], 
    electionController.findOne
/**
    #swagger.tags = ["Election"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

router.patch("/election", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])],
    electionController.update
/**
    #swagger.tags = ["Election"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ElectionRequest'
          }
        }
      }
    }
 */
);

router.delete("/election", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.FINISHED, ElectionStatus.CANCELLED])], 
    electionController.delete
/**
    #swagger.tags = ["Election"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */
);

router.patch("/election/status", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
electionController.status
/**
    #swagger.tags = ["Election"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ElectionStatusRequest
          }
        }
      }
    }
 */
);

router.patch("/election/update-logo", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING])], 
    electionController.updateLogo
/**
    #swagger.tags = ["Election"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/ElectionLogoRequest'
          }
        }
      }
    }
 */  
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/tps", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    tpsController.create
/**
    #swagger.tags = ["Tps"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/TpsRequest'
          }
        }
      }
    }
 */ 
);

router.get("/tps", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
    tpsController.findAll
/**
    #swagger.tags = ["Tps"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);

router.get("/tps/:id/admin", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
    tpsController.findByIdForAdmin
/**
    #swagger.tags = ["Tps"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.get("/tps/petugas", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS])], 
    tpsController.findByPetugas
/**
    #swagger.tags = ["Tps"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.patch("/tps/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    tpsController.update
/**
    #swagger.tags = ["Tps"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/TpsRequest'
          }
        }
      }
    }
 */  
);

router.delete("/tps/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    tpsController.delete
/**
    #swagger.tags = ["Tps"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////













//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/media/upload-single", 
    [authMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), mediaMiddleware.single("file")], 
    mediaController.uploadSingle
/**
    #swagger.tags = ["Media"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      requied: true,
      content: {
        "multipart/form-data" : {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }
    }
 */
);

router.delete("/media/delete-single", 
    [authMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
    mediaController.removeSingle
/**
    #swagger.tags = ["Media"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/RemoveMediaSingleRequest'
          }
        }
      }
    }
 */
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/petugas", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    petugasController.create
/**
    #swagger.tags = ["Petugas"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/PetugasRequest'
          }
        }
      }
    }
 */ 
);

router.get("/petugas", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
    petugasController.findAll
/**
    #swagger.tags = ["Petugas"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      type: 'integer',
    }
    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'integer',
    }
    #swagger.parameters['tps'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['active'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['search'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
 */   
);

router.get("/petugas/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
    petugasController.findOne
/**
    #swagger.tags = ["Petugas"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);

router.patch("/petugas/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    petugasController.update
/**
    #swagger.tags = ["Petugas"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/PetugasRequest'
          }
        }
      }
    }
 */   
);

router.delete("/petugas/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    petugasController.delete
/**
    #swagger.tags = ["Petugas"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);

router.patch("/petugas/:id/non-active", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING, ElectionStatus.ONGOING])], 
    petugasController.nonActive
/**
    #swagger.tags = ["Petugas"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);

router.patch("/petugas/:id/active", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT, ElectionStatus.UPCOMING, ElectionStatus.ONGOING])], 
    petugasController.active
/**
    #swagger.tags = ["Petugas"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/candidate", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    candidateController.create
/**
    #swagger.tags = ["Candidate"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/CandidateRequest'
          }
        }
      }
    }
 */   
);

router.get("/candidate", 
    [authMiddleware, electionMiddleware], 
    candidateController.findAll
/**
    #swagger.tags = ["Candidate"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.get("/candidate/:id", 
    [authMiddleware, electionMiddleware], 
    candidateController.findOne
/**
    #swagger.tags = ["Candidate"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.patch("/candidate/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]),  electionStatusMiddleware([ElectionStatus.DRAFT])], 
    candidateController.update
/**
    #swagger.tags = ["Candidate"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/CandidateRequest'
          }
        }
      }
    }
 */  
);

router.delete("/candidate/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]),  electionStatusMiddleware([ElectionStatus.DRAFT])], 
    candidateController.delete
/**
    #swagger.tags = ["Candidate"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/voter", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    voterController.create
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/VoterRequest'
          }
        }
      }
    }
 */   
);

router.get("/all-voter", 
    [authMiddleware, electionMiddleware], 
    voterController.findAll
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      type: 'integer',
    }
    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'integer',
    }
     #swagger.parameters['present'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['voted'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['tps'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['search'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
 */  
);

router.get("/voter", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS])], 
    voterController.findAllPerTps
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      type: 'integer',
    }
    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'integer',
    }
     #swagger.parameters['present'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['voted'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['tps'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
    #swagger.parameters['search'] = {
      in: 'query',
      required: false,
      type: 'string',
    }
 */  
);

router.get("/voter/:id", 
    [authMiddleware, electionMiddleware], 
    voterController.findOne
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.patch("/voter/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    voterController.update
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/VoterRequest'
          }
        }
      }
    }
 */  
);

router.patch("/voter/:id/present", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    voterController.present
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.patch("/voter/:id/no-present", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    voterController.notPresent
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.patch("/voter/:id/voted", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    voterController.voted
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.delete("/voter/:id", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.DRAFT])], 
    voterController.delete
/**
    #swagger.tags = ["Voter"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/token-vote/:voterId/create", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    tokenVoteController.create
/**
    #swagger.tags = ["TokenVote"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);

router.get("/token-vote", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    tokenVoteController.findAll
/**
    #swagger.tags = ["TokenVote"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */ 
);

router.get("/token-vote/:id/find", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    tokenVoteController.findOne
/**
    #swagger.tags = ["TokenVote"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);

router.post("/token-vote/validation", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    tokenVoteController.validation
/**
    #swagger.tags = ["TokenVote"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/TokenVoteValidationRequest'
          }
        }
      }
    }
 */   
)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/vote", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING])], 
    voteController.create
/**
    #swagger.tags = ["Vote"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json" : {
          schema: {
            $ref: '#/components/schemas/VoteRequest'
          }
        }
      }
    }
 */    
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////













/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/dashboard/admin", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN])], 
    dashboardController.admin
/**
    #swagger.tags = ["Dashboard"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */ 
);

router.get("/dashboard/petugas", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS])], 
    dashboardController.petugas
/**
    #swagger.tags = ["Dashboard"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */  
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/monitoring/admin", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.ONGOING, ElectionStatus.FINISHED])], 
    monitoringController.admin
/**
    #swagger.tags = ["Monitoring"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);

router.get("/monitoring/petugas", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.PETUGAS]), electionStatusMiddleware([ElectionStatus.ONGOING, ElectionStatus.FINISHED])], 
    monitoringController.petugas
/**
    #swagger.tags = ["Monitoring"]
    #swagger.security = [{
      "bearerAuth": []
    }]
 */   
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/export/result/pdf", 
    [authMiddleware, electionMiddleware, aclMiddleware([UserRole.SUPER_ADMIN]), electionStatusMiddleware([ElectionStatus.FINISHED])], 
    exportController.resultPDF
/**
    #swagger.tags = ["Export"]
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.produces = ["application/pdf"]
 */ 
);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



export default router;
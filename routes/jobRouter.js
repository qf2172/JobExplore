import { Router } from "express";
import { createJob, deleteJob, getAllJobs, getSingleJob, showStats, updateJob } from "../controllers/jobController.js";
import { validateIdParam, validateJobInput } from "../middleware/validationMiddleware.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";
const router = Router()
//router.get('/', getAllJobs)
//router.post('/', createJob)
router.route('/').get(getAllJobs).post(checkForTestUser,validateJobInput,createJob)
router.route('/stats').get(showStats)
router.route('/:id').get(validateIdParam,getSingleJob).patch(checkForTestUser, validateIdParam,validateJobInput,updateJob).delete(checkForTestUser,validateIdParam,deleteJob)

export default router
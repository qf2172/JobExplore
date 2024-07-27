import { Router } from "express";
import { createJob, deleteJob, getAllJobs, getSingleJob, updateJob } from "../controllers/jobController.js";
import { validateIdParam, validateJobInput } from "../middleware/validationMiddleware.js";
const router = Router()
//router.get('/', getAllJobs)
//router.post('/', createJob)
router.route('/').get(getAllJobs).post(validateJobInput,createJob)
router.route('/:id').get(validateIdParam,getSingleJob).patch(validateIdParam,validateJobInput,updateJob).delete(validateIdParam,deleteJob)

export default router
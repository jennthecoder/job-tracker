import express from "express";
const router = express.Router();

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
} from '../controllers/jobsController.js';

router.route('/').post(testUser, createJob).get(getAllJobs);

export default router;

import mongoose from 'mongoose';
import moment from 'moment';
import Job from '../models/Job';
import { HttpStatusCode } from 'axios';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';

const createJob = async (req, res) => {
  const { position, company} = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(HttpStatusCode.Created.json({ job }));
};

const getAllJobs = async (req, res) => {
  const {status, jobType, sort, search} = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  }

  let result = Job.find(queryObject);
}

const updateJob = async (req, res) => {
  const {id: jobId} = req.params;
  const {company, position} = req.body
  const job = await Job.findOne({_id: jobId});

  if(!job){
    throw new NotFoundError(`No job with id: ${jobId}`)
  }
  //check permissions before updating
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({_id: jobId}, req.body, {
      new: true,
      runValidators: true,
  });

  res.status(HttpStatusCode.Ok).json({ updatedJob })
}

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({_id: jobId});

  //check permissions before deleting
  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(HttpStatusCode.Ok).json({message: 'Job deleted!'})
};

export {createJob, deleteJob, getAllJobs};

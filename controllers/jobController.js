import { nanoid } from 'nanoid';
import JobModel from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customError.js';

export const getAllJobs = async (req, res) => {
    const jobs = await JobModel.find({createdBy: req.user.userId})
    res.status(StatusCodes.OK).json({ jobs });
}

export const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await JobModel.create(req.body)
    res.status(StatusCodes.CREATED).json({ job });
}

export const getSingleJob = async (req, res) => {
    const {id} = req.params
    const job = await JobModel.findById(id)
    res.status(StatusCodes.OK).json({job})
}

export const updateJob = async (req, res) => {
    const { id } = req.params
    const updatedJob = await JobModel.findByIdAndUpdate(id, req.body,
        {
            new: true
        }
    )
    res.status(StatusCodes.OK).json({ msg: 'job updated', job: updatedJob})
}

export const deleteJob = async (req, res) => {
    const {id} = req.params
    const removeJob = await JobModel.findByIdAndDelete(id)
    res.status(StatusCodes.OK).json({ msg: 'job delted', job: removeJob})
}


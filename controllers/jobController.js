import { nanoid } from 'nanoid';
import JobModel from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customError.js';
import mongoose from 'mongoose';
import day from 'dayjs'
export const getAllJobs = async (req, res) => {
    const { search, jobType, jobStatus, sort } = req.query
    console.log(sort)
    const queryObject = {
        createdBy: req.user.userId
    }
    if(search) {
        queryObject.$or = [
            {
                position: {$regex: search, $options: 'i'}
                // i don't care about case upper or lowere

            },
            {
                company: {$regex: search, $options: 'i'}
                // i don't care about case upper or lowere
                
            }
        ]
    }
    if(jobStatus && jobStatus != 'all' ) {
        queryObject.jobStatus = jobStatus
    }
    if(jobType && jobType != 'all' ) {
        queryObject.jobType = jobType
    }
    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'position',
        'z-a': '-position',
    }
    console.log(queryObject)
    const sortKey = sortOptions[sort] || sortOptions.newest
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page-1) * limit
    const jobs = await JobModel.find(queryObject).skip(skip).limit(limit)
    const totalJobs = await JobModel.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs / limit);
    res.status(StatusCodes.OK).json({totalJobs, numOfPages, currentPage: page, jobs });
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

export const showStats = async (req, res) => {
    let stats = await JobModel.aggregate([
        {$match:{createdBy:new mongoose.Types.ObjectId(req.user.userId)}},
        {$group:{_id: '$jobStatus', count:{$sum: 1}}}
    ])

    stats = stats.reduce((acc, curr) => {
        const {_id:title, count} = curr
        acc[title] = count
        return acc
    }, {})
    console.log(stats)
    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interviews || 0,
        declined: stats.declined || 0
    }
    let monthlyApplications = await JobModel.aggregate([
        { $match: { createdBy:new mongoose.Types.ObjectId(req.user.userId)}},
        { $group: {
            _id: {year:{ $year:'$createdAt' }, month: { $month: '$createdAt' }},
            count: {$sum: 1}
        }},
        { $sort:{'_id.year':-1, '_id.month': -1}},
        { $limit: 6 }
    ])
    monthlyApplications = monthlyApplications.map((item) => {
        const {_id:{year, month}, count} = item
        const date = day().month(month -1).year(year).format('MMM YY')
        return {date, count}
    }).reverse()
    res.status(StatusCodes.OK).json({defaultStats, monthlyApplications })
}


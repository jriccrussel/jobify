import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'

const createJob = async (req, res) => {
    const { position, company } = req.body

    if (!position || !company) {
        throw new BadRequestError('Please Provide All Values')
    }

    req.body.createdBy = req.user.userId

    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const getAllJobs = async (req, res) => {
    // res.send('get all jobs')
    const jobs = await Job.find({ createdBy: req.user.userId })

    res
        .status(StatusCodes.OK)
        .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}

const updateJob = async (req, res) => {
    // res.send('update job')
    const { id: jobId } = req.params
    const { company, position, status } = req.body

    if (!position || !company) {
        throw new BadRequestError('Please provide all values')
    }

    const job = await Job.findOne({ _id: jobId })

    if (!job) {
        throw new NotFoundError(`No job with id :${jobId}`)
    }
 
    // check permissions
    // e make sure nato na kini ra na user maka update sa job
    // if dili nato cya e butang any user can able to update jobs
    checkPermissions(req.user, job.createdBy)

    // using "findOneAndUpdate" does not trigger the ".save()" method
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(StatusCodes.OK).json({ updatedJob })

    //  alternative approach
    //  using this approach allows us to have control or freedom sa data we update
    //  kini ra mga data(job.position, job.company, job.jobLocatio) pwdi ma update anything else other than data na g mention will have an error 
    //  job.position = position
    //  job.company = company
    //  job.jobLocation = jobLocation
    //  await job.save()
    //  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params
  
    const job = await Job.findOneAndDelete({ _id: jobId })
  
    if (!job) {
      throw new NotFoundError(`No job with id : ${jobId}`)
    }
  
    checkPermissions(req.user, job.createdBy)
  
    await job.deleteOne()
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' })
};

const showStats = async (req, res) => {
    // res.send('show stats')

    // aggregate - sa mongoose what it does is a series of steps is use for GROUPING, FILTERING, SORTING, PROJECTING and etc. para sa mga objects and arrays

    // stats - what it does is to GROUP tanan nag match na id 
    // $match - pangitaon nag match id or etc. and show ang tanan nag match na id 
    // $group - e group ang two or more different objects or arrays in to one
    // NOTE: sa $group -> $status - kwaon niya tanan status 'declined', 'interview', 'pending'; while ang count: { $sum: 1 } - ihapon or count niya tanan status by 1
    let stats = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    stats = stats.reduce((acc, curr) => {
        console.log("%c Line:97 🍯 acc", "color:#f5ce50", acc);
        // console.log("%c Line:97 🍻 curr", "color:#465975", curr);
        const { _id: title, count } = curr
        // create cya ug new property or object with ang 'title'(ang mga status) - key and ang 'count' - ang value; eg. { "declined": 22, ... }
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    }
    
    let monthlyApplications = []

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }
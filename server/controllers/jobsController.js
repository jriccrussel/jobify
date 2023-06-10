import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'

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

    const { company, position } = req.body

    if (!company || !position) {
        throw new BadRequestError('Please Provide All Values')
    }

    const job = await Job.findOne({ _id: jobId })

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
 
    // check permissions
    // using "findOneAndUpdate" does not trigger the ".save()" method
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(StatusCodes.OK).json({ updatedJob })

        //  alternative approach
        //  using this approach allows us to have control or freedom sa data we update
        //  kini ra mga data(job.position, job.company, job.jobLocatio) pwdi ma update anything else other than data na g mention will have an error 
//      job.position = position
//      job.company = company
//      job.jobLocation = jobLocation
//      await job.save()
//      res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    res.send('delete job')
}
const showStats = async (req, res) => {
    res.send('show stats')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }
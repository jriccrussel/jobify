import Job from '../models/Job.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import mongoose from 'mongoose'
import moment from 'moment'

// post - {{URL}}/jobs
const createJob = async (req, res) => {
    const { position, company } = req.body

    if (!position || !company) {
        throw new BadRequestError('Please Provide All Values')
    }

    req.body.createdBy = req.user.userId

    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

// get - {{URL}}/jobs
const getAllJobs = async (req, res) => {
    // console.log("%c Line:24 🥐 req.query", "color:#2eafb0", req.query)
    // res.send('get all jobs')
    // const jobs = await Job.find({ createdBy: req.user.userId })
    const { search, status, jobType, sort } = req.query
    
    // make use sa conole para makita ang queryObject or even ang req.query
    const queryObject = {
        createdBy: req.user.userId,
    }

    // add stuff based on conditions
    // {{URL}}/jobs?status=pending
    // get all jobs based on status (para sa search form sa ato front-end)
    // if 'status' is not equal to 'all' - add 'pending, declined, interview' para sa ato status
    // ang 'queryObject' we can add another property sa ato object based sa condition
    // from queryObject = { createdBy: req.user.userId } sa conditon if 'status' is not equal to 'all' then we add status sa 'queryObject' to queryObject = { createdBy: req.user.userId, status } sa atong req.query
    if (status !== 'all') {
        queryObject.status = status
    }

    // get all jobs based on job type 
    // {{URL}}/jobs?status=pending&jobType=full-time
    // queryObject = { createdBy: req.user.userId, jobType } 
    if (jobType !== 'all') {
        queryObject.jobType = jobType
    }

    // get all jobs based what is currently gi search
    // {{URL}}/jobs?status=pending&jobType=full-time&search=Software Test Engineer III
    // queryObject = { createdBy , jobType, position: { '$regex': 'EXAMPLE React Developer', '$options': 'i' }}
    if (search) {
        // queryObject.position = search - if you search using small letters it will get an error better use regix instead
        queryObject.position = { $regex: search, $options: 'i' }
    }
    
    console.log("%c Line:31 🥛 queryObject", "color:#e41a6a", queryObject)

    // NO AWAIT - its because need nato kuhaon ang query(kuhaon ang specific na result based on status, search, jobType and etc) but if we put 'await' we right away get the results dili nato makuha ang query or ang specific result kato kuhaon
    let result = Job.find(queryObject)

    // chain sort conditions
    // {{URL}}/jobs?status=all&jobType=full-time&sort=latest
    if (sort === 'latest') {
        result = result.sort('-createdAt')
    }
    if (sort === 'oldest') {
        result = result.sort('createdAt')
    }
    if (sort === 'a-z') {
        result = result.sort('position')
    }
    if (sort === 'z-a') {
        result = result.sort('-position')
    }

    // after na makita ang query then we 'await' the result
    const jobs = await result
    // console.log("%c Line:66 🍤 jobs", "color:#3f7cff", jobs)

    res
        .status(StatusCodes.OK)
        .json({ jobs, totalJobs: jobs.length, numOfPages: 1 })
}

//  patch - {{URL}}/jobs/:id
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

// delete - {{URL}}/jobs/:id
const deleteJob = async (req, res) => {
    const { id: jobId } = req.params
  
    const job = await Job.findOneAndDelete({ _id: jobId })
  
    if (!job) {
      throw new NotFoundError(`No job with id : ${jobId}`)
    }
  
    checkPermissions(req.user, job.createdBy)
  
    await job.deleteOne()
    res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' })
}

//  get - {{URL}}/jobs/stats
const showStats = async (req, res) => {
    // res.send('show stats')

    // aggregate - sa mongoose what it does is a series of steps is use for GROUPING, FILTERING, SORTING, PROJECTING and etc. para sa mga objects and arrays

    // stats - what it does is to GROUP tanan nag match na id 
    // $match - pangitaon nag match id or etc. and show ang tanan nag match na id 
    // $group - e group ang two or more different objects or arrays in to one
    // NOTE: sa $group -> $status - kwaon niya tanan status 'declined', 'interview', 'pending' while ang count: { $sum: 1 } - ihapon or count niya tanan status by 1
    let stats = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    stats = stats.reduce((acc, curr) => {
        console.log("%c Line:97 🍯 acc", "color:#f5ce50", acc)
        // console.log("%c Line:97 🍻 curr", "color:#465975", curr)
        const { _id: title, count } = curr
        // create cya ug new property or object with ang 'title'(ang mga status) - key and ang 'count' - ang value eg. { "declined": 22, ... }
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    }
    
    // $match - pangitaon nya tanan nag match na ID
    // $group -> $year & $month - tanan nag match na ID gi group and naghimo ug bago object both ang $year & $month had a value of $createdAt while count: { $sum: 1 } - ihapon or count niya tanan  $year & $month by 1 
    // $sort - g sort by year and month 
    // $limit - tanan nag match na ID only show 6
    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: {
                    year: {
                        $year: '$createdAt',
                    },
                    month: {
                        $month: '$createdAt',
                    },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 },
    ])

    // g map and g format nato ang date ug turn in to one property na '{ date, ...}' 
    monthlyApplications = monthlyApplications.map((item) => {
        const {
            _id: { year, month },
            count,
        } = item
        // accepts 0-11
        const date = moment().month(month - 1).year(year).format('MMM Y')

        // { date: date } is same as { date, ...}
        return { date, count }
    }).reverse()

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }
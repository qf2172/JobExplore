import { body, param, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/customError.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import JobModel from '../models/JobModel.js';
import { NotFoundError } from '../errors/customError.js';
import UserModel from '../models/UserModel.js';
// two things
// validate test where we pass in the values we want to update
// function take care of the error response
const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next)=> {
            const errors = validationResult(req)
            console.log(errors.isEmpty())
            if(errors.isEmpty()) {
                next()
            } else {
                const errorMessage = errors.array().map((error) => error.msg)
                if(errorMessage[0].startswith('no job')) {
                    throw new NotFoundError(errorMessage)
                }
                throw new BadRequestError(errorMessage)
            }
        }
    ]
}

export const validateJobInput = withValidationErrors([
    body('company').notEmpty().withMessage('company is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('jobLocation').notEmpty().withMessage('job location is required'),
    body('jobStatus')
        .isIn(Object.values(JOB_STATUS))
        .withMessage('invalid status value'),
    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid job type'),
])

export const validateIdParam = withValidationErrors(
    [
        param('id').custom(async (value) => {
            const isValidId = mongoose.Types.ObjectId.isValid(value)
            if(!isValidId) throw new BadRequestError('invalid mongodb id')
            const job = await JobModel.findById(value)
            if(!job) {
                throw new NotFoundError(`no job with id ${value}`)
            }
        })
    ]
)

export const validateRegisterInput = withValidationErrors(
    [
        body('name').notEmpty().withMessage('name is required'),
        body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format').custom(
            async(email)=>{
                const user = await UserModel.findOne({email})
                if (user) {
                    throw new BadRequestError('email already exists')
                }
        }),
        body('password').notEmpty().withMessage('password is required').isLength({min: 8}).withMessage('password must be at least 8 characters long'),
        body('location').notEmpty().withMessage('location is required'),
        body('lastName').notEmpty().withMessage('lastName is required'),
    ]
)

export const validateLoginInput = withValidationErrors(
    [
        body('email').notEmpty().withMessage('email required').isEmail().withMessage('invalid email format'),
        body('password').notEmpty().withMessage('password required')
    ]
)
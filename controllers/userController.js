import { StatusCodes } from "http-status-codes"
import UserModel from "../models/UserModel.js"
import JobModel from "../models/JobModel.js";
import cloudinary from 'cloudinary'
import { promises as fs } from 'fs'

export const getCurrentUser = async (req, res) => {
    const user = await UserModel.findOne({_id: req.user.userId})
    const userWithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({user: userWithoutPassword})
}
export const getApplicationStats = async (req, res) => {
    const users = await UserModel.countDocuments()
    const Jobs = await JobModel.countDocuments()
    res.status(StatusCodes.OK).json({user: users, Jobs: Jobs})
}
export const updateUser = async (req, res) => {
    const newUser = {...req.body}
    delete newUser.password
    if(req.file) {
        const response = await cloudinary.v2.uploader.upload(req.file.path)
        await fs.unlink(req.file.path)
        newUser.avatar = response.secure_url
        newUser.avatarPublicId = response.public_id
    }
    if(req.file && updateUser.avatarPublicId) {
        await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId)
    }
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.userId, newUser)
    res.status(StatusCodes.OK).json({user: updatedUser})
}

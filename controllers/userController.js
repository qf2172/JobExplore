import { StatusCodes } from "http-status-codes"
import UserModel from "../models/UserModel.js"
import JobModel from "../models/JobModel.js";

export const getCurrentUser = async (req, res) => {
    const user = await UserModel.findOne({_id: req.user.userId})
    const userWithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({msg: userWithoutPassword})
}
export const getApplicationStats = async (req, res) => {
    const users = await UserModel.countDocuments()
    const Jobs = await JobModel.countDocuments()
    res.status(StatusCodes.OK).json({user: users, Jobs: Jobs})
}
export const updateUser = async (req, res) => {
    const obj = {...req.body}
    delete obj.password
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.userId, obj)
    res.status(StatusCodes.OK).json({msg: updatedUser})
}

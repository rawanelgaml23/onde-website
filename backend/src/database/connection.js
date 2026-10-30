import mongoose from "mongoose"
import configService from "../config/config.service.js"

export const DBconnect = async () => {
    await mongoose.connect(configService.DB_URI)
    console.log("DB connected")
}
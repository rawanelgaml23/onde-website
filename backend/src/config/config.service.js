import dotenv from "dotenv"
import { resolve } from "node:path"

dotenv.config({
    path: resolve(`.env.${process.env.NODE_ENV}`)
})

export default {
    port: process.env.PORT,
    DB_URI: process.env.DB_URI,
    clientUrl: process.env.CLIENT_URL,
    resendKey: process.env.RESEND_API_KEY,
    adminEmail: process.env.ADMIN_EMAIL,
}

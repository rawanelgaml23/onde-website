import { Router } from "express"
import { Subscriber } from "./newsletter.model.js"
import { response } from "../../common/middleware/response.js"
import { createHttpError } from "../../common/utils/httpError.js"

export const newsletterRouter = Router()

const EMAIL_RE = /^\S+@\S+\.\S+$/

// POST /api/newsletter   body: { email }
newsletterRouter.post("/", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : ""
    if (!EMAIL_RE.test(email)) throw createHttpError("Invalid email", 400)

    try {
        await Subscriber.create({ email })
    } catch (err) {
        // 11000 = الإيميل مسجل قبل كده، نعتبره نجاح
        if (err.code !== 11000) throw err
    }

    response({ res, status: 201, message: "Subscribed" })
})
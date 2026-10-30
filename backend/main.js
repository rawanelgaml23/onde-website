import express from "express"
import cors from "cors"
import configService from "./src/config/config.service.js"
import { errorHandler } from "./src/common/index.js"
import { DBconnect } from "./src/database/connection.js"
import { productRouter } from "./src/modules/product/product.controller.js"
import { orderRouter } from "./src/modules/order/order.controller.js"
import { newsletterRouter } from "./src/modules/newsletter/newsletter.controller.js"

const PORT = configService.port
const app = express()

await DBconnect()

const allowedOrigins = [
    configService.clientUrl,
    "https://onde-website-ashen.vercel.app",
    /^https:\/\/onde-website-[a-z0-9-]+-rawan-6db4\.vercel\.app$/,
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        const ok = allowedOrigins.some((o) =>
            o instanceof RegExp ? o.test(origin) : o === origin
        )
        callback(null, ok)
    },
}))
app.use(express.json({ limit: "50kb" }))

app.get("/", (req, res) => res.send("Hello World"))
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.use("/api/newsletter", newsletterRouter)

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        route: req.originalUrl,
        method: req.method
    })
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
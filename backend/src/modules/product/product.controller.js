import { Router } from "express"
import { Product } from "./product.model.js"
import { response } from "../../common/middleware/response.js"
import { createHttpError } from "../../common/utils/httpError.js"

export const productRouter = Router()

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i

// GET /api/products?category=Serums
productRouter.get("/", async (req, res) => {
    const filter = { inStock: true }
    const { category } = req.query
    if (typeof category === "string" && category !== "All") filter.category = category

    const products = await Product.find(filter).sort({ createdAt: 1 })
    response({ res, message: "Products fetched", data: products })
})

// GET /api/products/:id
productRouter.get("/:id", async (req, res) => {
    if (!OBJECT_ID_RE.test(req.params.id)) {
        throw createHttpError("Invalid product id", 400)
    }
    const product = await Product.findById(req.params.id)
    if (!product) throw createHttpError("Product not found", 404)

    response({ res, message: "Product fetched", data: product })
})
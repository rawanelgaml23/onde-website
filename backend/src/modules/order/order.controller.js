import { Router } from "express"
import crypto from "node:crypto"
import { Product } from "../product/product.model.js"
import { Order } from "./order.model.js"
import { response } from "../../common/middleware/response.js"
import { createHttpError } from "../../common/utils/httpError.js"
import { sendOrderEmail } from "../../common/utils/sendOrderEmail.js"


export const orderRouter = Router()

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i
const PHONE_RE = /^01[0-9]{9}$/
const EMAIL_RE = /^\S+@\S+\.\S+$/
const PAYMENTS = ["cash", "card"]
const FREE_SHIPPING_MIN = 50
const SHIPPING_FEE = 5
const MAX_LINES = 50
const MAX_QTY = 20

const cleanText = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "")

const getShipping = (subtotal) =>
    subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE

const makeOrderNumber = () =>
    `ONDE-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`

// POST /api/orders
// body: { customer: {...}, items: [{ productId, qty }], payment: "cash" | "card" }
orderRouter.post("/", async (req, res) => {
    const body = req.body ?? {}
    const c = body.customer ?? {}

    const customer = {
        name: cleanText(c.name, 100),
        phone: cleanText(c.phone, 20),
        email: cleanText(c.email, 120),
        address: cleanText(c.address, 200),
        city: cleanText(c.city, 80),
        notes: cleanText(c.notes, 500),
    }

    const errors = {}
    if (!customer.name) errors.name = "Please enter your name"
    if (!PHONE_RE.test(customer.phone)) errors.phone = "Enter a valid Egyptian mobile number (11 digits)"
    if (customer.email && !EMAIL_RE.test(customer.email)) errors.email = "Enter a valid email address"
    if (!customer.address) errors.address = "Please enter your address"
    if (!customer.city) errors.city = "Please enter your city"
    if (!PAYMENTS.includes(body.payment)) errors.payment = "Choose a payment method"

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Invalid order", errors })
    }

    const rawItems = Array.isArray(body.items) ? body.items : []
    if (rawItems.length === 0 || rawItems.length > MAX_LINES) {
        throw createHttpError("Your bag is empty or too large", 400)
    }

    // تجميع الكميات لنفس المنتج
    const quantities = new Map()
    for (const item of rawItems) {
        const productId = item?.productId
        const qty = item?.qty
        if (typeof productId !== "string" || !OBJECT_ID_RE.test(productId)) {
            throw createHttpError("Invalid product in bag", 400)
        }
        if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
            throw createHttpError("Invalid quantity", 400)
        }
        quantities.set(productId, (quantities.get(productId) || 0) + qty)
    }

    const ids = [...quantities.keys()]

    // السعر بيتجاب من الداتابيز، مش من الفرونت
    const products = await Product.find({ _id: { $in: ids }, inStock: true })
    if (products.length !== ids.length) {
        throw createHttpError("Some products are unavailable", 400)
    }

    const items = products.map((p) => ({
        product: p._id,
        name: p.name,
        price: p.price,
        qty: quantities.get(String(p._id)),
    }))

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const shipping = getShipping(subtotal)

    const order = await Order.create({
        orderNumber: makeOrderNumber(),
        customer,
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
        payment: body.payment,
    })
    sendOrderEmail(order).catch((err) => console.error("Email failed:", err.message))
    response({
        res,
        status: 201,
        message: "Order placed",
        data: {
            orderNumber: order.orderNumber,
            total: order.total,
            phone: order.customer.phone,
            name: order.customer.name,
        },
    })
})
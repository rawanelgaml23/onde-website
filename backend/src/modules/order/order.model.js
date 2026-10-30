import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
    },
    { _id: false }
)

const orderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, default: "" },
            address: { type: String, required: true },
            city: { type: String, required: true },
            notes: { type: String, default: "" },
        },
        items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
        subtotal: { type: Number, required: true },
        shipping: { type: Number, required: true },
        total: { type: Number, required: true },
        payment: { type: String, enum: ["cash", "card"], required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
)

export const Order = mongoose.model("Order", orderSchema)
import mongoose from "mongoose"

export const CATEGORIES = ["Sun Screen", "Toners", "Moisturizers", "Cleansers", "Serums", "Eye Cream"]

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, enum: CATEGORIES, required: true },
        detail: { type: String, default: "" },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, default: "" },
        tag: { type: String, default: "" },
        tone: { type: String, default: "sand" },
        featured: { type: Boolean, default: false },
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true }
)

productSchema.set("toJSON", {
    transform: (_, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
    },
})

export const Product = mongoose.model("Product", productSchema)
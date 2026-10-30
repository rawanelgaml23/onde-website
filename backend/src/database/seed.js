import mongoose from "mongoose"
import { DBconnect } from "./connection.js"
import { Product } from "../modules/product/product.model.js"
import { products } from "./seed/products.data.js"

const run = async () => {
    await DBconnect()

    await Product.deleteMany({})
    const created = await Product.insertMany(products)
    console.log(`Seeded ${created.length} products`)

    await mongoose.disconnect()
}

run().catch((err) => {
    console.error("Seed failed:", err.message)
    process.exit(1)
})
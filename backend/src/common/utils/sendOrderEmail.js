import { Resend } from "resend"
import configService from "../../config/config.service.js"

const resend = configService.resendKey ? new Resend(configService.resendKey) : null

export async function sendOrderEmail(order) {
    if (!resend || !configService.adminEmail) return

    const itemsHtml = order.items
        .map((i) => `<li>${i.name} × ${i.qty} — $${i.price * i.qty}</li>`)
        .join("")

    await resend.emails.send({
        from: "Onde <onboarding@resend.dev>",
        to: configService.adminEmail,
        subject: `New order ${order.orderNumber}`,
        html: `
            <h2>New order ${order.orderNumber}</h2>
            <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.phone})</p>
            <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}</p>
            <p><strong>Payment:</strong> ${order.payment}</p>
            <ul>${itemsHtml}</ul>
            <p><strong>Total:</strong> $${order.total}</p>
        `,
    })
}
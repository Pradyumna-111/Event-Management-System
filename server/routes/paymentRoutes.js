import express from "express";
import axios from "axios";

const router = express.Router();

// Create order (Cashfree)
router.post("/create-order", async (req, res) => {
    try {
        const { orderId, orderAmount, customerName, customerEmail, customerPhone } = req.body;

        const response = await axios.post(
            "https://sandbox.cashfree.com/pg/orders", // change to production URL later
            {
                order_id: orderId,
                order_amount: orderAmount,
                order_currency: "INR",
                customer_details: {
                    customer_id: customerEmail,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                },
            },
            {
                headers: {
                    "x-client-id": process.env.CASHFREE_APP_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                    "x-api-version": "2022-09-01",
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Cashfree order error:", error.response?.data || error.message);
        res.status(500).json({ message: "Payment order creation failed" });
    }
});
export default router;
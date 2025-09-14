import { useEffect } from "react";
import axios from "axios";

function PaymentPage({ eventId, amount }) {
    useEffect(() => {
        const initiatePayment = async () => {
            try {
                // Create order in backend
                const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
                    orderId: `order_${Date.now()}`,
                    orderAmount: amount,
                    customerName: "Test User",
                    customerEmail: "test@example.com",
                    customerPhone: "9999999999",
                });

                // Load Cashfree script
                const script = document.createElement("script");
                script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js";
                script.async = true;
                script.onload = () => {
                    const cashfree = new window.Cashfree(data.payment_session_id);
                    cashfree.redirect(); // opens payment page
                };
                document.body.appendChild(script);
            } catch (err) {
                console.error("Payment init failed", err);
            }
        };

        initiatePayment();
    }, [amount, eventId]);

    return (
        <div className="p-6 text-center">
            <h2 className="text-xl font-bold">Redirecting to Payment...</h2>
        </div>
    );
}

export default PaymentPage;

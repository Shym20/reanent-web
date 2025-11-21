import React, { useState } from "react";

const RazorpayPayment = ({ paymentId, jwtToken }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create Razorpay order from backend
      const orderRes = await fetch(
        `${process.env.REACT_APP_API_URL}/property/payment/razorpay/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ paymentId }),
        }
      );

      const orderData = await orderRes.json();
      if (orderData.status !== "success") {
        alert(orderData.message || "Failed to create Razorpay order");
        setLoading(false);
        return;
      }

      const { key, orderId, amount, currency, name, description } = orderData.data;

      // 2️⃣ Initialize Razorpay checkout
      const options = {
        key,
        amount: amount * 100, // amount in paise
        currency,
        name,
        description,
        order_id: orderId,
        handler: async function (response) {
          // 3️⃣ Verify payment with backend
          const verifyRes = await fetch(
            `${process.env.REACT_APP_API_URL}/property/payment/razorpay/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId,
              }),
            }
          );

          const verifyData = await verifyRes.json();
          if (verifyData.status === "success") {
            alert("Payment successful and verified!");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Tenant User",
          email: "tenant@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);

      // Optional: handle failure events
      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed", response.error);
        alert("Payment failed. Please try again later.");
      });

      razorpay.open();
    } catch (error) {
      console.error("Error in Razorpay flow:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: "#3399cc",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {loading ? "Processing..." : "Pay Rent"}
    </button>
  );
};

export default RazorpayPayment;

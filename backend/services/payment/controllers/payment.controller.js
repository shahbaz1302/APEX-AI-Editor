import razorpay from "../config/razorpay.js";
import paymentModel from "../models/payment.model.js";
import crypto from "crypto"
import { addCredits } from "../utils/updateCredits.js";

const Plans = {
    pro: {
        name: "Pro",
        amount: 49900,
        credits: 500,
    },
    team: {
        name: "Team",
        amount: 99900,
        credits: 2000,
    }
}

export const createOrder = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        if (!userId) {
            return res.status(400).json({ message: "User id not found" })
        }

        const { plan } = req.body
        const selectedPlan = Plans[plan]
        if (!selectedPlan) {
            return res.status(400).json({ message: "Plan not found" })
        }

        const order = await razorpay.orders.create({
            amount: selectedPlan.amount,
            currency: "INR",
            receipt: `receipt-${Date.now()}`,
            notes: { userId, plan }
        })

        const payment = await paymentModel.create({
            userId,
            plan,
            credits: selectedPlan.credits,
            amount: selectedPlan.amount,
            razorpayOrderId: order.id,
            currency: "INR",
            status: "created"
        })

        return res.status(200).json({
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            plan: {
                name: selectedPlan.name,
                credits: selectedPlan.credits
            },
            key_id: process.env.RAZORPAY_KEY_ID
        })
    } catch (error) {
        return res.status(500).json({ message: `Create order error ${error}` })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        if (!userId) {
            return res.status(400).json({ message: "User id not found" })
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "razorpay_order_id, razorpay_payment_id, razorpay_signature not found" })
        }

        const payment = await paymentModel.findOne({
            razorpayOrderId: razorpay_order_id
        })

        if (!payment) {
            return res.status(400).json({ message: "Payment not found" })
        }

        if (payment.status === "paid") {
            return res.status(400).json({ message: "Payment is already verified" })
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")
        const expectedSignatureBuffer = Buffer.from(generatedSignature, "hex")
        const receivedSignatureBuffer = Buffer.from(razorpay_signature, "hex")
        const signaturesMatch =
            expectedSignatureBuffer.length === receivedSignatureBuffer.length &&
            crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer)

        if (!signaturesMatch) {
            payment.status = "failed"
            await payment.save()
            return res.status(400).json({ message: "Invalid payment signature" })
        }

        payment.status = "paid"
        payment.razorpayPaymentId = razorpay_payment_id
        await payment.save()

        const data = await addCredits({ userId, credits: payment.credits })

        return res.status(200).json({ message: "Payment verified" })

    } catch (error) {
        return res.status(500).json({ message: `Payment verify error ${error}` })
    }
}
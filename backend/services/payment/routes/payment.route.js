import { Router } from "express"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"

const router=Router()

router.post("/create",createOrder)
router.post("/verify",verifyPayment)

export default router
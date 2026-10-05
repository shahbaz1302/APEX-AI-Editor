import { ArrowLeft, Check, Crown, Sparkles, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { createPayment, verifyPayment } from "../features/payment"

const plans = [
    {
        key: "free",
        name: "Free",
        description: "A thoughtful place to begin building.",
        price: "₹0",
        period: "/month",
        credits: "50 AI credits",
        icon: Zap,
        features: [
            "50 AI credits / month",
            "AI code generation",
            "Project editor",
            "HTML / CSS / JS preview",
            "React preview",
            "Project management",
        ],
        button: "Your current plan",
        current: true,
    },
    {
        key: "pro",
        name: "Pro",
        description: "More room for ambitious ideas.",
        price: "₹499",
        period: "/month",
        credits: "500 AI credits",
        icon: Sparkles,
        popular: true,
        features: [
            "500 AI credits / month",
            "Everything in Free",
            "Priority AI generation",
            "Larger projects",
            "Unlimited projects",
            "Advanced AI coding",
            "Priority support",
        ],
        button: "Choose Pro",
    },
    {
        key: "team",
        name: "Team",
        description: "A more considered way to build together.",
        price: "₹999",
        period: "/month",
        credits: "2,000 AI credits",
        icon: Crown,
        features: [
            "2,000 AI credits / month",
            "Everything in Pro",
            "Team collaboration",
            "Shared projects",
            "Higher AI limits",
            "Priority processing",
            "Team support",
        ],
        button: "Choose Team",
    },
]

const Plan = () => {
    const navigate = useNavigate()

    const handlePayment = async (plan) => {
        try {
            if (plan.key === "free" || plan.current) return
            const data = await createPayment(plan.key)
            console.log(data)
            const options = {
                key: data.key_id,
                amount: data.order.amount,
                currency: data.order.currency || "INR",
                name: "APEX",
                description: `Plan ${plan.name}`,
                order_id: data.order.id,
                handler: async (response) => {
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response
                    const data = await verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
                    console.log(data)
                },
                theme: {
                    color: "#4f46e5"
                }
            }
            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="min-h-dvh bg-[#e8edf4] px-5 py-8 text-slate-700 transition-colors duration-300 dark:bg-[#202631] dark:text-slate-200 sm:px-8 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <header className="mb-14 flex items-center justify-between sm:mb-20">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#e8edf4] px-4 text-sm font-medium text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all duration-300 hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back
                    </button>
                    <div className="text-sm font-bold tracking-[0.22em] text-slate-700 dark:text-slate-200">
                        APEX
                    </div>
                </header>

                <section className="mb-12 text-center sm:mb-16">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#e8edf4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
                        <Sparkles size={14} aria-hidden="true" />
                        Plans for every kind of progress
                    </div>
                    <h1 className="mx-auto max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight text-slate-800 dark:text-slate-100 sm:text-6xl">
                        Room to think.
                        <span className="block text-sky-700 dark:text-sky-300">Power to build.</span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                        Choose the pace that suits your work, with the tools and AI credits to take each idea further.
                    </p>
                </section>

                <section aria-label="Available plans" className="grid items-stretch gap-7 md:grid-cols-3">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon
                        return (
                            <motion.article
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -4 }}
                                className={`relative flex flex-col rounded-2xl bg-[#edf1f5] p-6 shadow-[10px_10px_22px_#c5cbd3,-10px_-10px_22px_#ffffff] transition-colors duration-300 dark:bg-[#202631] dark:shadow-[10px_10px_22px_#171c24,-10px_-10px_22px_#2a3341] sm:p-7 ${plan.popular ? "ring-1 ring-sky-600/30 dark:ring-sky-300/30" : ""
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-700 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-md dark:bg-sky-400 dark:text-slate-950">
                                        Most chosen
                                    </div>
                                )}

                                <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#e8edf4] text-sky-700 shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341]">
                                    <Icon size={19} aria-hidden="true" />
                                </div>

                                <h2 className="font-serif text-2xl font-medium text-slate-800 dark:text-slate-100">
                                    {plan.name}
                                </h2>
                                <p className="mt-1 min-h-10 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {plan.description}
                                </p>

                                <div className="mt-6 flex items-baseline gap-1">
                                    <span className="font-serif text-4xl font-medium tracking-tight text-slate-800 dark:text-slate-100">
                                        {plan.price}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>
                                </div>

                                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-[#e8edf4] px-3 py-2 text-xs font-semibold text-sky-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
                                    <Zap size={14} fill="currentColor" aria-hidden="true" />
                                    {plan.credits}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handlePayment(plan)}
                                    aria-current={plan.current ? "true" : undefined}
                                    className={`mt-6 min-h-11 w-full cursor-pointer rounded-lg px-4 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${plan.current
                                            ? "bg-[#e8edf4] text-slate-500 shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-slate-400 dark:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341]"
                                            : "bg-[#e8edf4] text-sky-800 shadow-[5px_5px_10px_#c5cbd3,-5px_-5px_10px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[5px_5px_10px_#171c24,-5px_-5px_10px_#2a3341] dark:hover:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341]"
                                        }`}
                                >
                                    {plan.button}
                                </button>

                                <div className="mt-7 border-t border-slate-300/60 pt-6 dark:border-slate-700/60">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                        Plan includes
                                    </p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-3 text-sm leading-5 text-slate-600 dark:text-slate-300"
                                            >
                                                <Check
                                                    size={15}
                                                    aria-hidden="true"
                                                    className="mt-0.5 shrink-0 text-sky-700 dark:text-sky-300"
                                                />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.article>
                        )
                    })}
                </section>

                <p className="mx-auto mt-9 max-w-xl text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
                    Your AI credits renew each month. Unused credits expire at the end of the billing period.
                </p>
            </div>
        </main>
    )
}

export default Plan

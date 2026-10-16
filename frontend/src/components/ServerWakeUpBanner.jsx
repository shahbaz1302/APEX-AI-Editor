import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, X } from "lucide-react";
import { WAKE_UP_EVENT } from "../utils/wakeUpRetry";

const ServerWakeUpBanner = () => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        let hideTimer;
        const handleWakeUpStatus = (event) => {
            window.clearTimeout(hideTimer);
            setStatus(event.detail);

            if (event.detail.status === "ready") {
                hideTimer = window.setTimeout(() => setStatus(null), 3500);
            }
        };

        window.addEventListener(WAKE_UP_EVENT, handleWakeUpStatus);
        return () => {
            window.clearTimeout(hideTimer);
            window.removeEventListener(WAKE_UP_EVENT, handleWakeUpStatus);
        };
    }, []);

    if (!status) return null;

    const isWarming = status.status === "warming";
    const isReady = status.status === "ready";
    const Icon = isWarming ? LoaderCircle : isReady ? CheckCircle2 : AlertCircle;
    const message = status.message || (isWarming
        ? `The server is waking up. Retrying your connection (${status.attempt}/${status.maxRetries})...`
        : isReady
            ? "Connection restored. The server is ready."
            : "The server is still unavailable. Please try again in a moment.");

    return (
        <div
            role={isWarming ? "status" : "alert"}
            aria-live="polite"
            className={`fixed left-1/2 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
                isReady
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                    : status.status === "failed"
                        ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
                        : "border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100"
            }`}
        >
            <Icon size={18} aria-hidden="true" className={`shrink-0 ${isWarming ? "animate-spin" : ""}`} />
            <span className="flex-1">{message}</span>
            {!isWarming && (
                <button
                    type="button"
                    onClick={() => setStatus(null)}
                    aria-label="Dismiss server status"
                    className="rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                >
                    <X size={16} aria-hidden="true" />
                </button>
            )}
        </div>
    );
};

export default ServerWakeUpBanner;

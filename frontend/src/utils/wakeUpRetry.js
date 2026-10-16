const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];
export const WAKE_UP_EVENT = "server-wake-up";

let activeRetries = 0;
let failedRetries = 0;

const emitWakeUpStatus = (detail) => {
    window.dispatchEvent(new CustomEvent(WAKE_UP_EVENT, { detail }));
};

export const reportWakeUpStatus = emitWakeUpStatus;

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const beginRetrying = () => {
    if (activeRetries === 0) failedRetries = 0;
    activeRetries += 1;
};

const finishRetrying = (succeeded) => {
    if (succeeded) {
        activeRetries -= 1;
    } else {
        failedRetries += 1;
        activeRetries -= 1;
    }

    if (activeRetries === 0) {
        emitWakeUpStatus({ status: failedRetries > 0 ? "failed" : "ready" });
    }
};

const transientStatusCodes = new Set([502, 503, 504]);

export const isTransientAxiosFailure = (error) => {
    if (transientStatusCodes.has(error?.response?.status)) return true;
    return Boolean(error?.config && !error.response && error.code !== "ERR_CANCELED");
};

export const isTransientFetchFailure = (resultOrError) => {
    if (transientStatusCodes.has(resultOrError?.status)) return true;
    return resultOrError instanceof TypeError;
};

export const retryWithWakeUp = async (operation, shouldRetry, initialError) => {
    let retryCount = 0;
    let isRetrying = initialError !== undefined;

    if (isRetrying) {
        if (!shouldRetry(initialError)) throw initialError;
        beginRetrying();
        retryCount = 1;
        emitWakeUpStatus({ status: "warming", attempt: retryCount, maxRetries: MAX_RETRIES });
        await wait(RETRY_DELAYS[retryCount - 1]);
    }

    while (true) {
        try {
            const result = await operation();
            if (!shouldRetry(result) || retryCount >= MAX_RETRIES) {
                if (isRetrying) finishRetrying(!shouldRetry(result));
                return result;
            }
        } catch (error) {
            if (!shouldRetry(error) || retryCount >= MAX_RETRIES) {
                if (isRetrying) finishRetrying(false);
                throw error;
            }
        }

        if (!isRetrying) {
            beginRetrying();
            isRetrying = true;
        }

        retryCount += 1;
        emitWakeUpStatus({ status: "warming", attempt: retryCount, maxRetries: MAX_RETRIES });
        await wait(RETRY_DELAYS[retryCount - 1]);
    }
};

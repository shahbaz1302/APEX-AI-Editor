import axios from "axios";
import { retryWithWakeUp, isTransientAxiosFailure } from "./wakeUpRetry";

const options = {
    baseURL:import.meta.env.VITE_SERVER_URL,
    withCredentials:true
};

const api = axios.create(options);
const retryClient = axios.create(options);

api.interceptors.response.use(
    (response) => response,
    (error) => retryWithWakeUp(
        () => retryClient.request(error.config),
        isTransientAxiosFailure,
        error
    )
);

export { api };
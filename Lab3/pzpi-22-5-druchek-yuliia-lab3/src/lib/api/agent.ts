import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    });
}

export const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

agent.interceptors.request.use(config => {
    store.uiStore.isBusy();
    return config;
})

agent.interceptors.response.use(
    async response => {
        await sleep(1000);
        store.uiStore.isIdle()
        return response;
    },
    async error => {
        await sleep(1000);
        store.uiStore.isIdle();

        const { status, data } = error.response;
        switch (status) {
            case 400:
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                toast.error('Unauthorised');
                break;
            default:
                break;
        }

        return Promise.reject(error);
    }
);

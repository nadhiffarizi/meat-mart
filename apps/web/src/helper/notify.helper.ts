import { toast } from "react-toastify"

export const callToast = (message: string, type: string, timeout?: number) => {
    if (type === 'INFO') toast.info(message, { autoClose: timeout! })
    if (type === 'ERROR') toast.error(message, { autoClose: timeout! })
}
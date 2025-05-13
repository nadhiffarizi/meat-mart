import { apiRequest } from "../api.helper"

export const getReverseLoc = async (lat: number, lon: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_OPENSTREETMAP}` + `lat=${lat}&lon=${lon}`)
    return res

}

export const getUserAddress = async (apiRoute: string) => {
    const res = await apiRequest(apiRoute || "", 'GET')
    return res
}
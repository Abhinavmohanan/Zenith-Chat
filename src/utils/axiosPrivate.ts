import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const axiosPublic = axios.create({
    baseURL: baseURL,
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

export const axiosPrivate = axios.create({ //With interceptors attached
    baseURL: baseURL,
    headers:{
        'Content-Type': 'application/json'
    }
})
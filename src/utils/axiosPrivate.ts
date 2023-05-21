import axios from 'axios'

export const axiosPublic = axios.create({
    baseURL: 'http://localhost:4000',
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

export const axiosPrivate = axios.create({ //With interceptors attached
    baseURL: 'http://localhost:4000',
    headers:{
        'Content-Type': 'application/json'
    }
})
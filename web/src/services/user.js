import axios from "axios"
import { apiUrl } from "./config"

class UserService {
    authenticate = async (query) => {
        return axios.post(apiUrl + `user/login`, query)
    }

    isExist = (key) => {
        return axios.post(apiUrl + `user/isExist`, { key: key })
    }

    create = (obj) => {
        return axios.post(apiUrl + `user/create`, obj)
    }
}

export {
    UserService
}

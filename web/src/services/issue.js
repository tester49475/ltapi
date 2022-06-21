import axios from "axios"
import { apiUrl } from "./config"

class IssueService {
    get = (owner, repo) => {
        return axios.get(apiUrl + `issue?owner=${owner}&repo=${repo}`)
    }

    create = (obj) => {
        return axios.post(apiUrl + `issue/create`, obj)
    }

    markAsRead = (id) => {
        return axios.post(apiUrl + `issue/markAsRead`, { id: id })
    }

    isExist = (key) => {
        return axios.post(apiUrl + `user/isExist`, { key: key })
    }
}

export {
    IssueService
}

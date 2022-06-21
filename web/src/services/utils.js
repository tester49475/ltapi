import axios from "axios"
import { apiUrl } from "./config"

class Utils {
    constructor(resource) {
        this.resource = resource
    }

    query = (route, query) => {
        return axios.post(apiUrl + `${route}`, query)
    }

    search = (body) => {
        return axios.post(apiUrl + `${this.resource}/search`, body)
    }

    getAll = () => {
        return axios.get(apiUrl + `${this.resource}`)
    }

    create = (route, obj) => {
        return axios.post(apiUrl + `${route}/create`, obj)
    }

    update = (route, obj) => {
        return axios.post(apiUrl + `${route}/update`, obj)
    }

    markAsRead = (id) => {
        return axios.post(apiUrl + `${this.resource}/markAsRead`, { id: id })
    }

    delete = (route, query) => {
        return axios.post(apiUrl + `${route}/delete`, query)
    }
}

export {
    Utils
}

import axios from "axios"
import { apiUrl } from "./config"

class Service {
    constructor(resource) {
        this.resource = resource
    }

    query = (query) => {
        return axios.post(apiUrl + `${this.resource}`, query)
    }

    search = (body) => {
        return axios.post(apiUrl + `${this.resource}/search`, body)
    }

    getAll = () => {
        return axios.get(apiUrl + `${this.resource}`)
    }

    create = (obj) => {
        return axios.post(apiUrl + `${this.resource}/create`, obj)
    }

    update = (obj) => {
        return axios.post(apiUrl + `${this.resource}/update`, obj)
    }

    markAsRead = (id) => {
        return axios.post(apiUrl + `${this.resource}/markAsRead`, { id: id })
    }

    delete = (query) => {
        return axios.post(apiUrl + `${this.resource}/delete`, query)
    }
}

export {
    Service
}

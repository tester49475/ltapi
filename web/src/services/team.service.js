import axios from "axios"
import { apiUrl } from "./config"

class TeamService {
    create = (obj) => {
        return axios.post(apiUrl + `team/create`, obj)
    }

    get = (query) => {
        return axios.post(apiUrl + `team`, query)
    }
}

export {
    TeamService
}

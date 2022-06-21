import axios from "axios"
import { apiUrl } from "../config"

const API_URL = "https://api.github.com/"

class Endpoint {
    listPullRequests = () => {
        return axios.get(API_URL + `repos/devhubapp/devhub/pulls`)
    }
}

export {
    Endpoint
}

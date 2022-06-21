import axios from "axios"
import { apiUrl } from "./config"

class RepoService {
    authenticate = async (query) => {
        axios.post(apiUrl + `user/login`, query)
    }

    create = async (obj) => {
        // axios.post("https://api.github.com/user/repos",
        //     {
        //         name: name,
        //         description: 'This is your first repository',
        //         'private': true,
        //     },
        //     {
        //         headers: {
        //             'Accept': 'application/vnd.github.v3+json',
        //             'Authorization': `token ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`
        //         }
        //     })

        await axios.post(apiUrl + `repo/create`, obj)
    }

    get = (obj) => {
        return axios.get(apiUrl + `repo`, obj)
    }

    getRepoContent = (owner, repo, path) => {
        return axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                owner: owner,
                repo: repo,
                path: path,
            },
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`
                }
            })
            .catch(
                e => {
                    if (e.response.status == 404) return null
                }
            )
    }

    getFile = (owner, repo, sha) => {
        return axios.get(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`,
            {
                owner: owner,
                repo: repo,
                file_sha: sha,
            },
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`
                }
            })
    }

    push = async (owner, repo, path, content) => {
        return axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                owner: owner,
                repo: repo,
                path: path,
                message: `create file at ${path}`,
                content: content
            },
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`
                }
            })
            // .then(response => console.log(response))
            // .catch(
            //     e => {
            //         console.log(e.response.status)
            //         // if (e.response.status == 404) return null
            //     }
            // )
    }

    delete = (owner, repo, path, sha) => {
        return axios.delete(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `token ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`
                },
                data: {
                    owner: owner,
                    repo: repo,
                    path: path,
                    message: `delete file at ${path}`,
                    sha: sha
                }
            }
        )
            // .then(response => console.log(response))
            // .catch(
            //     e => {
            //         console.log(e.response.status)
            //         // if (e.response.status == 404) return null
            //     }
            // )
    }

    latestCommit = async (owner, repo) => {
        return axios.get(`https://api.github.com/repos/${owner}/${repo}/commits/main`,
            {
                owner: owner,
                repo: repo,
                ref: "main",
            },
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`
                }
            })
            .catch(
                e => {
                    if (e.response.status == 404) return null
                }
            )
    }

    getFullFileTree = async (owner, repo, sha) => {
        return axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`,
            {
                owner: owner,
                repo: repo,
                tree_sha: sha
            },
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`
                }
            })
            .catch(
                e => {
                    if (e.response.status == 404) return null
                }
            )
    }
}

export {
    RepoService
}

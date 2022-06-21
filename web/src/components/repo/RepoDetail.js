import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";


import { CenteredFlex, ColumnFlex, Flex, m_l_a, YCenteredRowFlex } from "../../style/style";
import { Icon, PrimaryButton, StyledButton, Text, Title, LoadingBar } from "../BasicComponents";


import {
    changePath, getFileStructure, useQuery, appendParam, changeUrlParam,
    setSessionStorage, getSessionStorage, setLocalStorage, randomNumber, arrayBufferToString, stringToArrayBuffer
} from "../../js/util";
import { themeCollections } from "../../style/theme";
import { useEffect } from "react";
import { RepoService } from "../../services/repo.service";
import { Folder, File } from "./Components"
import { AiOutlinePlus, AiOutlineMinus, AiOutlineEdit } from "react-icons/ai";
import { Utils } from "../../services/utils";


const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: ${props => props.p || "8px"}
`

const RepoDetail = (props) => {
    const history = useHistory()
    const query = useQuery()
    const theme = props.theme
    const tc = themeCollections[props.theme]
    const [state, setState] = useState("Done")
    const [fileStructure, setFileStructure] = useState(null)
    const [newFileStructure, setNewFileStructure] = useState(null)
    const [currentLocalFolder, setCurrentLocalFolder] = useState("")
    const [selectFileGeneratorFunc, setSelectFileGeneratorFunc] = useState(null)

    const merge = async (files) => {
        const rs = new RepoService()

        let res

        // res = await rs.latestCommit("tester49475", "test_repo_0")

        // const tree_sha = res.data.commit.tree.sha

        // remove old files
        res = await rs.getFullFileTree("tester49475", "test_repo_0", "main")

        if (res != null) {
            const filesToRemove = []

            for (const file of res.data.tree) {
                if (file.type == "blob") {
                    filesToRemove.push(file)
                }
            }

            console.log(filesToRemove)

            const forLoop = async _ => {
                for (const file of filesToRemove) {
                    try {
                        await new RepoService().delete("tester49475", "test_repo_0", file.path, file.sha)
                    }
                    catch (e) {
                        console.log(e.response.status)
                    }
                }
            }

            await forLoop()
        }


        // push new files

        const forLoop = async _ => {
            for (const file of files) {
                try {
                    const base64Format = (await readFile(file)).replace('data:', '').replace(/^.+,/, '')

                    await new RepoService().push("tester49475", "test_repo_0", file.webkitRelativePath,
                        base64Format)
                }
                catch (e) {
                    console.log(e.response.status)
                }
            }
        }

        await forLoop()

        // commit notification
        new Utils().create("commit", {
            title: "Merge to main",
            number: randomNumber(7),
            created_at: Date.now().toString(),
            is_read: false,
            commiter: getSessionStorage("user").name,
            repo: getSessionStorage("repo").name
        })

        toFolder("")
    }

    const drawFileStructure = () => {
        let elements = []
        var name, path, type

        if (fileStructure == null) return

        for (let i = 0; i < fileStructure.length; i++) {
            name = fileStructure[i].name
            let path = fileStructure[i].path
            type = fileStructure[i].type

            if (type == "file") {
                elements.push(<File key={i} theme={props.theme} name={name} indent={0} />)
            }
            else {
                elements.push(
                    <Folder
                        key={i} theme={props.theme} name={name} indent={0}
                        onClick={() => { toFolder(name) }}
                    />)
            }
        }

        // if (elements.length > 0) {
        //     return <ColumnFlex gr={1} g="8px">
        //         <Text cl={tc.PrimaryButton} fs="16px" fw="bold" text="Old" />
        //         {elements}
        //     </ColumnFlex>
        // }
        // else return <Text cl={tc.secondaryText} fs="24px" fw="bold" text="Empty" />

        return <ColumnFlex gr={1}>
            {newFileStructure != null && <Text cl={tc.text} fs="16px" fw="bold" text="Old" w="100%" p="8px" />}
            {elements.length > 0 && elements}
            {elements.length == 0 &&
                <CenteredFlex p="8px" gr={1}>
                    <Text cl={tc.secondaryText} fs="24px" fw="bold" text="Empty" />
                </CenteredFlex>}
        </ColumnFlex>
    }

    const drawNewFileStructure = () => {
        let newFilesInCurrentFolder = []
        let elements = []
        let index = 0

        if (newFileStructure == null) return

        // get only files and folders in current path
        newFileStructure.forEach(
            e => {
                const splitPath = e.path.split("/")
                // add root path
                splitPath.unshift("")

                const splitCurrentPath = query.get("path").split("/")
                const currentLocalFolder = splitCurrentPath[splitCurrentPath.length - 1]

                if (splitPath[splitPath.length - 2] == currentLocalFolder) {
                    newFilesInCurrentFolder.push(e)
                }
            }
        )

        const getColorByState = (changeState) => {
            switch (changeState) {
                case "changed": return tc.changed
                case "addition": return tc.addition
                case "deletion": return tc.deletion
                default: return ""
            }
        }

        const getTrailingIcon = (changeState) => {
            switch (changeState) {
                case "changed": return <Icon component={<AiOutlineEdit />} theme={theme} hBg="none" p="0" size="16px" />
                case "addition": return <Icon component={<AiOutlinePlus />} theme={theme} hBg="none" p="0" size="16px" />
                case "deletion": return <Icon component={<AiOutlineMinus />} theme={theme} hBg="none" p="0" size="16px" />
                default: return null
            }
        }

        for (let i = 0; i < newFilesInCurrentFolder.length; i++) {
            const name = newFilesInCurrentFolder[i].name
            const path = newFilesInCurrentFolder[i].path
            const type = newFilesInCurrentFolder[i].type
            const changeState = newFilesInCurrentFolder[i].changeState

            if (type == "file") {
                elements.push(
                    <File
                        key={i} theme={props.theme} name={name} indent={0}
                        bg={getColorByState(changeState)}
                        trailingIcon={getTrailingIcon(changeState)}
                    />
                )
            }
            else {
                elements.push(
                    <Folder
                        key={i}
                        bg={getColorByState(changeState)}
                        theme={props.theme} name={name} indent={0}
                        onClick={() => { toFolder(name) }}
                        trailingIcon={getTrailingIcon(changeState)}
                    />
                )
            }
        }

        // for (let i = 0; i < newFilesInCurrentFolder.length; i++) {
        //     if (fileStructure.length == 0) changeState = "addition"

        //     for (let j = 0; j < fileStructure.length; j++) {
        //         if (fileStructure[j].name == newFilesInCurrentFolder[i]) {
        //             changeState = "none"
        //             break
        //         }
        //         else if (j == fileStructure.length - 1) {
        //             changeState = "addition"
        //         }
        //     }

        //     const name = newFilesInCurrentFolder[i].name
        //     const path = newFilesInCurrentFolder[i].path
        //     const type = newFilesInCurrentFolder[i].type

        //     if (type == "file") {
        //         elements.push(
        //             <File
        //                 key={index} theme={props.theme} name={name} indent={0}
        //                 bg={getColorByState()}
        //                 trailingIcon={changeState == "addition" &&
        //                     <Icon component={<AiOutlinePlus />} theme={theme} hBg="none" p="0" size="16px" />
        //                 }
        //             />
        //         )
        //     }
        //     else {
        //         elements.push(
        //             <Folder
        //                 key={index}
        //                 bg={getColorByState()}
        //                 theme={props.theme} name={name} indent={0}
        //                 onClick={() => { toFolder(name) }}
        //                 trailingIcon={changeState == "addition" &&
        //                     <Icon component={<AiOutlinePlus />} theme={theme} hBg="none" p="0" size="16px" />
        //                 }
        //             />
        //         )
        //     }

        //     index++
        // }

        // // check deleted files
        // loop0:
        // for (let i = 0; i < fileStructure.length; i++) {
        //     if (newFilesInCurrentFolder.length == 0) break

        //     for (let j = 0; j < newFilesInCurrentFolder.length; j++) {
        //         if (newFilesInCurrentFolder[j].name == fileStructure[i]) {
        //             changeState = "None"
        //             continue loop0
        //         }
        //         else if (j == fileStructure.length - 1) {
        //             changeState = "deletion"
        //         }
        //     }

        //     const name = fileStructure[i].name
        //     const path = fileStructure[i].path
        //     const type = fileStructure[i].type

        //     if (type == "file") {
        //         elements.push(
        //             <File
        //                 key={index}
        //                 theme={props.theme} name={name} indent={0}
        //                 bg={getColorByState()}
        //                 trailingIcon={<Icon component={<AiOutlineMinus />} theme={theme} hBg="none" p="0" size="16px" />}
        //             />
        //         )
        //     }
        //     else {
        //         elements.push(
        //             <Folder
        //                 key={index}
        //                 theme={props.theme} name={name} indent={0}
        //                 bg={getColorByState()}
        //                 onClick={() => { toFolder(name) }}
        //                 trailingIcon={changeState == "deletion" &&
        //                     <Icon component={<AiOutlineMinus />} theme={theme} hBg="none" p="0" size="16px" />
        //                 }
        //             />
        //         )
        //     }

        //     index++
        // }

        if (elements.length > 0) {
            return <ColumnFlex gr={1}>
                <Text cl={tc.text} fs="16px" fw="bold" text="New" w="100%" p="8px" />
                {elements}
            </ColumnFlex>
        }
        else return <></>
        // else return <Text cl={tc.secondaryText} fs="24px" fw="bold" text="No diff" p="16px" />

        // return <ColumnFlex gr={1}>
        //     <Text cl={tc.text} fs="16px" fw="bold" text="New" m="0 0 8px 0" />
        //     {elements.length > 0 && elements}
        //     {elements.length == 0 &&
        //         <CenteredFlex gr={1}>
        //             <Text cl={tc.secondaryText} fs="24px" fw="bold" text="Empty" />
        //         </CenteredFlex>}
        // </ColumnFlex>
    }

    const toFolder = (path) => {
        console.log(path);
        changeUrlParam(history, "path", `/${path}`)
    }

    const buildLocalFileStructure = () => {
        const allFoldersAndFiles = getSessionStorage("local_file_structure")

        if (allFoldersAndFiles == undefined) return

        const newFileStructure = []

        allFoldersAndFiles.forEach(
            e => {
                const splitPath = e.path.split("/")
                const splitCurrentPath = query.get("path").split("/")
                const currentLocalFolder = splitCurrentPath[splitCurrentPath.length - 1]

                if (splitPath[splitPath.length - 2] == currentLocalFolder) {
                    newFileStructure.push(e)
                }
            }
        )

        setFileStructure(newFileStructure)
    }

    const fetchFileStructure = async () => {
        setState("Loading")

        // const res = await new RepoService().getRepoContent("facebook", "react", query.get("path"))
        const res = await new RepoService().getRepoContent("tester49475", "test_repo_0", query.get("path").substring(1))

        if (res == null) {
            setFileStructure([])
        }
        else {
            setFileStructure(res.data.map(e => ({
                name: e.name,
                path: e.path,
                type: e.type,
                sha: e.sha
            })))
        }

        setState("Done")
    }

    const onFileSelected = async (files) => {
        const buildPath = (splitPath, stop) => {
            let path = ""

            for (let i = 0; i <= stop; i++) {
                path += i == 0 ? `${splitPath[i]}` : `/${splitPath[i]}`
            }

            return path
        }

        let oldFileStructure = []
        let newFileStructure = []
        let path

        for (let i = 0; i < files.length; i++) {
            path = files[i].webkitRelativePath.split("/")

            for (let j = 0; j < path.length; j++) {
                if (newFileStructure[`level${j}`] == undefined) {
                    newFileStructure[`level${j}`] = []
                }

                const content = (await readFile(files[i])).replace('data:', '').replace(/^.+,/, '')

                newFileStructure[`level${j}`].push({
                    name: path[j],
                    path: buildPath(path, j),
                    type: j == path.length - 1 ? "file" : "folder",
                    content: content
                })
            }
        }

        // remove duplicates
        for (const i in newFileStructure) {

            const arr = newFileStructure[i]

            newFileStructure[i] = Array.from(new Set(arr.map(a => a.name)))
                .map(name => {
                    return arr.find(a => a.name === name)
                })
        }

        newFileStructure = Object.values(newFileStructure).flat()
        setState("Loading")


        // const newFileStructure = []

        fileStructure.forEach(
            e => {
                const splitPath = e.path.split("/")
                const splitCurrentPath = query.get("path").split("/")
                const currentLocalFolder = splitCurrentPath[splitCurrentPath.length - 1]

                if (splitPath[splitPath.length - 2] == currentLocalFolder) {
                    oldFileStructure.push(e)
                }
            }
        )

        // newFileStructure.forEach(
        //     e => {
        //         const splitPath = e.path.split("/")
        //         const splitCurrentPath = query.get("path").split("/")
        //         const currentLocalFolder = splitCurrentPath[splitCurrentPath.length - 1]

        //         if (splitPath[splitPath.length - 2] == currentLocalFolder) {
        //             newFileStructure.push(e)
        //         }
        //     }
        // )

        // fetch old file structure
        let res = await new RepoService().getFullFileTree("tester49475", "test_repo_0", "main")
        oldFileStructure = res.data.tree

        console.log("Old", oldFileStructure)
        console.log("New", newFileStructure)

        // CHECK FILE CHANGES
        // check changes
        for (let i = 0; i < newFileStructure.length; i++) {
            if (newFileStructure[i].type == "folder") continue

            for (let j = 0; j < oldFileStructure.length; j++) {
                if (oldFileStructure[j].type == "tree") continue
                if (oldFileStructure[j].path != newFileStructure[i].path) continue

                res = await new RepoService().getFile("tester49475", "test_repo_0", oldFileStructure[j].sha)
                const oldFileContent = res.data.content.replace(/[\r\n]/gm, "")
                // console.log(res.data.content.replace(/[\r\n]/gm, "") == newFileStructure[i].content)
                if (oldFileContent != newFileStructure[i].content) {
                    newFileStructure[i].changeState = "changed"
                }
                else {
                    newFileStructure[i].changeState = "unchanged"
                }
            }
        }


        // check addition
        for (let i = 0; i < newFileStructure.length; i++) {
            if (oldFileStructure.length == 0) newFileStructure[i].changeState = "addition"

            for (let j = 0; j < oldFileStructure.length; j++) {
                if (oldFileStructure[j].path == newFileStructure[i].path) {
                    break
                }
                else if (j == oldFileStructure.length - 1) {
                    newFileStructure[i].changeState = "addition"
                }
            }
        }

        // check deletion
        const deletedFiles = []
        loop0:
        for (let i = 0; i < oldFileStructure.length; i++) {
            if (newFileStructure.length == 0) break

            for (let j = 0; j < newFileStructure.length; j++) {
                if (newFileStructure[j].path == oldFileStructure[i].path) {
                    continue loop0
                }
                else if (j == newFileStructure.length - 1) {
                    deletedFiles.push({
                        name: oldFileStructure[i].path.split("/").slice(-1).join(),
                        path: oldFileStructure[i].path,
                        type: oldFileStructure[i].type,
                        changeState: "deletion"
                    })
                }
            }
        }

        deletedFiles.forEach(
            e => newFileStructure.push(e)
        )

        console.log(newFileStructure);
        setNewFileStructure(newFileStructure)
        setState("Done")
    }

    function* selectFiles(files) {

        yield onFileSelected(files)

        // let allFoldersAndFiles = Object.values(files).map(
        //     e => (
        //         {
        //             name: e.name,
        //             type: e.type,
        //             path: e.webkitRelativePath
        //         }
        //     )
        // )

        // setSessionStorage("local_file_structure", allFoldersAndFiles)

        // buildLocalFileStructure()

        yield merge(files)
    }

    const readFile = (file) => {
        return new Promise(function (resolve, reject) {
            let fr = new FileReader()

            fr.onload = function () {
                resolve(fr.result)
            }

            fr.onerror = function () {
                reject(fr)
            }

            fr.readAsDataURL(file)
        })
    }

    const readFileAsArrayBuffer = (file) => {
        return new Promise(function (resolve, reject) {
            let fr = new FileReader()

            fr.onload = function () {
                resolve(fr.result)
            }

            fr.onerror = function () {
                reject(fr)
            }

            fr.readAsText(file)
        })
    }

    const pushToRepo = async (files) => {
        selectFiles(files)

        console.log(files[0])
        const fr = new FileReader()
        fr.readAsDataURL(files[0])

        fr.onload = function () {
            console.log(fr.result)

            return fr.result
        }
    }

    useEffect(
        () => {
            fetchFileStructure()

        }, [query.get("path"), currentLocalFolder]
    )

    return (
        <ColumnFlex bg={tc.background} h="100%">

            <Bar bcolor={tc.borderColor} p="16px">
                <Title theme={props.theme} text={getSessionStorage("repo").name} />

                <div className={`file-input-wrapper dark`}>
                    <button className={`btn-file-input btn-file-input-dark`}>
                        Push</button>
                    <input type="file" webkitdirectory="" multiple=""
                        onChange={e => {
                            var func = selectFiles(e.target.files)
                            func.next()
                            setSelectFileGeneratorFunc(func)
                        }} />
                </div>

                {/* <StyledButton bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                    br="4px" p="8px" m={m_l_a} fs="16px" text="Push"
                    onClick={() => fetchFileStructure()} /> */}
            </Bar>
            {state == "Loading" && <LoadingBar theme={props.theme} />}
            <Flex>
                {drawFileStructure()}
                {drawNewFileStructure()}
            </Flex>

            <Flex p="16px" m="16px 0 0 0">
                <PrimaryButton theme={props.theme} text="Merge" w="100%" onClick={() => selectFileGeneratorFunc.next()} />
            </Flex>

        </ColumnFlex>
    )
}


export { RepoDetail }


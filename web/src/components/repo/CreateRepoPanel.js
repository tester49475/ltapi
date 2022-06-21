import { useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"
import { useHistory } from "react-router"
import styled from "styled-components"

import { Resizable } from "re-resizable"

import { getSessionStorage, setSessionStorage, obj2Array, changeColorAlpha } from "../../js/util"
import { ColumnFlex, Flex, m_l_a, YCenteredRowFlex, StyledInput } from "../../style/style"
import { CopyIcon } from "../../svg"
import { Avatar, SearchBar, StyledButton, SvgIcon, Text, Icon, Title } from "../BasicComponents"
import { useHandleInput } from "../../hooks/useHandleInput"

import { LeftNav } from "../LeftNav"
import { Sidebar } from "../Sidebar"

import { Endpoint } from "../../services/Github/Endpoints"
import { IssueService } from "../../services/issue"
import "../../css/animation.css"
import "../../css/style.css"
import "../../css/inputFile.css"

import { BsFilter, BsFolder } from 'react-icons/bs'
import { AiOutlineFile, AiFillFolder } from 'react-icons/ai'
import { RiArrowDownSFill } from 'react-icons/ri'

import { themeCollections } from "../../style/theme"
import { changePath } from "../../js/util";


import { RepoService } from "../../services/repo.service"



const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 8px
`

const CreateRepoPanel = (props) => {
    const history = useHistory()
    const { input, getInput } = useHandleInput({})
    const tc = themeCollections[props.theme]

    const createRepo = () => {
        new RepoService().create({
            name: input.name,
            created_at: new Date(),
            ownerId: getSessionStorage("user").email,
        })

        changePath(history, "repo")
    }

    return (
        <ColumnFlex bg={tc.background} br="0px" h="100%" p="16px" g="8px" style={{ minWidth: "50%" }}>

            <Bar bcolor={tc.borderColor}>
                <Title theme={props.theme} text={`Create New Repo`} />
            </Bar>

            <StyledInput bg={changeColorAlpha(tc.backgroundVariant, "80")}
                cl={tc.text} fs="16px" w="100%" b="0" br="4px" p="16px" bs="border-box" placeholder="Repository"
                onChange={e => getInput(`name`, e.target.value)}
            />

            <Text cl={tc.text} fw="bold" text={`Is private?`} />
            <Text cl={tc.text} fw="bold" text={`Add readme.md?`} />

            <StyledButton
                bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                br="5px" p="16px" fs="24px" text="Create"
                onClick={createRepo}
            />

        </ColumnFlex>
    )
}

const Directory = (props) => {
    const tc = themeCollections[props.theme]

    const render = () => {
        const files = getSessionStorage("files")
        let path

        let elements = []

        if (files == undefined) {
            return <Text tc={tc.text} text="No files selected" />
        }

        let allFoldersAndFiles = {}


        for (let i = 0; i < files.length; i++) {
            path = files[i].split("/")

            for (let j = 0; j < path.length; j++) {
                if (allFoldersAndFiles[`level${j}`] == undefined) {
                    allFoldersAndFiles[`level${j}`] = []
                }

                allFoldersAndFiles[`level${j}`].push({
                    name: path[j],
                    type: j == path.length - 1 ? "file" : "folder"
                })
            }
        }


        // remove duplicates
        for (const i in allFoldersAndFiles) {

            const arr = allFoldersAndFiles[i]

            allFoldersAndFiles[i] = Array.from(new Set(arr.map(a => a.name)))
                .map(name => {
                    return arr.find(a => a.name === name)
                })
        }

        allFoldersAndFiles = Object.values(allFoldersAndFiles)



        let index = 0
        let name, type

        for (let i = 0; i < allFoldersAndFiles.length; i++) {

            for (let j = 0; j < allFoldersAndFiles[i].length; j++) {
                name = allFoldersAndFiles[i][j].name
                type = allFoldersAndFiles[i][j].type

                if (type == "file") {
                    elements.push(<File key={index} theme={props.theme} name={name} indent={i} />)
                }
                else {
                    elements.push(<Folder key={index} theme={props.theme} name={name} indent={i} />)
                }

                index++
            }
        }

        return elements
    }

    return (
        <ColumnFlex g="8px">

            {render()}

        </ColumnFlex>
    )
}

const Folder = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <YCenteredRowFlex w="100%" p={`0 0 0 ${32 * props.indent}px`}
            style={{ borderBottom: `2px solid ${tc.backgroundVariant}` }}
        >

            <Icon component={<AiFillFolder />} theme={props.theme} size="20px" />

            <Text cl={tc.text} text={props.name} />

        </YCenteredRowFlex>
    )
}

const File = (props) => {

    const tc = themeCollections[props.theme]

    return (
        <YCenteredRowFlex w="100%" p={`0 0 0 ${32 * props.indent}px`}
            style={{ borderBottom: `2px solid ${tc.backgroundVariant}` }}>

            <Icon component={<AiOutlineFile />} theme={props.theme} size="20px" />

            <Text cl={tc.text} text={props.name} />

        </YCenteredRowFlex>
    )
}

export { CreateRepoPanel }


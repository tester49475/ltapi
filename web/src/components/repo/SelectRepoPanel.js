import styled from "styled-components"
import { useState } from "react"

import { ColumnFlex, YCenteredRowFlex, CenteredFlex, XCenteredColumnFlex } from "../../style/style"
import { themeCollections } from "../../style/theme"
import { Text } from "../BasicComponents"
import { useHandleInput } from "../../hooks/useHandleInput"
import { StyledInput } from "../../style/style"
import { StyledButton, IconButton } from "../BasicComponents"
import { changeColorAlpha, setSessionStorage } from "../../js/util"

import { RiGitRepositoryLine } from 'react-icons/ri'
import { BiGitPullRequest } from 'react-icons/bi'
import { GoIssueReopened } from 'react-icons/go'
import { IssueService } from "../../services/issue"
import { Service } from "../../services/Service"


const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: ${props => props.p || "8px"}
`

const BorderedColumnFlex = styled(ColumnFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 16px;
    gap: 8px
`



const SelectRepoPanel = (props) => {
    const { input, getInput } = useHandleInput({})
    const tc = themeCollections[props.theme]

    const select = () => {
        setSessionStorage("repo", {
            org: input.org,
            repo: input.repo
        })

        props.updateDashboard()
    }

    return (
        <ColumnFlex bg={tc.background} w="100%" h="100%" p="16px">

            <Text cl={tc.text} fs="24px" fw="bold" text={`Select Repository`} p="0 0 16px 0" />

            <ColumnFlex g="8px">

                <StyledInput bg={changeColorAlpha(tc.backgroundVariant, "80")}
                    cl={tc.text} fs="16px" w="100%" b="0" br="4px" p="16px" bs="border-box" placeholder="Organization"
                    onChange={e => getInput(`org`, e.target.value)}
                />

                <StyledInput bg={changeColorAlpha(tc.backgroundVariant, "80")}
                    cl={tc.text} fs="16px" w="100%" b="0" br="4px" p="16px" bs="border-box" placeholder="Repository"
                    onChange={e => getInput(`repo`, e.target.value)}
                />

                <StyledButton bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                    br="5px" p="16px" fs="24px" text="Select"
                    onClick={select} />

            </ColumnFlex>


        </ColumnFlex>
    )
}

export { SelectRepoPanel }


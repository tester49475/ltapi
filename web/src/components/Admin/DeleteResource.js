import styled from "styled-components"
import { useState } from "react"

import { ColumnFlex, YCenteredRowFlex, CenteredFlex, XCenteredColumnFlex } from "../../style/style"
import { themeCollections } from "../../style/theme"
import { Text } from "../BasicComponents"
import { useHandleInput } from "../../hooks/useHandleInput"
import { StyledInput } from "../../style/style"
import { StyledButton, IconButton } from "../BasicComponents"
import { changeColorAlpha } from "../../js/util"
import { UserService } from "../../services/user"

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



const DeleteResource = (props) => {
    const [chosenMainBtn, chooseMainBtn] = useState(0)
    const [resource, chooseResource] = useState("Issue")
    const { input, getInput } = useHandleInput({})
    const tc = themeCollections[props.theme]

    const deleteRequest = () => {
        let sv
        
        switch (resource) {
            case "Issue": sv = new Service("issue"); break
            case "Commit": sv = new Service("commit"); break
            case "Pull Request": sv = new Service("pullRequest"); break
        }

        let query

        if (input) {
            query = {
                _id: parseInt(input.id)
            }
        }

        sv.delete(query)
    }

    const clickChooseResource = (i) => {
        chooseMainBtn(i)

        switch (i) {
            case 0: chooseResource("Issue"); break
            case 1: chooseResource("Commit"); break
            case 2: chooseResource("Pull Request"); break
        }
    }

    const mainButton = () => {
        let arr = [
            {
                icon: <GoIssueReopened />,
                text: "Issue"
            },
            {
                icon: <RiGitRepositoryLine />,
                text: "Commit"
            },
            {
                icon: <BiGitPullRequest />,
                text: "Pull Request"
            }
        ]

        arr = arr.map((e, i) => <IconButton key={i} theme={props.theme}
            bg={chosenMainBtn == i ? tc.primaryButton : tc.backgroundVariant} hBg={chosenMainBtn != i ? tc.primaryButton : ""}
            br="100px" icon={e.icon} text={e.text} onClick={() => clickChooseResource(i)} />)

        return arr
    }

    return (
        <ColumnFlex bg={tc.background} w="100%" p="16px">
            <Bar bcolor={tc.backgroundVariant} p="24px 0" g="16px">
                {mainButton()}
            </Bar>

            <Text cl={tc.text} fs="32px" fw="bold" text={`Delete ${resource}`} p="24px 0" />

            <ColumnFlex w="40%" g="8px">

                <StyledInput bg={changeColorAlpha(tc.backgroundVariant, "80")}
                    cl={tc.text} fs="16px" w="100%" b="0" br="4px" p="16px" bs="border-box" placeholder="Id"
                    onChange={e => getInput(`id`, e.target.value)}
                />

                <StyledButton bg="#e73535" hBg={tc.primaryButtonVariant} cl={tc.text}
                    br="5px" p="16px" fs="24px" text="Delete"
                    onClick={deleteRequest} />

            </ColumnFlex>


        </ColumnFlex>
    )
}

export { DeleteResource }


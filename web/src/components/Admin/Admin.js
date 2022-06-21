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



const Admin = (props) => {
    const [chosenMainBtn, chooseMainBtn] = useState(0)
    const [resource, chooseResource] = useState("User")
    const { input, getInput } = useHandleInput({})
    const tc = themeCollections[props.theme]
    
    const create = () => {
        let sv

        switch (resource) {
            case "User": sv = new Service("user"); break
            case "Issue": sv = new Service("issue"); break
            case "Commit": sv = new Service("commit"); break
            case "Pull Request": sv = new Service("pullRequest"); break
        }

        let obj

        if (resource == "User") {
            obj = {
                email: input.email,
                password: input.password,
                name: input.name,
                avatar_url: input.avatar_url
            }
        }
        if (resource == "Issue") {
            obj = {
                title: input.title,
                number: input.number,
                label: input.label,
                created_at: input.created_at,
                is_read: false,
                owner: input.owner,
                repo: input.repo,
            }
        }
        if (resource == "Commit") {
            obj = {
                title: input.title,
                number: input.number,
                created_at: input.created_at,
                is_read: false,
                commiter: input.commiter,
                repo: input.repo,
            }
        }
        if (resource == "Pull Request") {
            obj = {
                title: input.title,
                body: input.body,
                state: input.state,
                created_at: input.created_at,
                is_read: false,
                user: input.user,
                repo: input.repo,
            }
        }

        
        if (input.id == null) {
            sv.create(obj)
        }
        else {
            obj._id = parseInt(input.id)

            sv.update(obj)
        }
    }

    const clickChooseResource = (i) => {
        chooseMainBtn(i)

        switch (i) {
            case 0: chooseResource("User"); break
            case 1: chooseResource("Issue"); break
            case 2: chooseResource("Commit"); break
            case 3: chooseResource("Pull Request"); break
        }
    }

    const mainButton = () => {
        let arr = [
            {
                icon: <GoIssueReopened />,
                text: "User"
            },
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

    const form = () => {
        switch (resource) {
            case "User": return <UserForm themeCollection={tc} getInput={getInput} />
            case "Issue": return <IssueForm themeCollection={tc} getInput={getInput} />
            case "Commit": return <CommitForm themeCollection={tc} getInput={getInput} />
            case "Pull Request": return <PullRequestForm themeCollection={tc} getInput={getInput} />
        }
    }

    return (
        <ColumnFlex className="hide-scrollbar" bg={tc.background} w="100%" p="16px" style={{overflow: "auto"}}>
            <Bar bcolor={tc.backgroundVariant} p="24px 0" g="16px">
                {mainButton()}
            </Bar>

            <Text cl={tc.text} fs="32px" fw="bold" text={`Create New ${resource}`} p="24px 0" />

            <ColumnFlex w="40%" g="8px">
                {form()}

                <StyledButton bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                    br="5px" p="16px" fs="24px" text="Create"
                    onClick={create} />
            </ColumnFlex>


        </ColumnFlex>
    )
}

const UserForm = (props) => {
    const tc = props.themeCollection

    return (
        <>
		 <Field themeCollection={tc} getInput={props.getInput} name="_id" for="id" />        	
            <Field themeCollection={tc} getInput={props.getInput} name="Email" for="email" />
            <Field themeCollection={tc} getInput={props.getInput} name="Password" for="password" />
            <Field themeCollection={tc} getInput={props.getInput} name="Name" for="name" />
            <Field themeCollection={tc} getInput={props.getInput} name="Avatar Url" for="avatar_url" />
        </>
    )
}

const IssueForm = (props) => {
    const tc = props.themeCollection

    return (
        <>
            {/* 1653442194000 */}
            <Field themeCollection={tc} getInput={props.getInput} name="_id" for="id" />
            <Field themeCollection={tc} getInput={props.getInput} name="Title" for="title" />
            <Field themeCollection={tc} getInput={props.getInput} name="Number" for="number" />
            <Field themeCollection={tc} getInput={props.getInput} name="Label" for="label" />
            <Field themeCollection={tc} getInput={props.getInput} name="Created At" for="created_at" />
            <Field themeCollection={tc} getInput={props.getInput} name="Owner" for="owner" />
            <Field themeCollection={tc} getInput={props.getInput} name="Repo" for="repo" />
        </>
    )
}

const CommitForm = (props) => {
    const tc = props.themeCollection

    return (
        <>
            <Field themeCollection={tc} getInput={props.getInput} name="_id" for="id" />
            <Field themeCollection={tc} getInput={props.getInput} name="Title" for="title" />
            <Field themeCollection={tc} getInput={props.getInput} name="Number" for="number" />
            <Field themeCollection={tc} getInput={props.getInput} name="Created At" for="created_at" />
            <Field themeCollection={tc} getInput={props.getInput} name="Commiter" for="commiter" />
            <Field themeCollection={tc} getInput={props.getInput} name="Repo" for="repo" />
        </>
    )
}

const PullRequestForm = (props) => {
    const tc = props.themeCollection

    return (
        <>
            <Field themeCollection={tc} getInput={props.getInput} name="_id" for="id" />
            <Field themeCollection={tc} getInput={props.getInput} name="Title" for="title" />
            <Field themeCollection={tc} getInput={props.getInput} name="Body" for="body" />
            <Field themeCollection={tc} getInput={props.getInput} name="State" for="state" />
            <Field themeCollection={tc} getInput={props.getInput} name="Created At" for="created_at" />
            <Field themeCollection={tc} getInput={props.getInput} name="User" for="user" />
            <Field themeCollection={tc} getInput={props.getInput} name="Repo" for="repo" />
        </>
    )
}

const Field = (props) => {
    const tc = props.themeCollection

    return (
        <StyledInput bg={changeColorAlpha(tc.backgroundVariant, "80")}
            cl={tc.text} fs="16px" w="100%" b="0" br="4px" p="16px" bs="border-box" placeholder={props.name}
            onChange={e => props.getInput(`${props.for}`, e.target.value)}
        />
    )
}

export { Admin }


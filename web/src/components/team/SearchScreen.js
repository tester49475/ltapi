import { useState } from "react"
import { useHistory } from "react-router"
import styled from "styled-components"


import { useHandleInput } from "../../hooks/useHandleInput"
import { ColumnFlex, YCenteredRowFlex } from "../../style/style"
import { SearchBar, Text, LoadingBar, Icon } from "../BasicComponents"


import "../../css/animation.css"
import "../../css/inputFile.css"
import "../../css/style.css"


import { themeCollections } from "../../style/theme"

import { Service } from "../../services/Service"
import { TeamService } from "../../services/team.service"
import { asyncWithTimeout, getSessionStorage } from "../../js/util"
import { Utils } from "../../services/utils"
import { BasicUserInfoItem } from "../BasicComponents"
import { AiOutlineSend } from "react-icons/ai"
import { m_l_a } from "../../style/style"


const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 8px
`

const SearchScreen = (props) => {
    const history = useHistory()
    const { input, getInput } = useHandleInput({})
    const [state, setState] = useState("notStart")
    const [searchString, setSearchString] = useState("")
    const [searchResult, setSearchResult] = useState(null)
    const theme = props.theme
    const tc = themeCollections[props.theme]

    const createTeam = () => {
        new TeamService().create({
            name: input.name,
            leaderId: 0,
            memberIds: [0]
        })
    }

    const displaySeachResult = () => {
        if (searchResult == null) {
            return <Text cl={tc.text} text={`No result`} />
        }
        else {
            const users = searchResult
            return users.map(
                e =>
                    <YCenteredRowFlex key={e._id}>
                        <BasicUserInfoItem
                            key={e._id} theme={theme}
                            name={e.name} email={e.email} avatar_url={e.avatar_url}
                        />

                        <Icon component={<AiOutlineSend />} theme={theme} size="24px"
                            m={m_l_a}
                            onClick={() => inviteToTeam(e._id)}
                        />
                    </YCenteredRowFlex>

            )
        }
    }

    const search = async () => {
        const requestBody = {
            query: {
                _id: { $ne: getSessionStorage("user")._id }
            },
            field: { name: "text" },
            searchStr: searchString,
            // sort: getSortQuery()
        }

        try {
            setState("Searching")

            let res = await asyncWithTimeout(new Utils().query("user", requestBody), 5000)

            console.log(res.data)
            setSearchResult(res.data)

            setState("Done")
        }
        catch (e) {

            console.log(e)
            setState("Timeout")
        }

    }

    const inviteToTeam = async (id) => {
        const requestBody = {
            to: id,
            teamId: getSessionStorage("team")._id,
            status: "pending"
        }

        await asyncWithTimeout(new Utils().create("teamRequest", requestBody), 5000)
    }

    return (
        <ColumnFlex bg={tc.background} br="0px" h="100%" p="16px" g="8px" style={{ minWidth: "50%" }}>

            {/* <Bar bcolor={tc.borderColor}>
                <Title theme={props.theme} text={`Create new team`} />
            </Bar> */}

            {state == "Searching" && <LoadingBar theme={theme} />}

            <SearchBar theme={theme} placeholder={`Search user`}
                getSearchQuery={setSearchString} search={search}
            />

            {displaySeachResult()}
        </ColumnFlex>
    )
}


export { SearchScreen }


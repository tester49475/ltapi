import { useHistory } from "react-router"
import styled from "styled-components"


import { useHandleInput } from "../../hooks/useHandleInput"
import { asyncWithTimeout, changeColorAlpha, setSessionStorage, getSessionStorage, changeWholePath } from "../../js/util"
import { ColumnFlex, StyledInput, YCenteredRowFlex } from "../../style/style"
import { StyledButton, Title } from "../BasicComponents"


import "../../css/animation.css"
import "../../css/inputFile.css"
import "../../css/style.css"


import { themeCollections } from "../../style/theme"


import { TeamService } from "../../services/team.service"
import { Utils } from "../../services/utils"



const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 8px
`

const CreateTeamPanel = (props) => {
    const history = useHistory()
    const { input, getInput } = useHandleInput({})
    const tc = themeCollections[props.theme]

    const createTeam = async () => {
        const currentUserId = getSessionStorage("user")._id

        try {
            let res = await asyncWithTimeout(new TeamService().create({
                name: input.name,
                leaderId: currentUserId,
                memberIds: [currentUserId]
            }), 5000)

            const updatedUser = getSessionStorage("user")

            if (updatedUser.teamIds) {
                updatedUser.teamIds.push(res.data._id)
            }
            else {
                updatedUser.teamIds = [res.data._id]
            }

            await asyncWithTimeout(new Utils().update("user", updatedUser), 5000)

            setSessionStorage("user", updatedUser)

            changeWholePath(history, "dashboard/team")
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <ColumnFlex bg={tc.background} br="0px" h="100%" p="16px" g="8px" style={{ minWidth: "50%" }}>

            <Bar bcolor={tc.borderColor}>
                <Title theme={props.theme} text={`Create new team`} />
            </Bar>

            <StyledInput
                bg={changeColorAlpha(tc.backgroundVariant, "80")}
                cl={tc.text} fs="16px" w="100%" b="0" br="4px" p="16px" bs="border-box" placeholder="Name"
                onChange={e => getInput(`name`, e.target.value)}
            />

            <StyledButton
                bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                br="5px" p="16px" fs="24px" text="Create"
                onClick={createTeam}
            />

        </ColumnFlex>
    )
}


export { CreateTeamPanel }


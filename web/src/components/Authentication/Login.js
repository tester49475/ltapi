import styled from "styled-components"

import { useHistory } from "react-router"
import { ColumnFlex, YCenteredRowFlex, CenteredFlex, XCenteredColumnFlex } from "../../style/style"
import { themeCollections } from "../../style/theme"
import { Text, CustomLinearProgress, TextField } from "../BasicComponents"
import { useHandleInput } from "../../hooks/useHandleInput"
import { StyledInput } from "../../style/style"
import { StyledButton } from "../BasicComponents"
import { changeColorAlpha } from "../../js/util"
import { UserService } from "../../services/user"
import { getSessionStorage, setSessionStorage, changePath } from "../../js/util"
import { useState } from "react"

import "../../css/style.css"



const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 8px
`

const BorderedColumnFlex = styled(ColumnFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 16px;
    gap: 8px
`



const Login = (props) => {
    const history = useHistory()
    const { input, getInput } = useHandleInput({})
    const [authState, setAuthState] = useState(false)

    const theme = props.theme
    const tc = themeCollections[theme]

    const login = async () => {
        setAuthState("authenticating")

        const res = await new UserService().authenticate({
            email: input.email,
            password: input.password
        })

        if (res.data == "") {
            setAuthState("error")
        }
        else {
            setSessionStorage("user", res.data)

            props.updateHeader()

            changePath(history, "dashboard/notification/issue")
        }
    }
    
    return (
        <CenteredFlex bg={tc.background} w="100%">
            <XCenteredColumnFlex bg={changeColorAlpha(tc.backgroundVariant, "40")} w="30%" br="6px" p="16px" g="16px">

                <Text cl={tc.text} fs="32px" fw="bold" text="Login" m="24px 0" />

                <TextField theme={theme} name="Email" for="email" getInput={getInput} />
                <TextField className="password-input" theme={theme} name="Password" for="password" getInput={getInput} />

                {authState == "authenticating" &&
                    <CustomLinearProgress theme={theme} />}

                {authState == "error" &&
                    <Text w="100%" p="0 16px" cl={tc.error} fs="16px" fw="bold" ta="left" text="Incorrect email or password" />}

                <StyledButton bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl="#fff"
                    w="100%" br="5px" p="16px" m="auto 0 0 0" fs="16px" text="Login"
                    onClick={() => login()} />

            </XCenteredColumnFlex>
        </CenteredFlex>
    )
}

export { Login }


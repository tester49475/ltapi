import styled from "styled-components"


import { ColumnFlex, YCenteredRowFlex, CenteredFlex, XCenteredColumnFlex } from "../../style/style"
import { themeCollections } from "../../style/theme"
import { Text, TextField } from "../BasicComponents"
import { useHandleInput } from "../../hooks/useHandleInput"
import { StyledInput } from "../../style/style"
import { StyledButton } from "../BasicComponents"
import { changeColorAlpha } from "../../js/util"
import { UserService } from "../../services/user"


const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 8px
`

const BorderedColumnFlex = styled(ColumnFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 16px;
    gap: 8px
`



const Signup = (props) => {
    const { input, getInput } = useHandleInput({})

    const theme = props.theme
    const tc = themeCollections[theme]

    const signup = () => {
        new UserService().create({
            email: input.email,
            password: input.password,
            name: input.name,
            avatar_url: input.avatar_url
        })
    }

    return (
        <CenteredFlex bg={tc.background} w="100%">
            <XCenteredColumnFlex bg={changeColorAlpha(tc.backgroundVariant, "40")} w="30%" br="6px" p="16px" g="16px">

                <Text cl={tc.text} fs="32px" fw="bold" text="Registration" m="24px 0" />

                <TextField theme={theme} name="Email" for="email" getInput={getInput} />
                <TextField theme={theme} name="User Name" for="name" getInput={getInput} />
                <TextField theme={theme} name="Avatar Url" for="avatar_url" getInput={getInput} />
                <TextField className="password-input" theme={theme} name="Password" for="password" getInput={getInput} />
                <TextField className="password-input" theme={theme} name="Confirm Password" for="confirm_password" getInput={getInput} />

                <StyledButton
                    bg={tc.primaryButton} hBg={tc.primaryButtonVariant}
                    cl={tc.text} fs="16px" text="Signup"
                    w="100%" br="5px" p="16px" m="auto 0 0 0"
                    onClick={() => signup()}
                />

            </XCenteredColumnFlex>
        </CenteredFlex>
    )
}

export { Signup }


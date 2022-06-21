import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Icon, StyledButton, Text, Avatar } from "../../components/BasicComponents";
import { themeCollections } from "../../style/theme"
import { changeColorAlpha, changeWholePath } from "../../js/util"
import { ColumnFlex, m_l_a, YCenteredRowFlex } from "../../style/style";
import "../../css/style.css"
import { changePath } from "../../js/util"
import { getSessionStorage, removeSessionStorage } from "../../js/util"

import { AiOutlineGithub } from 'react-icons/ai'
import { MdOutlineLightMode } from 'react-icons/md'

let account = "";

const localThemeCollections = {
    light: {
        header: ["#eee", "#333", "#ddd", "#ccc"]

    },
    dark: {
        header: ["#161b22", "#fff", "#555", "#444"]
    }
}

const Header = (props) => {
    const history = useHistory()
    const [updateTime, update] = useState(0)

    const theme = props.theme
    const tc = localThemeCollections[props.theme].header
    const gtc = themeCollections[props.theme]

    const user = getSessionStorage("user")

    // useEffect(
    //     () => {
    //         if (user != undefined) {
    //             changePath(history, "./dashboard")
    //         }
    //     }, []
    // )

    const logout = () => {
        removeSessionStorage("user")

        changeWholePath(history, "login")

        update(updateTime + 1)
        props.updateMainRouter()
    }

    return (
        <YCenteredRowFlex
            bg={tc[0]} top="0" h="50px" p="16px" bs="content-box" g="16px" z={3}
            style={{ boxShadow: "1px 1px 10px" }}
        >
            <Icon component={<AiOutlineGithub />} theme={props.theme} hBg="none" size="36px" p="0" />

            <Text cl={tc[1]} fs="16px" text="2022 Githull. All Rights Reserved" />

            {user == undefined &&
                <>
                    <StyledButton className="br-5-p-9" bg="" hBg={tc[3]} cl={tc[1]} m={m_l_a} text="Login"
                        onClick={() => changePath(history, "./login")}
                    />

                    <StyledButton className="br-5-p-9" bg={tc[2]} hBg={tc[3]} cl={tc[1]} text="Signup"
                        onClick={() => changePath(history, "./signup")}
                    />
                </>
            }

            {
                user &&
                <>
                    <YCenteredRowFlex m={m_l_a} p="0 8px" g="8px">
                        <Avatar url={user.avatar_url} />

                        <ColumnFlex g="8px">
                            <Text cl={gtc.text} text={`Hello, ${user.name}`} />
                            <Text cl={gtc.secondaryText} fs="12px" text={`${user.email}`} />
                        </ColumnFlex>

                    </YCenteredRowFlex>

                    <StyledButton className="br-5-p-9" bg={tc[2]} hBg={tc[3]} cl={tc[1]} text="Logout"
                        onClick={() => logout()}
                    />
                </>
            }

            <Icon component={<MdOutlineLightMode />} theme={props.theme}
                hBg={changeColorAlpha(gtc.primaryButton, "40")} size="24px" p="8px"
                onClick={() => props.setTheme(props.theme == "light" ? "dark" : "light")}
            />

        </YCenteredRowFlex>
    )
}

export { Header };


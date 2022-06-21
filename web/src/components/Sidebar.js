import { useEffect } from "react";
import styled from "styled-components";

import { changeColorAlpha } from "../js/util"
import { themeCollections } from "../style/theme"
import { ColumnFlex, Flex, m_t_a, XCenteredColumnFlex } from "../style/style";
import { Avatar } from "./BasicComponents";

import { IconContext } from "react-icons";
import { AiOutlineMenu, AiOutlineSetting } from 'react-icons/ai'

import { Icon } from "./BasicComponents";

// const themeCollections = {
//     light: {
//         background: "#fff",
//         backgroundVariant: "#ddd",
//         secondaryBackground: "#fff",
//         borderColor: "#ccc",
//         text: "#222",
//         secondaryText: "#888"
//     },
//     dark: {
//         background: "#333",
//         backgroundVariant: "#555",
//         secondaryBackground: "#12171e",
//         borderColor: "#444",
//         text: "#fff",
//         secondaryText: "#999"
//     }
// }


const Bar = styled(Flex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 8px
`;

const BorderedColumnFlex = styled(ColumnFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 16px;
    gap: 8px
`;


const Sidebar = (props) => {
    const tc = themeCollections[props.theme]

    useEffect(
        () => {

        }, []
    )

    return (
        <XCenteredColumnFlex
            bg={tc.backgroundVariant}
            w="fit-content" p="8px" bs="content-box" g="0px"
            z="2"
            style={{ borderRight: `solid 1px ${tc.borderColor}` }}
        >
            {/* <Avatar url="https://cdn.pixabay.com/photo/2022/04/15/07/58/sunset-7133867__340.jpg" /> */}

            <Icon component={<AiOutlineMenu />} theme={props.theme} hBg={changeColorAlpha(tc.primaryButton, "40")} m={m_t_a} size="24px"
                onClick={props.openLeftNav}
            />

            <Icon component={<AiOutlineSetting />} theme={props.theme} hBg={changeColorAlpha(tc.primaryButton, "40")} size="24px" />

        </XCenteredColumnFlex>
    )
}

export { Sidebar };


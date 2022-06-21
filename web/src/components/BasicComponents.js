import { useState } from "react";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material"

import {
    BasicButton, br_5, Centered, CenteredFlex, ColumnFlex, Flex, px_9, StyledImage, StyledText,
    YCenteredRowFlex, m_l_a, StyledInput
} from "../style/style";

import { changeColorAlpha } from "../js/util";

import { useHandleInput } from "../hooks/useHandleInput";
import { SearchIcon } from "../svg";

import { IconContext } from "react-icons";
import { BsSearch } from "react-icons/bs"

import { themeCollections } from "../style/theme";


const localThemeCollections = {
    light: {
        searchBar: ["#ddd", "#222", "#ccc"]
    },
    dark: {
        searchBar: ["#444", "#fff", "#555", "#666"]
    }
}



const StyledButton = (props) => {
    return (
        <BasicButton
            className={props.className}
            bg={props.bg || "transparent"} b={props.b} br={props.br} w={props.w} h={props.h}
            p={props.p} m={props.m}
            hBg={props.hBg} hc={props.hc}
            style={props.style}
            onClick={() => props.onClick()}
            ref={props.iref}
        >
            <Centered>
                <StyledText cl={props.cl} hc={props.hc} fs={props.fs} fw={props.fw || "bold"}>{props.text}</StyledText>
            </Centered>
        </BasicButton>
    )
}

const IconButton = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <YCenteredRowFlex bg={props.bg || "transparent"} hBg={props.hBg} br={props.br} w={props.w} h={props.h} p="8px 16px" g="8px" onClick={() => props.onClick()}>
            <Icon component={props.icon} theme={props.theme} hBg="none" p="0" size="24px" />

            <Text cl={tc.text} text={props.text} style={{ cursor: "default" }} />
        </YCenteredRowFlex>
    )
}

const PrimaryButton = (props) => {
    const tc = themeCollections[props.theme]

    return <StyledButton
        bg={tc.primaryButton} hBg={tc.primaryButtonVariant}
        cl={tc.text} fs="16px" text={props.text}
        w={props.w || ""} br="4px" p="8px" m={props.m || ""}
        onClick={props.onClick}
    />
}


const Badge = (props) => {
    return (
        <CenteredFlex
            bg={props.bg} cl={props.cl} br={br_5} w={props.w} h={props.h || "25px"}
            p={props.p || px_9} m={props.m}
            hBg={props.hb} hc={props.hc}
        >
            <StyledText fs={props.fs || "14px"} fw={props.fw}>{props.text}</StyledText>
        </CenteredFlex>
    )
}

const StyledRouteLink = (props) => {
    return (
        <Link to={props.to} style={{ textDecoration: "none" }}>
            <Badge bg={props.bg} cl={props.cl} br={br_5} w={props.w} h={props.h} p={props.p} hb={props.hb} hc={props.hc} fw="bold"
                text={props.text}
            />
        </Link>
    )
}

const SvgIcon = (props) => {
    let size = props.w || props.h;
    size *= 1 * props.scale;
    size += "px";

    return (
        <CenteredFlex bg="none" m={props.m} onClick={props.onClick}>
            {props.svg}
            <img
                style={{
                    clipPath: `url(#${props.cpId})`,
                    background: props.bg,
                    width: size,
                    height: size,
                }}
                alt=""
            />
        </CenteredFlex>
    )
}

const Text = (props) => {
    return (
        <StyledText
            className={props.className} bg={props.bg} hBg={props.hBg} cl={props.cl} hc={props.hc} b={props.b} br={props.br}
            fs={props.fs} fw={props.fw} ta={props.ta} w={props.w} p={props.p} m={props.m} style={props.style}
        >
            {props.text}
        </StyledText>
    )
}

const TextWithIcon = (props) => {
    return (
        <YCenteredRowFlex bg={props.cbg || "none"} g="8px">
            <SvgIcon svg={props.svg} cpId={props.id} bg={props.bg} w={512} scale={0.05} />

            <Flex
                cl={props.cl} br={props.br}
                w={props.w} p={props.p} m={props.m}
                style={{ fontFamily: "sans-serif", fontSize: props.fs, fontWeight: props.fw, textAlign: props.ta }}
            >
                {props.text}
            </Flex>
        </YCenteredRowFlex>
    )
}

// const dropDownThemeCollections = {
//     light: []
// }

const DropDown = (props) => {
    const [isExpand, expand] = useState(false);
    const [chosen, choose] = useState(null);

    const chooseOption = (value) => {
        props.getValue(value);
        choose(value);
        expand(false);
    }

    const tc = props.themeCollection;

    return (
        <ColumnFlex pos="relative" m={props.m} g={isExpand ? "8px" : "0"} tr="gap 0.5s">
            <StyledButton bg={tc[0]} cl={tc[2]} br="5px" fs="16px" p="8px" hb={tc[1]}
                text={chosen || props.btnName} onClick={() => expand(!isExpand)}
            />

            <ColumnFlex pos="absolute" top="110%" br="5px" w="100%" h="" o="auto" z="2" tr="all 0.3s"
                style={{ transform: isExpand ? "scaleY(1)" : "scaleY(0)", transformOrigin: "top", maxHeight: "150px" }}>
                {
                    props.options.map(
                        (item, i) =>
                            <Centered key={i} bg={tc[0]} w="100%" p="16px" hBg={tc[1]} onClick={() => chooseOption(item)}>
                                <Text cl={tc[2]} text={item} />
                            </Centered>
                    )
                }
            </ColumnFlex>
        </ColumnFlex>
    )
}

const CenteredText = (props) => {
    return (
        <Flex
            bg={props.bg} cl={props.cl} br={props.br}
            w={props.w} p={props.p} m={props.m}
            style={{ fontFamily: "system-ui", fontSize: props.fs, fontWeight: props.fw, textAlign: props.ta }}
        >
            {props.text}
        </Flex>
    )
}

const SearchBar = (props) => {
    const { input, getInput } = useHandleInput({});

    const tc = themeCollections[props.theme]

    const onChange = (e) => {
        const value = e.target.value

        getInput("q", value)

        props.getSearchQuery(value)
    }

    return (
        <YCenteredRowFlex className="br-5-p-9" bg={tc.backgroundVariant} w={props.w} g="8px">
            <StyledInput cl={tc.text} fs="16px" b="0" w="70%" placeholder={props.placeholder}
                onChange={e => onChange(e)}
            />

            <CenteredFlex className="br-5-p-9" bg={tc.background} hBg={tc.secondaryBackground} m={m_l_a}
                onClick={props.search}
            >
                <IconContext.Provider value={{ size: "16px", color: themeCollections[props.theme].text }}>
                    <BsSearch />
                </IconContext.Provider>
            </CenteredFlex>
        </YCenteredRowFlex>
    )
}

const Avatar = (props) => {
    return (
        <StyledImage src={props.url} w="40px" h="40px" b="3px solid #fff" br="50%" m={props.m}
            style={{ objectFit: "cover" }}
        />
    )
}

const Icon = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <Flex hBg={props.hBg || tc.backgroundVariant} br="50%" p={props.p || "8px"} m={props.m} onClick={props.onClick}>
            <IconContext.Provider value={{ size: props.size, color: tc.text }}>
                {props.component}
            </IconContext.Provider>
        </Flex>
    )
}

const CustomLinearProgress = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <LinearProgress
            sx={{
                '& .MuiLinearProgress-barColorPrimary': {
                    backgroundColor: tc.primaryButton,
                }
            }}
            style={{ width: "100%" }}
        />
    )
}

const TextField = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <StyledInput
            className={props.className}
            bg={changeColorAlpha(tc.backgroundVariant, "80")}
            cl={tc.text} fs="16px" w="100%" b="0" br="4px" p="16px" bs="border-box" placeholder={props.name}
            onChange={e => props.getInput(`${props.for}`, e.target.value)}
        />
    )
}

const Title = (props) => {
    const tc = themeCollections[props.theme]

    return (<Text cl={props.cl || tc.text} fs="24px" fw="bold" text={props.text} />)
}

const LoadingBar = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <ColumnFlex w="100%">
            <LinearProgress sx={{
                '& .MuiLinearProgress-barColorPrimary': {
                    backgroundColor: tc.primaryButton,
                }
            }} />
        </ColumnFlex>
    )
}

const LoadingBarWithText = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <ColumnFlex w="100%" m="auto 0 0 0" g="16px">
            <Text cl={tc.secondaryText} fw="bold" text={props.text} w="100%" />

            <LinearProgress sx={{
                '& .MuiLinearProgress-barColorPrimary': {
                    backgroundColor: tc.primaryButton,
                }
            }} />
        </ColumnFlex>
    )
}

const BasicUserInfoItem = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <YCenteredRowFlex p="8px" g="8px">
            <Avatar url={props.avatar_url} />

            <ColumnFlex g="8px">
                <Text cl={tc.text} text={`${props.name}`} />
                <Text cl={tc.secondaryText} fs="12px" text={`${props.email}`} />
            </ColumnFlex>

        </YCenteredRowFlex>
    )
}

export {
    StyledButton, PrimaryButton, IconButton, Badge, StyledRouteLink, SvgIcon, Text, CenteredText, TextWithIcon, DropDown,
    SearchBar, Avatar, Icon, CustomLinearProgress, TextField, Title, LoadingBar, LoadingBarWithText, BasicUserInfoItem
}

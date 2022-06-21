import { useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"
import styled from "styled-components"

import { Resizable } from "re-resizable"

import { getSessionStorage, setSessionStorage, obj2Array, changeColorAlpha } from "../../js/util"
import { ColumnFlex, Flex, m_l_a, YCenteredRowFlex, StyledInput } from "../../style/style"
import { CopyIcon } from "../../svg"
import { Avatar, SearchBar, StyledButton, SvgIcon, Text, Icon } from "../BasicComponents"
import { useHandleInput } from "../../hooks/useHandleInput"

import { LeftNav } from "../LeftNav"
import { Sidebar } from "../Sidebar"

import { Endpoint } from "../../services/Github/Endpoints"
import { IssueService } from "../../services/issue"
import "../../css/animation.css"
import "../../css/style.css"
import "../../css/inputFile.css"

import { BsFilter, BsFolder } from 'react-icons/bs'
import { AiOutlineFile, AiFillFolder } from 'react-icons/ai'
import { RiArrowDownSFill } from 'react-icons/ri'

import { themeCollections } from "../../style/theme"

import { RepoService } from "../../services/repo.service"

const FONT_SIZE = "14px"
const ICON_SIZE = "14px"

const Folder = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <YCenteredRowFlex
            bg={props.bg} hBg={tc.backgroundVariant}
            w="100%" p={`4px 4px 4px ${32 * props.indent}px`}
            style={{ borderBottom: `2px solid ${tc.backgroundVariant}` }}
            onClick={props.onClick}
        >

            <Icon component={<AiFillFolder />} theme={props.theme} hBg="none" size={ICON_SIZE} />

            <Text cl={tc.secondaryText} fs={FONT_SIZE} text={props.name} />
            {/* Spacer */}
            <Flex w="8px" />

            {props.trailingIcon}

        </YCenteredRowFlex>
    )
}

const File = (props) => {

    const tc = themeCollections[props.theme]

    return (
        <YCenteredRowFlex
            bg={props.bg} hBg={tc.backgroundVariant}
            w="100%" p={`4px 4px 4px ${32 * props.indent}px`}
            style={{ borderBottom: `2px solid ${tc.backgroundVariant}` }}
        >

            <Icon component={<AiOutlineFile />} theme={props.theme} hBg="none" size={ICON_SIZE} />

            <Text cl={tc.secondaryText} fs={FONT_SIZE} text={props.name} />

            <Flex w="8px" />

            {props.trailingIcon}

        </YCenteredRowFlex>
    )
}

export { Folder, File }
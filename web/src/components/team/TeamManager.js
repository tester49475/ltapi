import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import styled from "styled-components"


import { useHandleInput } from "../../hooks/useHandleInput"
import { changeWholePath, getSessionStorage, removeSessionStorage, setSessionStorage, asyncWithTimeout, removePropertyFromObject } from "../../js/util"
import { Flex, ColumnFlex, m_l_a, YCenteredRowFlex } from "../../style/style"
import { BasicUserInfoItem, Icon, StyledButton, Text, Title } from "../BasicComponents"


import "../../css/animation.css"
import "../../css/inputFile.css"
import "../../css/style.css"

import { AiOutlinePlus, AiOutlineTeam } from 'react-icons/ai'

import { pushPath } from "../../js/util"
import { themeCollections } from "../../style/theme"


import { TeamService } from "../../services/team.service"
import { Utils } from "../../services/utils"



const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: ${props => props.p || "8px"}
`

const TeamManager = (props) => {
    const history = useHistory()
    const [team, setTeam] = useState(null)
    const [teamRequest, setTeamRequest] = useState(null)
    const theme = props.theme
    const tc = themeCollections[props.theme]
    const user = getSessionStorage("user")

    const fetchTeam = async () => {
        let res

        try {
            res = await asyncWithTimeout(new TeamService().get({ _id: { $in: user.teamIds } }), 5000)

            const team = res.data

            res = await new Utils().query("user",
                {
                    query: { _id: { $in: team.memberIds } }
                }
            )

            team.member = res.data
            setSessionStorage("team", team)
            setTeam(team)
        }
        catch (e) {
            setTeam(null)
        }
    }

    const fetchTeamRequest = async () => {
        let res

        try {
            res = await asyncWithTimeout(new Utils().query("teamRequest",
                { to: user._id, status: "pending" }),
                5000
            )

            const teamRequest = res.data[0]

            res = await asyncWithTimeout(new TeamService().get({ _id: teamRequest.teamId }), 5000)

            teamRequest.team = res.data

            setTeamRequest(teamRequest)
        }
        catch (e) {
            setTeamRequest(null)
        }
    }

    const denyTeamRequest = async () => {
        try {
            const updatedTeamRequest = teamRequest

            delete updatedTeamRequest.team

            updatedTeamRequest.status = "denied"

            await asyncWithTimeout(new Utils().update("teamRequest", updatedTeamRequest), 5000)
        }
        catch (e) {

        }
    }

    const acceptTeamRequest = async () => {
        try {
            // update team request
            const updatedTeamRequest = removePropertyFromObject(teamRequest, "team")

            updatedTeamRequest.status = "accepted"

            await asyncWithTimeout(new Utils().update("teamRequest", updatedTeamRequest), 5000)

            // update team
            const updatedTeam = teamRequest.team

            updatedTeam.memberIds.push(user._id)

            await asyncWithTimeout(new Utils().update("team", updatedTeam), 5000)

            // update user
            const updatedUser = getSessionStorage("user")

            if (updatedUser.teamIds) {
                updatedUser.teamIds.push(updatedTeam._id)
            }
            else {
                updatedUser.teamIds = [updatedTeam._id]
            }

            await asyncWithTimeout(new Utils().update("user", updatedUser), 5000)

            setSessionStorage("user", updatedUser)
        }
        catch (e) {

        }
    }

    const displayTeamMember = () => {
        if (team == null) {
            return <Text cl={tc.secondaryText} text={"You don't have a team"} w="100%" p="64px" />
        }
        else {
            return <ColumnFlex p="16px" g="8px">
                <YCenteredRowFlex bg={tc.backgroundVariant} br="4px" p="12px" g="4px">
                    <ColumnFlex g="4px">
                        <YCenteredRowFlex g="4px">
                            <Icon component={<AiOutlineTeam />} theme={theme} size="24px" p="0" hBg={""} />
                            <Text cl={tc.text} text={`${team.name}`} />
                        </YCenteredRowFlex>

                        <Text cl={tc.secondaryText} text={`${team.member.length} members`} />
                    </ColumnFlex>

                    <Icon component={<AiOutlinePlus />} theme={theme} size="24px"
                        m={m_l_a} hBg={tc.background}
                        onClick={() => changeWholePath(history, "search")}
                    />
                </YCenteredRowFlex>

                {team.member.map(
                    e =>
                        e._id != team.leaderId ?

                            <BasicUserInfoItem key={e._id} theme={theme}
                                name={e.name} email={e.email} avatar_url={e.avatar_url} />
                            :

                            <YCenteredRowFlex key={e._id}>
                                <BasicUserInfoItem theme={theme}
                                    name={e.name} email={e.email} avatar_url={e.avatar_url} />
                                <Text bg={tc.backgroundVariant} cl={tc.text} text="Leader" h="fit-content" br="4px" p="8px" m={m_l_a} />
                            </YCenteredRowFlex>
                )}
            </ColumnFlex>
        }
    }

    const displayTeamRequest = () => {
        if (teamRequest == null) {
            return <Text cl={tc.secondaryText} text={"You don't have any request"} w="100%" p="64px" />
        }
        else {
            return <ColumnFlex g="8px">
                <YCenteredRowFlex bg={tc.backgroundVariant} br="4px" p="8px" g="8px">
                    <ColumnFlex g="4px">
                        <Text cl={tc.text} text={`${teamRequest.team.name}`} />
                        <Text cl={tc.secondaryText} text={`${teamRequest.team.memberIds.length} members`} />
                    </ColumnFlex>

                    {teamRequest.status == "pending" &&
                        <>
                            <StyledButton
                                bg={"none"} hBg={tc.background} cl={tc.text}
                                br="4px" p="8px" m={m_l_a} text="Deny"
                                onClick={() => denyTeamRequest()}
                            />

                            <StyledButton
                                bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                                br="4px" p="8px" text="Accept"
                                onClick={() => acceptTeamRequest()}
                            />
                        </>
                    }

                    {teamRequest.status == "accepted" &&
                        <StyledButton
                            bg={tc.background} cl={tc.text}
                            br="4px" p="8px" m={m_l_a} text="Accepted"
                            onClick={() => acceptTeamRequest()}
                        />
                    }
                </YCenteredRowFlex>
            </ColumnFlex>
        }
    }

    const deleteTeam = async () => {
        await asyncWithTimeout(new Utils().delete("team", {
            _id: getSessionStorage("team")._id
        }), 5000)

        removeSessionStorage("team")
        setTeam(null)
    }

    useEffect(
        () => {
            fetchTeam()
            fetchTeamRequest()
        }, []
    )

    return (
        <ColumnFlex bg={tc.background} br="0px" h="100%" style={{ minWidth: "50%" }}>

            <Bar bcolor={tc.borderColor} p="16px">
                <Title theme={props.theme} text={`Team Manager`} />
            </Bar>

            {displayTeamMember()}

            <Flex p="0 16px" g="8px">
                {team == null &&
                    <StyledButton
                        bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                        w="100%" br="4px" p="16px" fs="24px" text="Create"
                        onClick={() => pushPath(history, "create")}
                    />
                }

                {
                    (() => {
                        if (team != null) {
                            if (user._id == team.leaderId) {
                                return <StyledButton
                                    bg={tc.error} hBg={tc.backgroundVariant} cl={tc.text}
                                    w="auto" br="4px" p="16px" m={m_l_a} fs="16px" text="Delete team"
                                    onClick={() => deleteTeam()}
                                />
                            }
                            else {
                                return <StyledButton
                                    bg={tc.error} hBg={tc.backgroundVariant} cl={tc.text}
                                    w="auto" br="4px" p="16px" m={m_l_a} fs="16px" text="Leave team"
                                // onClick={() => deleteTeam()}
                                />
                            }
                        }
                    })()
                }
            </Flex>

            <Bar bcolor={tc.borderColor} p="16px">
                <Title theme={props.theme} text={`Team Request`} />
            </Bar>

            <ColumnFlex p="16px">
                {displayTeamRequest()}
            </ColumnFlex>

        </ColumnFlex>
    )
}

export { TeamManager }


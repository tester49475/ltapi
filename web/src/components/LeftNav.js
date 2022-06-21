import { useHistory } from "react-router";
import { IconContext } from "react-icons";
import { AiOutlineUser, AiOutlineTeam } from 'react-icons/ai';
import { BiGitPullRequest, BiGitMerge } from 'react-icons/bi';
import { GoIssueReopened } from 'react-icons/go';
import { RiGitRepositoryLine } from 'react-icons/ri';
import { FiGitCommit } from 'react-icons/fi'
import styled from "styled-components";

import { ColumnFlex, Flex, YCenteredRowFlex } from "../style/style";
import { Text, StyledButton } from "./BasicComponents";

import { themeCollections } from "../style/theme";
import { pushPath, changePath, changeWholePath } from "../js/util";


const Bar = styled(Flex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 8px
`;

const BorderedFlex = styled(ColumnFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: 16px 0;
    gap: 8px
`;


const LeftNav = (props) => {
    const history = useHistory()
    const tc = themeCollections[props.theme]

    const toPath = (path) => {
        props.openLeftNav(false)
        changeWholePath(history, path)
    }

    return (
        <ColumnFlex
            className="hide-scrollbar"
            pos="absolute" z="1"
            bg={tc.background} br="0px" w="100%" h="100%" p="0 16px" g="0px"
            style={{ overflow: "auto" }}
        >

            <BorderedFlex bcolor={tc.borderColor}>

                <StyledButton
                    bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                    br="5px" p="16px" fs="24px" text="Select Repository"
                    onClick={props.selectRepo}
                />

                {/* <Text cl={tc.text} fw="bold" text="Select" /> */}
            </BorderedFlex>

            <BorderedFlex bcolor={tc.borderColor}>
                <Text cl={tc.text} fw="bold" text="Repository" />

                <Selection theme={props.theme} iconClass={<BiGitMerge />} text="Push"
                    onClick={() => {
                        props.openLeftNav(false)
                        changeWholePath(history, `dashboard/repo?id=${props.repo.id}&path=/`)
                    }} />

                <Selection theme={props.theme} iconClass={<AiOutlineTeam />} text="Team"
                    onClick={() => toPath("dashboard/team")} />
            </BorderedFlex>

            <BorderedFlex bcolor={tc.borderColor}>
                <Text cl={tc.text} fw="bold" text="Issue & Pull Request" />

                {/* <Text cl={tc.secondaryText} fw="bold" text="Issues" /> */}

                <Selection theme={props.theme} iconClass={<GoIssueReopened />} text="Issue"
                    onClick={() => props.selectResource("Issue")} />

                <Selection theme={props.theme} iconClass={<FiGitCommit />} text="Commit"
                    onClick={() => props.selectResource("Commit")} />

                <Selection theme={props.theme} iconClass={<BiGitPullRequest />} text="Pull Request"
                    onClick={() => props.selectResource("Pull Request")} />
            </BorderedFlex>

            <BorderedFlex bcolor={tc.borderColor}>
                <Text cl={tc.text} fw="bold" text="Activities" />

                <Selection theme={props.theme} iconClass={<AiOutlineUser />} text="User Activity" />

                <Selection theme={props.theme} iconClass={<RiGitRepositoryLine />} text="Repository Activity" />
            </BorderedFlex>

        </ColumnFlex>
    )
}

const Selection = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <YCenteredRowFlex hBg={tc.borderColor} aBg={tc.backgroundVariant} w="100%" br="4px" p="8px" g="8px" onClick={props.onClick}>

            <IconContext.Provider value={{ size: "24px", color: tc.secondaryText }}>
                {props.iconClass}
            </IconContext.Provider>

            <Text
                cl={tc.secondaryText} fw="bold" ta="left" text={props.text}

            />

        </YCenteredRowFlex>

    )
}

export { LeftNav };


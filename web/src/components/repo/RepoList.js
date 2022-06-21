import { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";


import { ColumnFlex, Flex, YCenteredRowFlex } from "../../style/style";
import { StyledButton, Text, Title } from "../BasicComponents";


import { changePath, setSessionStorage, useQuery } from "../../js/util";
import { themeCollections } from "../../style/theme";
import { useEffect } from "react";
import { RepoService } from "../../services/repo.service";
import { RepoDetail } from "./RepoDetail";
import { RiGitRepositoryLine } from "react-icons/ri";
import { Icon } from "../BasicComponents";



const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: ${props => props.p || "8px"}
`

const RepoList = (props) => {
    const history = useHistory()
    const query = useQuery()

    const [repoList, setRepoList] = useState([])
    const tc = themeCollections[props.theme]

    const urlRepoId = query.get("id")


    const drawRepoList = () => {
        if (repoList.length > 0) {
            return repoList.map(
                (e, i) => <RepoListItem key={i} theme={props.theme} id={e._id} name={e.name}
                    onRepoSelected={props.onRepoSelected}
                />
            )
        }
        else {
            return <ColumnFlex p="8px" g="8px">
                <Text cl={tc.secondaryText} fw="bold" fs="24px" text={`You have no repo`} w="100%" p="36px 0" />
                <StyledButton bg={tc.primaryButton} hBg={tc.primaryButtonVariant} cl={tc.text}
                    br="4px" p="16px" fs="16px" text="Create new repo"
                    onClick={() => changePath(history, "create")} />
            </ColumnFlex>
        }
    }

    useEffect(
        () => {
            const fetchData = async () => {
                const res = await new RepoService().get()

                setRepoList(res.data)
            }

            fetchData()
                .catch(console.error)
        }, []
    )


    return (
        <ColumnFlex bg={tc.background} w="100%" mh="100%" p="0px">

            {urlRepoId == null &&
                <>
                    <Bar bcolor={tc.borderColor} p="16px">
                        <Title theme={props.theme} text="Repo List" />
                    </Bar>

                    {drawRepoList()}
                </>
            }

            {/* {urlRepoId != null &&
                <RepoDetail theme={props.theme} name={repoList[0].name} />
            } */}

        </ColumnFlex>
    )
}

const RepoListItem = (props) => {
    const history = useHistory()
    const theme = props.theme
    const tc = themeCollections[props.theme]

    const toItemDetail = () => {
        const repo = {
            id: props.id,
            name: props.name,
        }

        setSessionStorage("repo", repo)

        props.onRepoSelected(repo)
        // changePath(history, `repo?id=${props.id}&path=/`)
    }

    return (
        <YCenteredRowFlex
            bg={tc.background} hBg={tc.backgroundVariant} br="0px" w="100%" p="16px" g="8px"
            style={{ borderBottom: `2px solid ${tc.backgroundVariant}` }}
            onClick={toItemDetail}
        >
            <Icon component={<RiGitRepositoryLine />} theme={theme} hBg="none" p="0" size="16px" />
            <Text cl={tc.text} fw="bold" text={props.name} />

        </YCenteredRowFlex>
    )
}


export { RepoList };


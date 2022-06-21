import { LinearProgress, Skeleton } from "@mui/material"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Resizable } from "re-resizable"
import { useEffect, useState } from "react"
import { Switch, Route, useHistory } from "react-router"
import { CSSTransition } from "react-transition-group"
import styled from "styled-components"

import {
    asyncWithTimeout, changeColorAlpha, changePath, changeWholePath,
    clipText, getSessionStorage, obj2Array, popPath, pushPath, removeSessionStorage,
    setSessionStorage, toHumanDate, useQuery
} from "../../js/util"

import { Avatar, Icon, SearchBar, StyledButton, Text, Title } from "../BasicComponents"
import { LeftNav } from "../LeftNav"
import { CreateRepoPanel } from "../repo/CreateRepoPanel"
import { SelectRepoPanel } from "../repo/SelectRepoPanel"
import { Sidebar } from "../Sidebar"

import "../../css/animation.css"
import "../../css/style.css"
import { ColumnFlex, Flex, m_l_a, YCenteredRowFlex } from "../../style/style"
import { themeCollections } from "../../style/theme"

import { BsSortAlphaDown } from 'react-icons/bs'
import { RiGitRepositoryLine } from "react-icons/ri"

import { Service } from "../../services/Service"
import { RepoDetail } from "../repo/RepoDetail"
import { RepoList } from "../repo/RepoList"
import { TeamManager } from "../team/TeamManager"
import { CreateTeamPanel } from "../team/CreateTeamPanel"
import { SearchScreen } from "../team/SearchScreen"




const Bar = styled(YCenteredRowFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: ${props => props.p || "8px"};
    gap:  ${props => props.g || "0"}
`

const BorderedColumnFlex = styled(ColumnFlex)`
    border-bottom: 2px solid ${props => props.bcolor};
    padding: ${props => props.p || "16px"};
    gap: ${props => props.g || "8px"}
`



const Dashboard = (props) => {
    const FETCH_ERR_STR = (resource) => {
        return `Can't fetch ${resource}. Please check your internet connection`
    }

    const history = useHistory()
    const query = useQuery()
    const [mainState, setMainState] = useState("notStart")
    const [isLeftNav, openLeftNav] = useState(false)
    const [repo, setRepo] = useState(getSessionStorage("repo"))
    const [searchString, setSearchString] = useState("")
    const [sortType, setSortType] = useState("By date")

    const theme = props.theme
    const tc = themeCollections[theme]

    const resource = history.location.pathname.split("/").slice(-1)[0]
    const urlRepoId = query.get("id")

    // back to login, fetch
    useEffect(
        () => {
            if (getSessionStorage("user") == undefined) changeWholePath(history, "login")
            else {
                if (repo == undefined) {
                    changeWholePath(history, "dashboard/repo")
                }
                else {
                    if (mainState == "notStart") {
                        setMainState("fetching")
                    }
                    if (mainState == "fetching") {
                        if (resource != "" && resource != "repo") {
                            const requestBody = {
                                query: { repo: repo.name },
                                sort: getSortQuery()
                            }

                            runFetchingProcess(requestBody)
                        }
                    }
                }
            }
        }, [mainState]
    )

    // // fetching
    // useEffect(
    //     () => {

    //     }, [mainState]
    // )


    const onRepoSelected = (repo) => {
        setMainState("fetching")
        setRepo(repo)
        changeWholePath(history, "dashboard/notification/issue")
    }


    const search = () => {
        refresh()

        const requestBody = {
            query: {
                repo: getSessionStorage("repo").repo
            },
            field: { title: "text" },
            searchStr: searchString,
            sort: getSortQuery()
        }

        runFetchingProcess(requestBody)
    }


    const runFetchingProcess = async (requestBody) => {
        let res

        const resource = history.location.pathname.split("/").slice(-1)[0]

        try {
            res = await asyncWithTimeout(new Service(resource).query(requestBody), 5000)
        }
        catch (e) {
            console.log(e.respond.status)
            setMainState("fetching fail")
        }

        if (res != undefined) {
            setSessionStorage(resource, res.data)
            setMainState("fetched")
        }
    }


    const handleChangeSortType = (type) => {
        setSortType(type)

        refresh()
    }


    const getSortQuery = () => {
        switch (sortType) {
            case "By date": return { created_at: -1 }
            case "By label": return { label: -1 }
            case "By name": return { title: -1 }
        }
    }


    const selectResource = (resource) => {
        changeWholePath(history, `dashboard/notification/${resource.toLowerCase()}`)

        setMainState("fetching")

        // changeResource(resource)

        openLeftNav(false)
    }


    const selectRepo = () => {
        removeSessionStorage("repo")

        openLeftNav(false)
    }


    const renderNotifications = () => {
        const arr = getSessionStorage(resource)

        if (mainState == "fetched") {
            if (arr.length == 0) {
                return <Text cl={tc.secondaryText} text={`There's no ${resource.toLowerCase()}`} w="100%" p="64px 0" />
            }

            let content

            if (resource == "issue") {
                content = arr.map(
                    (item, i) =>
                        <Item
                            key={i} theme={theme}
                            id={item._id}
                            title={item.title} url={item.owner.avatar_url} time={item.created_at}
                            number={`#${item.number}`} label={item.label}
                            isRead={item.is_read}
                            refresh={refresh}
                        />
                )
            }
            if (resource == "commit") {
                content = arr.map(
                    (item, i) =>
                        <Item
                            key={i} theme={theme}
                            id={item._id}
                            title={item.title} url={item.commiter.avatar_url} time={item.created_at}
                            number={`#${item.number}`}
                            isRead={item.is_read}
                            refresh={refresh}
                        />
                )
            }
            if (resource == "pullRequest") {
                content = arr.map(
                    (item, i) =>
                        <Item
                            key={i} theme={theme}
                            id={item._id}
                            title={item.title} url={item.user.avatar_url} time={item.created_at}
                            label={item.state} body={item.body}
                            isRead={item.is_read}
                            refresh={refresh}
                        />
                )
            }

            return content
        }
        if (mainState == "fetching") {
            return <LoadingBar theme={theme} resource={resource} />
            // Alternatives
            // return <SkeletonLayout theme={theme} />
            // return <Text cl={tc.secondaryText} text={`There's no ${resource}`} w="100%" p="64px 0" />
        }
        if (mainState == "fetching fail") {
            return <Text
                cl={tc.error} text={FETCH_ERR_STR(resource)}
                w="100%" m="auto 0 0 0"
            />
        }
    }


    const refresh = () => {
        removeSessionStorage(resource)

        setMainState("fetching")
    }


    return (
        <Flex>

            <Sidebar theme={props.theme} openLeftNav={() => openLeftNav(!isLeftNav)} />

            <Resizable
                defaultSize={{
                    width: "100%",
                }}
                enable={{
                    top: false, right: true, bottom: false, left: false,
                    topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
                }}
            >

                <CSSTransition in={isLeftNav} timeout={300} classNames="left-to-right" unmountOnExit>
                    <LeftNav
                        theme={props.theme} w="100%" selectResource={selectResource} repo={repo} selectRepo={selectRepo}
                        openLeftNav={openLeftNav}
                    />
                </CSSTransition>

                {/* {resource == "Repo" &&
                    <>
                        <Route path="/create">
                            <CreateRepoPanel theme={props.theme} />
                        </Route>

                        <Route path="/select">
                            <SelectRepoPanel theme={theme} />
                        </Route>
                    </>
                } */}

                <Route path="/dashboard/team/create">
                    <CreateTeamPanel theme={props.theme} />
                </Route>

                <Route path="/dashboard/team/">
                    <TeamManager theme={props.theme} />
                </Route>

                <Route path="/dashboard/repo">
                    {urlRepoId == null && <RepoList theme={props.theme} onRepoSelected={onRepoSelected} />}
                    {urlRepoId != null && <RepoDetail theme={props.theme} name={"repoList[0].name"} />}
                </Route>

                <Route path="/dashboard/repo/create">
                    <CreateRepoPanel theme={props.theme} />
                </Route>

                <Route path="/dashboard/repo/select">
                    <SelectRepoPanel theme={props.theme} updateDashboard={refresh} />
                </Route>

                <Route path="/dashboard/notification">
                    {resource != "Repo" && getSessionStorage("repo") != null &&
                        <ColumnFlex bg={tc.background} br="0px" h="100%" p="16px" g="0px">
                            <Bar bcolor={tc.borderColor} g="8px">
                                <Icon component={<RiGitRepositoryLine />} theme={theme} hBg="none" p="0" size="24px" />
                                <Title theme={theme} text={`${repo.name}`} />
                                <Title theme={theme} cl={tc.secondaryText} text={`${resource}`} />
                            </Bar>

                            <Bar bcolor={tc.borderColor} p="16px">
                                <SearchBar theme={props.theme} w="65%" placeholder={`search ${resource.toLowerCase()}`}
                                    getSearchQuery={setSearchString} search={search}
                                />

                                <AppMenu
                                    theme={theme} m={m_l_a}
                                    items={["By date", "By label", "By name"]}
                                    action={handleChangeSortType}
                                />
                            </Bar>

                            <ColumnFlex className="hide-scrollbar" h="100%" style={{ overflow: "auto" }}>
                                {renderNotifications()}
                            </ColumnFlex>

                            <StyledButton
                                bg={tc.backgroundVariant} hBg={tc.primaryButton}
                                w="100%" br="4px" p="16px" m="16px 0 0 0"
                                cl={tc.text} fs="16px" text="Refresh"
                                onClick={refresh}
                            />

                        </ColumnFlex>
                    }
                </Route>

            </Resizable>

        </Flex>
    )
}


const AppMenu = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [buttonName, setButtonName] = useState(props.items[0]);

    const theme = props.theme
    const tc = themeCollections[theme]


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onItemClick = (e) => {
        props.action(e)

        setButtonName(e)

        handleClose()
    }

    const menuItems = () => {
        return props.items.map(
            (e, i) => <MenuItem key={i} onClick={() => onItemClick(e)}>{e}</MenuItem>
        )
    }


    return (
        <>
            <YCenteredRowFlex
                bg={tc.backgroundVariant} hBg={tc.primaryButton}
                br="80px" p="8px 16px" m={props.m} g="8px"
                onClick={handleClick}
            >
                <Icon component={<BsSortAlphaDown />} theme={theme} hBg="none" p="0" size="28px" />

                <Text cl={tc.text} text={buttonName} />
            </YCenteredRowFlex>

            {/* <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                Dashboard
            </Button> */}

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems()}
            </Menu>
        </>
    )
}


const Item = (props) => {
    const tc = themeCollections[props.theme]

    const markAsRead = () => {
        new Service("issue").markAsRead(props.id)

        props.refresh()
    }

    const getLabelColor = () => {
        switch (props.label) {
            case "Status: Unconfirmed": return tc.unconfirmed
            case "Status: Confirmed": return tc.success
            case "Open": return tc.success
            case "Bug": return tc.error
            case "Question": return tc.info
        }
    }

    return (
        <BorderedColumnFlex bcolor={tc.borderColor} hBg={changeColorAlpha(tc.backgroundVariant, "40")} p="24px" g="24px">
            <YCenteredRowFlex w="100%" g="8px">
                <Avatar url={props.url} />

                <ColumnFlex g="8px" gr={1}>

                    <YCenteredRowFlex g="8px">
                        <Text
                            cl={props.isRead ? tc.secondaryText : tc.text} fw={props.isRead ? "" : "bold"} ta="left" text={props.title}

                        />

                        {props.label && <Text cl="#fff" fw="bold" text={props.label}
                            bg={getLabelColor()} br="80px" p="8px 16px"
                        />}

                        <Text cl={tc.secondaryText} ta="right" m="0 8px 0 auto" text={toHumanDate(props.time)} />
                    </YCenteredRowFlex>

                    {props.number && <Text cl={tc.secondaryText} text={props.number} />}



                </ColumnFlex>
            </YCenteredRowFlex>

            {props.body && <Text cl={tc.secondaryText} ta="left" text={clipText(props.body)} />}

            <YCenteredRowFlex g="8px">
                {/* <StyledButton bg={tc.borderColor} hBg={tc.backgroundVariant} cl={tc.secondaryText} br="5px" p="5px" text="Save" /> */}
                <StyledButton
                    bg={tc.borderColor} hBg={tc.primaryButton}
                    cl={tc.text}
                    br="80px" p="8px 12px"
                    text="Mark as read"
                    onClick={markAsRead}
                />
            </YCenteredRowFlex>
        </BorderedColumnFlex>
    )
}


// const SkeletonLayout = (props) => {
//     const tc = themeCollections[props.theme]

//     return (
//         <ColumnFlex w="100%" p="16px" g="8px">
//             <YCenteredRowFlex g="8px">
//                 <Skeleton
//                     animation="wave"
//                     variant="circular" width={45} height={40} />

//                 <ColumnFlex w="100%">
//                     <Skeleton variant="text" animation="wave" width="100%" />
//                     <Skeleton variant="text" animation="wave" width="30%" />
//                 </ColumnFlex>
//             </YCenteredRowFlex>

//             <Skeleton variant="text" animation="wave" width="100%" height={25} />
//         </ColumnFlex>
//     )
// }


const SkeletonLayout = (props) => {
    const tc = themeCollections[props.theme]

    const repeat = () => {
        let arr = []

        for (let i = 0; i < 3; i++) {
            arr.push(<Skeleton
                key={i}
                sx={{ bgcolor: changeColorAlpha(tc.borderColor, props.theme == "dark" ? "44" : "aa") }}
                variant="rectangular" width="100%"
                style={{ borderRadius: "4px", flexGrow: 1 }}
            />)
        }

        return arr
    }

    return (
        <ColumnFlex w="100%" h="100%" p="16px 0 0 0" g="16px">
            {/* <YCenteredRowFlex g="8px">
                <Skeleton
                    animation="wave"
                    variant="circular" width={45} height={40} />

                <ColumnFlex w="100%">
                    <Skeleton variant="text" animation="wave" width="100%" />
                    <Skeleton variant="text" animation="wave" width="30%" />
                </ColumnFlex>
            </YCenteredRowFlex>

            <Skeleton variant="text" animation="wave" width="100%" height={25} /> */}

            {repeat()}
        </ColumnFlex>
    )
}


const LoadingBar = (props) => {
    const tc = themeCollections[props.theme]

    return (
        <ColumnFlex w="100%" m="auto 0 0 0" g="16px">
            <Text cl={tc.secondaryText} fw="bold" text={`Fetching ${props.resource}...`} w="100%" />

            <LinearProgress sx={{
                '& .MuiLinearProgress-barColorPrimary': {
                    backgroundColor: tc.primaryButton,
                }
            }} />
        </ColumnFlex>
    )
}


export { Dashboard }


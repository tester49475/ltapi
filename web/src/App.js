import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Header } from "./components/Header/Header";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "./style/theme";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Signup } from "./components/Authentication/Signup";
import { Login } from "./components/Authentication/Login";
import { Flex, ColumnFlex } from "./style/style";
import { Admin } from "./components/Admin/Admin";
import { DeleteResource } from "./components/Admin/DeleteResource";
import { getSessionStorage } from "./js/util";
import { CreateRepoPanel } from "./components/repo/CreateRepoPanel";
import { SearchScreen } from "./components/team/SearchScreen";
import { changeWholePath } from "./js/util";


export const App = () => {
    const [theme, setTheme] = useState("dark")
    const [updateTime, setUpdateTime] = useState(0)

    const update = () => {
        setUpdateTime(updateTime + 1)
    }


    // useEffect(
    //     () => {
    //         console.log(history)
    //         changeWholePath(history, "login")}, []
    // )

    
    return (
        <BrowserRouter>

            <ColumnFlex h="100vh">

                <Header theme={theme} setTheme={setTheme} updateMainRouter={update} />

                <Flex style={{ flexGrow: 1, overflow: "hidden" }}>

                    <Switch>
                        <Route path="/repo">
                            <CreateRepoPanel theme={theme} />
                        </Route>

                        <Route path="/dashboard">
                            <Dashboard theme={theme} />
                        </Route>

                        <Route path="/signup">
                            <Signup theme={theme} />
                        </Route>

                        <Route path="/login">                        
                            <Login theme={theme} updateHeader={update} />
                        </Route>

                        <Route path="/admin/delete">
                            <DeleteResource theme={theme} />
                        </Route>

                        <Route path="/admin">
                            <Admin theme={theme} />
                        </Route>

                        <Route path="/search">
                            <SearchScreen theme={theme} />
                        </Route>
                    </Switch>

                </Flex>
            </ColumnFlex>

        </BrowserRouter>
    )
}

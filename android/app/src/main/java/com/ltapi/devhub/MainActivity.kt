package com.ltapi.devhub

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.*

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.ltapi.devhub.database.Commit
import com.ltapi.devhub.database.Issue
import com.ltapi.devhub.database.PullRequest
import com.ltapi.devhub.ui.components.AppDrawerContent
import com.ltapi.devhub.ui.components.AppTopBar
import com.ltapi.devhub.ui.components.authentication.LoginForm
import com.ltapi.devhub.ui.components.authentication.SignupForm
import com.ltapi.devhub.ui.components.dashboard.*
import com.ltapi.devhub.ui.theme.AppTheme
import com.safety.emergency.notifier.routes.Route

import kotlinx.coroutines.*


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppTheme {
//                Box(
//                    modifier = Modifier
//                        .fillMaxSize()
//                        .background(MaterialTheme.colors.background)
//                ) {
//                    Routes("Android")
//                }

                Routes(this)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Routes(activity: ComponentActivity) {
    val navController = rememberNavController()

    val scaffoldState = rememberScaffoldState()
    val scope = rememberCoroutineScope()

    var theme by remember { mutableStateOf(true) }

    AppTheme(useDarkTheme = theme) {
        Scaffold(
            scaffoldState = scaffoldState,
            topBar = {
                AppTopBar(
                    { handleDrawer(scope, scaffoldState) },
                    { theme = theme == false },
                    navController
                )
            },
            drawerContent = {
                AppDrawerContent(
                    activity,
                    navController,
                    scope,
                    scaffoldState.drawerState
                )
            },
            drawerBackgroundColor = MaterialTheme.colorScheme.surface,
            backgroundColor = MaterialTheme.colorScheme.surface,
        ) {
            TestScreen(navController, it)
        }
    }
}


fun handleDrawer(scope: CoroutineScope, scaffoldState: ScaffoldState) {
    scope.launch {
        scaffoldState.drawerState.apply {
            if (isClosed) open() else close()
        }
    }
}


@Composable
fun TestScreen(navController: NavHostController, padding: PaddingValues) {
    NavHost(
        navController = navController,
        startDestination = Route.Signup.name,
        modifier = Modifier
            .padding(padding)
            .fillMaxWidth()
    ) {
        composable(Route.Signup.name) {
            SignupForm(navController)
        }

        composable(Route.Login.name) {
            LoginForm(navController)
        }

        composable(Route.SelectRepo.name) {
            SelectRepoPanel(navController)
        }

        composable(Route.Issue.name) {
            ListViewer<Issue>("Issue", ::fetchIssue)
        }

        composable(Route.Commit.name) {
            ListViewer<Commit>("Commit", ::fetchCommits)
        }

        composable(Route.PullRequest.name) {
            ListViewer<PullRequest>("PullRequest", ::fetchPullRequests)
        }
    }
}
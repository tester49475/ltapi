package com.ltapi.devhub.ui.components


import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Bolt
import androidx.compose.material.icons.outlined.BugReport
import androidx.compose.material.icons.outlined.Comment
import androidx.compose.ui.graphics.vector.ImageVector
import compose.icons.AllIcons
import compose.icons.FontAwesomeIcons
import compose.icons.fontawesomeicons.Regular
import compose.icons.fontawesomeicons.Solid
import compose.icons.fontawesomeicons.solid.CodeBranch
import compose.icons.fontawesomeicons.solid.ExclamationCircle

sealed class AppNavigationDrawerItem(val route: String, val title: String, val icon: ImageVector) {
    object Signup: AppNavigationDrawerItem("Signup", "Signup", Icons.Filled.Home)
    object Login: AppNavigationDrawerItem("Login", "Login", Icons.Filled.AccountBox)
    object Issue: AppNavigationDrawerItem("Issue", "Issue", Icons.Outlined.BugReport)
    object Commit: AppNavigationDrawerItem("Commit", "Commit", Icons.Outlined.Comment)
    object PullRequest: AppNavigationDrawerItem("PullRequest", "PullRequest", Icons.Outlined.Bolt)
}

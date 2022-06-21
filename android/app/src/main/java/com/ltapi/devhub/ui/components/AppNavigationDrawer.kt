package com.ltapi.devhub.ui.components

import android.content.Context
import android.content.SharedPreferences
import androidx.activity.ComponentActivity
import androidx.compose.foundation.layout.*
import androidx.compose.material.DrawerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppNavigationDrawer(content: @Composable () -> Unit, navController: NavController) {
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    val items = listOf(AppNavigationDrawerItem.Signup, AppNavigationDrawerItem.Login)
    val selectedItem = remember { mutableStateOf(items[0]) }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            items.forEach { item ->
                NavigationDrawerItem(
                    icon = { Icon(item.icon, contentDescription = null) },
                    label = { Text(item.title) },
                    selected = item == selectedItem.value,
                    onClick = {
                        scope.launch { drawerState.close() }
                        selectedItem.value = item
                        navController.navigate(item.route)
                    },
                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                )
            }
        },
        content = content
    )
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppDrawerContent(
    activity: ComponentActivity,
    navController: NavController,
    scope: CoroutineScope,
    drawerState: DrawerState
) {
    val sharedPref = activity.getPreferences(Context.MODE_PRIVATE)

    val items = listOf(
        AppNavigationDrawerItem.Signup,
        AppNavigationDrawerItem.Login,
        AppNavigationDrawerItem.Issue,
        AppNavigationDrawerItem.Commit,
        AppNavigationDrawerItem.PullRequest
    )

    val selectedItem = remember { mutableStateOf(items[0]) }



    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxSize(),
//        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        NavigationDrawerItem(
            label = { Text("Select Repository") },
            icon = { Icon(Icons.Filled.Storage, contentDescription = null) },
            selected = true,
            onClick = {
                scope.launch { drawerState.close() }
                with(sharedPref.edit()) {
                    putString("repo", "repo0")
                    apply()
                }

                navController.navigate("SelectRepo")
            },
            modifier = Modifier.padding(bottom = 16.dp),
            colors = NavigationDrawerItemDefaults.colors(
                selectedContainerColor = MaterialTheme.colorScheme.primary,
                selectedIconColor = MaterialTheme.colorScheme.onPrimary,
                selectedTextColor = MaterialTheme.colorScheme.onPrimary
            )
        )

        items.forEach { item ->
            NavigationDrawerItem(
                label = { Text(item.title) },
                icon = { Icon(item.icon, contentDescription = null) },
                badge = { Badge() { Text("19") } },
                selected = item == selectedItem.value,
                onClick = {
                    scope.launch { drawerState.close() }
                    selectedItem.value = item

                    if (checkAuthToken(sharedPref)) {
                        navController.navigate(item.route)
                    } else {
                        navController.navigate("Login")
                    }
                },
//                modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                colors = NavigationDrawerItemDefaults.colors(selectedContainerColor = MaterialTheme.colorScheme.surfaceVariant)
            )
        }
    }
}

fun checkAuthToken(sharedPref: SharedPreferences): Boolean {
    return sharedPref.getString("user", null) != null
}

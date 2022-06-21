package com.ltapi.devhub.ui.components

import Border
import android.graphics.drawable.shapes.Shape
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBox
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.LightMode
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import border
import coil.compose.SubcomposeAsyncImage
import compose.icons.FontAwesomeIcons
import compose.icons.fontawesomeicons.Brands
import compose.icons.fontawesomeicons.Regular
import compose.icons.fontawesomeicons.Solid
import compose.icons.fontawesomeicons.brands.Github
import compose.icons.fontawesomeicons.solid.Sun

@Composable
fun AppTopBar(handleDrawer: () -> Unit, setTheme: () -> Unit, navController: NavController) {
    SmallTopAppBar(
        title = { TopBarTitle() },
        modifier = Modifier
            .border(bottom = Border(1.dp, MaterialTheme.colorScheme.surfaceVariant))
            .padding(1.dp),
        navigationIcon = {
            IconButton(onClick = { handleDrawer() }) {
                Icon(
                    Icons.Filled.Menu,
                    contentDescription = "Localized description",
                )
            }
        },
        actions = {
            IconButton(onClick = { navController.navigate("Login") }) {
                Icon(
                    Icons.Filled.AccountBox,
                    contentDescription = "Localized description",
                )
            }

            IconButton(onClick = { setTheme() }) {
                Icon(
                    Icons.Outlined.LightMode,
                    contentDescription = null,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
    )

//    SmallTopAppBar() {
//        Row(
//            modifier = Modifier.padding(16.dp)
//        ) {
//            IconButton(onClick = { handleDrawer() }) {
//                Icon(
//                    Icons.Filled.Menu,
//                    contentDescription = "Localized description",
//                )
//            }

//            Spacer(modifier = Modifier.weight(1f))
//
//            IconButton(onClick = { navController.navigate("Login") }) {
//                Icon(
//                    Icons.Filled.AccountBox,
//                    contentDescription = "Localized description",
//                )
//            }
//
//            IconButton(onClick = { setTheme() }) {
//                Icon(
//                    Icons.Filled.Person,
//                    contentDescription = null,
//                )
//            }
//        }
//    }

}


@Composable
fun TopBarTitle() {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = FontAwesomeIcons.Brands.Github,
            contentDescription = null,
            modifier = Modifier.size(32.dp)
        )

        Spacer(modifier = Modifier.width(8.dp))

        Text(
            text = "Githull",
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
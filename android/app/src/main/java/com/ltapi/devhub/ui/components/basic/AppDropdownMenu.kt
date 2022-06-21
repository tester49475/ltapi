package com.ltapi.devhub.ui.components.basic

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector


data class DropdownMenuItemProperty(
    val name: String,
    val leadingIcon: ImageVector,
    val action: (String) -> Unit
)


@Composable
fun AppDropdownMenu(items: List<DropdownMenuItemProperty>) {
    var expanded by remember { mutableStateOf(false) }

    fun handleItemClick(str: String, action: (String) -> Unit) {
        action(str)

        expanded = false
    }

    Surface(color = MaterialTheme.colorScheme.surface) {
        Box(
            modifier = Modifier
                .wrapContentSize(Alignment.TopStart)
        ) {

            IconButton(onClick = { expanded = true }) {
                Icon(Icons.Default.Sort, contentDescription = "Localized description")
            }
            DropdownMenu(
                expanded = expanded,
                onDismissRequest = { expanded = false }
            ) {
                for (e in items) {
                    DropdownMenuItem(
                        text = { Text(e.name) },
                        onClick = { handleItemClick(e.name, e.action) },
                        leadingIcon = {
                            Icon(
                                e.leadingIcon,
                                contentDescription = null
                            )
                        })
                }
            }
        }
    }

}

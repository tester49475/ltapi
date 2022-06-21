package com.safety.notifier.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType


@Composable
fun SearchBar(
    label: String,
    onDoneActionClick: (s: String) -> Unit = {},
    onClearClick: () -> Unit = {}
) {

    var text: String by remember { mutableStateOf("") }
    var showClearButton by remember { mutableStateOf(false) }

    OutlinedTextField(
        value = text,
        onValueChange = { value ->
            text = value
        },
        modifier = Modifier
            .onFocusChanged { focusState ->
                showClearButton = (focusState.isFocused)
            },
        placeholder = { Text(text = "search $label", color = MaterialTheme.colorScheme.onSurfaceVariant) },
        leadingIcon = {
            Icon(
                contentDescription = null,
                imageVector = Icons.Default.Search
            )
        },
        trailingIcon = {
            if (showClearButton) {
                IconButton(onClick = {
                    onClearClick()
                    text = ""
                }) {
                    Icon(imageVector = Icons.Filled.Close, contentDescription = "Clear")
                }
            }
        },
        keyboardActions = KeyboardActions(onDone = {
            onDoneActionClick(text)
        }),
        keyboardOptions = KeyboardOptions(
            imeAction = ImeAction.Done,
            keyboardType = KeyboardType.Text
        ),
        singleLine = true
    )
}
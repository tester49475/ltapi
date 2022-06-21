package com.ltapi.devhub.ui.components.custom

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

@Composable
fun Header(text: String, modifier: Modifier = Modifier) {
    Text(
        color = MaterialTheme.colorScheme.onSurface,
        modifier = modifier,
        fontSize = 24.sp,
        fontWeight = FontWeight.Bold,
        text = text
    )
}
package com.ltapi.devhub.ui.components.custom.shimmer

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Brush.Companion.linearGradient
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp


@Composable
fun AppLoadingBar(text: String) {
    Column(Modifier.padding(horizontal = 16.dp),verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(text, color = MaterialTheme.colorScheme.onSurfaceVariant)
        LinearProgressIndicator(Modifier.fillMaxWidth())
    }
}


@Composable
fun LoadingShimmerEffect() {
    val gradient = listOf(
        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f), //darker grey (90% opacity)
        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f), //lighter grey (30% opacity)
        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
    )

    val transition = rememberInfiniteTransition() // animate infinite times

    val translateAnimation = transition.animateFloat( //animate the transition
        initialValue = 0f,
        targetValue = 1700f,
        animationSpec = infiniteRepeatable(
            animation = tween(
                durationMillis = 2000,
                easing = FastOutSlowInEasing
            ),
            repeatMode = RepeatMode.Reverse
        )
    )

    val brush = linearGradient(
        colors = gradient,
        start = Offset(0f, 0f),
        end = Offset(
            x = translateAnimation.value,
            y = 0f
        )
    )

    ShimmerLayout(brush = brush)
}


@Composable
fun ShimmerLayout(brush: Brush) {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)) {

        for (i in 0..2) {
            Spacer(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(4.dp))
                    .fillMaxWidth(fraction = 1f)
                    .background(brush)
            )
        }
    }
}


@Composable
fun ShimmerGridItem(brush: Brush) {
    Row(
        modifier = Modifier
            .fillMaxSize()
            .padding(all = 10.dp),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {

        Spacer(
            modifier = Modifier
                .size(80.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(brush)
        )

        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Spacer(
                modifier = Modifier
                    .height(20.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .fillMaxWidth(fraction = 1f)
                    .background(brush)
            )

            Spacer(
                modifier = Modifier
                    .height(20.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .fillMaxWidth(fraction = 0.4f)
                    .background(brush)
            )

            Spacer(
                modifier = Modifier
                    .height(20.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .fillMaxWidth(fraction = 0.7f)
                    .background(brush)
            )
        }
    }
}
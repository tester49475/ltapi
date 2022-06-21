package com.safety.emergency.notifier.routes

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.ui.graphics.vector.ImageVector


enum class Route() {
    Signup(),
    Login(),
    SelectRepo(),
    Issue(),
    Commit(),
    PullRequest();

    companion object {
        fun fromRoute(route: String?): Route =
            when (route?.substringBefore("/")) {
                Signup.name -> Signup
                Login.name -> Login
                SelectRepo.name -> SelectRepo
                Issue.name -> Issue
                Commit.name -> Commit
                PullRequest.name -> PullRequest
                null -> Issue
                else -> throw IllegalArgumentException("Route $route is not recognized.")
            }
    }
}
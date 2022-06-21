package com.ltapi.devhub.ui.components.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.ltapi.devhub.database.User
import com.ltapi.devhub.database.UserRequest
import com.ltapi.devhub.services.UserService
import com.ltapi.devhub.ui.components.authentication.Email
import com.ltapi.devhub.ui.components.authentication.Field
import com.ltapi.devhub.ui.components.authentication.FormState
import com.ltapi.devhub.ui.components.authentication.Required
import com.ltapi.devhub.ui.components.custom.Header
import kotlinx.coroutines.runBlocking
import java.lang.StringBuilder

@Composable
fun SelectRepoPanel(navController: NavController) {
    val fields = listOf(
        Field(
            name = "owner",
            label = "Owner",
            validators = listOf(Required())
        ),
        Field(
            name = "repo",
            label = "Repo",
            validators = listOf(Required())
        ),
    )

    val state by remember { mutableStateOf(FormState()) }
    state.fields = fields

    Column(
        modifier = Modifier
            .padding(20.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        fields.forEach {
            it.Content()
        }

        Spacer(modifier = Modifier.height(2.dp))

        Button(
            onClick = {
                if (state.validate()) {

                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Select Repository")
        }
    }
}
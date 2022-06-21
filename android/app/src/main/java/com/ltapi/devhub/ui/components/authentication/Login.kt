package com.ltapi.devhub.ui.components.authentication

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.ltapi.devhub.database.User
import com.ltapi.devhub.database.UserRequest
import com.ltapi.devhub.services.AuthState
import com.ltapi.devhub.services.UserService
import com.ltapi.devhub.ui.components.custom.Header
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.lang.StringBuilder

@Composable
fun LoginForm(navController: NavController) {
    val fields = listOf(
        Field(
            name = "email",
            label = "Email",
            KeyboardType.Email,
            validators = listOf(Required(), Email())
        ),
        Field(
            name = "password",
            label = "Password",
            KeyboardType.Password,
            validators = listOf(Required())
        ),
    )

    var authState by remember { mutableStateOf(AuthState.NotStart) }
    val state by remember { mutableStateOf(FormState()) }
    state.fields = fields


    val coroutineScope = rememberCoroutineScope()


    // Content
    if (authState == AuthState.Pending) {
        LinearProgressIndicator(Modifier.fillMaxWidth())
    }

    Column(
        modifier = Modifier
            .padding(20.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Header("Login")

        fields.forEach {
            it.Content()
        }

        if (authState == AuthState.NotFound) {
            Text(
                text = "Incorrect email or password",
                color = MaterialTheme.colorScheme.error
            )
        }
        if (authState == AuthState.ConnectionError) {
            Text(
                text = "Some thing went wrong. Please check internet connection",
                color = MaterialTheme.colorScheme.error,
                overflow = TextOverflow.Ellipsis,
                softWrap = false
            )
        }

        Spacer(modifier = Modifier.height(2.dp))

        Button(
            onClick = {
                if (state.validate()) {
                    coroutineScope.launch {
                        val data = state.getData()

                        authState = AuthState.Pending

                        val res =
                            login(
                                data["email"].toString(),
                                data["password"].toString(),
                                navController
                            )

                        authState = res
                    }
                }
            },
            modifier = Modifier.align(Alignment.End)
        ) {
            Text("Login")
        }
    }
}

suspend fun login(email: String, password: String, navController: NavController): AuthState {
    val res = UserService().loginUser(UserRequest(email, password))

    if (res == AuthState.Authenticated) {
        navController.navigate("Issue")
    }

    return res
}
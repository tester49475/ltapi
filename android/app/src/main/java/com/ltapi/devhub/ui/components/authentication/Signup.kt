package com.ltapi.devhub.ui.components.authentication

import android.content.Intent
import android.content.res.Configuration
import android.util.Log
import android.util.Patterns
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import border
import com.ltapi.devhub.database.User
import com.ltapi.devhub.database.UserRequest
import com.ltapi.devhub.services.UserService
import com.ltapi.devhub.ui.components.custom.Header
import kotlinx.coroutines.runBlocking


private const val EMAIL_MESSAGE = "invalid email address"
private const val REQUIRED_MESSAGE = "this field is required"
private const val REGEX_MESSAGE = "value does not match the regex"

sealed interface Validator
open class Email(var message: String = EMAIL_MESSAGE) : Validator
open class Required(var message: String = REQUIRED_MESSAGE) : Validator
open class Regex(var message: String, var regex: String = REGEX_MESSAGE) : Validator

class Field(
    val name: String, val label: String = "", val type: KeyboardType = KeyboardType.Text,
    val validators: List<Validator>
) {
    var text: String by mutableStateOf("")
    var lbl: String by mutableStateOf(label)
    var hasError: Boolean by mutableStateOf(false)

    fun clear() {
        text = ""
    }

    private fun showError(error: String) {
        hasError = true
        lbl = error
    }

    private fun hideError() {
        lbl = label
        hasError = false
    }

    @Composable
    fun Content() {
        OutlinedTextField(
            value = text,
            onValueChange = { value ->
                hideError()
                text = value
            },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(text = lbl) },
            isError = hasError,
            visualTransformation = if (type == KeyboardType.Password) {
                PasswordVisualTransformation()
            } else {
                VisualTransformation.None
            },
            keyboardOptions = KeyboardOptions(keyboardType = type)
        )
    }

    fun validate(): Boolean {
        return validators.map {
            when (it) {
                is Email -> {
                    if (!Patterns.EMAIL_ADDRESS.matcher(text).matches()) {
                        showError(it.message)
                        return@map false
                    }
                    true
                }
                is Required -> {
                    if (text.isEmpty()) {
                        showError(it.message)
                        return@map false
                    }
                    true
                }
                is Regex -> {
                    if (!it.regex.toRegex().containsMatchIn(text)) {
                        showError(it.message)
                        return@map false
                    }
                    true
                }
            }
        }.all { it }
    }
}

class FormState {
    var fields: List<Field> = listOf()
        set(value) {
            field = value
        }

    fun validate(): Boolean {
        var valid = true
        for (field in fields) if (!field.validate()) {
            valid = false
            break
        }
        return valid
    }

    fun getData(): Map<String, String> = fields.map { it.name to it.text }.toMap()
}

@Composable
fun SignupForm(navController: NavController) {
    val context = LocalContext.current

    val fields = listOf(
        Field(
            name = "email",
            label = "Email",
            KeyboardType.Email,
            validators = listOf(Required(), Email())
        ),
        Field(
            name = "name",
            label = "User Name",
            KeyboardType.Text,
            validators = listOf(Required())
        ),
        Field(
            name = "avatar_url",
            label = "Avatar Url",
            KeyboardType.Text,
            validators = listOf(Required())
        ),
        Field(
            name = "password",
            label = "Password",
            KeyboardType.Password,
            validators = listOf(Required())
        ),
        Field(
            name = "confirm password",
            label = "Confirm Password",
            KeyboardType.Password,
            validators = listOf(Required())
        )
    )

    val state by remember { mutableStateOf(FormState()) }
    state.fields = fields

    Column(
        modifier = Modifier
            .padding(20.dp)
            .fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Header("Registration", modifier = Modifier.padding(0.dp))

        fields.forEach {
            it.Content()
        }

        Spacer(modifier = Modifier.height(2.dp))

        Button(
            onClick = {
                if (state.validate()) {
                    val data = state.getData()

                    signup(data["email"].toString(), data["password"].toString(), navController)
                }
            },
            modifier = Modifier.align(Alignment.End)
        ) {
            Text("Signup")
        }
    }
}

fun signup(email: String, password: String, navController: NavController) {
    UserService().postSignupData(UserRequest(email, password))

    toLogin(navController)
}

fun toLogin(navController: NavController) {
    navController.navigate("Login")
}

fun toDashboard(navController: NavController, userId: Int) {
    navController.navigate("Dashboard/${userId}")
}
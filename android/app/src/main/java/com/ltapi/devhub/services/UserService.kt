package com.ltapi.devhub.services

import com.google.gson.Gson
import com.ltapi.devhub.database.User
import com.ltapi.devhub.database.UserRequest
import kotlinx.coroutines.runBlocking
import java.lang.StringBuilder


enum class AuthState {
    NotStart, Pending, Authenticated, NotFound, ConnectionError
}

class UserService {
    private val root = Config().root

    suspend fun loginUser(request: UserRequest): AuthState {
        try {
            val gson = Gson()

            val user = Utils().sendPostRequest<User>(root + "user/login", gson.toJson(request))

            if(user != null) {
                return AuthState.Authenticated
            }
            else {
                return  AuthState.NotFound
            }
        }
        catch (e: Exception) {
            return  AuthState.ConnectionError
        }
    }

    fun postSignupData(request: UserRequest) {
//        runBlocking {
//            Utils().sendPostRequest(root + "user/new", user)
//        }
    }
}
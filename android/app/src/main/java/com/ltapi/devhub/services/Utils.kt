package com.ltapi.devhub.services

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonParser
import com.ltapi.devhub.database.User

import kotlinx.coroutines.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import org.json.JSONObject


@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)

class Utils {

//    fun sendGetRequest(url: String) {
//        val mURL = URL(url)
//
//        with(mURL.openConnection() as HttpURLConnection) {
//            // optional default is GET
//            requestMethod = "GET"
//
//            println("URL : $url")
//            println("Response Code : $responseCode")
//
//            BufferedReader(InputStreamReader(inputStream)).use {
//                val response = StringBuffer()
//
//                var inputLine = it.readLine()
//                while (inputLine != null) {
//                    response.append(inputLine)
//                    inputLine = it.readLine()
//                }
//                it.close()
//                println("Response : $response")
//            }
//        }
//    }

    suspend inline fun <reified T> sendGetRequest(url: String): T? =
        withContext(Dispatchers.IO) {
            val httpURLConnection = URL(url).openConnection() as HttpURLConnection

            // Response
            val reader = BufferedReader(httpURLConnection.getInputStream().reader())
            val response = StringBuilder()
            reader.use { reader ->
                var line = reader.readLine()
                while (line != null) {
                    response.append(line)
                    line = reader.readLine()
                }
            }

            if (response.toString() != "") {
//                val text =
//                    "[{\"_id\":0,\"owner\":\"owner0\",\"repo\":\"repo0\",\"title\":\"Extremely Buggy!\",\"number\":\"0\",\"label\":\"bug\",\"created_at\":1650857817007}]"

                return@withContext Json {
                    ignoreUnknownKeys = true
                }.decodeFromString<T>(response.toString())
            } else {
                return@withContext null
            }
        }

    suspend inline fun <reified T> sendPostRequest(url: String, requestBodyInString: String): T? =
        withContext(Dispatchers.IO) {
            val httpURLConnection = URL(url).openConnection() as HttpURLConnection
            httpURLConnection.requestMethod = "POST"
            httpURLConnection.setRequestProperty(
                "Content-Type",
                "application/json"
            )
            httpURLConnection.setRequestProperty(
                "Accept",
                "application/json"
            )

            httpURLConnection.connectTimeout = 10000
            httpURLConnection.readTimeout = 10000
            httpURLConnection.doInput = true
            httpURLConnection.doOutput = true


//            val gson = Gson()
//            val jsonString = gson.toJson(obj)

            val outputStreamWriter = OutputStreamWriter(httpURLConnection.outputStream)
            outputStreamWriter.write(requestBodyInString)
            outputStreamWriter.flush()

            // Response
            val reader = BufferedReader(httpURLConnection.getInputStream().reader())
            val response = StringBuilder()
            reader.use { reader ->
                var line = reader.readLine()
                while (line != null) {
                    response.append(line)
                    line = reader.readLine()
                }
            }


            if (response.toString() != "") {
                return@withContext Json {
                    ignoreUnknownKeys = true
                }.decodeFromString<T>(response.toString())
            } else {
                return@withContext null
            }
        }
}


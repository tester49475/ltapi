package com.ltapi.devhub.database

import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import java.sql.Timestamp
import java.util.*

@Serializable
data class UserRequest(val email: String, val password: String)

@Serializable
data class User(
    val _id: Int,
    val email: String,
    val password: String,
    val name: String,
    val avatar_url: String
)

@Serializable
data class Repo(
    val _id: Int,
    val name: String,
    @Serializable(DateSerializer::class)
    val created_at: Date,
    val ownerId: Int
)

@Serializable
data class Issue(
    val _id: Int,
    val title: String,
    val number: String,
    val label: String,
    @Serializable(DateSerializer::class)
    val created_at: Date,
    val owner: User,
    val repo: Repo,
)

@Serializable
data class Commit(
    val _id: Int,
    val title: String,
    val number: String,
    @Serializable(DateSerializer::class)
    val created_at: Date,
    val commiter: User,
    val repo: Repo,
)

@Serializable
data class PullRequest(
    val _id: Int,
    val title: String,
    val body: String,
    val state: String,
    @Serializable(DateSerializer::class)
    val created_at: Date,
    val user: User,
    val repo: Repo,
)

object DateSerializer : KSerializer<Date> {
    override val descriptor = PrimitiveSerialDescriptor("Date", PrimitiveKind.LONG)
    override fun serialize(encoder: Encoder, value: Date) = encoder.encodeLong(value.time)
    override fun deserialize(decoder: Decoder): Date = Date(decoder.decodeLong())
}
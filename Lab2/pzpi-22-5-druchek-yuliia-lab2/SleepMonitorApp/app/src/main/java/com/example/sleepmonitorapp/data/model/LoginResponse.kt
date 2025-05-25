package com.example.sleepmonitorapp.data.model

data class LoginResponse(
    val tokenType: String,
    val accessToken: String,
    val expiresIn: Int,
    val refreshToken: String
)


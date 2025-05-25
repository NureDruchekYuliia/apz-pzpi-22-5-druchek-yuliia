package com.example.sleepmonitorapp.data.model

data class SleepRecord(
    val id: String,
    val date: String,
    val sleepStart: String,
    val sleepEnd: String,
    val quality: Int,
    val avgNoiseLevel: Double,
    val avgLightLevel: Double
)

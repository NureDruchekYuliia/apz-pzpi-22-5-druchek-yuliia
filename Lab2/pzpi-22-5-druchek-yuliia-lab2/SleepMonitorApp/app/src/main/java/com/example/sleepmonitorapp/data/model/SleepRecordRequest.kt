package com.example.sleepmonitorapp.data.model

data class SleepRecordRequest(
    val date: String,
    val sleepStart: String,
    val sleepEnd: String,
    val quality: Int
)

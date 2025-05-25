package com.example.sleepmonitorapp.data.model

sealed class SleepListItem {
    data class DateHeader(val date: String) : SleepListItem()
    data class SleepRecordItem(val record: SleepRecord) : SleepListItem()
}

package com.example.sleepmonitorapp.ui

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.sleepmonitorapp.R
import com.example.sleepmonitorapp.data.model.SleepRecordRequest
import com.example.sleepmonitorapp.data.network.RetrofitClient
import com.google.android.material.slider.Slider
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter

class AddSleepRecordActivity : AppCompatActivity() {

    private lateinit var btnPickDate: Button
    private lateinit var btnPickStartTime: Button
    private lateinit var btnPickEndTime: Button
    private lateinit var sliderQuality: Slider
    private lateinit var qualityLabel: TextView
    private lateinit var btnSave: Button

    private var selectedDate: LocalDate? = null
    private var startTime: LocalTime? = null
    private var endTime: LocalTime? = null
    private var quality: Int = 5

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_sleep_record)

        btnPickDate = findViewById(R.id.btnPickDate)
        btnPickStartTime = findViewById(R.id.btnPickStartTime)
        btnPickEndTime = findViewById(R.id.btnPickEndTime)
        sliderQuality = findViewById(R.id.seekBarQuality)
        qualityLabel = findViewById(R.id.textQualityLabel)
        btnSave = findViewById(R.id.btnSaveRecord)

        btnPickDate.setOnClickListener {
            val today = LocalDate.now()
            DatePickerDialog(this, { _, y, m, d ->
                selectedDate = LocalDate.of(y, m + 1, d)
                btnPickDate.text = selectedDate.toString()
            }, today.year, today.monthValue - 1, today.dayOfMonth).show()
        }

        btnPickStartTime.setOnClickListener {
            TimePickerDialog(this, { _, h, m ->
                startTime = LocalTime.of(h, m)
                btnPickStartTime.text = startTime.toString()
            }, 22, 0, true).show()
        }

        btnPickEndTime.setOnClickListener {
            TimePickerDialog(this, { _, h, m ->
                endTime = LocalTime.of(h, m)
                btnPickEndTime.text = endTime.toString()
            }, 7, 0, true).show()
        }

        sliderQuality.addOnChangeListener { _, value, _ ->
            quality = value.toInt()
            qualityLabel.text = "Sleep Quality: $quality"
        }

        btnSave.setOnClickListener {
            saveRecord()
        }
    }

    private fun saveRecord() {
        val date = selectedDate
        val start = startTime
        val end = endTime

        if (date == null || start == null || end == null) {
            Toast.makeText(this, "Please, fill in all fields", Toast.LENGTH_SHORT).show()
            return
        }

        val startDateTime = LocalDateTime.of(date, start).toInstant(java.time.ZoneOffset.UTC)
        val endDateTime = LocalDateTime.of(date, end).toInstant(java.time.ZoneOffset.UTC)

        val formatter = DateTimeFormatter.ISO_INSTANT

        val request = SleepRecordRequest(
            date.toString(),
            formatter.format(startDateTime),
            formatter.format(endDateTime),
            quality
        )

        lifecycleScope.launch {
            try {
                val api = RetrofitClient.getInstance(this@AddSleepRecordActivity)
                api.addSleepRecord(request)
                Toast.makeText(this@AddSleepRecordActivity, "Record added", Toast.LENGTH_SHORT).show()
                setResult(RESULT_OK)
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@AddSleepRecordActivity, "Save error", Toast.LENGTH_SHORT).show()
            }
        }
    }
}

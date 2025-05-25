package com.example.sleepmonitorapp.ui

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.widget.Toast
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

class EditSleepRecordActivity : AppCompatActivity() {

    private lateinit var btnPickDate: com.google.android.material.button.MaterialButton
    private lateinit var btnPickStartTime: com.google.android.material.button.MaterialButton
    private lateinit var btnPickEndTime: com.google.android.material.button.MaterialButton
    private lateinit var sliderQuality: Slider
    private lateinit var qualityLabel: android.widget.TextView
    private lateinit var btnSave: com.google.android.material.button.MaterialButton

    private val apiService by lazy { RetrofitClient.getInstance(this) }

    private var recordId: String? = null
    private var selectedDate: LocalDate = LocalDate.now()
    private var startTime: LocalTime = LocalTime.of(23, 0)
    private var endTime: LocalTime = LocalTime.of(7, 0)
    private var quality: Int = 5

    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE
    private val timeFormatter = DateTimeFormatter.ofPattern("HH:mm")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_sleep_record)

        recordId = intent.getStringExtra("recordId")
        if (recordId == null) {
            Toast.makeText(this, "Invalid record ID", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        btnPickDate = findViewById(R.id.btnPickDate)
        btnPickStartTime = findViewById(R.id.btnPickStartTime)
        btnPickEndTime = findViewById(R.id.btnPickEndTime)
        sliderQuality = findViewById(R.id.seekBarQuality)
        qualityLabel = findViewById(R.id.textQualityLabel)
        btnSave = findViewById(R.id.btnSaveRecord)

        sliderQuality.value = quality.toFloat()
        qualityLabel.text = "Sleep Quality: $quality"

        sliderQuality.addOnChangeListener { _, value, _ ->
            quality = value.toInt()
            qualityLabel.text = "Sleep Quality: $quality"
        }

        btnPickDate.setOnClickListener { showDatePicker() }
        btnPickStartTime.setOnClickListener { showTimePicker(true) }
        btnPickEndTime.setOnClickListener { showTimePicker(false) }
        btnSave.setOnClickListener { saveRecord() }

        loadRecord()
    }

    private fun loadRecord() {
        lifecycleScope.launch {
            try {
                val record = apiService.getRecordById(recordId!!)
                selectedDate = LocalDate.parse(record.date)
                startTime = LocalDateTime.parse(record.sleepStart).toLocalTime()
                endTime = LocalDateTime.parse(record.sleepEnd).toLocalTime()
                quality = record.quality

                runOnUiThread {
                    btnPickDate.text = selectedDate.toString()
                    btnPickStartTime.text = startTime.format(timeFormatter)
                    btnPickEndTime.text = endTime.format(timeFormatter)
                    sliderQuality.value = quality.toFloat()
                    qualityLabel.text = "Sleep Quality: $quality"
                }
            } catch (e: Exception) {
                Toast.makeText(this@EditSleepRecordActivity, "Error loading record", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun showDatePicker() {
        val today = selectedDate
        DatePickerDialog(this, { _, y, m, d ->
            selectedDate = LocalDate.of(y, m + 1, d)
            btnPickDate.text = selectedDate.toString()
        }, today.year, today.monthValue - 1, today.dayOfMonth).show()
    }

    private fun showTimePicker(isStart: Boolean) {
        val initialTime = if (isStart) startTime else endTime
        TimePickerDialog(this, { _, h, m ->
            val picked = LocalTime.of(h, m)
            if (isStart) {
                startTime = picked
                btnPickStartTime.text = startTime.format(timeFormatter)
            } else {
                endTime = picked
                btnPickEndTime.text = endTime.format(timeFormatter)
            }
        }, initialTime.hour, initialTime.minute, true).show()
    }

    private fun saveRecord() {
        if (selectedDate == null || startTime == null || endTime == null) {
            Toast.makeText(this, "Please, fill in all fields", Toast.LENGTH_SHORT).show()
            return
        }

        val startDateTime = LocalDateTime.of(selectedDate, startTime)
        val endDateTime = LocalDateTime.of(selectedDate, endTime)

        val request = SleepRecordRequest(
            date = selectedDate.toString(),
            sleepStart = startDateTime.toString() + "Z",
            sleepEnd = endDateTime.toString() + "Z",
            quality = quality
        )

        lifecycleScope.launch {
            try {
                apiService.updateRecord(recordId!!, request)
                runOnUiThread {
                    Toast.makeText(this@EditSleepRecordActivity, "Record updated", Toast.LENGTH_SHORT).show()
                    setResult(RESULT_OK)
                    finish()
                }
            } catch (e: Exception) {
                runOnUiThread {
                    Toast.makeText(this@EditSleepRecordActivity, "Failed to update record", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}

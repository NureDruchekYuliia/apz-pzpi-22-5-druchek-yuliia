package com.example.sleepmonitorapp.ui

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.sleepmonitorapp.R
import com.example.sleepmonitorapp.data.network.RetrofitClient
import com.example.sleepmonitorapp.ui.adapter.RecommendationAdapter
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class SleepDetailActivity : AppCompatActivity() {

    private lateinit var recordId: String
    private lateinit var textDate: TextView
    private lateinit var textStartEnd: TextView
    private lateinit var textQuality: TextView
    private lateinit var textNoise: TextView
    private lateinit var textLight: TextView
    private lateinit var btnEdit: Button
    private lateinit var btnDelete: Button
    private lateinit var recyclerRecommendations: RecyclerView

    private val apiService by lazy { RetrofitClient.getInstance(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sleep_detail)

        recordId = intent.getStringExtra("recordId") ?: return finish()

        textDate = findViewById(R.id.textDate)
        textStartEnd = findViewById(R.id.textTime)
        textQuality = findViewById(R.id.textQuality)
        textNoise = findViewById(R.id.textNoise)
        textLight = findViewById(R.id.textLight)
        recyclerRecommendations = findViewById(R.id.recyclerRecommendations)
        btnEdit = findViewById(R.id.btnEdit)
        btnDelete = findViewById(R.id.btnDelete)

        recyclerRecommendations.layoutManager = LinearLayoutManager(this)

        loadRecord(recordId)

        btnEdit.setOnClickListener {
            val intent = Intent(this, EditSleepRecordActivity::class.java)
            intent.putExtra("recordId", recordId)
            editLauncher.launch(intent)
        }

        btnDelete.setOnClickListener {
            deleteRecord(recordId)
        }
    }

    private val editLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            loadRecord(recordId)
        }
    }

    @SuppressLint("SetTextI18n")
    private fun loadRecord(id: String) {
        lifecycleScope.launch {
            try {
                val record = apiService.getRecordById(id)
                val recommendations = apiService.getRecommendations(id)

                textDate.text = "Date: ${formatDate(record.date)}"
                textStartEnd.text = "Sleep: ${formatTime(record.sleepStart)} - ${formatTime(record.sleepEnd)}"
                textQuality.text = "Quality: ${record.quality}/10"
                textNoise.text = "Avg. Noise Level: ${record.avgNoiseLevel} dB"
                textLight.text = "Avg. Light Level: ${record.avgLightLevel} lux"

                recyclerRecommendations.adapter = RecommendationAdapter(recommendations)
            } catch (e: Exception) {
                Toast.makeText(this@SleepDetailActivity, "Error loading record", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun deleteRecord(id: String) {
        lifecycleScope.launch {
            try {
                apiService.deleteRecord(id)
                Toast.makeText(this@SleepDetailActivity, "Record deleted", Toast.LENGTH_SHORT).show()
                setResult(Activity.RESULT_OK)
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@SleepDetailActivity, "Error deleting record", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun formatDate(date: String): String {
        val parsedDate = LocalDate.parse(date)
        val formatter = DateTimeFormatter.ofPattern("dd MMM yyyy")
        return parsedDate.format(formatter)
    }

    private fun formatTime(dateTime: String): String {
        val parsed = LocalDateTime.parse(dateTime)
        val formatter = DateTimeFormatter.ofPattern("HH:mm")
        return parsed.toLocalTime().format(formatter)
    }
}

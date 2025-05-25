package com.example.sleepmonitorapp.ui

import android.app.Activity
import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.sleepmonitorapp.R
import com.example.sleepmonitorapp.data.model.SleepListItem
import com.example.sleepmonitorapp.data.model.SleepRecord
import com.example.sleepmonitorapp.data.network.RetrofitClient
import com.example.sleepmonitorapp.ui.adapter.SleepRecordAdapter
import com.google.android.material.appbar.MaterialToolbar
import com.google.android.material.bottomappbar.BottomAppBar
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.coroutines.launch
import java.time.LocalDate

class MainSleepScreen : AppCompatActivity() {

    private lateinit var sleepRecyclerView: RecyclerView
    private lateinit var addRecordButton: FloatingActionButton
    private lateinit var adapter: SleepRecordAdapter

    private val apiService by lazy { RetrofitClient.getInstance(this) }
    private var sleepRecords: List<SleepRecord> = listOf()

    private val detailLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            loadAllRecords()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_sleep_screen)
        setSupportActionBar(findViewById(R.id.bottomAppBar))

        sleepRecyclerView = findViewById(R.id.recyclerSleep)
        addRecordButton = findViewById(R.id.btnAddRecord)

        adapter = SleepRecordAdapter(mutableListOf()) { record ->
            openDetails(record)
        }

        sleepRecyclerView.layoutManager = LinearLayoutManager(this)
        sleepRecyclerView.adapter = adapter

        loadAllRecords()

        addRecordButton.setOnClickListener {
            val intent = Intent(this, AddSleepRecordActivity::class.java)
            detailLauncher.launch(intent)
        }

        val topAppBar = findViewById<MaterialToolbar>(R.id.topAppBar)
        setSupportActionBar(topAppBar)

        val bottomAppBar = findViewById<BottomAppBar>(R.id.bottomAppBar)
        bottomAppBar.setOnMenuItemClickListener { menuItem ->
            when (menuItem.itemId) {
                R.id.action_logout -> {
                    val sharedPref = getSharedPreferences("auth", MODE_PRIVATE)
                    sharedPref.edit().putBoolean("isLoggedIn", false).apply()

                    val intent = Intent(this, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                    true
                }
                else -> false
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.top_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_pick_date -> {
                showDatePicker()
                true
            }
            R.id.action_clear_filter -> {
                loadAllRecords()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun loadRecordsByDate(date: String) {
        lifecycleScope.launch {
            try {
                val records = apiService.getRecordsByDate(date)
                if (records.isNotEmpty()) {
                    val grouped = listOf(SleepListItem.DateHeader(date)) +
                            records.map { SleepListItem.SleepRecordItem(it) }
                    adapter.updateData(grouped)
                } else {
                    Toast.makeText(this@MainSleepScreen, "No records for this date", Toast.LENGTH_SHORT).show()
                    adapter.updateData(emptyList())
                }
            } catch (e: Exception) {
                Toast.makeText(this@MainSleepScreen, "Loading error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun groupRecordsByDate(records: List<SleepRecord>): List<SleepListItem> {
        return records
            .sortedByDescending { it.date }
            .groupBy { it.date }
            .flatMap { (date, recs) ->
                listOf(SleepListItem.DateHeader(date)) +
                        recs.map { SleepListItem.SleepRecordItem(it) }
            }
    }

    private fun loadAllRecords() {
        lifecycleScope.launch {
            try {
                sleepRecords = apiService.getAllRecords()
                val grouped = groupRecordsByDate(sleepRecords)
                adapter.updateData(grouped)
            } catch (e: Exception) {
                Toast.makeText(this@MainSleepScreen, "Loading error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showDatePicker() {
        val today = LocalDate.now()
        val datePicker = DatePickerDialog(this, { _, year, month, day ->
            val selectedDate = LocalDate.of(year, month + 1, day).toString()
            loadRecordsByDate(selectedDate)
        }, today.year, today.monthValue - 1, today.dayOfMonth)
        datePicker.show()
    }

    private fun openDetails(record: SleepRecord) {
        val intent = Intent(this, SleepDetailActivity::class.java)
        intent.putExtra("recordId", record.id)
        detailLauncher.launch(intent)
    }
}

package com.example.sleepmonitorapp.ui.adapter

import android.annotation.SuppressLint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.sleepmonitorapp.R
import com.example.sleepmonitorapp.data.model.SleepListItem
import com.example.sleepmonitorapp.data.model.SleepRecord
import java.time.Duration
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class SleepRecordAdapter(
    private var items: List<SleepListItem>,
    private val onClick: (SleepRecord) -> Unit
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        private const val TYPE_HEADER = 0
        private const val TYPE_RECORD = 1
    }

    fun updateData(newItems: List<SleepListItem>) {
        items = newItems
        notifyDataSetChanged()
    }

    override fun getItemViewType(position: Int): Int {
        return when (items[position]) {
            is SleepListItem.DateHeader -> TYPE_HEADER
            is SleepListItem.SleepRecordItem -> TYPE_RECORD
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (viewType == TYPE_HEADER) {
            val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_date_header, parent, false)
            DateHeaderViewHolder(view)
        } else {
            val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_sleep_record, parent, false)
            RecordViewHolder(view)
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (val item = items[position]) {
            is SleepListItem.DateHeader -> (holder as DateHeaderViewHolder).bind(item)
            is SleepListItem.SleepRecordItem -> (holder as RecordViewHolder).bind(item.record, onClick)
        }
    }

    override fun getItemCount(): Int = items.size

    class DateHeaderViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val header: TextView = view.findViewById(R.id.textDateHeader)
        fun bind(item: SleepListItem.DateHeader) {
            header.text = formatDate(item.date)
        }

        private fun formatDate(date: String): String {
            return try {
                val parsed = LocalDateTime.parse(date)
                parsed.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"))
            } catch (e: Exception) {
                date
            }
        }
    }

    class RecordViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val date: TextView = view.findViewById(R.id.textDate)
        private val duration: TextView = view.findViewById(R.id.textDuration)
        private val quality: TextView = view.findViewById(R.id.textQuality)

        @SuppressLint("SetTextI18n")
        fun bind(record: SleepRecord, onClick: (SleepRecord) -> Unit) {
            date.text = "Sleep: ${formatTime(record.sleepStart)} - ${formatTime(record.sleepEnd)}"
            duration.text = "Duration: ${getDuration(record)}"
            quality.text = "Quality: ${record.quality}"
            itemView.setOnClickListener { onClick(record) }
        }

        private fun getDuration(record: SleepRecord): String {
            val start = LocalDateTime.parse(record.sleepStart)
            val end = LocalDateTime.parse(record.sleepEnd)
            val duration = Duration.between(start, end)
            return "${duration.toHours()} hrs ${duration.toMinutes() % 60} mins"
        }

        private fun formatTime(dateTime: String): String {
            val parsed = LocalDateTime.parse(dateTime)
            val formatter = DateTimeFormatter.ofPattern("HH:mm")
            return parsed.toLocalTime().format(formatter)
        }
    }
}

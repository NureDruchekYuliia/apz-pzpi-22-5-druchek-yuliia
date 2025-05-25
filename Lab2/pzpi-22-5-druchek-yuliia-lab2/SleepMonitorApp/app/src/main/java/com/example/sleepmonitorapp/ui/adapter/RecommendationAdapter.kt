package com.example.sleepmonitorapp.ui.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.sleepmonitorapp.R
import com.example.sleepmonitorapp.data.model.Recommendation


class RecommendationAdapter(
    private val items: List<Recommendation>
) : RecyclerView.Adapter<RecommendationAdapter.RecommendationViewHolder>() {

    class RecommendationViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val nameText: TextView = view.findViewById(R.id.textRecommendationName)
        val descriptionText: TextView = view.findViewById(R.id.textRecommendationDescription)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecommendationViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_recommendation, parent, false)
        return RecommendationViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecommendationViewHolder, position: Int) {
        val rec = items[position]
        holder.nameText.text = rec.name
        holder.descriptionText.text = rec.description
    }

    override fun getItemCount(): Int = items.size
}

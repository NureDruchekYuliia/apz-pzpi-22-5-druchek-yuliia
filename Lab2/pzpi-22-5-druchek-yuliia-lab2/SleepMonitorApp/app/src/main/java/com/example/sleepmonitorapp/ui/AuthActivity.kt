package com.example.sleepmonitorapp.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class AuthActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val sharedPref = getSharedPreferences("auth", MODE_PRIVATE)
        val token = sharedPref.getString("jwt_token", null)

        if (!token.isNullOrEmpty()) {
            startActivity(Intent(this, MainSleepScreen::class.java))
        } else {
            startActivity(Intent(this, LoginActivity::class.java))
        }
        finish()
    }
}

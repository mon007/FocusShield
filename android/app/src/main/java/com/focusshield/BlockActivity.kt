package com.focusshield

import android.content.Intent
import android.os.Bundle
import android.os.CountDownTimer
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class BlockActivity : AppCompatActivity() {

    private var countDownTimer:
        CountDownTimer? = null

    override fun onCreate(
        savedInstanceState: Bundle?
    ) {
        super.onCreate(savedInstanceState)

        setContentView(
            R.layout.activity_block
        )

        val appName =
            intent.getStringExtra(
                "APP_NAME"
            ) ?: "App"

        val blockTitle =
            findViewById<TextView>(
                R.id.blockTitle
            )

        val timerText =
            findViewById<TextView>(
                R.id.timerText
            )

        blockTitle.text =
            "$appName is blocked"

        startTimer(timerText)

        findViewById<Button>(
            R.id.goBackButton
        ).setOnClickListener {

            val homeIntent =
                Intent(Intent.ACTION_MAIN)

            homeIntent.addCategory(
                Intent.CATEGORY_HOME
            )

            homeIntent.flags =
                Intent.FLAG_ACTIVITY_NEW_TASK

            startActivity(homeIntent)

            finish()
        }
    }

    private fun startTimer(
        timerView: TextView
    ) {

        val remaining =
            StorageHelper.getRemainingTime(
                this
            )

        countDownTimer =
            object : CountDownTimer(
                remaining,
                1000
            ) {

                override fun onTick(
                    millisUntilFinished: Long
                ) {

                    timerView.text =
                        formatTime(
                            millisUntilFinished
                        )
                }

                override fun onFinish() {

                    finish()
                }
            }

        countDownTimer?.start()
    }

    private fun formatTime(
        millis: Long
    ): String {

        val totalSeconds =
            millis / 1000

        val hours =
            totalSeconds / 3600

        val minutes =
            (totalSeconds % 3600) / 60

        val seconds =
            totalSeconds % 60

        return String.format(
            "%02d:%02d:%02d",
            hours,
            minutes,
            seconds
        )
    }

    override fun onDestroy() {
        super.onDestroy()

        countDownTimer?.cancel()
    }
}
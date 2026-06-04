package com.focusshield

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.CountDownTimer
import android.os.IBinder
import androidx.core.app.NotificationCompat

class FocusForegroundService : Service() {

    private var countDownTimer: CountDownTimer? =
        null

    private lateinit var notificationManager:
        NotificationManager

    companion object {
        const val CHANNEL_ID =
            "focus_shield_channel"
    }

    override fun onCreate() {
        super.onCreate()

        createNotificationChannel()

        notificationManager =
            getSystemService(
                NotificationManager::class.java
            )

        val remaining =
            StorageHelper.getRemainingTime(
                this
            )

        startForeground(
            1,
            buildNotification(
                "${formatTime(remaining)} remaining"
            )
        )

        startTimer()
    }

    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {

        return START_STICKY
    }

    override fun onBind(
        intent: Intent?
    ): IBinder? {
        return null
    }

private fun buildNotification(
    text: String
): Notification {

    val blockedApps =
        StorageHelper.getBlockedAppNames(
            this
        )

    return NotificationCompat.Builder(
        this,
        CHANNEL_ID
    )
        .setContentTitle(
            "Focus Shield Active"
        )
        .setContentText(text)
        .setStyle(
            NotificationCompat.BigTextStyle()
                .bigText(
                    "Blocking: $blockedApps\n$text"
                )
        )
        .setSmallIcon(
            android.R.drawable.ic_lock_idle_alarm
        )
        .setOnlyAlertOnce(true)
        .build()
}

    private fun startTimer() {

        val remaining =
            StorageHelper.getRemainingTime(
                this
            )

        if (remaining <= 0) {
            stopSelf()
            return
        }

        countDownTimer =
            object : CountDownTimer(
                remaining,
                1000
            ) {

                override fun onTick(
                    millisUntilFinished: Long
                ) {

                    val time =
                        formatTime(
                            millisUntilFinished
                        )

                    notificationManager.notify(
                        1,
                        buildNotification(
                            "$time remaining"
                        )
                    )
                }

                override fun onFinish() {

                    notificationManager.cancel(
                        1
                    )

                    stopSelf()
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

    private fun createNotificationChannel() {

        if (
            Build.VERSION.SDK_INT >=
            Build.VERSION_CODES.O
        ) {

            val channel =
                NotificationChannel(
                    CHANNEL_ID,
                    "Focus Shield",
                    NotificationManager.IMPORTANCE_LOW
                )

            val manager =
                getSystemService(
                    NotificationManager::class.java
                )

            manager.createNotificationChannel(
                channel
            )
        }
    }

    override fun onDestroy() {
        super.onDestroy()

        countDownTimer?.cancel()
    }
}
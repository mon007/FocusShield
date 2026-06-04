package com.focusshield

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class FocusForegroundService : Service() {

    companion object {
        const val CHANNEL_ID =
            "focus_shield_channel"
    }

    override fun onCreate() {
        super.onCreate()

        createNotificationChannel()

        val notification: Notification =
            NotificationCompat.Builder(
                this,
                CHANNEL_ID
            )
                .setContentTitle(
                    "Focus Shield"
                )
                .setContentText(
                    "Focus session active"
                )
                .setSmallIcon(
                    android.R.drawable.ic_lock_idle_alarm
                )
                .build()

        startForeground(
            1,
            notification
        )
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
}
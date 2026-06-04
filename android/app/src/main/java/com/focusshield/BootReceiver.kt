package com.focusshield

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(
        context: Context,
        intent: Intent
    ) {

        if (
            intent.action ==
            Intent.ACTION_BOOT_COMPLETED
        ) {

            val sessionEndTime =
                StorageHelper.getSessionEndTime(
                    context
                )

            val sessionActive =
                System.currentTimeMillis() <
                    sessionEndTime

            if (sessionActive) {

                val serviceIntent =
                    Intent(
                        context,
                        FocusForegroundService::class.java
                    )

                context.startForegroundService(
                    serviceIntent
                )
            }
        }
    }
}
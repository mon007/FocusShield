package com.focusshield

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class FocusAccessibilityService : AccessibilityService() {

    private var lastBlockedTime = 0L

    override fun onAccessibilityEvent(
        event: AccessibilityEvent?
    ) {

        if (event == null) {
            return
        }

        val packageName =
            event.packageName?.toString()
                ?: return

        Log.d(
            "FOCUS_SHIELD",
            "Opened: $packageName"
        )

        val blockedApps =
            StorageHelper.getBlockedApps(this)

        val sessionEndTime =
            StorageHelper.getSessionEndTime(this)

        val sessionActive =
            System.currentTimeMillis() <
                sessionEndTime

        if (
            sessionActive &&
            blockedApps.contains(packageName)
        ) {

            val now =
                System.currentTimeMillis()

            if (
                now - lastBlockedTime < 1000
            ) {
                return
            }

            lastBlockedTime = now

            Log.d(
                "FOCUS_SHIELD",
                "BLOCKED APP DETECTED: $packageName"
            )

            val intent = Intent(
                this,
                BlockActivity::class.java
            )

          val appLabel =
    try {
        packageManager
            .getApplicationLabel(
                packageManager
                    .getApplicationInfo(
                        packageName,
                        0
                    )
            )
            .toString()
    } catch (e: Exception) {
        packageName
    }

intent.putExtra(
    "APP_NAME",
    appLabel
)

            intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
            )

            startActivity(intent)
        }
    }

    override fun onInterrupt() {}

    override fun onServiceConnected() {
        super.onServiceConnected()

        Log.d(
            "FOCUS_SHIELD",
            "Accessibility Service Connected"
        )
    }
}
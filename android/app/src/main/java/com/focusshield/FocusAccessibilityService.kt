package com.focusshield

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.util.Log

class FocusAccessibilityService :
    AccessibilityService() {

    override fun onAccessibilityEvent(
        event: AccessibilityEvent?
    ) {

        if (event == null) {
            return
        }

    val packageName =
    event.packageName?.toString()

if (packageName == null) {
    return
}

val blockedApps =
    StorageHelper.getBlockedApps(this)

val sessionEndTime =
    StorageHelper
        .getSessionEndTime(this)

val sessionActive =
    System.currentTimeMillis() <
        sessionEndTime

if (
    sessionActive &&
    blockedApps.contains(packageName)
) {

    Log.d(
        "FOCUS_SHIELD",
        "BLOCKED APP DETECTED: $packageName"
    )
}
    }

    override fun onInterrupt() {}
}
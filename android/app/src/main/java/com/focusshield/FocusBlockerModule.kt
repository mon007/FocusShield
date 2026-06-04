package com.focusshield
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.content.Intent
import com.facebook.react.bridge.ReadableArray


class FocusBlockerModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "FocusBlocker"
    }

    @ReactMethod
    fun getDeviceName(promise: Promise) {
        try {
            val deviceName =
                "${Build.MANUFACTURER} ${Build.MODEL}"

            promise.resolve(deviceName)
        } catch (e: Exception) {
            promise.reject(
                "DEVICE_ERROR",
                e.message
            )
        }
    }

@ReactMethod
fun getInstalledApps(promise: Promise) {
    try {

        val packageManager =
            reactApplicationContext.packageManager

        val intent = Intent(
            Intent.ACTION_MAIN,
            null
        )

        intent.addCategory(
            Intent.CATEGORY_LAUNCHER
        )

        val apps =
            packageManager.queryIntentActivities(
                intent,
                0
            )

        val result =
            Arguments.createArray()

        for (app in apps) {

            val appMap =
                Arguments.createMap()

            appMap.putString(
                "name",
                app.loadLabel(packageManager)
                    .toString()
            )

            appMap.putString(
                "packageName",
                app.activityInfo.packageName
            )

            result.pushMap(appMap)
        }

        promise.resolve(result)

    } catch (e: Exception) {

        promise.reject(
            "GET_APPS_ERROR",
            e.message
        )
    }
}

@ReactMethod
fun saveBlockedApps(
    apps: ReadableArray,
    promise: Promise
) {

    try {

        val blockedApps =
            mutableSetOf<String>()

        for (i in 0 until apps.size()) {

            apps.getString(i)?.let {
                blockedApps.add(it)
            }
        }

        StorageHelper.saveBlockedApps(
            reactApplicationContext,
            blockedApps
        )

        promise.resolve(true)

    } catch (e: Exception) {

        promise.reject(
            "SAVE_ERROR",
            e.message
        )
    }
}
@ReactMethod
fun saveSessionEndTime(
    endTime: Double,
    promise: Promise
) {

    try {

        StorageHelper.saveSessionEndTime(
            reactApplicationContext,
            endTime.toLong()
        )

        promise.resolve(true)

    } catch (e: Exception) {

        promise.reject(
            "END_TIME_ERROR",
            e.message
        )
    }
}

@ReactMethod
fun clearFocusSession(
    promise: Promise
) {

    try {

        StorageHelper.clearSession(
            reactApplicationContext
        )

        promise.resolve(true)

    } catch (e: Exception) {

        promise.reject(
            "CLEAR_SESSION_ERROR",
            e.message
        )
    }
}

@ReactMethod
fun startForegroundService(
    promise: Promise
) {

    try {

        val intent =
            Intent(
                reactApplicationContext,
                FocusForegroundService::class.java
            )

        reactApplicationContext
            .startForegroundService(
                intent
            )

        promise.resolve(true)

    } catch (e: Exception) {

        promise.reject(
            "SERVICE_START_ERROR",
            e.message
        )
    }
}

@ReactMethod
fun stopForegroundService(
    promise: Promise
) {

    try {

        val intent =
            Intent(
                reactApplicationContext,
                FocusForegroundService::class.java
            )

        reactApplicationContext
            .stopService(
                intent
            )

        promise.resolve(true)

    } catch (e: Exception) {

        promise.reject(
            "SERVICE_STOP_ERROR",
            e.message
        )
    }
}
}
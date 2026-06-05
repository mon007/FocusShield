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
import android.provider.Settings
import android.text.TextUtils
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.util.Base64
import java.io.ByteArrayOutputStream

class FocusBlockerModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "FocusBlocker"
    }

private fun drawableToBase64(
    drawable: android.graphics.drawable.Drawable
): String {

    val bitmap =
        if (drawable is BitmapDrawable) {
            drawable.bitmap
        } else {

            val bitmap =
                Bitmap.createBitmap(
                    drawable.intrinsicWidth,
                    drawable.intrinsicHeight,
                    Bitmap.Config.ARGB_8888
                )

            val canvas =
                Canvas(bitmap)

            drawable.setBounds(
                0,
                0,
                canvas.width,
                canvas.height
            )

            drawable.draw(canvas)

            bitmap
        }

    val outputStream =
        ByteArrayOutputStream()

    bitmap.compress(
        Bitmap.CompressFormat.PNG,
        100,
        outputStream
    )

    val bytes =
        outputStream.toByteArray()

    return Base64.encodeToString(
        bytes,
        Base64.NO_WRAP
    )
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
            val icon =
    app.loadIcon(
        packageManager
    )

appMap.putString(
    "icon",
    drawableToBase64(icon)
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

@ReactMethod
fun saveBlockedAppNames(
    names: String,
    promise: Promise
) {

    try {

        StorageHelper
            .saveBlockedAppNames(
                reactApplicationContext,
                names
            )

        promise.resolve(true)

    } catch (e: Exception) {

        promise.reject(
            "SAVE_APP_NAMES_ERROR",
            e.message
        )
    }
}
@ReactMethod
fun isAccessibilityEnabled(
    promise: Promise
) {

    try {

        val service =
            "${reactApplicationContext.packageName}/" +
            "com.focusshield.FocusAccessibilityService"

        var accessibilityEnabled = 0

        try {

            accessibilityEnabled =
                Settings.Secure.getInt(
                    reactApplicationContext
                        .contentResolver,
                    Settings.Secure
                        .ACCESSIBILITY_ENABLED
                )

        } catch (
            e: Settings.SettingNotFoundException
        ) {
        }

        if (accessibilityEnabled == 1) {

            val settingValue =
                Settings.Secure.getString(
                    reactApplicationContext
                        .contentResolver,
                    Settings.Secure
                        .ENABLED_ACCESSIBILITY_SERVICES
                )

            if (settingValue != null) {

                val splitter =
                    TextUtils.SimpleStringSplitter(':')

                splitter.setString(
                    settingValue
                )

                while (
                    splitter.hasNext()
                ) {

                    val accessibilityService =
                        splitter.next()

                    if (
                        accessibilityService.equals(
                            service,
                            ignoreCase = true
                        )
                    ) {

                        promise.resolve(true)
                        return
                    }
                }
            }
        }

        promise.resolve(false)

    } catch (e: Exception) {

        promise.reject(
            "ACCESSIBILITY_CHECK_ERROR",
            e.message
        )
    }
}
@ReactMethod
fun openAccessibilitySettings(
    promise: Promise
) {

    try {

        val intent =
            Intent(
                Settings
                    .ACTION_ACCESSIBILITY_SETTINGS
            )

        intent.addFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK
        )

        reactApplicationContext
            .startActivity(intent)

        promise.resolve(true)

    } catch (e: Exception) {

        promise.reject(
            "SETTINGS_ERROR",
            e.message
        )
    }
}
}
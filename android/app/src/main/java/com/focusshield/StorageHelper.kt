package com.focusshield

import android.content.Context

object StorageHelper {

    private const val PREF_NAME =
        "focus_shield_prefs"

    private const val BLOCKED_APPS_KEY =
        "blocked_apps"
        fun saveSessionEndTime(
    context: Context,
    endTime: Long
) {

    context
        .getSharedPreferences(
            PREF_NAME,
            Context.MODE_PRIVATE
        )
        .edit()
        .putLong(
            SESSION_END_KEY,
            endTime
        )
        .apply()
}

fun getSessionEndTime(
    context: Context
): Long {

    return context
        .getSharedPreferences(
            PREF_NAME,
            Context.MODE_PRIVATE
        )
        .getLong(
            SESSION_END_KEY,
            0L
        )
}
private const val SESSION_END_KEY =
    "session_end_time"
    fun saveBlockedApps(
        context: Context,
        packages: Set<String>
    ) {

        context
            .getSharedPreferences(
                PREF_NAME,
                Context.MODE_PRIVATE
            )
            .edit()
            .putStringSet(
                BLOCKED_APPS_KEY,
                packages
            )
            .apply()
    }

    fun getBlockedApps(
        context: Context
    ): Set<String> {

        return context
            .getSharedPreferences(
                PREF_NAME,
                Context.MODE_PRIVATE
            )
            .getStringSet(
                BLOCKED_APPS_KEY,
                emptySet()
            ) ?: emptySet()
    }

    fun clearSession(
    context: Context
) {

    context
        .getSharedPreferences(
            PREF_NAME,
            Context.MODE_PRIVATE
        )
        .edit()
        .remove(BLOCKED_APPS_KEY)
        .remove(SESSION_END_KEY)
        .apply()
}

fun getRemainingTime(
    context: Context
): Long {

    val endTime =
        getSessionEndTime(context)

    return maxOf(
        0,
        endTime - System.currentTimeMillis()
    )
}
}
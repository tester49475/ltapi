package com.ltapi.devhub.utils

import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

class DatetimeUtils {
    fun toDatetime(date: Date): String {
        val d = date.toInstant().atZone(ZoneId.systemDefault())
            .toLocalDateTime()

        return "${d.hour}:${d.minute} ${d.month} ${d.dayOfMonth}, ${d.year}"
    }
}
package com.elmn.SecurityLastChance.dto.admin;

public record AdminStatsResponse(
        long totalUsers,
        long totalAdmins,
        long newUsersToday,
        long totalCategories,
        long totalSessions,
        long activeSessions,
        long sessionsStartedToday,
        long totalFocusTimeSec,
        long todayFocusTimeSec,
        long averageCompletedSessionSec
) {
}

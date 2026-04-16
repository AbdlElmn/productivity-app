package com.elmn.SecurityLastChance.dto.session;

import java.util.List;

public record TodaySessionsResponse(
        List<SessionResponse> sessions,
        Long totalDurationSec
) {
}

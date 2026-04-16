package com.elmn.SecurityLastChance.service;

import com.elmn.SecurityLastChance.dto.admin.AdminStatsResponse;
import com.elmn.SecurityLastChance.enums.Role;
import com.elmn.SecurityLastChance.exception.ForbiddenException;
import com.elmn.SecurityLastChance.exception.UnauthorizedException;
import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.repository.CategoryRepository;
import com.elmn.SecurityLastChance.repository.SessionRepository;
import com.elmn.SecurityLastChance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatsService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final CategoryRepository categoryRepository;

    public AdminStatsResponse getOverview() {
        User currentUser = getCurrentUser();
        ensureAdmin(currentUser);

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        long totalUsers = userRepository.count();
        long totalAdmins = userRepository.countByRole(Role.ADMIN);
        long newUsersToday = userRepository.countByCreatedAtGreaterThanEqual(startOfToday);
        long totalCategories = categoryRepository.count();
        long totalSessions = sessionRepository.count();
        long activeSessions = sessionRepository.countByEndTimeIsNull();
        long sessionsStartedToday = sessionRepository.countByStartTimeGreaterThanEqual(startOfToday);
        long totalFocusTimeSec = sessionRepository.sumDurationSec();
        long todayFocusTimeSec = sessionRepository.sumDurationSecByStartTimeGreaterThanEqual(startOfToday);
        long averageCompletedSessionSec = Math.round(sessionRepository.averageCompletedSessionDurationSec());

        return new AdminStatsResponse(
                totalUsers,
                totalAdmins,
                newUsersToday,
                totalCategories,
                totalSessions,
                activeSessions,
                sessionsStartedToday,
                totalFocusTimeSec,
                todayFocusTimeSec,
                averageCompletedSessionSec
        );
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Authenticated user not found.");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found: " + email));
    }

    private void ensureAdmin(User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Access denied. Admin role is required.");
        }
    }
}

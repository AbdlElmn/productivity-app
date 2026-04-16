package com.elmn.SecurityLastChance.service;

import com.elmn.SecurityLastChance.dto.session.SessionResponse;
import com.elmn.SecurityLastChance.dto.session.StartSessionRequest;
import com.elmn.SecurityLastChance.dto.session.StopSessionRequest;
import com.elmn.SecurityLastChance.dto.session.TotalFocusTimeResponse;
import com.elmn.SecurityLastChance.dto.session.TodaySessionsResponse;
import com.elmn.SecurityLastChance.exception.BadRequestException;
import com.elmn.SecurityLastChance.exception.ConflictException;
import com.elmn.SecurityLastChance.exception.NotFoundException;
import com.elmn.SecurityLastChance.exception.UnauthorizedException;
import com.elmn.SecurityLastChance.model.Category;
import com.elmn.SecurityLastChance.model.Session;
import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.repository.CategoryRepository;
import com.elmn.SecurityLastChance.repository.SessionRepository;
import com.elmn.SecurityLastChance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public SessionResponse startSession(StartSessionRequest request) {
        User user = getCurrentUser();
        Long userId = user.getId();

        sessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId)
                .ifPresent(session -> {
                    throw new ConflictException("You already have an active session. Stop it before starting a new one.");
                });

        Category category = null;
        if (request.categoryId() != null) {
            category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                    .orElseThrow(() -> new NotFoundException("Category not found for user: " + request.categoryId()));
        }

        LocalDateTime now = LocalDateTime.now();
        Session session = Session.builder()
                .user(user)
                .category(category)
                .note(cleanText(request.note()))
                .startTime(now)
                .createdAt(now)
                .build();

        return toResponse(sessionRepository.save(session));
    }

    @Transactional
    public SessionResponse stopSession(StopSessionRequest request) {
        Long userId = getCurrentUser().getId();

        Session activeSession = sessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId)
                .orElseThrow(() -> new NotFoundException("No active session found for user: " + userId));

        LocalDateTime endTime = LocalDateTime.now();
        if (endTime.isBefore(activeSession.getStartTime())) {
            throw new BadRequestException("Session end time cannot be before start time.");
        }

        int durationSec = Math.toIntExact(Duration.between(activeSession.getStartTime(), endTime).getSeconds());
        activeSession.setEndTime(endTime);
        activeSession.setDurationSec(durationSec);

        String note = cleanText(request.note());
        if (note != null) {
            activeSession.setNote(note);
        }

        return toResponse(sessionRepository.save(activeSession));
    }

    public List<SessionResponse> getUserSessions() {
        Long userId = getCurrentUser().getId();

        return sessionRepository.findAllByUserIdOrderByStartTimeDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public TodaySessionsResponse getTodaySessions() {
        Long userId = getCurrentUser().getId();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = today.plusDays(1).atStartOfDay();

        List<SessionResponse> sessions = sessionRepository
                .findAllByUserIdAndStartedBetween(userId, startOfDay, startOfNextDay)
                .stream()
                .map(this::toResponse)
                .toList();

        Long totalDurationSec = sessionRepository
                .sumDurationSecByUserIdAndStartedBetween(userId, startOfDay, startOfNextDay);

        return new TodaySessionsResponse(sessions, totalDurationSec);
    }

    public TotalFocusTimeResponse getTotalFocusTime() {
        Long userId = getCurrentUser().getId();
        Long totalDurationSec = sessionRepository.sumDurationSecByUserId(userId);

        return new TotalFocusTimeResponse(totalDurationSec);
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

    private String cleanText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private SessionResponse toResponse(Session session) {
        return new SessionResponse(
                session.getId(),
                session.getCategory() != null ? session.getCategory().getId() : null,
                session.getCategory() != null ? session.getCategory().getName() : null,
                session.getNote(),
                session.getStartTime(),
                session.getEndTime(),
                session.getDurationSec(),
                session.getEndTime() == null
        );
    }
}

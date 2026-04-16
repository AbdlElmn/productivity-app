package com.elmn.SecurityLastChance.controller;

import com.elmn.SecurityLastChance.dto.session.SessionResponse;
import com.elmn.SecurityLastChance.dto.session.StartSessionRequest;
import com.elmn.SecurityLastChance.dto.session.StopSessionRequest;
import com.elmn.SecurityLastChance.dto.session.TotalFocusTimeResponse;
import com.elmn.SecurityLastChance.dto.session.TodaySessionsResponse;
import com.elmn.SecurityLastChance.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/start")
    public ResponseEntity<SessionResponse> startSession(@RequestBody StartSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.startSession(request));
    }

    @PostMapping("/stop")
    public ResponseEntity<SessionResponse> stopSession(@RequestBody StopSessionRequest request) {
        return ResponseEntity.ok(sessionService.stopSession(request));
    }

    @GetMapping
    public ResponseEntity<List<SessionResponse>> getSessions() {
        return ResponseEntity.ok(sessionService.getUserSessions());
    }

    @GetMapping("/today")
    public ResponseEntity<TodaySessionsResponse> getTodaySessions() {
        return ResponseEntity.ok(sessionService.getTodaySessions());
    }

    @GetMapping("/total-time")
    public ResponseEntity<TotalFocusTimeResponse> getTotalFocusTime() {
        return ResponseEntity.ok(sessionService.getTotalFocusTime());
    }
}

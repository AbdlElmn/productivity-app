package com.elmn.SecurityLastChance.controller;

import com.elmn.SecurityLastChance.dto.admin.AdminStatsResponse;
import com.elmn.SecurityLastChance.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/overview")
    public ResponseEntity<AdminStatsResponse> getOverview() {
        return ResponseEntity.ok(adminStatsService.getOverview());
    }
}

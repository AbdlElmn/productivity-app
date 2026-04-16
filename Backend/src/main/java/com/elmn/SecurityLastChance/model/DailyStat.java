package com.elmn.SecurityLastChance.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_stats",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private Integer totalTime; // seconds

    private Integer sessionCount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

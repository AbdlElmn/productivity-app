package com.elmn.SecurityLastChance.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "streaks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Streak {

    @Id
    private Long userId;

    private Integer currentStreak;

    private Integer bestStreak;

    private LocalDate lastActive;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}

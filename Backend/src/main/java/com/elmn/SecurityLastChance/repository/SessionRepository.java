package com.elmn.SecurityLastChance.repository;

import com.elmn.SecurityLastChance.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(Long userId);

    List<Session> findAllByUserIdOrderByStartTimeDesc(Long userId);

    @Query("""
            select s
            from Session s
            where s.user.id = :userId
              and s.startTime >= :from
              and s.startTime < :to
            order by s.startTime desc
            """)
    List<Session> findAllByUserIdAndStartedBetween(Long userId, LocalDateTime from, LocalDateTime to);

    @Query("""
            select coalesce(sum(s.durationSec), 0)
            from Session s
            where s.user.id = :userId
              and s.startTime >= :from
              and s.startTime < :to
            """)
    Long sumDurationSecByUserIdAndStartedBetween(Long userId, LocalDateTime from, LocalDateTime to);

    @Query("""
            select coalesce(sum(s.durationSec), 0)
            from Session s
            where s.user.id = :userId
            """)
    Long sumDurationSecByUserId(Long userId);

    long countByEndTimeIsNull();

    long countByStartTimeGreaterThanEqual(LocalDateTime startTime);

    @Query("""
            select coalesce(sum(s.durationSec), 0)
            from Session s
            """)
    Long sumDurationSec();

    @Query("""
            select coalesce(sum(s.durationSec), 0)
            from Session s
            where s.startTime >= :startTime
            """)
    Long sumDurationSecByStartTimeGreaterThanEqual(LocalDateTime startTime);

    @Query("""
            select coalesce(avg(s.durationSec), 0)
            from Session s
            where s.durationSec is not null
            """)
    Double averageCompletedSessionDurationSec();

    @Modifying
    @Query("""
            update Session s
            set s.category = null
            where s.category.id = :categoryId
              and s.user.id = :userId
            """)
    int clearCategoryForUserSessions(Long categoryId, Long userId);
}

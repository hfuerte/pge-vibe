package com.pge.vibe.repository;

import com.pge.vibe.entity.ElectricUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ElectricUsageRepository extends JpaRepository<ElectricUsage, Long> {
    
    List<ElectricUsage> findByAccountIdOrderByUsageDateDesc(String accountId);
    
    List<ElectricUsage> findByAccountIdAndUsageDateBetween(String accountId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT e FROM ElectricUsage e WHERE e.accountId = :accountId AND e.usageDate >= :fromDate ORDER BY e.usageDate DESC, e.startTime DESC")
    List<ElectricUsage> findRecentUsage(@Param("accountId") String accountId, @Param("fromDate") LocalDate fromDate);
    
    boolean existsByAccountIdAndUsageDateAndStartTime(String accountId, LocalDate usageDate, LocalTime startTime);
}
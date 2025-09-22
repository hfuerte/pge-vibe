package com.pge.vibe.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "electric_usage")
public class ElectricUsage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "account_id", nullable = false)
    private String accountId;
    
    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "usage_kwh", precision = 10, scale = 3)
    private BigDecimal usageKwh;
    
    @Column(name = "cost", precision = 10, scale = 2)
    private BigDecimal cost;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    public ElectricUsage() {
        this.createdAt = LocalDateTime.now();
    }
    
    public ElectricUsage(String accountId, LocalDate usageDate, LocalTime startTime, LocalTime endTime, BigDecimal usageKwh, BigDecimal cost, String notes) {
        this();
        this.accountId = accountId;
        this.usageDate = usageDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.usageKwh = usageKwh;
        this.cost = cost;
        this.notes = notes;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getAccountId() {
        return accountId;
    }
    
    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
    
    public LocalDate getUsageDate() {
        return usageDate;
    }
    
    public void setUsageDate(LocalDate usageDate) {
        this.usageDate = usageDate;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public BigDecimal getUsageKwh() {
        return usageKwh;
    }
    
    public void setUsageKwh(BigDecimal usageKwh) {
        this.usageKwh = usageKwh;
    }
    
    public BigDecimal getCost() {
        return cost;
    }
    
    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
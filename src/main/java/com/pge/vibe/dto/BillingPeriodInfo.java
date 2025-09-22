package com.pge.vibe.dto;

public class BillingPeriodInfo {
    private String startDate;
    private String endDate;
    private Integer billingDays;
    private boolean success;
    private String message;

    public BillingPeriodInfo() {
    }

    public BillingPeriodInfo(String startDate, String endDate, Integer billingDays) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.billingDays = billingDays;
        this.success = true;
        this.message = "Successfully extracted billing period information";
    }

    public BillingPeriodInfo(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Integer getBillingDays() {
        return billingDays;
    }

    public void setBillingDays(Integer billingDays) {
        this.billingDays = billingDays;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
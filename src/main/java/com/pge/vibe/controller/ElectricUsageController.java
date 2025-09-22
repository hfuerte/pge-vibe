package com.pge.vibe.controller;

import com.opencsv.exceptions.CsvException;
import com.pge.vibe.entity.AccountInfo;
import com.pge.vibe.entity.ElectricUsage;
import com.pge.vibe.repository.AccountInfoRepository;
import com.pge.vibe.repository.ElectricUsageRepository;
import com.pge.vibe.service.CsvParsingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/usage")
public class ElectricUsageController {
    
    @Autowired
    private ElectricUsageRepository repository;
    
    @Autowired
    private AccountInfoRepository accountInfoRepository;
    
    @Autowired
    private CsvParsingService csvParsingService;
    
    @GetMapping("/all")
    public ResponseEntity<List<ElectricUsage>> getAllUsage() {
        return ResponseEntity.ok(repository.findAll());
    }
    
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<ElectricUsage>> getUsageByAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(repository.findByAccountIdOrderByUsageDateDesc(accountId));
    }
    
    @GetMapping("/accounts")
    public ResponseEntity<List<AccountInfo>> getAllAccounts() {
        return ResponseEntity.ok(accountInfoRepository.findAll());
    }
    
    @GetMapping("/account/{accountId}/range")
    public ResponseEntity<List<ElectricUsage>> getUsageByDateRange(
            @PathVariable String accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(repository.findByAccountIdAndUsageDateBetween(accountId, startDate, endDate));
    }
    
    @GetMapping("/account/{accountId}/recent")
    public ResponseEntity<List<ElectricUsage>> getRecentUsage(
            @PathVariable String accountId,
            @RequestParam(defaultValue = "30") int days) {
        LocalDate fromDate = LocalDate.now().minusDays(days);
        return ResponseEntity.ok(repository.findRecentUsage(accountId, fromDate));
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a CSV file to upload");
        }
        
        try {
            List<ElectricUsage> usages = csvParsingService.parseAndSaveCsv(file);
            return ResponseEntity.ok().body(
                String.format("Successfully processed %d usage records from %s", 
                    usages.size(), file.getOriginalFilename()));
        } catch (IOException | CsvException e) {
            return ResponseEntity.badRequest().body("Error processing CSV file: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllUsage() {
        repository.deleteAll();
        return ResponseEntity.ok().build();
    }
}
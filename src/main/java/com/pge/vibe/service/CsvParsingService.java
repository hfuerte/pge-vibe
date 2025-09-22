package com.pge.vibe.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.pge.vibe.entity.AccountInfo;
import com.pge.vibe.entity.ElectricUsage;
import com.pge.vibe.repository.AccountInfoRepository;
import com.pge.vibe.repository.ElectricUsageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvParsingService {
    
    private static final Logger logger = LoggerFactory.getLogger(CsvParsingService.class);
    
    @Autowired
    private ElectricUsageRepository usageRepository;
    
    @Autowired
    private AccountInfoRepository accountInfoRepository;
    
    public List<ElectricUsage> parseAndSaveCsv(MultipartFile file) throws IOException, CsvException {
        logger.info("Parsing CSV file: {}", file.getOriginalFilename());
        
        List<ElectricUsage> savedUsages = new ArrayList<>();
        AccountInfo accountInfo = null;
        
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> records = reader.readAll();
            
            for (int i = 0; i < records.size(); i++) {
                String[] record = records.get(i);
                
                if (record.length >= 2) {
                    String key = record[0].trim();
                    String value = record[1].trim();
                    
                    if (key.equals("Name")) {
                        accountInfo = new AccountInfo();
                        accountInfo.setName(value);
                    } else if (key.equals("Address") && accountInfo != null) {
                        accountInfo.setAddress(value.replaceAll("\"", ""));
                    } else if (key.equals("Account Number") && accountInfo != null) {
                        accountInfo.setAccountNumber(value);
                    } else if (key.equals("Service") && accountInfo != null) {
                        accountInfo.setServiceType(value);
                        saveAccountInfo(accountInfo);
                    } else if (key.equals("TYPE") && record.length >= 7) {
                        i++;
                        while (i < records.size()) {
                            String[] usageRecord = records.get(i);
                            if (usageRecord.length >= 6 && usageRecord[0].equals("Electric usage")) {
                                ElectricUsage usage = parseUsageRecord(usageRecord, accountInfo.getAccountNumber());
                                if (usage != null && !usageRepository.existsByAccountIdAndUsageDateAndStartTime(
                                        usage.getAccountId(), usage.getUsageDate(), usage.getStartTime())) {
                                    ElectricUsage savedUsage = usageRepository.save(usage);
                                    savedUsages.add(savedUsage);
                                }
                            }
                            i++;
                        }
                        break;
                    }
                }
            }
        }
        
        logger.info("Successfully parsed and saved {} usage records", savedUsages.size());
        return savedUsages;
    }
    
    private void saveAccountInfo(AccountInfo accountInfo) {
        if (!accountInfoRepository.existsByAccountNumber(accountInfo.getAccountNumber())) {
            accountInfoRepository.save(accountInfo);
            logger.info("Saved account info for: {}", accountInfo.getAccountNumber());
        } else {
            logger.info("Account info already exists for: {}", accountInfo.getAccountNumber());
        }
    }
    
    private ElectricUsage parseUsageRecord(String[] record, String accountNumber) {
        try {
            LocalDate date = LocalDate.parse(record[1], DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalTime startTime = LocalTime.parse(record[2], DateTimeFormatter.ofPattern("HH:mm"));
            LocalTime endTime = LocalTime.parse(record[3], DateTimeFormatter.ofPattern("HH:mm"));
            BigDecimal usageKwh = new BigDecimal(record[4]);
            BigDecimal cost = new BigDecimal(record[5].replace("$", ""));
            String notes = record.length > 6 ? record[6] : null;
            
            return new ElectricUsage(accountNumber, date, startTime, endTime, usageKwh, cost, notes);
        } catch (Exception e) {
            logger.error("Error parsing usage record: {}", String.join(",", record), e);
            return null;
        }
    }
}
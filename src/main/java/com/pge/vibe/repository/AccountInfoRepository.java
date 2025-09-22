package com.pge.vibe.repository;

import com.pge.vibe.entity.AccountInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountInfoRepository extends JpaRepository<AccountInfo, Long> {
    
    Optional<AccountInfo> findByAccountNumber(String accountNumber);
    
    boolean existsByAccountNumber(String accountNumber);
}
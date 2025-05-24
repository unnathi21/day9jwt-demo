package com.vignan.jwtdemo.repository;

import com.vignan.jwtdemo.model.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogEntryRepository extends JpaRepository<LogEntry, Long> {
}
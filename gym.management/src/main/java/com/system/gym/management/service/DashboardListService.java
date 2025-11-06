// src/main/java/com/system/gym/management/service/DashboardListService.java
package com.system.gym.management.service;

import com.system.gym.management.dto.ClassSummaryDTO;
import com.system.gym.management.dto.PaymentSummaryDTO;
import com.system.gym.management.repository.ClassRepository;
import com.system.gym.management.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardListService {

    private final PaymentRepository paymentRepository;
    private final ClassRepository classRepository;

    // ============================================
    // RECENT PAYMENTS
    // ============================================
    public List<PaymentSummaryDTO> getRecentPayments(int limit) {
        return paymentRepository.findRecentPayments(PageRequest.of(0, limit))
                .stream()
                .map(this::toPaymentSummaryDTO)
                .collect(Collectors.toList());
    }

    private PaymentSummaryDTO toPaymentSummaryDTO(Object[] row) {
        PaymentSummaryDTO dto = new PaymentSummaryDTO();
        dto.setPaymentId((Integer) row[0]);
        dto.setUserName((String) row[1]);
        dto.setAmount((Double) row[2]);
        dto.setMethod((String) row[3]);
        dto.setPaymentDate(((java.sql.Date) row[4]).toString());
        dto.setStatus((String) row[5]);
        return dto;
    }

    // ============================================
    // UPCOMING CLASSES
    // ============================================
    public List<ClassSummaryDTO> getUpcomingClasses(int limit) {
        return classRepository.findUpcomingClasses(PageRequest.of(0, limit))
                .stream()
                .map(this::toClassSummaryDTO)
                .collect(Collectors.toList());
    }

    private ClassSummaryDTO toClassSummaryDTO(com.system.gym.management.entity.Class c) {
        ClassSummaryDTO dto = new ClassSummaryDTO();
        dto.setClassId(c.getClassId());
        dto.setClassName(c.getClassName());
        dto.setTrainerName(c.getTrainer() != null
                ? c.getTrainer().getUser().getFirstName() + " " + c.getTrainer().getUser().getLastName()
                : "—");
        dto.setClassDate(c.getClassDate().toString());
        dto.setStartTime(c.getStartTime().toLocalDateTime().toLocalTime().toString());
        dto.setCapacity(c.getCapacity());
        return dto;
    }
}
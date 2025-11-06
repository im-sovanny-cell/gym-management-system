// src/main/java/com/system/gym/management/service/PaymentService.java
package com.system.gym.management.service;

import com.system.gym.management.dto.PaymentDTO;
import com.system.gym.management.dto.PaymentSummaryDTO;
import com.system.gym.management.entity.*;
import com.system.gym.management.exception.ResourceNotFoundException;
import com.system.gym.management.repository.*;
import com.system.gym.management.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TelegramNotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final MapperUtil mapperUtil;



    // ============================================
    // DASHBOARD: TODAY TOTAL
    // ============================================
    public double getTodayTotal() {
        return paymentRepository.sumPaymentsByDate(LocalDate.now())
                .orElse(0.0);
    }

    // ============================================
    // DASHBOARD: RECENT PAYMENTS
    // ============================================
    public List<PaymentSummaryDTO> getRecentPayments(int limit) {
        return paymentRepository.findRecentPayments(PageRequest.of(0, limit))
                .stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    private PaymentSummaryDTO toSummaryDTO(Object[] row) {
        PaymentSummaryDTO dto = new PaymentSummaryDTO();
        dto.setPaymentId((Integer) row[0]);
        dto.setUserName((String) row[1]);
        dto.setAmount(((Number) row[2]).doubleValue());
        dto.setMethod((String) row[3]);
        dto.setPaymentDate(((java.sql.Date) row[4]).toLocalDate().toString());
        dto.setStatus((String) row[5]);
        return dto;
    }

    // ============================================
    // CRUD (Your existing code)
    // ============================================
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(mapperUtil::toPaymentDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO getPaymentById(Integer id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return mapperUtil.toPaymentDTO(payment);
    }

    public PaymentDTO createPayment(PaymentDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found id = " + dto.getUserId()));

        Membership membership = membershipRepository.findById(dto.getMembershipId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found id = " + dto.getMembershipId()));

        Payment payment = mapperUtil.toPayment(dto);
        payment.setUser(user);
        payment.setMembership(membership);

        payment = paymentRepository.save(payment);

        // Telegram notification
        TelegramNotification n = new TelegramNotification();
        n.setUser(user);
        n.setMessage("Payment received: $" + payment.getAmount() +
                     " (membership #" + membership.getMembershipId() + ")");
        notificationRepository.save(n);

        return mapperUtil.toPaymentDTO(payment);
    }

    public PaymentDTO updatePayment(Integer id, PaymentDTO dto) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setMethod(dto.getMethod());
        payment.setStatus(dto.getStatus());

        paymentRepository.save(payment);
        return mapperUtil.toPaymentDTO(payment);
    }

    public void deletePayment(Integer id) {
        if (!paymentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payment not found");
        }
        paymentRepository.deleteById(id);
    }
}
// src/main/java/com/system/gym/management/repository/PaymentRepository.java
package com.system.gym.management.repository;

import com.system.gym.management.entity.Payment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // TODAY TOTAL
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentDate = :date")
    Optional<Double> sumPaymentsByDate(@Param("date") LocalDate date);

    // RECENT PAYMENTS (native query)
    // src/main/java/com/system/gym/management/repository/PaymentRepository.java
    @Query(value = """
    SELECT 
        p.payment_id,
        u.first_name || ' ' || COALESCE(u.last_name, '') AS user_name,
        p.amount,
        p.method,
        p.payment_date,
        p.status
    FROM payments p
    JOIN users u ON p.user_id = u.user_id
    ORDER BY p.payment_date DESC, p.payment_id DESC
    """, nativeQuery = true)
    List<Object[]> findRecentPayments(Pageable pageable);
}
package com.system.gym.management.repository;

import com.system.gym.management.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MembershipRepository extends JpaRepository<Membership, Integer> {

    @Query("SELECT COUNT(m) FROM Membership m WHERE m.startDate = CURRENT_DATE")
    Long countMembershipsToday();

}

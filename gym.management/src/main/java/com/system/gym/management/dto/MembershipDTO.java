package com.system.gym.management.dto;

import lombok.Data;
import java.sql.Date;

@Data
public class MembershipDTO {
    private Integer membershipId;
    private Integer userId;
    private Integer trainerId;     // NEW
    private String planType;
    private Date startDate;
    private Date endDate;
    private String status;
    private Integer gymId;
}

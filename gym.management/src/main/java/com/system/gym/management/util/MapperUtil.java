// src/main/java/com/system/gym/management/util/MapperUtil.java
package com.system.gym.management.util;

import com.system.gym.management.dto.*;
import com.system.gym.management.entity.*;
import com.system.gym.management.entity.Class;
import org.mapstruct.*;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Mapper(componentModel = "spring", imports = {LocalDate.class, DateTimeFormatter.class})
public interface MapperUtil {

    // ------------------------------------------------------------------------
    // STRING to DATE (for hireDate, classDate)
    // ------------------------------------------------------------------------
    @Named("stringToDate")
    default Date stringToDate(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(value);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format: " + value, e);
        }
    }

    // ------------------------------------------------------------------------
    // DATE to STRING
    // ------------------------------------------------------------------------
    @Named("dateToString")
    default String dateToString(Date date) {
        if (date == null) return null;
        return new SimpleDateFormat("yyyy-MM-dd").format(date);
    }

    // ------------------------------------------------------------------------
    // STRING to LocalDate (for joinDate)
    // ------------------------------------------------------------------------
    @Named("stringToLocalDate")
    default LocalDate stringToLocalDate(String value) {
        if (value == null || value.isBlank()) return null;
        return LocalDate.parse(value, DateTimeFormatter.ISO_LOCAL_DATE);
    }

    // ------------------------------------------------------------------------
    // LocalDate to STRING
    // ------------------------------------------------------------------------
    @Named("localDateToString")
    default String localDateToString(LocalDate date) {
        if (date == null) return null;
        return date.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    // ------------------------------------------------------------------------
    // STRING to TIMESTAMP (startTime, endTime)
    // ------------------------------------------------------------------------
    @Named("stringToTimestamp")
    default Timestamp stringToTimestamp(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            String pattern = value.length() <= 5 ? "HH:mm" : "HH:mm:ss";
            java.util.Date utilDate = new SimpleDateFormat(pattern).parse(value);
            return new Timestamp(utilDate.getTime());
        } catch (Exception e) {
            throw new RuntimeException("Invalid time format: " + value, e);
        }
    }

    // ------------------------------------------------------------------------
    // TIMESTAMP to STRING (HH:mm)
    // ------------------------------------------------------------------------
    @Named("timestampToString")
    default String timestampToString(Timestamp ts) {
        if (ts == null) return null;
        return new SimpleDateFormat("HH:mm").format(ts);
    }

    // ------------------------------------------------------------------------
    // USER → DTO
    // ------------------------------------------------------------------------
    @Mapping(target = "roleId", source = "role.roleId")
    @Mapping(target = "roleName", source = "role.roleName")
    @Mapping(target = "gymId", source = "gym.gymId")
    @Mapping(target = "gymName", source = "gym.name")
    @Mapping(target = "joinDate", source = "joinDate", qualifiedByName = "localDateToString")
    UserDTO toUserDTO(User user);

    // ------------------------------------------------------------------------
    // DTO → USER
    // ------------------------------------------------------------------------
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "gym", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "joinDate", source = "joinDate", qualifiedByName = "stringToLocalDate")
    User toUser(UserDTO dto);

    // ------------------------------------------------------------------------
    // GYM
    // ------------------------------------------------------------------------
    @Mapping(target = "ownerId", source = "owner.userId")
    GymDTO toGymDTO(Gym gym);

    @Mapping(target = "owner", ignore = true)
    Gym toGym(GymDTO dto);

    // ------------------------------------------------------------------------
    // MEMBERSHIP
    // ------------------------------------------------------------------------
    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "gymId", source = "gym.gymId")
    MembershipDTO toMembershipDTO(Membership membership);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "gym", ignore = true)
    Membership toMembership(MembershipDTO dto);

    // ------------------------------------------------------------------------
    // TRAINER
    // ------------------------------------------------------------------------
    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "hireDate", source = "hireDate", qualifiedByName = "dateToString")
    TrainerDTO toTrainerDTO(Trainer trainer);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "hireDate", source = "hireDate", qualifiedByName = "stringToDate")
    Trainer toTrainer(TrainerDTO dto);

    // ------------------------------------------------------------------------
    // CLASS
    // ------------------------------------------------------------------------
    @Mapping(target = "trainerId", source = "trainer.trainerId")
    @Mapping(target = "gymId", source = "gym.gymId")
    @Mapping(target = "classDate", source = "classDate", qualifiedByName = "dateToString")
    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "timestampToString")
    @Mapping(target = "endTime", source = "endTime", qualifiedByName = "timestampToString")
    ClassDTO toClassDTO(Class classEntity);


    @Mapping(target = "trainer", ignore = true)
    @Mapping(target = "gym", ignore = true)
    @Mapping(target = "classDate", source = "classDate", qualifiedByName = "stringToDate")
    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "stringToTimestamp")
    @Mapping(target = "endTime", source = "endTime", qualifiedByName = "stringToTimestamp")
    Class toClass(ClassDTO dto);

    // ------------------------------------------------------------------------
    // PAYMENT
    // ------------------------------------------------------------------------
    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "membershipId", source = "membership.membershipId")
//    PaymentDTO toPaymentDTO(Payment payment);

    // MapperUtil.java
    @Mapping(target = "userName",
            expression = "java(payment.getUser() != null ? payment.getUser().getFirstName() + \" \" + payment.getUser().getLastName() : null)")
    PaymentDTO toPaymentDTO(Payment payment);


    @Mapping(target = "user", ignore = true)
    @Mapping(target = "membership", ignore = true)
    Payment toPayment(PaymentDTO dto);

    // ------------------------------------------------------------------------
    // PAYMENT SUMMARY (Dashboard)
    // ------------------------------------------------------------------------
    @Mapping(target = "userName",
            expression = "java(payment.getUser() != null ? payment.getUser().getFirstName() + \" \" + payment.getUser().getLastName() : \"Unknown\")")
    @Mapping(target = "paymentDate", dateFormat = "yyyy-MM-dd")
    PaymentSummaryDTO toPaymentSummaryDTO(Payment payment);

    // ------------------------------------------------------------------------
    // CLASS SUMMARY (Dashboard)
    // ------------------------------------------------------------------------
    @Mapping(target = "trainerName",
            expression = "java(classEntity.getTrainer() != null && classEntity.getTrainer().getUser() != null ? classEntity.getTrainer().getUser().getFirstName() + \" \" + classEntity.getTrainer().getUser().getLastName() : \"—\")")
    @Mapping(target = "classDate", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "startTime", source = "startTime", qualifiedByName = "timestampToString")
    ClassSummaryDTO toClassSummaryDTO(Class classEntity);

    // ------------------------------------------------------------------------
    // PAYROLL
    // ------------------------------------------------------------------------
    @Mapping(target = "trainerId", source = "trainer.trainerId")
    PayrollDTO toPayrollDTO(TrainerPayroll payroll);

    @Mapping(target = "trainer", ignore = true)
    TrainerPayroll toTrainerPayroll(PayrollDTO dto);
}
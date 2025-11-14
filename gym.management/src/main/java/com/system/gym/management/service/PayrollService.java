package com.system.gym.management.service;

import com.system.gym.management.dto.PayrollDTO;
import com.system.gym.management.entity.Class;
import com.system.gym.management.entity.Trainer;
import com.system.gym.management.entity.TrainerPayroll;
import com.system.gym.management.exception.ResourceNotFoundException;
import com.system.gym.management.repository.ClassRepository;
import com.system.gym.management.repository.TrainerPayrollRepository;
import com.system.gym.management.repository.TrainerRepository;
import com.system.gym.management.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class PayrollService {

    @Autowired
    private TrainerPayrollRepository payrollRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private MapperUtil mapperUtil;

    public List<PayrollDTO> getAllPayrolls() {
        return payrollRepository.findAll().stream()
                .map(mapperUtil::toPayrollDTO)
                .collect(Collectors.toList());
    }

    public PayrollDTO getPayrollById(Integer id) {
        TrainerPayroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));
        return mapperUtil.toPayrollDTO(payroll);
    }

    public PayrollDTO createPayroll(PayrollDTO dto) {
        TrainerPayroll payroll = mapperUtil.toTrainerPayroll(dto);

        Trainer trainer = trainerRepository.findById(dto.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        payroll.setTrainer(trainer);
        payroll.setTotalPay(dto.getTotalHours() * trainer.getHourlyRate());
        payroll = payrollRepository.save(payroll);

        return mapperUtil.toPayrollDTO(payroll);
    }

    public PayrollDTO updatePayroll(Integer id, PayrollDTO dto) {
        TrainerPayroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found"));

        payroll.setMonthYear(dto.getMonthYear());
        payroll.setTotalHours(dto.getTotalHours());
        payroll.setTotalPay(dto.getTotalPay());
        payroll.setPaidStatus(dto.getPaidStatus());

        payroll = payrollRepository.save(payroll);
        return mapperUtil.toPayrollDTO(payroll);
    }

    public void deletePayroll(Integer id) {
        payrollRepository.deleteById(id);
    }

    // 🔥 NEW — Auto calculate total hours from classes
    public double calculateMonthlyHours(Integer trainerId, String monthYear) {
        // monthYear format: 2025-11
        String[] parts = monthYear.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        List<Class> classes = classRepository.findTrainerClassesInMonth(trainerId, year, month);

        double total = 0;
        for (Class c : classes) {
            long diffMs = c.getEndTime().getTime() - c.getStartTime().getTime();
            total += diffMs / (1000.0 * 60 * 60);    // convert ms → hours
        }

        return total;
    }

}

package com.system.gym.management.service;

import com.system.gym.management.dto.PayrollDTO;
import com.system.gym.management.entity.Trainer;
import com.system.gym.management.entity.TrainerPayroll;
import com.system.gym.management.exception.ResourceNotFoundException;
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
}
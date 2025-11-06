package com.system.gym.management.service;

import com.system.gym.management.dto.RoleDTO;
import com.system.gym.management.entity.Role;
import com.system.gym.management.exception.ResourceNotFoundException;
import com.system.gym.management.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role create(RoleDTO dto) {
        Role r = new Role();
        r.setRoleName(dto.getRoleName());
        r.setPermissions(dto.getPermissions());
        return roleRepository.save(r);
    }

    public Role findById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
    }

    public Role update(Integer id, RoleDTO dto) {
        Role r = findById(id);
        r.setRoleName(dto.getRoleName());
        r.setPermissions(dto.getPermissions());
        return roleRepository.save(r);
    }

    public void delete(Integer id) {
        roleRepository.deleteById(id);
    }
}

package com.system.gym.management.controller;

import com.system.gym.management.dto.RoleDTO;
import com.system.gym.management.entity.Role;
import com.system.gym.management.repository.RoleRepository;
import com.system.gym.management.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:5173")
public class RoleController {

    @Autowired
    private RoleService roleService;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public ResponseEntity<List<Role>> all() {
        return ResponseEntity.ok(roleService.findAll());
    }

    @PostMapping
    public ResponseEntity<Role> create(@RequestBody RoleDTO dto) {
        return ResponseEntity.ok(roleService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> get(@PathVariable Integer id) {
        return ResponseEntity.ok(roleService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> update(@PathVariable Integer id, @RequestBody RoleDTO dto) {
        return ResponseEntity.ok(roleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        roleService.delete(id);
        return ResponseEntity.ok().build();
    }
}

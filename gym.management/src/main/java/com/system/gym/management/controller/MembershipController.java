// src/main/java/com/system/gym/management/controller/MembershipController.java
package com.system.gym.management.controller;

import com.system.gym.management.dto.MembershipDTO;
import com.system.gym.management.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping
    public ResponseEntity<MembershipDTO> create(@RequestBody MembershipDTO request) {
        MembershipDTO created = membershipService.create(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<MembershipDTO>> getAll() {
        return ResponseEntity.ok(membershipService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(membershipService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipDTO> update(@PathVariable Integer id, @RequestBody MembershipDTO request) {
        return ResponseEntity.ok(membershipService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        membershipService.delete(id);
        return ResponseEntity.ok().build();
    }
}
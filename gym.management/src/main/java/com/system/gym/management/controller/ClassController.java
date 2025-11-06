package com.system.gym.management.controller;

import com.system.gym.management.dto.ClassDTO;
import com.system.gym.management.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @PostMapping
    public ResponseEntity<ClassDTO> create(@RequestBody ClassDTO dto) {
        return ResponseEntity.ok(classService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<ClassDTO>> getAll() {
        return ResponseEntity.ok(classService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(classService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassDTO> update(@PathVariable Integer id, @RequestBody ClassDTO dto) {
        return ResponseEntity.ok(classService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        classService.delete(id);
        return ResponseEntity.ok().build();
    }
}

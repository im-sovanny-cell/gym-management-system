// src/main/java/com/system/gym/management/repository/ClassRepository.java
package com.system.gym.management.repository;

import com.system.gym.management.entity.Class;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<Class, Integer> {

    @Query("SELECT c FROM Class c WHERE c.classDate >= CURRENT_DATE ORDER BY c.classDate, c.startTime")
    List<Class> findUpcomingClasses(Pageable pageable);
}
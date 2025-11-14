//// src/main/java/com/system/gym/management/repository/ClassRepository.java
//package com.system.gym.management.repository;
//
//import com.system.gym.management.entity.Class;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface ClassRepository extends JpaRepository<Class, Integer> {
//
//    @Query("SELECT c FROM Class c WHERE c.classDate >= CURRENT_DATE ORDER BY c.classDate, c.startTime")
//    List<Class> findUpcomingClasses(Pageable pageable);
//}

package com.system.gym.management.repository;

import com.system.gym.management.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<Class, Integer> {

    @Query("SELECT c FROM Class c WHERE c.classDate >= CURRENT_DATE ORDER BY c.classDate, c.startTime")
    List<Class> findUpcomingClasses(org.springframework.data.domain.Pageable pageable);

    // 🔥 NEW — For Auto Payroll Hours
    @Query("""
SELECT c FROM Class c
WHERE c.trainer.trainerId = :trainerId
AND EXTRACT(YEAR FROM c.classDate) = :year
AND EXTRACT(MONTH FROM c.classDate) = :month
""")
    List<Class> findTrainerClassesInMonth(
            @Param("trainerId") Integer trainerId,
            @Param("year") int year,
            @Param("month") int month);


}

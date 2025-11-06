package com.system.gym.management.service;

import com.system.gym.management.entity.Attendance;
import com.system.gym.management.entity.User;
import com.system.gym.management.repository.AttendanceRepository;
import com.system.gym.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final TelegramService telegram;

    private final String CHAT_ID = "-1003278994755";

    private String d(OffsetDateTime dt){ return dt.toLocalDate().toString(); }
    private String t(OffsetDateTime dt){ return dt.toLocalTime().toString().substring(0,5); }

    public String scan(Integer userId){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Attendance last = attendanceRepository.findTopByUserIdOrderByIdDesc(userId);

        String fullName = user.getFirstName()+" "+user.getLastName();

        // ================= CHECK-IN ====================
        if(last == null || last.getCheckOut() != null){

            Attendance a = Attendance.builder()
                    .userId(userId)
                    .checkIn(OffsetDateTime.now())
                    .build();

            attendanceRepository.save(a);

            last = a; // <<< IMPORTANT FIX ✅

            String msg = """
                    ------------------------------------------------
                    ✅ CHECK-IN ATTENDANCE
                    ------------------------------------------------
                    📍 Attendance ID : %d
                    🔑 User ID   : %d
                    👤 Username  : %s
                    📆 IN Date   : %s
                    ⏱️ IN Time   : %s
                    ------------------------------------------------
                    """.formatted(
                    a.getId(),
                    user.getUserId(),
                    fullName,
                    d(a.getCheckIn()),
                    t(a.getCheckIn())
            );

            telegram.queueNotification(msg, CHAT_ID, null);
            return msg;
        }


        // ================= CHECK-OUT ====================
        last.setCheckOut(OffsetDateTime.now());
        attendanceRepository.save(last);

        Duration diff  = Duration.between(last.getCheckIn(), last.getCheckOut());
        long h = diff.toHours();
        long m = diff.toMinutesPart();
//⏱️ IN Date   : %s | %s
        String msg = """
                ------------------------------------------------
                ❌ CHECK-OUT ATTENDANCE
                ------------------------------------------------
                📍 Attendance ID : %d
                🔑 User ID   : %d
                👤 Username  : %s
                📆 OUT Date  : %s
                ⏱️ OUT Time  : %s
                🎯 Duration  : %2dh:%02dm
                ------------------------------------------------
                """.formatted(
                last.getId(),
                user.getUserId(),
                fullName,
//                d(last.getCheckIn()),
//                t(last.getCheckIn()),
                d(last.getCheckOut()),
                t(last.getCheckOut()),
                h, m
        );

        telegram.queueNotification(msg, CHAT_ID, null);
        return msg;
    }
}

// test_slots_logic.js
// Simulação da lógica de slots para verificação rápida

function calculateSlots(availability, appointments, date) {
    console.log(`\n--- Testando Data: ${date} ---`);
    const slots = [];

    // 1. Availability Processing
    availability.forEach(block => {
        let currentHour = parseInt(block.start_time.split(':')[0]);
        let currentMinute = parseInt(block.start_time.split(':')[1]);

        const endHour = parseInt(block.end_time.split(':')[0]);
        const endMinute = parseInt(block.end_time.split(':')[1]);

        let currentTimeInMinutes = currentHour * 60 + currentMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;
        const sessionDuration = 60; // 1 hour

        while (currentTimeInMinutes + sessionDuration <= endTimeInMinutes) {
            const h = Math.floor(currentTimeInMinutes / 60);
            const m = currentTimeInMinutes % 60;
            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

            // Check conflicts
            const slotStart = new Date(`${date}T${timeString}:00`);
            const slotEnd = new Date(slotStart.getTime() + sessionDuration * 60000); // +1 hour

            const isBlocked = appointments.some(apt => {
                const aptStart = new Date(apt.start_time);
                const aptEnd = new Date(apt.end_time);
                // Overlap: (StartA < EndB) && (EndA > StartB)
                const overlap = (slotStart < aptEnd && slotEnd > aptStart);
                if (overlap) {
                    console.log(`   [Conflito] Slot ${timeString}-${slotEnd.toTimeString().slice(0, 5)} colide com Agendamento ${apt.start_time.slice(11, 16)}-${apt.end_time.slice(11, 16)}`);
                }
                return overlap;
            });

            if (!isBlocked) {
                slots.push(timeString);
            }
            // Increment 30 mins
            currentTimeInMinutes += 30;
        }
    });

    return slots;
}

// Mock Data
const date = "2024-03-20";
const availability = [
    { start_time: "09:00:00", end_time: "12:00:00" }, // 09:00, 09:30, 10:00, 10:30, 11:00 (ends 12:00)
    { start_time: "14:00:00", end_time: "18:00:00" }
];

const appointments = [
    { start_time: "2024-03-20T09:00:00", end_time: "2024-03-20T10:00:00" }, // Blocks 09:00 and 09:30 (starts 09:30, ends 10:30, overlap) 
    // Wait, 09:30 ends 10:30. 10:30 > 09:00. 09:30 < 10:00. YES.
    // Block 08:30? (08:30-09:30). 08:30 < 10:00. 09:30 > 09:00. YES.
    { start_time: "2024-03-20T15:30:00", end_time: "2024-03-20T16:30:00" }
];

const result = calculateSlots(availability, appointments, date);
console.log("Slots Disponíveis:", result);

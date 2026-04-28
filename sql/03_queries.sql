-- 1. Вывести все номера с типами
SELECT r.id, r.room_number, r.floor, r.status, rt.name AS room_type, rt.price_per_night
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id;

-- 2. Вывести все бронирования
SELECT b.id, g.first_name || ' ' || g.last_name AS guest, r.room_number,
       b.check_in_date, b.check_out_date, b.status, b.total_price
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id;

-- 3. Посчитать выручку
SELECT SUM(amount) AS total_revenue
FROM payments
WHERE status = 'paid';

-- 4. Количество бронирований по типам номеров
SELECT rt.name, COUNT(b.id) AS bookings_count
FROM room_types rt
JOIN rooms r ON r.room_type_id = rt.id
LEFT JOIN bookings b ON b.room_id = r.id
GROUP BY rt.name;

-- 5. Свободные номера
SELECT r.room_number, r.floor, rt.name AS room_type, rt.price_per_night
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.status = 'available';

-- 6. Услуги по бронированиям
SELECT b.id AS booking_id, s.name AS service_name, bs.quantity, s.price,
       (bs.quantity * s.price) AS service_total
FROM booking_services bs
JOIN bookings b ON bs.booking_id = b.id
JOIN services s ON bs.service_id = s.id;

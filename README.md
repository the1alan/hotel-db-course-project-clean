# Система управления гостиницей

## 1. Цель проекта
Учебный курсовой проект демонстрирует проектирование и использование базы данных для гостиницы, а также простой веб-интерфейс для просмотра и добавления данных.

## 2. Предметная область
Гостиница: учет номеров, гостей, сотрудников, бронирований, услуг и платежей.

## 3. Используемые технологии
- PostgreSQL 15
- Docker Compose
- Node.js
- Express
- pg
- HTML/CSS/JavaScript

## 4. Структура проекта
```
hotel-db-course-project/
  docker-compose.yml
  Dockerfile
  package.json
  server.js
  README.md
  sql/
    01_create_tables.sql
    02_insert_data.sql
    03_queries.sql
  public/
    index.html
    style.css
    script.js
```

## 5. Описание таблиц
- `room_types` — типы номеров.
- `rooms` — номера гостиницы.
- `guests` — гости.
- `employees` — сотрудники.
- `bookings` — бронирования.
- `services` — дополнительные услуги.
- `booking_services` — связь бронирований с услугами.
- `payments` — платежи.

## 6. Связи между таблицами
- `rooms.room_type_id -> room_types.id`
- `bookings.guest_id -> guests.id`
- `bookings.room_id -> rooms.id`
- `bookings.employee_id -> employees.id`
- `booking_services.booking_id -> bookings.id`
- `booking_services.service_id -> services.id`
- `payments.booking_id -> bookings.id`

## 7. Инструкция запуска
```bash
docker compose up --build
```

## 8. Адрес веб-интерфейса
- http://localhost:8080

## 9. Примеры SQL-запросов
Готовые запросы находятся в файле `sql/03_queries.sql`:
- все номера с типами;
- все бронирования;
- общая выручка;
- бронирования по типам номеров;
- свободные номера;
- услуги по бронированиям.

## 10. Что можно показать на защите
- ER-логику и связи таблиц.
- Автоматическую инициализацию БД SQL-скриптами.
- Работу API (`/api/health`, `/api/rooms`, `/api/bookings`, `/api/stats/revenue`).
- Работу веб-интерфейса (таблицы, статистика, формы добавления данных).

## Параметры PostgreSQL
- host: `localhost`
- port: `5434`
- database: `hotel_db`
- user: `hotel_user`
- password: `1111`

## После запуска должны работать
- http://localhost:8080
- http://localhost:8080/api/health
- http://localhost:8080/api/rooms
- http://localhost:8080/api/bookings
- http://localhost:8080/api/stats/revenue

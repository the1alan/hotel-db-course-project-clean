const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5434,
  database: process.env.DB_NAME || 'hotel_db',
  user: process.env.DB_USER || 'hotel_user',
  password: process.env.DB_PASSWORD || '1111'
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Hotel database app is running' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.room_number, r.floor, r.status, rt.name AS room_type, rt.price_per_night
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      ORDER BY r.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/guests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM guests ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, g.first_name || ' ' || g.last_name AS guest, r.room_number,
             b.check_in_date, b.check_out_date, b.status, b.total_price
      FROM bookings b
      JOIN guests g ON b.guest_id = g.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/revenue', async (req, res) => {
  try {
    const result = await pool.query("SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM payments WHERE status = 'paid'");
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/occupancy', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_rooms,
        COUNT(*) FILTER (WHERE status = 'available') AS available_rooms,
        COUNT(*) FILTER (WHERE status = 'occupied') AS occupied_rooms,
        COUNT(*) FILTER (WHERE status = 'maintenance') AS maintenance_rooms
      FROM rooms
    `);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/bookings-by-room-type', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rt.name, COUNT(b.id) AS bookings_count
      FROM room_types rt
      JOIN rooms r ON r.room_type_id = rt.id
      LEFT JOIN bookings b ON b.room_id = r.id
      GROUP BY rt.name
      ORDER BY rt.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { guest_id, room_id, employee_id, check_in_date, check_out_date, status, total_price } = req.body;
    const result = await pool.query(
      `INSERT INTO bookings (guest_id, room_id, employee_id, check_in_date, check_out_date, status, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [guest_id, room_id, employee_id, check_in_date, check_out_date, status || 'created', total_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/guests', async (req, res) => {
  try {
    const { first_name, last_name, phone, email, passport_number } = req.body;
    const result = await pool.query(
      `INSERT INTO guests (first_name, last_name, phone, email, passport_number)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [first_name, last_name, phone, email, passport_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

function fillTable(tableId, rowsHtml) {
  document.querySelector(`#${tableId} tbody`).innerHTML = rowsHtml;
}

async function loadData() {
  const [rooms, guests, bookings, services, payments, revenue, occupancy] = await Promise.all([
    getJson('/api/rooms'),
    getJson('/api/guests'),
    getJson('/api/bookings'),
    getJson('/api/services'),
    getJson('/api/payments'),
    getJson('/api/stats/revenue'),
    getJson('/api/stats/occupancy')
  ]);

  document.getElementById('totalRevenue').textContent = revenue.total_revenue;
  document.getElementById('totalRooms').textContent = occupancy.total_rooms;
  document.getElementById('availableRooms').textContent = occupancy.available_rooms;
  document.getElementById('occupiedRooms').textContent = occupancy.occupied_rooms;
  document.getElementById('maintenanceRooms').textContent = occupancy.maintenance_rooms;

  fillTable('roomsTable', rooms.map(r => `<tr><td>${r.room_number}</td><td>${r.floor}</td><td>${r.status}</td><td>${r.room_type}</td><td>${r.price_per_night}</td></tr>`).join(''));
  fillTable('guestsTable', guests.map(g => `<tr><td>${g.first_name} ${g.last_name}</td><td>${g.phone}</td><td>${g.email || ''}</td><td>${g.passport_number}</td></tr>`).join(''));
  fillTable('bookingsTable', bookings.map(b => `<tr><td>${b.guest}</td><td>${b.room_number}</td><td>${b.check_in_date?.slice(0,10)}</td><td>${b.check_out_date?.slice(0,10)}</td><td>${b.status}</td><td>${b.total_price}</td></tr>`).join(''));
  fillTable('servicesTable', services.map(s => `<tr><td>${s.name}</td><td>${s.description || ''}</td><td>${s.price}</td></tr>`).join(''));
  fillTable('paymentsTable', payments.map(p => `<tr><td>${p.booking_id}</td><td>${p.amount}</td><td>${p.payment_method}</td><td>${p.payment_date?.slice(0,10)}</td><td>${p.status}</td></tr>`).join(''));
}

document.getElementById('guestForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  await fetch('/api/guests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  e.target.reset();
  loadData();
});

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const raw = Object.fromEntries(new FormData(e.target));
  const formData = {
    ...raw,
    guest_id: Number(raw.guest_id),
    room_id: Number(raw.room_id),
    employee_id: Number(raw.employee_id),
    total_price: Number(raw.total_price)
  };
  await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  e.target.reset();
  loadData();
});

loadData();

import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// ใช้งาน middleware
app.use(bodyParser.json());
app.use(cors());

// ตั้งค่าการเชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pizza007pizza_',
  database: 'leave_management'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// เพิ่มข้อมูลขอลาหยุด
app.post('/api/leave-requests', (req, res) => {
  const { full_name, department_position, email, phone, leave_type, leave_reason, leave_start, leave_end } = req.body;

  const leaveDate = new Date(leave_start);
  const currentDate = new Date();
  const daysBeforeLeave = Math.ceil((leaveDate - currentDate) / (1000 * 60 * 60 * 24));
  const leaveDuration = Math.ceil((new Date(leave_end) - new Date(leave_start)) / (1000 * 60 * 60 * 24)) + 1;

  // ตรวจสอบเงื่อนไข
  if (leave_type === 'พักร้อน' && daysBeforeLeave < 3) {
    return res.status(400).json({ message: 'พักร้อนต้องขอลาล่วงหน้าอย่างน้อย 3 วัน' });
  }
  if (leave_type === 'พักร้อน' && leaveDuration > 2) {
    return res.status(400).json({ message: 'พักร้อนลาติดต่อกันได้ไม่เกิน 2 วัน' });
  }
  if (new Date(leave_start) < currentDate) {
    return res.status(400).json({ message: 'ไม่สามารถบันทึกวันลาย้อนหลังได้' });
  }

  db.query(
    'INSERT INTO leave_requests (full_name, department_position, email, phone, leave_type, leave_reason, leave_start, leave_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [full_name, department_position, email, phone, leave_type, leave_reason, leave_start, leave_end],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: 'เพิ่มข้อมูลการลาสำเร็จ' });
    }
  );
});

// ดึงข้อมูลขอลาหยุด
app.get('/api/leave-requests', (req, res) => {
  db.query('SELECT * FROM leave_requests ORDER BY record_timestamp DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// ลบข้อมูลขอลาหยุด
app.delete('/api/leave-requests/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM leave_requests WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  });
});

// ปรับสถานะการพิจารณา
app.patch('/api/leave-requests/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query('UPDATE leave_requests SET status = ? WHERE id = ?', [status, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'ปรับสถานะสำเร็จ' });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

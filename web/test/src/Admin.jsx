import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // ค้นหาตามชื่อ - นามสกุล และวันที่ขอลา

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leave-requests');
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const updateLeaveStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/leave-requests/${id}`, { status: newStatus });
      alert('ปรับสถานะสำเร็จ');
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  // ฟังก์ชันกรองคำขอลาหยุดตามคำค้นหาที่พิมพ์ (ชื่อ - นามสกุล หรือ วันที่ขอลา)
  const filteredRequests = leaveRequests.filter((request) => {
    const query = searchQuery.toLowerCase();
    const matchesName = request.full_name.toLowerCase().includes(query);
    const matchesDate = request.leave_start.includes(query);
    return matchesName || matchesDate;
  });

  return (
    <div>
      <h2>รายการขอลาหยุด</h2>

      {/* ช่องค้นหาตามชื่อ - นามสกุล หรือ วันที่ขอลา */}
      <div>
        <label>ค้นหาตามชื่อ - นามสกุล หรือ วันที่ขอลา (yyyy-mm-dd): </label>
        <input
          type="text"
          placeholder="กรอกชื่อ - นามสกุล หรือ วันที่ขอลา"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ul>
        {filteredRequests.map((request) => (
          <li key={request.id}>
            ชื่อ: {request.full_name} - ประเภทการลา: {request.leave_type} - 
            วันที่ขอลา: {request.leave_start} - สถานะ: {request.status}
            <button onClick={() => updateLeaveStatus(request.id, 'รอพิจารณา')}>ตั้งเป็น รอพิจารณา</button>
            <button onClick={() => updateLeaveStatus(request.id, 'อนุมัติ')}>ตั้งเป็น อนุมัติ</button>
            <button onClick={() => updateLeaveStatus(request.id, 'ไม่อนุมัติ')}>ตั้งเป็น ไม่อนุมัติ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;

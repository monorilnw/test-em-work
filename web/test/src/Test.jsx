import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Test() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({
    full_name: '',
    department_position: '',
    email: '',
    phone: '',
    leave_type: 'อื่นๆ',
    other_reason: '',  // เพิ่มช่องสำหรับ "อื่นๆ"
    leave_reason: '',
    leave_start: '',
    leave_end: ''
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    const response = await axios.get('http://localhost:5000/api/leave-requests');
    setLeaveRequests(response.data);
  };

  const handleInputChange = (e) => {
    setNewLeave({ ...newLeave, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบกรณีที่เลือก "อื่นๆ" แล้วไม่กรอกข้อมูลเพิ่มเติม
    if (newLeave.leave_type === 'อื่นๆ' && !newLeave.other_reason) {
      alert('กรุณาระบุรายละเอียดการลาเพิ่มเติมในช่อง "อื่นๆ"');
      return;
    }

    try {
      // เตรียมข้อมูลการลา หากเลือก "อื่นๆ" ให้ใช้ other_reason
      const leaveData = {
        ...newLeave,
        leave_reason: newLeave.leave_type === 'อื่นๆ' ? newLeave.other_reason : newLeave.leave_reason
      };

      await axios.post('http://localhost:5000/api/leave-requests', leaveData);
      fetchLeaveRequests();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('ยืนยันการลบข้อมูลใช่หรือไม่?')) {
      await axios.delete(`http://localhost:5000/api/leave-requests/${id}`);
      fetchLeaveRequests();
    }
  };

  return (
    <div>
      <h1>ระบบบันทึกการขอลาหยุด</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <label >ชื่อ - นามสกุล</label>
        <input name="full_name" placeholder="ชื่อ - นามสกุล" onChange={handleInputChange} required />
        </div>
        <div>
        <label >สังกัด/ตำแหน่ง</label>
        <input name="department_position" placeholder="สังกัด/ตำแหน่ง" onChange={handleInputChange}  />
        </div>
        <div>
        <label >อีเมล</label>
        <input name="email" placeholder="อีเมล" onChange={handleInputChange}  />
        </div>
        <div>
        <label >เบอร์โทรศัพท์</label>
        <input name="phone" placeholder="เบอร์โทรศัพท์" onChange={handleInputChange} required />
        </div>
        <div>
        <label >ประเภทการลา</label>
        <select name="leave_type" onChange={handleInputChange} required>
          <option value="ลาป่วย">ลาป่วย</option>
          <option value="ลากิจ">ลากิจ</option>
          <option value="พักร้อน">พักร้อน</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
        
        
        {/* แสดงช่อง input เพิ่มเมื่อเลือก "อื่นๆ" */}
        {newLeave.leave_type === 'อื่นๆ' && (
          <input
            name="other_reason"
            placeholder="โปรดระบุรายละเอียดการลา"
            onChange={handleInputChange}
            required
          />
        )}
        </div>
        <div>
        <label >สาเหตุการลา</label>
        <textarea name="leave_reason" placeholder="สาเหตุการลา" onChange={handleInputChange} required />
        </div>
        <div>
        <label >เวลาเริ่ม</label>
        <input type="date" name="leave_start" onChange={handleInputChange} required />
        </div>
        <div>
        <label >เวลาสิ้นสุด</label>
        <input type="date" name="leave_end" onChange={handleInputChange} required />
        </div>
        <div>
        <button type="submit">บันทึก</button>
        </div>
      </form>

      <h2>รายการขอลาหยุด</h2>
      <ul>
        {leaveRequests.map(request => (
          <li key={request.id}>
            {request.full_name} - {request.leave_type} - สถานะ: {request.status}
            <button onClick={() => handleDelete(request.id)}>ลบ</button>
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default Test;

const express = require('express');
const app = express.Router();
const connection = require('../mysql');



// api เริ่ม ต้นที่ /course

//  list แสดงรายการหลักสูตรทั้งหมด
app.get('/list', (req, res) => {
  connection.query('SELECT * FROM course', (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


//ค้นหาหลักสูตรด้วยรหัสหลักสูตร
app.get('/search/:id', (req, res) => {
  const courseId = req.params.id;
  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }
  connection.query('SELECT * FROM course WHERE course_id = ?', [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(results[0]);
  });
});

//แสดงหลักสูตรเฉพาะหลักสูตรที่ต้องการประชาสัมพันธ์เป็นพิเศษ
app.get('/promote', (req, res) => {
  connection.query('SELECT * FROM course WHERE promote = 1', (err, results) => {
    if (err) {
      console.error('Error fetching promoted courses:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


//เพิ่มข้อมูลหลักสูตรใหม่
app.post('/create', (req, res) => {
  const course = req.body;
  if (!course.course_id || !course.title || !course.description) {
    return res.status(400).json({ 
      result: 0,

    });
  }
  
  connection.query('INSERT INTO course SET ?', course, (err, result) => {
    if (err) {
      console.error('Error creating course:', err);
      return res.status(500).json({ 
        result: 0,
        message: 'Database error: ' + err.message
      });
    }
    
    res.status(201).json({ 
      result: 1,
      message: 'Course created successfully',
      insertId: result.insertId
    });
  });
});

// ปรับปรุงข้อมูลหลักสูตร
app.put('/update', (req, res) => {
  const course = req.body;
  
  if (!course.course_id) {
    return res.status(400).json({ result: 0 });
  }
  
  connection.query('UPDATE course SET ? WHERE course_id = ?', [course, course.course_id], (err, result) => {
    if (err) {
      return res.status(500).json({ result: 0 });
    }
    
    res.status(200).json({ result: 1 });
  });
});

// ลบข้อมูลหลักสูตรที่ระบุ
app.delete('/delete', (req, res) => {
  const courseId = req.body.course_id;
  
  if (!courseId) {
    return res.status(400).json({ result: 0 });
  }
  
  connection.query('DELETE FROM course WHERE course_id = ?', [courseId], (err, result) => {
    if (err) {
      return res.status(500).json({ result: 0 });
    }
    
    res.status(200).json({ result: 1 });
  });
});


module.exports = app;
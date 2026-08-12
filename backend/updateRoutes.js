const fs = require('fs');
const path = require('path');
const routesDir = path.join('d:', 'school', 'backend', 'routes');
const files = ['studentRoutes.js', 'facultyRoutes.js', 'examRoutes.js', 'feeRoutes.js', 'attendanceRoutes.js', 'salaryRoutes.js', 'timetableRoutes.js'];

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update GET routes (find without args)
  content = content.replace(/await (\w+)\.find\(\)/g, 'await $1.find({ schoolId: req.user.schoolId })');
  
  // Update GET routes (find with existing args) - we might need to handle this manually if complex
  
  // Update POST routes (req.body)
  content = content.replace(/new (\w+)\(req\.body\)/g, 'new $1({ ...req.body, schoolId: req.user.schoolId })');
  
  // For findByIdAndUpdate, it uses req.params.id and req.body
  content = content.replace(/findByIdAndUpdate\(req\.params\.id, req\.body/g, 'findOneAndUpdate({ _id: req.params.id, schoolId: req.user.schoolId }, req.body');

  // For findByIdAndDelete
  content = content.replace(/findByIdAndDelete\(req\.params\.id\)/g, 'findOneAndDelete({ _id: req.params.id, schoolId: req.user.schoolId })');

  fs.writeFileSync(filePath, content);
  console.log('Updated', file);
});

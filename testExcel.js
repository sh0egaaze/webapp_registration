// testExcel.js
const ExcelJS = require('exceljs');
const path = require('path');

async function testWrite() {
  const filePath = path.join(__dirname, 'test.xlsx');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('TestSheet');

  worksheet.columns = [
    { header: 'Test Column', key: 'test', width: 20 }
  ];

  worksheet.addRow({ test: 'Hello World' });

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log('Test file saved successfully.');
  } catch (error) {
    console.error('Error saving test file:', error);
  }
}

testWrite();
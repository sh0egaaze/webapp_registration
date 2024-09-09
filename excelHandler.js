const ExcelJS = require('exceljs');
const path = require('path');

async function writeDataToExcel(name, username) {
  const filePath = path.join(__dirname, 'data.xlsx');
  const workbook = new ExcelJS.Workbook();
  let worksheet;

  try {
    // Попытка открыть существующий файл
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet('Sheet1');
  } catch (error) {
    // Если файл не существует, создаем новый
    worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = [
      { header: 'Имя', key: 'name', width: 30 },
      { header: 'Имя пользователя', key: 'username', width: 30 },
      { header: 'Очки', key: 'points', width: 10 }
    ];
  }

  let userExists = false;
  let rowNumberToUpdate = null;
  let rowNumberLast = null;

  // Проверяем, существует ли уже имя пользователя
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (row.getCell(2).value === username) {
      userExists = true;
      rowNumberToUpdate = rowNumber; // Запоминаем номер строки для обновления
    }
    rowNumberLast = rowNumber + 1;
  });

  if (userExists) {
    // Обновляем существующую строку
    const rowToUpdate = worksheet.getRow(rowNumberToUpdate);
    rowToUpdate.getCell(1).value = name;
    rowToUpdate.commit(); // Обновляем строку
  } else {
    // Добавляем новую строку
    const rowLast = worksheet.getRow(rowNumberLast);
    rowLast.getCell(1).value = name;
    rowLast.getCell(2).value = username;
    rowLast.getCell(3).value = 100;
    rowLast.commit();
  }

  try {
    // Перемещаем вызов записи файла перед return
    console.log('Saving file:', filePath);
    await workbook.xlsx.writeFile(filePath);
    console.log('File saved successfully.');
  } catch (error) {
    console.error('Error saving file:', error.message);
    throw error;
  }

  // Возвращаем сообщение только после успешного сохранения
  if (userExists) {
    return `Данные успешно обновлены!`;
  } else {
    return `Успешная регистрация! Получено 100 поинтов!`;
  }
}

module.exports = { writeDataToExcel };
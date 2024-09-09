const express = require('express');
const path = require('path');
const { writeDataToExcel } = require('./excelHandler');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/register', async (req, res) => {
  const { name, username } = req.body;

  if (!name || !username) {
    return res.status(400).send('Имя и короткое имя telegram обязательны.');
  }

  try {
    const result = await writeDataToExcel(name, username); // Возвращаем сообщение о результате операции
    res.send(result); // Отправляем сообщение обратно пользователю
  } catch (error) {
    res.status(500).send('Произошла ошибка при записи данных.');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
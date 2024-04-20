const express = require("express");
const cors = require("cors");
const pool = require("./database.js");

const app = express();


app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
    const { fullname, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE fullname = $1", [fullname]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Неверное имя пользователя или пароль" });
        }

        if (password !== user.rows[0].password) {
            return res.status(400).json({ message: "Неверное имя пользователя или пароль" });
        }

        // Если вход успешен, отправляем данные пользователя
        res.json(user.rows[0]);
    } catch (error) {
        console.error("Ошибка при входе:", error.message);
        res.status(500).json({ message: "Произошла ошибка при входе" });
    }
});

app.post("/register", async (req, res) => {
    const { fullname, birth, phone, depart, password } = req.body;
    const rating = req.body.rating || 0;
    const ondeck = req.body.ondeck || false;

    try {
        // Добавляем нового пользователя
        const newUser = await pool.query("INSERT INTO users (fullname, birth, phone, depart, rating, password, ondeck) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [fullname, birth, phone, depart, rating, password, ondeck]);

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error("Ошибка при регистрации:", error.message);
        res.status(500).json({ message: "Произошла ошибка при регистрации" });
    }
});

// Функция для обновления пользователя
const updateUser = async (username, ondeck) => {
    try {
        // Обновляем состояние ondeck пользователя в базе данных
        await pool.query("UPDATE users SET ondeck = $1 WHERE fullname = $2", [ondeck, username]);
        return { success: true, message: "Состояние пользователя успешно обновлено" };
    } catch (error) {
        console.error("Ошибка при обновлении состояния пользователя:", error.message);
        throw new Error("Произошла ошибка при обновлении состояния пользователя");
    }
};

// Маршрут для обновления пользователя
app.post("/updateUser", async (req, res) => {
    const { username, ondeck } = req.body;

    try {
        const result = await updateUser(username, ondeck);
        res.status(200).json(result);
    } catch (error) {
        console.error("Ошибка при обновлении пользователя:", error.message);
        res.status(500).json({ message: "Произошла ошибка при обновлении пользователя" });
    }
});

app.get("/usersOnDeck", async (req, res) => {
    try {
        // Выбираем всех пользователей, у которых столбец ondeck равен true
        const users = await pool.query("SELECT * FROM users WHERE ondeck = true");
        console.log("Пользователи на доске:", users.rows); // Добавим логирование для отслеживания полученных данных
        res.json(users.rows);
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error.message);
        res.status(500).json({ message: "Произошла ошибка при получении пользователей" });
    }
});

app.post("/addRating", async (req, res) => {
    const { fullname } = req.body;

    try {
        // Получаем текущий рейтинг пользователя из базы данных
        const user = await pool.query("SELECT rating FROM users WHERE fullname = $1", [fullname]);

        // Проверяем, есть ли пользователь с таким именем
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Получаем текущий рейтинг
        const currentRating = user.rows[0].rating;

        // Обновляем рейтинг пользователя
        await pool.query("UPDATE users SET rating = $1 WHERE fullname = $2", [currentRating + 1, fullname]);

        res.status(200).json({ message: "Рейтинг успешно добавлен" });
    } catch (error) {
        console.error("Ошибка при добавлении рейтинга:", error.message);
        res.status(500).json({ message: "Произошла ошибка при добавлении рейтинга" });
    }
});

app.post("/removeRating", async (req, res) => {
    const { fullname } = req.body;

    try {
        // Получаем текущий рейтинг пользователя из базы данных
        const user = await pool.query("SELECT rating FROM users WHERE fullname = $1", [fullname]);

        // Проверяем, есть ли пользователь с таким именем
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Получаем текущий рейтинг
        const currentRating = user.rows[0].rating;

        // Обновляем рейтинг пользователя
        await pool.query("UPDATE users SET rating = $1 WHERE fullname = $2", [currentRating - 1, fullname]);

        res.status(200).json({ message: "Рейтинг успешно удален" });
    } catch (error) {
        console.error("Ошибка при удалении рейтинга:", error.message);
        res.status(500).json({ message: "Произошла ошибка при удалении рейтинга" });
    }
});

app.listen(4000, () => console.log("Сервер запущен на localhost:4000"));
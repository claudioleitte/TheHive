import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs-extra";

const app = express();
const PORT = 3000;
const DB_FILE = "./db.json";

app.use(cors());
app.use(bodyParser.json());

async function loadDB() {
    return await fs.readJSON(DB_FILE);
}

async function saveDB(data) {
    await fs.writeJSON(DB_FILE, data, { spaces: 2 });
}

app.post("/like", async (req, res) => {
    const { from, to } = req.body;
    const db = await loadDB();

    db.likes.push({ from, to });
    const mutual = db.likes.some(like => like.from === to && like.to === from);

    if (mutual) {
        db.matches.push({ users: [from, to], date: new Date() });
    }

    await saveDB(db);

    res.json({
        success: true,
        match: mutual ? true : false
    });
});

app.post("/dislike", async (req, res) => {
    const { from, to } = req.body;
    const db = await loadDB();

    db.likes = db.likes.filter(like => !(like.from === from && like.to === to));

    await saveDB(db);

    res.json({ success: true });
});

app.get("/matches/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const db = await loadDB();

    const userMatches = db.matches.filter(m => m.users.includes(userId));

    res.json(userMatches);
});

app.listen(PORT, () => {
    console.log("Servidor rodando: http://localhost:" + PORT);
});

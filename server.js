const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./'));

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: './assets/',
    filename: (req, file, cb) => {
        cb(null, 'project-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const DB_PATH = './projects.json';

// Get all projects
app.get('/api/projects', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    res.json(data);
});

// Upload multiple projects
app.post('/api/upload', upload.array('images'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const projects = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const newAdded = [];

    req.files.forEach(file => {
        const newProject = {
            id: Date.now() + Math.random(), // Unique ID
            image: 'assets/' + file.filename
        };
        projects.push(newProject);
        newAdded.push(newProject);
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 4));

    res.json({ success: true, count: newAdded.length });
});

// Delete a project
app.delete('/api/projects/:id', (req, res) => {
    const id = Number(req.params.id);
    let projects = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    
    projects = projects.filter(p => Number(p.id) !== id);
    fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 4));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`[SYSTEM ONLINE]: Server running at http://localhost:${PORT}`);
    console.log(`[ADMIN ACCESS]: http://localhost:${PORT}/admin.html`);
});

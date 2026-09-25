const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const readData = () => {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, '[]', 'utf-8');
    }
    const jsonData = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(jsonData || '[]');
};

const writeData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

app.post('/items', (req, res) => {
    const items = readData();
    const newItem = {
        id: Date.now(),
        name: req.body.name,
        price: req.body.price
    };
    items.push(newItem);
    writeData(items);
    res.status(201).json({ message: 'Item created successfully!', data: newItem });
});

app.get('/items', (req, res) => {
    const items = readData();
    res.status(200).json(items);
});

app.get('/items/:id', (req, res) => {
    const items = readData();
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
});

app.put('/items/:id', (req, res) => {
    const items = readData();
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });
    
    items[itemIndex] = { ...items[itemIndex], name: req.body.name, price: req.body.price };
    writeData(items);
    res.status(200).json({ message: 'Item updated successfully!', data: items[itemIndex] });
});

app.delete('/items/:id', (req, res) => {
    const items = readData();
    const filteredItems = items.filter(i => i.id !== parseInt(req.params.id));
    if (items.length === filteredItems.length) return res.status(404).json({ message: 'Item not found' });
    
    writeData(filteredItems);
    res.status(200).json({ message: 'Item deleted successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

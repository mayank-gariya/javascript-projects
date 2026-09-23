const express = require("express");
const multer = require("multer");
const QRCode = require("qrcode");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


["uploads", "generated"].forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/generated", express.static("generated"));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + path.extname(file.originalname);
        cb(null, unique);
    }
});

const upload = multer({ storage });

// ---------- Text QR ----------

app.post("/api/text", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        const qrName = `qr-${Date.now()}.png`;
        const qrPath = path.join("generated", qrName);

        await QRCode.toFile(qrPath, text, {
            width: 500,
            margin: 2
        });

        res.json({
            success: true,
            qr: `/generated/${qrName}`
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


app.post("/api/file", upload.single("file"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File required"
            });
        }

        const fileUrl =
            `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const qrName = `qr-${Date.now()}.png`;
        const qrPath = path.join("generated", qrName);

        await QRCode.toFile(qrPath, fileUrl, {
            width: 500,
            margin: 2
        });

        res.json({
            success: true,
            qr: `/generated/${qrName}`,
            file: fileUrl
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// ---------- Home ----------

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- Start ----------

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
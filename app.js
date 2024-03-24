const express = require('express');
const app = express();
const cors = require('cors')
const conn = require('./config/db');

app.use(express.json());
app.use(cors())

function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    const codeLength = 6;

    for (let i = 0; i < codeLength; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
}

app.post('/login', function (req, res) {
    const { username, password } = req.body;

    // Cari pengguna berdasarkan username
    const queryDb = `SELECT * FROM user WHERE username = ?`;
    conn.query(queryDb, [username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'An error occurred during login'
            });
        }

        // Jika pengguna dengan username yang diberikan tidak ditemukan
        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect username or password'
            });
        }

        const user = result[0];

        // Verifikasi password
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect username or password'
            });
        }

        // Jika kredensial benar, beri respons berhasil ke frontend
        res.status(200).json({
            success: true,
            message: 'Successfully',
            user: {
                id: user.id,
                username: user.username
                // Tambahkan properti pengguna lainnya jika diperlukan
            }
        });
    });
});

app.get('/get-user', function (req, res) {
    const queryDb = `SELECT * FROM user`;

    conn.query(queryDb, (err, result) => {
        if (err) {
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "result": null
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": "Successfully",
                "result": result
            });
        }
    });
});

app.get('/get-user-by-id/', function (req, res) {
    const param = req.query
    const id = param.id

    const queryDb = `select * from user where id = ?`
    const value = [id]

    conn.query(queryDb, value, (err, result) => {
        if (err) {
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "result": null
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": "Successfully",
                "result": result
            });
        }
    })
})

app.post('/register-user', function (req, res) {
    const param = req.body;
    const username = param.username;
    const password = param.password;
    const now = new Date();

    const queryDb = `INSERT INTO user (username, password, cts) VALUES (?, ?, ?)`;
    const values = [username, password, now];

    conn.query(queryDb, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": 'Successfully'
            });
        }
    });
});

app.put('/update-user', function (req, res) {
    const param = req.body
    const id = param.id
    const username = param.username
    const password = param.password
    const now = new Date();

    const queryDb = `update user set username = ?, password = ?, uts = ? where id = ?`
    const values = [username, password, now, id]

    conn.query(queryDb, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": 'Successfully'
            });
        }
    })
})

app.delete('/delete-user', function (req, res) {
    const param = req.body
    const id = param.id

    const queryDb = `delete from user where id = ?`
    const value = [id]

    conn.query(queryDb, value, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": 'Successfully'
            });
        }
    })
})

app.get('/get-streetlight-pole', function (req, res) {
    const queryDb = `SELECT * FROM streetlight_pole`;

    conn.query(queryDb, (err, result) => {
        if (err) {
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "result": null
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": "Successfully",
                "result": result
            });
        }
    });
});

app.get('/get-streetlight-pole-by-id/', function (req, res) {
    const param = req.query
    const id = param.id

    const queryDb = `select * from streetlight_pole where id = ?`
    const value = [id]

    conn.query(queryDb, value, (err, result) => {
        if (err) {
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage,
                "result": null
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": "Successfully",
                "result": result
            });
        }
    })
})

app.post('/add-streetlight-pole', function (req, res) {
    const param = req.body;
    const code = generateRandomCode()
    const name = param.name;
    const location = param.location;
    const link_location = param.link_location
    const lat = param.lat
    const lon = param.lon
    const now = new Date();

    const queryDb = `insert into streetlight_pole (code, name, location, link_location, lat, lon, cts) values (?, ?, ?, ?, ?, ?, ?)`;
    const values = [code, name, location, link_location, lat, lon, now];

    conn.query(queryDb, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": 'Successfully'
            });
        }
    });
});

app.put('/update-streetlight-pole', function (req, res) {
    const param = req.body
    const id = param.id
    const name = param.name;
    const location = param.location;
    const link_location = param.link_location
    const lat = param.lat
    const lon = param.lon
    const now = new Date();

    const queryDb = `update streetlight_pole set name = ?, location = ?, link_location = ?, lat = ?, lon = ?, uts = ? where id = ?`
    const values = [name, location, link_location, lat, lon, now, id]

    conn.query(queryDb, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": 'Successfully'
            });
        }
    })
})

app.delete('/delete-streetlight-pole', function (req, res) {
    const param = req.body
    const id = param.id

    const queryDb = `delete from streetlight_pole where id = ?`
    const value = [id]

    conn.query(queryDb, value, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message": err.sqlMessage
            });
        } else {
            res.status(200).json({
                "success": true,
                "message": 'Successfully'
            });
        }
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

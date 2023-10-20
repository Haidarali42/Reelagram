
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const PORT = 5000;


app.use(bodyParser.json());

//Configuration
const config = {
  user: 'TEST_USER',
  password: 'TEST_PASSWORD1234',
  server: 'LAPTOP-2OQ12E51',
  database: 'tiktok',
  port: 1433,
  encrypt: true,
  trustServerCertificate: true
};

//Connection
async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}
app.use(express.json());
app.use(cors());

//Post request for registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, userId, password, mobileNumber } = req.body;
    await sql.connect(config);
    const result = await sql.query`INSERT INTO register (email, userId, password, mobileNumber) VALUES (${email}, ${userId}, ${password}, ${mobileNumber})`;
    console.log('Data Inserted Successfully:', result.recordset);
    res.json({ message: 'Data Inserted Successfully' });
  } catch (err) {
    console.error('Error occurred while inserting data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    sql.close();
  }
});

//Post request for Login checking
app.post('/api/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    await sql.connect(config);

    const result = await sql.query`
      SELECT * FROM register WHERE userId = ${userId} AND password = ${password}`;
    // {
    //   userId: sql.NVarChar,
    //   password: sql.NVarChar
    // };

    if (result.recordset.length > 0) {
      console.log('Data fetched Successfully:', result.recordset);
      res.json({ message: 'Logged in successfully', data: result.recordset, success: true });
    } else {
      console.log('No matching records found');
      res.status(200).json({ message: 'Invalid login credentials', data: null, success: false });
      // 404 => page not found sathi aste
    }
  } catch (err) {
    console.error('Error occurred while fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    sql.close();
  }
});

//Post request for comment
app.post('/api/comment', async (req, res) => {
  try {
    const { userId, videoId, comment } = req.body;
    await sql.connect(config);
    const result = await sql.query`INSERT INTO comment (userId, videoId, comment) VALUES (${userId}, ${videoId}, ${comment})`;
    console.log('Comment Posted Successfully:', result.recordset);
    res.json({ message: 'Data Inserted Successfully' });
  } catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    sql.close();
  }
});

//Get Comment are donhi endpoint same kase chaltil ektr method name vegl pahije nahi tr endpoint name
app.get('/api/comment', async (req, res) => {
  try {
    
    const payload = req.query;
    // return;
    console.log('Payload from comment in DAO',payload);
    await sql.connect(config);
    const rows =  await sql.query`
    SELECT * FROM comment`;
    console.log(rows.recordsets);
    if(rows)
    {
      res.json({comments:rows.recordsets});
    }
  }catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//Like 
app.post('/api/like', async (req, res) => {
  try {
    const { userId, videoId, likes } = req.body;
    await sql.connect(config);
    const result = await sql.query`INSERT INTO likes (userId, videoId, likes) VALUES (${userId}, ${videoId}, ${likes})`;
    console.log('like Posted Successfully:', result.recordset);
    res.json({ message: 'like Inserted Successfully' });
  } catch (error) {
    console.error('Error occurred while inserting like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    sql.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDatabase();
});

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import log from '@ajar/marker';
import path from 'path';
import { fileURLToPath } from 'url';
import board_router from './modules/board/board.router.js';
import {connect_db} from './db/mongoose.connection.mjs'
import board_model from './modules/board/board.model.js';

mongoose.set('strictQuery', false);

const { PORT, HOST, DB_URI } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// SSR
app.set('views', './public/views');
app.set('view engine', 'ejs');

// parse incoming request bodies as JSON
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
// set public folder as root to static files
app.use(express.static(__dirname + '/public'));

// API
app.use('/api/boards', board_router);

// Views
app.get('/', (req, res) => {
  board_model.find({}, (_, boards) => {
    res.render('boards',{boards: boards} )
  })
});
app.get('/board/:boardId', async (req, res) => {
  // const boardId = req.params.boardId;
  // board_model.findById(boardId, (_, board) => {
  //   res.render('board',{board: board} )
  // });
  res.sendFile(path.join(__dirname, 'public', 'views', 'board.html'));
});

// start the express api server
(async ()=> {
  await connect_db(DB_URI);  
  await app.listen(PORT,HOST);
  log.magenta(`api is live on`,` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);  
})().catch(console.log);
import board_model from './board.model.js';
import express from 'express';
import { generateUID } from '../../public/utils/index.js';

const router = express.Router();

router.use(express.json());

/* -----------  Board API  ----------- */

// Create a new board
router.post('/' ,async (req, res) => {
  const update = {...req.body, createdAt: new Date()}
  try {
    const board = await board_model.create(update);
    res.status(200).json(board);
  } catch(err) {
    res.status(500).json(err)
  }
});

// Get All Boards
router.get('/', async (req, res) => {
  try {
    const boards = await board_model.find({}, {notes: 0});
    res.status(200).json(boards)
  } catch(err) {
    res.status(500).json(err)
  }
});

// Get Specific Board
router.get('/:boardId', async (req, res) => {
  try {
    const board = await board_model.findById(req.params.boardId);
    res.status(200).json(board)
  } catch(err) {
    res.status(500).json(err)
  }
})

// Update exist board
router.patch('/:id', async (req, res) => {
  const id = {_id: req.params.id};
  const {name} = req.body;
  try {
    const boardToEdit = await board_model.findOneAndUpdate(id, {name}, {new: true});
    if (!boardToEdit) return res.status(404).send('Board not found')
    res.status(200).json(boardToEdit);
  } catch(err) {
    res.status(500).json(err)
  }
});

// Remove board
router.delete('/:id', async (req, res) => {
  const id = {_id: req.params.id};
  try {
    const boardToDelete = await board_model.findByIdAndDelete(id);
    if (!boardToDelete) return res.status(404).send('Board not found')
    res.status(200).json(boardToDelete);
  } catch(err) {
    res.status(500).json(err)
  }
});

/* -----------  Note API  ----------- */

// Update Board with new Note
// TODO: change route "/:boardId/notes" and use POST
router.put('/:boardId', async (req, res) => {
  const update = {content: '', color: '#fffacd', createdAt: new Date(), _id: generateUID() };
  try {
    const board = await board_model.findById(req.params.boardId);
    const note = update;
    board.notes.push(note);
    board.save();

    res.status(200).json(note);
  } catch(err) {
    res.status(500).json(err);
  }
})

// Update a board's note
// TODO: change route "/:boardId/notes/:noteId"
router.patch('/:boardId/notes/:noteId', async (req, res) => {
  const boardIdObj = {_id: req.params.boardId };
  const noteId = req.params.noteId;
  const update = req.body;

  try {
    const boardToEdit = await board_model.findById(boardIdObj);
    if (!boardToEdit) return res.status(404).send('Board not found');
    
    const note = boardToEdit?.notes.find(({_id}) => _id === noteId);
    if (!note) return res.status(404).send('Note not found');
    
    Object.assign(note, update);
    boardToEdit.save();

    res.status(200).json(note);
  } catch(err) {
    res.status(500).json(err);
  }
});

// Delete note and Update Board
// TODO: change route "/:boardId/notes/:noteId"
router.delete('/:boardId/:noteId', async (req, res) => {
  const boardIdObj = {_id: req.params.boardId };
  const noteId = req.params.noteId;

  try {
    const boardToEdit = await board_model.findById(boardIdObj);
    if (!boardToEdit) return res.status(404).send('Board not found');
    
    const notes = boardToEdit?.notes.filter(({_id}) => _id !== noteId);
    boardToEdit.notes = notes;

    boardToEdit.save();

    res.status(200).json(boardToEdit);
  } catch(err) {
    res.status(500).json(err);
  }
});

export default router;
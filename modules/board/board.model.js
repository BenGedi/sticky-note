import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import {NoteSchema} from '../note/note.model.js';
// how to create a custom type of array schema in mongoose

const BoardSchema = new Schema({
    name      : {
      type: String,
      required: true,
    },
    createdAt : {
      type: Date,
      required: true,
    },
    notes: {
      type: [ {type: NoteSchema} ],
      default: []
    }
});
  
export default model('board',BoardSchema);
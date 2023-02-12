import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// how to define a spacific string pattern for a property schema type
export const NoteSchema = new Schema({
    _id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#fffacd',
    },
    position: {
      type: {x: String, y: String}
    },
    createdAt : {
      type: Date,
      required: true,
      default: new Date()
    },
});
  
export default model('note',NoteSchema);
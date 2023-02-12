import { getBoard, addNote, removeNote, updateNote } from "../../api/index.js";

class Board extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    // init borad's variables
    this._boardId = window.location.pathname.split('/').at(-2);
    // render board
    this._render.call(this);
    // init dynamic data elements variables
    this._addNoteBtn =  this.shadowRoot.getElementById('headerBtn');
    this._headerTitle = this.shadowRoot.getElementById('headerTitle');

    this._addNote = this._addNote.bind(this);
    this._removeNote = this._removeNote.bind(this);
    this._updateNote = this._updateNote.bind(this);
    this._createAndAppendNote = this._createAndAppendNote.bind(this);
  }

  async connectedCallback() {
    const board = await getBoard(this._boardId);

    this._headerTitle.textContent = board.name;
    const notes = board?.notes || [];

    notes.forEach(({_id: id, color, content, position}) => {
      this._createAndAppendNote({id, color, content, position});
    });

    this._addNoteBtn.addEventListener('click', this._addNote);
    this.addEventListener('removenote', this._removeNote);
    this.addEventListener('updatenote', this._updateNote);
  }

  disconnectedCallback() {
    this._addNoteBtn.removeEventListener('click', this._addNote);
    this.removeEventListener('removenote', this._removeNote);
    this.removeEventListener('updatenote', this._updateNote);
  }

  async _addNote() {
    const {_id: id, color, content} = await addNote(this._boardId);
    this._createAndAppendNote({ id, color, content });
  }

  async _updateNote(event) {
    const {noteId, noteData} = event.detail;
    await updateNote(this._boardId, noteId, noteData);
  }

  async _removeNote(event) {
    const {noteElm} = event.detail;
    await removeNote(this._boardId, noteElm.id);

    noteElm.remove();
  }

  _createAndAppendNote(note) {
    const notesContainer = this.shadowRoot.getElementById('notes');
    const noteElm = document.createElement('wc-note');
    const noteData  = {...note};
    // if position is undeifined remove position property
    !noteData.position && delete noteData.position;

    Object.assign(noteElm, noteData);
    notesContainer.appendChild(noteElm);
  }

  _render() {
    this.shadowRoot.innerHTML = /* html */`
      <style>@import "../../components/board/style.css";</style>
      <header>
        <h1 id="headerTitle">Board</h1>
        <button title="Add new note" id="headerBtn">🗒️</button>
      </header>
      <div class="notes" id="notes"/>
    `
  }
}

window.customElements.define('wc-board', Board);
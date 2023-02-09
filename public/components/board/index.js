import { getBoard, addNote } from "../../api/index.js";

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
  }

  disconnectedCallback() {
    this._addNoteBtn.removeEventListener('click', this._addNote);
  }

  async _addNote() {
    const {_id: id, color, content} = await addNote(this._boardId);
    this._createAndAppendNote({ id, color, content });
  }

  _createAndAppendNote({_id: id, ...rest}) {
    const notesContainer = this.shadowRoot.getElementById('notes');
    const note = document.createElement('wc-note');
    Object.assign(note, {id, ...rest});
    notesContainer.appendChild(note);
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
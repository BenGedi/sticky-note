import { removeNote, updateNote } from "../../api/index.js";
import { debounce, isLightColor } from "../../utils/index.js";

export class Note extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this._mouseUp =      this._mouseUp.bind(this);
    this._onUpdate =     this._onUpdate.bind(this);
    this._mouseDown =    this._mouseDown.bind(this);
    this._mouseMove =    this._mouseMove.bind(this);
    this._removeNote =   this._removeNote.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);

    // this.color =    this.getAttribute('color');
    // this.content =  this.getAttribute('content');
    // this.boardId =  this.getAttribute('boardId');
    // this.position = this.getAttribute('position')?.split(',');

    this._render();

    this._moveBtn =      this.shadowRoot.getElementById('moveBtn');
    this._removeBtn =    this.shadowRoot.getElementById('removeBtn');
    this._contentElm =   this.shadowRoot.getElementById('content');
    this._noteColorElm = this.shadowRoot.getElementById('noteColor');
  }

  connectedCallback() {
    this._removeBtn.addEventListener('click', this._removeNote);
    this._contentElm.addEventListener('input', debounce(this._onUpdate), 500);
    this._noteColorElm.addEventListener('change', this.onChangeColor);
    this._moveBtn.addEventListener('mousedown', this._mouseDown);
  }

  _mouseDown() {
    document.addEventListener('mousemove', this._mouseMove);
    document.addEventListener('mouseup', this._mouseUp);
    this._moveBtn.style.cursor = 'grabbing';
  }

  _mouseMove(event) {
    const noteContainer = this.parentElement;
    const newPosX = event.movementX;
    const newPosY = event.movementY;
    const top = parseInt(noteContainer.style.top, 10);
    // Top dragging boundery
    noteContainer.style.top = top <= 0 ? '0px' : noteContainer.style.top;

    // set the element's new position:
    noteContainer.style.top = (noteContainer.offsetTop + newPosY) + "px";
    noteContainer.style.left = (noteContainer.offsetLeft + newPosX) + "px";
    noteContainer.style.position = 'absolute';
    noteContainer.style.zIndex = 1;
    noteContainer.style.opacity = .5;
  }
  
  _mouseUp() {
    const noteContainer = this.parentElement;
    noteContainer.style.opacity = 1;
    this._moveBtn.style.cursor = 'grab';
    document.removeEventListener('mousemove', this._mouseMove);
    document.removeEventListener('mouseup', this._mouseUp);
  }

  disconnectedCallback() {
    this._removeBtn.removeEventListener('click', this._removeNote);
    this._contentElm.removeEventListener('input', debounce(this._onUpdate), 500);
    this._noteColorElm.removeEventListener('change', this.onChangeColor);
    this._moveBtn.removeEventListener('mousedown', this._mouseDown);
  }
  // TODO: shot event to board
  async _removeNote(event) {
    await removeNote(this.boardId, this.id);
    this.remove();
  }

  async _onUpdate(){
    await updateNote(this.boardId, this.id, { 
      content: this._contentElm.textContent, 
      color: this.color, 
      position: this.position
    });
  }

  async onChangeColor(event) {
    this.color = event.target.value;
    this._onUpdate();
  }

  set color(value) {
    const fontColor = isLightColor(value) ? '#000' : '#fff';

    this.style.setProperty("--note-bg-color", value);
    this.style.setProperty("--font-color", fontColor);
  }

  _render() {
    this.shadowRoot.innerHTML= /* html */`
      <style>@import "../../components/note/style.css";</style>
      <article id="note" class="note"" >
        <p dir="auto" contenteditable="true" id="content">
          ${this.content}
        </p>
        <footer>
          <button style="cursor: grab;" id="moveBtn">👋🏻</button>
          <input title="Change note color" type="color" id="noteColor" name="color" value="${this.color}">
          <button title="Delete note" id="removeBtn">🗑️</button>
        </footer>
      </article>
    `;
  }

}

window.customElements.define('wc-note', Note);
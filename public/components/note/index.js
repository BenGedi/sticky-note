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
    this._onChangeColor = this._onChangeColor.bind(this);

    this._render();

    this._moveBtn =      this.shadowRoot.getElementById('moveBtn');
    this._removeBtn =    this.shadowRoot.getElementById('removeBtn');
    this._contentElm =   this.shadowRoot.getElementById('content');
    this._noteColorElm = this.shadowRoot.getElementById('noteColor');
  }

  get content() {
    return this?._contentElm?.textContent || '';
  }

  set content(value) {
    this._contentElm.textContent = value;
  }

  get color() {
    const color = this.style.getPropertyValue('--note-bg-color');
    return color;
  }

  set color(value = "#000") {
    const fontColor = isLightColor(value) ? '#000' : '#fff';
    this.style.setProperty("--note-bg-color", value);
    this.style.setProperty("--font-color", fontColor);
    
    this._noteColorElm.value = value;
  }

  get position() {
    console.log('GET Posiotn');
    const {left, top} = this.style;
    if (!(left || top)) return; 

    const x = left;
    const y = top;

    return {x, y};
  }

  set position({x,y}) {
    const posX = parseInt(x, 10);
    const posY = parseInt(y, 10);
    if (isNaN(posX) || isNaN(posY)) return;
    
    console.log('SET Posiotn', {x,y});
    
    this.style.top = y;
    this.style.left = x;
    this.style.position = 'absolute';
  }

  connectedCallback() {
    this._removeBtn.addEventListener('click', this._removeNote);
    this._contentElm.addEventListener('input', debounce(this._onUpdate), 500);
    this._noteColorElm.addEventListener('change', this._onChangeColor);
    this._moveBtn.addEventListener('mousedown', this._mouseDown);
  }

  disconnectedCallback() {
    document.removeEventListener('mousemove', this._mouseMove);
    document.removeEventListener('mouseup', this._mouseUp);
  }

  _mouseDown() {
    document.addEventListener('mousemove', this._mouseMove);
    document.addEventListener('mouseup', this._mouseUp);
    this._moveBtn.style.cursor = 'grabbing';
  }

  _mouseMove(event) {
    const newPosX = event.movementX;
    const newPosY = event.movementY;
    const top = parseInt(this.style.top, 10);
    // Top dragging boundery
    this.style.top = top <= 0 ? '0px' : this.style.top;
    
    const positionX = this.offsetLeft + newPosX;
    const positionY = this.offsetTop + newPosY;

    // set the element's new position:
    this.style.left = (positionX) + "px";
    this.style.top = (positionY) + "px";
    this.style.position = 'absolute';
    this.style.zIndex = 1;
    this.style.opacity = .5;
  }
  
  _mouseUp() {
    this.style.opacity = 1;
    this._moveBtn.style.cursor = 'grab';
    const x = this.style.left;
    const y = this.style.top;
    this.position = {x, y};

    this._onUpdate();
    document.removeEventListener('mousemove', this._mouseMove);
    document.removeEventListener('mouseup', this._mouseUp);
  }

  _removeNote() {
    const removeEvent = new CustomEvent('removenote', {
      detail: {
        noteElm: this
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(removeEvent);
  }

  async _onUpdate() {
    const noteData = { 
      content: this._contentElm.textContent, 
      color: this._noteColorElm.value, 
      position: this.position
    };

    !noteData.position && delete noteData.position;

    const updateEvent = new CustomEvent('updatenote', {
      detail: {
        noteData,
        noteId: this.id
      },
      bubbles: true,
      composed: true
    })

    this.dispatchEvent(updateEvent);
  }

  async _onChangeColor(event) {
    const value = event.target.value;
    this.color = value;
    this._onUpdate();
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
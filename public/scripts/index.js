import { getBoard, addNote, removeNote } from "/api/index.js";

addEventListener('DOMContentLoaded', (event) => {
  const wcBoard = document.querySelector('wc-board');
  const notesContainer = wcBoard.querySelector('#notes');

  const wcBoardState = {
    id: '',
    name: '',
    notes: []
  };

  // async function init() {
    // const boardId = window.location.pathname.split('/').at(-2);
    // wcBoard.getBoard = getBoard;
    // wcBoard.id = boardId;
    // const board = await getBoard(boardId);

    // wcBoardState.id = board._id;
    // wcBoardState.name = board.name;
    // wcBoardState.notes = board.notes;

    // wcBoard.setAttribute('id', wcBoardState.id);
    // wcBoard.setAttribute('name', wcBoardState.name);

    // renderNotes(notesContainer, wcBoardState.notes);
  // }

  wcBoard.addEventListener('removenote', (event) => {
    const boardId = window.location.pathname.split('/').at(-2);
    const { noteId } = event.detail;

    async function removeNoteElement() {
      const board = await removeNote(boardId, noteId);
      wcBoardState.notes = board.notes;

      renderNotes(notesContainer, wcBoardState.notes);
    }
    removeNoteElement();
  });

  // init();
});

function renderNotes (elm, notes) {
  elm.innerHTML = /* html */ `
  ${notes?.map(({_id, color, content, position: {x, y}}) => /* html */`
    <wc-note 
      id="${_id}" 
      content="${content}" 
      color="${color}" 
      position="${JSON.stringify({x,y})}"></wc-note>
  `).join('')}
`;
}

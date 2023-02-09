export async function getBoard(boardId) {
  try {
    const board = await (await fetch(`/api/boards/${boardId}/`)).json();
    return board;
  } catch(err) {
    console.error('Get Board faild!', err.message);
  }
}

export async function addNote (boardId) {
  try {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    };

    const note = await (await fetch(`/api/boards/${boardId}/`, requestOptions)).json();
    return note;
  }catch(err) {
    console.error('Add Note faild!', err.message);
  }
};

export async function removeNote(boardId, noteId) {
  try {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };

    const board = await (await fetch(`/api/boards/${boardId}/${noteId}`, requestOptions)).json();
    return board;
  }catch(err) {
    console.error('Add Note faild!', err.message);
  }
}

export async function updateNote(boardId, noteId, update) {
  try {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    };

    const board = await (await fetch(`/api/boards/${boardId}/notes/${noteId}`, requestOptions)).json();
    return board;
  }catch(err) {
    console.error('Add Note faild!', err.message);
  }
}
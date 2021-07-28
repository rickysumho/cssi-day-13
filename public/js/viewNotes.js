let googleUserId;
let testData;
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html';
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  //Sorting method in works
//   let sortedCards = [];


//   for (const noteItem in data) {
//       const note = data[noteItem];
//       note[key] = noteItem;
//       sortedCards.push(note);
//   }
//   sortedCards.sort((noteA, noteB) => noteA.title > noteB.title ? -1 : 1);

//   for (const noteItem of sortedCards) {
//       cards += createCard(noteItem, noteItem.key)
//   }
  for (const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note, noteItem)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const createCard = (note, noteId) => {
  return `
    <div class="column is-one-quarter">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">${note.title}</p>
        </header>
        <div class="card-content">
          <div class="content">${note.text}</div>
        </div>
        <footer class="card-footer">
            <a href="#" class="card-footer-item" onclick="editNote('${noteId}')">
                Edit
            </a>
            <a href="#" class="card-footer-item" onclick="deleteNote('${noteId}')">
                Delete
            </a>
        </footer>
      </div>
    </div>
  `;
}

const deleteNote = (noteId) => {
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
}

const editNote = (noteId) => {
    const editNoteModal = document.getElementById('editNoteModal');
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const note = data[noteId];
        document.getElementById('editTitleInput').value = note.title;
        document.getElementById('editTextInput').value = note.text;
        document.getElementById('editNoteId').value = noteId;
    });
    editNoteModal.classList.toggle('is-active');
}

const closeEditModal = () => {
    const editNoteModal = document.getElementById('editNoteModal');
    editNoteModal.classList.toggle('is-active');
}

const saveEditedNote = () => {
    const noteTitle = document.getElementById('editTitleInput').value;
    const noteText = document.getElementById('editTextInput').value;
    const noteId = document.getElementById('editNoteId').value;
    const noteEdits = {
        title: noteTitle,
        text: noteText
    }

    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
    closeEditModal();
}
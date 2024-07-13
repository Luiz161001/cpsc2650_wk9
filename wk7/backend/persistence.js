let _notes = [
    { id: "2", text: "CPSC 2650" },
    { id: "1", text: "An awesome web dev Note" },
];

const notes = () => _notes;

const addNote = (id, content) => {
    _notes.push({ id: id, text: content });
}

const removeNote = (id) => {
    let found = _notes.findIndex(note => note.id == id);
    _notes.splice(found, 1);
}

const editNote = (id, content) => {
    let found = _notes.findIndex(note => note.id == id);
    _notes[found].text = content;
    return _notes.findIndex(note => note.id == id);
}

const singleNote = (id) => _notes.filter(note => id === note.id);

export { notes, removeNote, addNote, editNote, singleNote };
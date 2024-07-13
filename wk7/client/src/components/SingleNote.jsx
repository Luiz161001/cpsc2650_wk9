import { Link } from 'react-router-dom';

export default function SingleNote({note, onDelete}) {
    return (
        <li>
            <Link to={`/note/${note.id}`}>{note.text}</Link>
            <button id={note.id} onClick={onDelete} className='btn'>Delete</button>
        </li>    
    )
}
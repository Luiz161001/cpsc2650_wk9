import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SingleNote from '../components/SingleNote';
import { Link } from 'react-router-dom';
import { useQuery, gql, useMutation } from '@apollo/client'


const GetNotes = gql`
    query {
        Notes {
            id
            text
        }
    }
`;

const DeletNote = gql`
    mutation deleteNote($id: ID!){
        deleteNote(id: $id)
    }
`;


export default function Home(){
    const [notes, setNotes] = useState([]);
    const [deleteNote] = useMutation(DeletNote);

    const { loading, error, data } = useQuery(GetNotes, {
        onError:(error) => {
            console.log(`Apollo error: ${JSON.stringify(error, null, 2)}`);
        } 
    });

    // console.log(data);

    useEffect(() => {
        if(data){
            setNotes(data.Notes);
        }
        // fetch("http://localhost:3000/notes")
        //     .then(response => response.json())
        //     .then(data => setNotes(data.Notes))
        //     .catch(error => console.error("Something went wrong: ", error));
    }, [data])

    async function handleDelete(noteId){
        const data = await deleteNote({variables: { id: noteId}});
        alert(data.data.deleteNote);
        location.reload();
        // fetch(`http://localhost:3000/notes/${noteId}`, {method: 'DELETE'})
        //     .then(response => response.json())
        //     .then(data =>{
        //         if(alert(data.res)){
        //             setNotes(notes => notes.filter(note => note.id !== id));
        //         }
        //         location.reload();
        //     })
        //     .catch(error => console.error("Something went wrong: ", error));
    }
    
    return(
        <div className="home">
            <NavBar />
            <h1>YANT</h1>
            <main>
                <ul>
                    {notes.map(note => <SingleNote className="notes" key={note.id} note={note} onDelete={() => handleDelete(note.id)}/>)}
                </ul>

                <Link to='/new-note' className='btn'>Add a new Note</Link>
            </main>
        </div>
    )
}
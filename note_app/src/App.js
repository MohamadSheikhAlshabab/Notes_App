import React from "react"
import Sidebar from "./Components/Sidebar"
import Editor from "./Components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [darkMode , setDarkMode] = React.useState(true)
    function toggleDarkMode(){
        setDarkMode(prevMode => !prevMode)
    }
    
    const [notes, setNotes] = React.useState(
        JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        
        setNotes(oldNotes => {
            const arrNotes = [];
            oldNotes.map((note,index)=>{

                if (note.id === currentNoteId){
                    arrNotes.unshift({...note,body:text})
                } else {
                    arrNotes.push(note)
                }
            })
            return arrNotes
            
    })
        
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))
    }
    
    
    function deleteNote(event,noteId){
        event.stopPropagation()
        setNotes(oldNotes=> oldNotes.filter
        (note =>note.id !==noteId))
    }
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <div>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                // className="split"
                className={darkMode ? "dark33" : "split"}
                // className={"split"?
                // style={{  background: '#fff'}}
                //   :
                //   style={{  background: '#282D35'}}
                // }
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                        darkMode={darkMode}
                    />
                }
            </Split>
            :
            <div className={darkMode ? "dark" : "no-notes"}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            > 
          <div 
                className="toggler" 
            >
                <p className="toggler--light">Light</p>
                <div 
                    className="toggler--slider"
                    onClick={toggleDarkMode}
                >
                    <div className="toggler--slider--circle"></div>
                </div>
                <p className="toggler--dark">Dark</p>
            </div>

                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </div>
    )
}

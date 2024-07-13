import NavBar from '../components/NavBar'

export default function Home(){
    return(
        <div className='about'>
            <NavBar />
            <main>
                <h1>My first React App</h1>
                <p>
                    Hey, my name is Luiz and this is my first project using react!
                </p>
            </main>
        </div>
    )
}
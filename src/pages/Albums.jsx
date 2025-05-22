import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx';
import Album from '../components/Album.jsx';
import { Link } from 'react-router-dom';
import { IoIosAlbums } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Navbar from '../components/Navbar.jsx';
import AddAlbumForm from "../components/AddAlbumForm";
import { useNavigate } from 'react-router-dom';
import '../styles/Albums.css'

export default function Albums() {
    
    const { user, logout } = useAuth();
    const [albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [albumsToDisplay, setAlbumsToDisplay] = useState([])
    const navigate = useNavigate();

    const getAlbums = async () => {
        setIsLoading(true);
        try {
            if (!user) navigate('/login');
            const response = await fetch(`http://localhost:3000/albums?userId=${user.id}`);
            if (!response.ok) {
                throw new Error('Error while fetching albums!');
            } 
            const data = await response.json();
            setAlbums(data);
            setAlbumsToDisplay(data);
            
        } catch (err) {
            alert(err);
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        getAlbums();
    }, [user]);

    const handleAlbumAdded = (newAlbum) => {
        setAlbums((prev) => [...prev, newAlbum]);
        setIsAdding(false);
    };

    const handleDeleteAlbum = async (albumId) => {
        
        await fetch(`http://localhost:3000/albums/${albumId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        setAlbums(albums.filter(alb => alb.id !== albumId));
    };

    useEffect(() => {
        if (searchText !== "") {
            const regex = new RegExp(searchText, "i");
            setAlbumsToDisplay(
                albums.filter(
                    (album) =>
                        regex.test(album.title) ||
                        regex.test(String(album.id)) // convert ID to string if it's a number
                )
            );
        } else {
            setAlbumsToDisplay(albums);
        }
    }, [searchText, albums]);

    const handleCancelClick = () => {
        setIsAdding(false);
    }

    return (
        <>
            <Navbar user={user} onLogout={logout} /> {/* Navbar here */}

            {isLoading ? <p>Loading...</p>
                :isAdding ?  <AddAlbumForm onAlbumAdded={handleAlbumAdded} handleCancelClick={handleCancelClick} />
                : <div>
                    <div className='search-and-add'>
                        <textarea 
                            placeholder='Search...'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        ></textarea>
                        <FaSearch />
                        <button onClick={() => setIsAdding(true)} >Add Album</button>
                    </div>
            
                <ul className='album-grid'>
                {albumsToDisplay.map(({ id, title, urlsForImages }) => (
                    <li key={id} className='album-items'><Link 
                        className='album-link' 
                        to={`/albums/${id}`}>
                        <IoIosAlbums className='icons' />
                        <br />
                        {`${id}: ${title}`}
                    </Link>
                    <br />
                    <button type='button' className='delete-button' onClick={() => handleDeleteAlbum(id)}>Delete</button>
                    </li>
                ))}
                
            </ul>
            </div>}
        </>
    );
}
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/Album.css';

export default function Album() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [albumDetails, setAlbumDetails] = useState({ title: "", urlsForImages: [] });
  const [visibleCount, setVisibleCount] = useState(5);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    const getAlbumDetails = async () => {
      try {
        if (!user) navigate('/login');
        const response = await fetch(`http://localhost:3000/albums?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        console.log("Fetched album:", data[0]);
        setAlbumDetails(data[0]);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    getAlbumDetails();
  }, [id]);

  const handleClick = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleAddImage = async () => {
    const updatedUrls = [...albumDetails.urlsForImages, newUrl];
    const updatedAlbum = { ...albumDetails, urlsForImages: updatedUrls };
  
    await fetch(`http://localhost:3000/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAlbum),
    });
  
    setAlbumDetails(updatedAlbum);
    setNewUrl("");
  };

  const handleDeleteImage = async (indexToDelete) => {
    const updatedUrls = albumDetails.urlsForImages.filter((_, i) => i !== indexToDelete);
    const updatedAlbum = { ...albumDetails, urlsForImages: updatedUrls };
  
    await fetch(`http://localhost:3000/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAlbum),
    });
  
    setAlbumDetails(updatedAlbum);
  };

  const styleBackButton = {
    padding: '8px 16px',
    backgroundColor: 'rgba(65, 126, 239, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'backgroundColor 0.2s ease',
    justifyContent: 'left'
  }

  return (
    <div className="album-container">
      <button type="button" style={styleBackButton} onClick={() => navigate('/albums')}>Back To All Albums</button>
      <h3 className="album-title">{albumDetails.title}</h3>
      <input
        type="text"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        placeholder="Enter image URL"
      />
      <button onClick={handleAddImage}>Add Image</button>
      {albumDetails.urlsForImages && <div className="album-grid">
        {albumDetails.urlsForImages.slice(0, visibleCount).map((url, index) => (
          <div className="grid-item" key={index}>
            <img
              src={url}
              alt={`Album ${albumDetails.title}`}
              className="album-image"
            />
            <button onClick={() => handleDeleteImage(index)}>Delete</button>
            </div>
        ))}
      </div>}
      <button type="button" onClick={handleClick} className="load-more-button"
          disabled={(visibleCount < albumDetails.urlsForImages.length) ? false : true}>
          Load More Pictures
        </button>
      
    </div>
  );
}








/*import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";

export default function AlbumModal() {
    const { albumId } = useParams();
    const [imagesToDisplay, setImagesToDisplay] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [albumDetails, setAlbumDetails] = useState(null);
    const { user } = useAuth();

    const getAlbumDetails = async () => {
        const response = await fetch(`http://localhost:3000/albums?albumId=${albumId}`);
        let data = await response.json();
        if (data) {
            data = data[0];
            setAlbumDetails(data);
        }
    };

    const handleClick = () => {
        nextCount = visibleCount + 3;
        if (albumDetails.urlsForImages.length < nextCount) {
            setImagesToDisplay(albumDetails.urlsForImages)
        } else {
            setImagesToDisplay(albumDetails.urlsForImages.slice(0, nextCount));
            setVisibleCount(prev => prev + 3);
        }
    }

    useEffect(() => {
        getAlbumDetails();
        
    }, []);

    useEffect(() => {
        if (albumDetails) {
            albumDetails.urlsForImages.length >= 5 ? setImagesToDisplay(albumDetails.urlsForImages.slice(0, 5)) : albumDetails.urlsForImages;
            console.log(albumDetails);
        }
    }, [albumDetails]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(imagesToDisplay);
            if (imagesToDisplay) clearInterval(interval);
        }, 1000);
        
        //return () => clearInterval(interval);
    }, [imagesToDisplay, albumDetails]);

    return (
        <div>
            <h3>{albumDetails?.title}</h3>
            {imagesToDisplay?.map((url, index) => (
                <img 
                    key={index}
                    src={url}
                    width='150px'
                    height='auto'
                    alt={albumDetails?.title}
                />
            ))}
            <button type="button" onClick={handleClick}>Load More Pictures</button>
        </div>
        
    );
}

*/
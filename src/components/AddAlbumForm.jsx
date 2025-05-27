import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import '../styles/Album.css'

export default function AddAlbumForm({ onAlbumAdded, handleCancelClick }) {
    const [title, setTitle] = useState("");
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert comma-separated string to array

        const newAlbum = {
            userId: user.id,
            title,
            urlsForImages: [],
        };

        try {
            const response = await fetch("http://localhost:3000/albums", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(newAlbum),
            });

            if (response.ok) {
                const createdAlbum = await response.json();
                onAlbumAdded(createdAlbum);
                setTitle("");
            } else {
                console.error("Failed to add album");
            }
            } catch (err) {
                console.error("Error:", err);
            }
        };

  return (
    <form onSubmit={handleSubmit} className="add-album-form" style={{ marginBottom: "2rem" }}>
      <h3>Add New Album</h3>
      <div>
        <input
          type="text"
          placeholder="Album title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="buttons">
        <button type="submit">Add Album</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </div>
      
    </form>
  );
}

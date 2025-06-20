// src/components/UserContentList.js
import React, { useState, useEffect } from "react";
// IMPORTANT: Updated imports for real-time, update, and delete
import { subscribeToUserContent, updateUserContent, deleteUserContent } from "../firebaseAuthService";

function UserContentList() {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useEffect for the real-time subscription
  useEffect(() => {
    setLoading(true); // Set loading true when starting subscription
    const unsubscribe = subscribeToUserContent((data) => {
      setContentList(data);
      setLoading(false); // Set loading false once data is received
    }, (err) => {
      setError("Failed to load your content in real-time.");
      console.error("Error in real-time content subscription:", err);
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  const handleEdit = async (item) => {
    const newTitle = prompt("Edit title:", item.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      try {
        await updateUserContent(item.id, { title: newTitle.trim(), editedAt: new Date() });
        // The UI will automatically update due to the real-time listener
      } catch (err) {
        alert("Failed to update content: " + err.message);
        console.error("Error updating content:", err);
      }
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteUserContent(itemId);
        // The UI will automatically update due to the real-time listener
      } catch (err) {
        alert("Failed to delete content: " + err.message);
        console.error("Error deleting content:", err);
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading your content...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', marginTop: '20px' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px', textAlign: 'center' }}>Your Saved Content</h3>
      {contentList.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No content saved yet. Try clicking "Save Test Content"!</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {contentList.map((item) => (
            <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '15px', background: 'var(--background-secondary)' }}>
              <h4 style={{ color: 'var(--info)', marginBottom: '5px' }}>{item.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>Type: {item.type}</p>
              <p style={{ color: 'var(--text-color)', fontSize: '0.95em' }}>Description: {item.description}</p>
              <p style={{ fontSize: '0.8em', color: 'var(--text-light)', marginTop: '5px' }}>
                Saved on: {new Date(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleString()}
                {item.editedAt && (
                  <span> (Edited: {new Date(item.editedAt.toDate ? item.editedAt.toDate() : item.editedAt).toLocaleString()})</span>
                )}
              </p>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '6px',
                    background: 'var(--info)', // Use a suitable color, e.g., blue
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '6px',
                    background: 'var(--danger)', // Use a suitable color, e.g., red
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserContentList;
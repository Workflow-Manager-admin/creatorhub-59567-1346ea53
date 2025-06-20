// src/components/UserContentList.js
import React, { useState, useEffect } from "react";
import { fetchUserContent } from "../firebaseAuthService"; // Import our fetching function

function UserContentList() {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await fetchUserContent();
        setContentList(data);
      } catch (err) {
        setError("Failed to load your content.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []); // Empty dependency array to run once on mount

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
              <p style={{ fontSize: '0.8em', color: 'var(--text-light)', marginTop: '5px' }}>Saved on: {new Date(item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserContentList;
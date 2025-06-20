// src/components/ProfileView.js
import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../firebaseAuthService"; // Import profile functions
import Card from "./Card"; // Assuming you have a Card component for styling
import SkeletonLoader from "./SkeletonLoader"; // Assuming you have a SkeletonLoader

function ProfileView({ user }) { // Expects the Firebase user object as a prop
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.uid) {
        setLoading(true);
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
          setDisplayName(userProfile?.name || ""); // Initialize with existing name or empty string
          setError(null);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load profile data.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]); // Re-fetch when user object changes (e.g., after login)

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // You can add more fields here if desired (e.g., bio)
      await updateUserProfile({ name: displayName.trim() });
      // After successful update, re-fetch the profile to ensure UI is in sync
      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);
      setEditMode(false); // Exit edit mode
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
        Please log in to view your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
        <Card title={<SkeletonLoader width={150} />}>
          <SkeletonLoader width="80%" height={20} style={{ marginBottom: '10px' }} />
          <SkeletonLoader width="70%" height={20} />
          <SkeletonLoader width={100} height={40} style={{ marginTop: '20px' }} />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'var(--danger)', textAlign: 'center', marginTop: '50px' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <Card title="Your Profile">
        {!editMode ? (
          <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <strong>Display Name:</strong> {profile?.name || "Not set"}
            </p>
            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
              }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="displayName" style={{ display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>
                Display Name:
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-color)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'var(--success)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: 'bold',
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                    setEditMode(false);
                    setDisplayName(profile?.name || ""); // Reset name if cancelling
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'var(--danger)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default ProfileView;
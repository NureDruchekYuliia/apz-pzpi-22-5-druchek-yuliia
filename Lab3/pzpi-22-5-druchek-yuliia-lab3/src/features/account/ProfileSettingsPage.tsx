import { useState } from 'react';
import { useAccount } from '../../lib/hooks/useAccount';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

export const ProfileSettingsPage = () => {
  const { currentUser, loadingUserInfo, useProfile } = useAccount();
  const { updateProfile } = useProfile();

  const [name, setName] = useState(currentUser?.name ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [imageUrl, setImageUrl] = useState(currentUser?.imageUrl ?? '');
  const [isSubmitting] = useState(false);
  const [error] = useState<string | null>(null);
  const [_loading, setLoading] = useState(false);

  if (loadingUserInfo) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile.mutateAsync({ name, bio, imageUrl });
      alert('Profile updated successfully!');
    } catch {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 600, mx: 'auto', p: 4, mt: 4 }}>
      <Typography variant="h5" mb={3}>
        Edit Profile
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <TextField
          label="Bio"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={isSubmitting}
        />

        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSubmitting}
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Paper>
  );
};



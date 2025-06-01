import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { agent } from '../../lib/api/agent';

interface EditUserDialogProps {
    open: boolean;
    onClose: () => void;
    user: {
        id: string;
        userName: string;
        email: string;
        role: 'admin' | 'user' | string;
    } | null;
    onUserUpdated: () => void;
}

export default function EditUserDialog({
    open,
    onClose,
    user,
    onUserUpdated,
}: EditUserDialogProps) {
    const [id, setId] = useState(user?.id);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'admin' | 'user'>('user');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setId(user.id);
            setUserName(user.userName);
            setEmail(user.email);
            const normalizedRole = user.role?.toLowerCase() === 'admin' ? 'admin' : 'user';
            setRole(normalizedRole);
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await agent.patch(`/account/${user.id}`, {
                id,
                userName,
                email,
            });

            await agent.post('/account/userRole', {
                UserId: user.id,
                RoleName: role.charAt(0).toUpperCase() + role.slice(1),
                UserEmail: email,
            });

            onUserUpdated();
            onClose();
        } catch (error) {
            console.error('Failed to update user', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                            label="Role"
                            name="role"
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

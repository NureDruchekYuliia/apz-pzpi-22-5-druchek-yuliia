import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Avatar, Box, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { useAccount } from '../../lib/hooks/useAccount';
import { Link } from 'react-router-dom';
import { Add, Logout, Person } from '@mui/icons-material';

export default function UserMenu() {
    const { logoutUser } = useAccount();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logoutUser.mutate(undefined, {
            onSuccess: () => {
                handleClose();
            },
            onError: (error) => {
                console.error("Logout failed", error);
            }
        });
    };

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
                size="large"
                sx={{ fontSize: '1.1rem' }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar />
                </Box>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    }
                }}
            >
                <MenuItem component={Link} to="/create-character" onClick={handleClose}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText>Create Activity</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>My profile</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={handleLogout}
                    disabled={logoutUser.isPending}
                >
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}

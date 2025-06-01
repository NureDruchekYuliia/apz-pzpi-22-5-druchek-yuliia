import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  MenuItem,
  LinearProgress,
  Button
} from "@mui/material";
import { NavLink } from "react-router";
import { useStore } from "../../lib/hooks/useStore";
import { Observer } from "mobx-react-lite";
import { useAccount } from "../../lib/hooks/useAccount";

export default function NavBar() {
  const { uiStore } = useStore();
  const { loadingUserInfo, logoutUser, currentUser } = useAccount();

  if (loadingUserInfo) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#2b2b2b' }}>
          <Container maxWidth='xl'>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" color="inherit" noWrap>
                SLEEP MONITOR
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#2b2b2b' }}>
        <Container maxWidth='xl'>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <MenuItem component={NavLink} to='/' sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="h6">SLEEP MONITOR</Typography>
              </MenuItem>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {currentUser ? (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => logoutUser.mutate()}
                  >
                    Вийти
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={NavLink} to="/login">
                    Увійти
                  </Button>
                  <Button color="inherit" component={NavLink} to="/register">
                    Зареєструватися
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>

        <Observer>
          {() =>
            uiStore.isLoading ? (
              <LinearProgress
                color="secondary"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4
                }}
              />
            ) : null
          }
        </Observer>
      </AppBar>
    </Box>
  );
}

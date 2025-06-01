import { Container, CssBaseline } from "@mui/material";
import { useEffect} from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";

function App() {
  const { currentUser, loadingUserInfo } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUserInfo && !currentUser) {
      navigate("/login");
    }
  }, [loadingUserInfo, currentUser, navigate]);

  if (loadingUserInfo) return <div>Loading user...</div>;

  return (
    <>
      <CssBaseline />
      <NavBar />
      <Outlet />
      {currentUser && (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
        </Container>
      )}
    </>
  );
}

export default App;

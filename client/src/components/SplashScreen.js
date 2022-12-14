import { Button, createTheme, Grid, Stack, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { Link, useHistory } from "react-router-dom";
import GlobalStoreContext from "../store";
import logo from "./logo.png";
import AuthContext from '../auth';
import { useContext, useState } from 'react';


export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();
    const isMenuOpen = Boolean(anchorEl);

    function handleRegister() {
        history.push("/register/");
    }

    function handleLogIn() {
        history.push("/login/");
    }

    function handleGuest () {
        handleMenuClose();
        auth.loginGuest();
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div id="splash-screen">
            <img src={logo}></img>
            <h2 id="splash-header">Welcome to Playlister!</h2>
            <p id="splash-text"><em>An application for creating and playing playlists of YouTube music videos. The site will allow users to create, edit, and play playlists as well as share playlists so that others may then play and comment on them. The site will include a built-in YouTube player and will allow users to find others’ playlists via multiple search criteria.</em></p>
            <Grid container>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <Stack direction = "row" spacing={2}>
                            <Button variant="contained"  onClick={handleRegister}>Create Account</Button>
                            <Button variant="contained"  onClick={handleLogIn}>Log In</Button>
                            <Button variant="contained"  onClick={handleGuest}>Continue as Guest</Button>
                    </Stack>
                    <p id="splash-text">Created by Alan Thai</p>
                </Grid>
            </Grid>
        </div>
    )
}
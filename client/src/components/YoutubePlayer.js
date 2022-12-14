import React from 'react';
import YouTube from 'react-youtube';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton } from '@mui/material';
import { useRef, useContext } from 'react';
import { GlobalStoreContext } from '../store';

export default function YouTubePlayerExample() {
    const { store } = useContext(GlobalStoreContext);
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST

    let playlist = [];
    let titles = [];
    let artists = [];
    let currentSong = null;
    if (store.currentList){
        let songs = store.currentList.songs;
        console.log(songs)
        if (songs){
            currentSong = 0;
            titles = [];
            artists = [];
            playlist = [];

            songs.forEach(song => { 
                titles.push(song.title)
                artists.push(song.artist)
                playlist.push(song.youTubeId)
            });
        }
        

    }
    
    // this will allow us to interact with the player without having to interact with event.target
    const videoPlayer = useRef(null);

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    if (store.currentSongIndex){
        currentSong = store.currentSongIndex;
    }
    

    const playerOptions = {
        height: '270',
        width: '450',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        console.log(song)
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
        store.displaySong(currentSong, store.currentList.songs[currentSong])
    }

    function decSong() {
        currentSong--;
        if (currentSong < 0){
            currentSong = playlist.length - 1;
        }
        else{
            currentSong = currentSong % playlist.length;
        }
        store.displaySong(currentSong, store.currentList.songs[currentSong])
        
    }

    function onPlayerReady(event) {
        videoPlayer.current = event.target 
    }

    function handlePrevious(){
        decSong();
        loadAndPlayCurrentSong(videoPlayer.current);
    }

    function handlePause(){
        videoPlayer.current.pauseVideo()
    }

    function handlePlay(){
        videoPlayer.current.playVideo();
    }

    function handleNext(){
        incSong();
        loadAndPlayCurrentSong(videoPlayer.current);
    }


    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
            videoPlayer.current = event.target 
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    let info = ''
    if (store.currentList){
        info = store.currentList.name
    }
    
    let card = 
        <Box>
            <Typography sx={{fontSize: '1.7rem', fontStyle: 'oblique',fontFamily: 'Monospace'}}>
                Playlist: {info}
            </Typography>
            <Typography sx={{fontSize: '1.7rem', fontStyle: 'oblique',fontFamily: 'Monospace'}}>
                Current Song: {titles[store.currentSongIndex]}
            </Typography>
            <Typography sx={{fontSize: '1.7rem', fontStyle: 'oblique',fontFamily: 'Monospace'}}>
                Artist: {artists[store.currentSongIndex]}
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton>
                    <SkipPreviousIcon 
                    sx={{fontSize: '2.5rem', color: 'black'}}
                    onClick={handlePrevious}
                    /> 
                </IconButton>
                <IconButton>
                    <PauseIcon 
                    sx={{fontSize: '2.5rem', color: 'black'}}
                    onClick={handlePause}
                    /> 
                </IconButton>
                <IconButton>
                    <PlayArrowIcon 
                    sx={{fontSize: '2.5rem', color: 'black'}}
                    onClick={handlePlay}
                    /> 
                </IconButton>
                <IconButton>
                    <SkipNextIcon 
                    sx={{fontSize: '2.5rem', color: 'black'}}
                    onClick={handleNext}
                    />
                </IconButton>
                
            </Box>
        </Box>

    return (
        <>
            <YouTube
                id='videoPlayer'
                ref={videoPlayer}
                videoId={playlist[currentSong]}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange} 
            />
            {card}
        </>
        
        )
        
        ;
}


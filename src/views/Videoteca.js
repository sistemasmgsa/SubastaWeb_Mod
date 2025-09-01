import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player'
import { eventoService } from '../services/evento.service';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ImageList from '@mui/material/ImageList';
import '../css/Video.css';
import Grid from '@mui/material/Grid';

import { storage } from "../storage.js";

function Videoteca() {
  const [videos, setVideos] = useState([]);
  const [contenido, setContenido] = useState('');

  const obtenerVideos = async () => {
    let _body = { Accion: "BUSCARTODOS", Emp_cCodigo: storage.GetStorage("Emp_cCodigo") }
    return await eventoService.obtenerVideos(_body).then(
      (res) => {
        setVideos(res[0]);
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  // Detecta si el link es de Google Drive
  const isDriveLink = (url) => url.includes('drive.google.com');

  // Extrae el ID del video de Google Drive
  const getDriveId = (url) => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const [playerWidth, setPlayerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setPlayerWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let gridItemSize;
  let playerAspectRatio;

  if (playerWidth >= 1280) {
    gridItemSize = 4;
    playerAspectRatio = 16 / 9;
  } else {
    gridItemSize = 12;
    playerAspectRatio = 4 / 3;
  }

  useEffect(() => {
    obtenerVideos();
  }, []);

  return (
    <div>
      <div>
        <h3 style={{ marginLeft: "15px" }}>Videoteca</h3>
      </div>
      <div>
        <ImageList cols={1}>
          <Grid container spacing={1}>
            {videos.map(video => {
              if (isDriveLink(video.Lgt_cURL)) {
                const driveId = getDriveId(video.Lgt_cURL);
                if (!driveId) return null; // Si no se obtiene el ID, no renderizar
                return (
                  <Grid item xs={gridItemSize} key={`${video.Emp_cCodigo}-${video.Lgt_nIndice}`}>
                    <Paper sx={{
                      p: 2,
                      margin: 1,
                      maxWidth: 'auto',
                      flexGrow: 1,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                    }}>
                      <h3>{video.Lgt_cTitulo}</h3>
                      <iframe
                        src={`https://drive.google.com/file/d/${driveId}/preview`}
                        width="100%"
                        height="480"
                        allow="autoplay"
                        frameBorder="0"
                        allowFullScreen
                        title={video.Lgt_cTitulo}
                      />
                      <br />
                      <h3>Contenido: </h3>
                      <TextField
                        label=""
                        multiline
                        value={video.Lgt_cComentario}
                        InputProps={{ readOnly: true }}
                        sx={{ "& fieldset": { border: 'none' } }}
                      />
                    </Paper>
                  </Grid>
                );
              } else {
                // YouTube u otro
                return (
                  <Grid item xs={gridItemSize} key={`${video.Emp_cCodigo}-${video.Lgt_nIndice}`}>
                    <Paper sx={{
                      p: 2,
                      margin: 1,
                      maxWidth: 'auto',
                      flexGrow: 1,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                    }}>
                      <h3>{video.Lgt_cTitulo}</h3>
                      <ReactPlayer
                        url={video.Lgt_cURL}
                        style={{ width: '100%' }}
                        width="100%"
                        height="100%"
                        controls
                        loop
                      />
                      <br />
                      <h3>Contenido: </h3>
                      <TextField
                        label=""
                        multiline
                        value={video.Lgt_cComentario}
                        InputProps={{ readOnly: true }}
                        sx={{ "& fieldset": { border: 'none' } }}
                      />
                    </Paper>
                  </Grid>
                );
              }
            })}
          </Grid>
        </ImageList>
      </div>
    </div>
  );
}

export default Videoteca;

import React, { useRef, Fragment, useState, useEffect, useLayoutEffect, createContext } from 'react';
import { css, useTheme } from 'styled-components';
import { styled } from '@mui/material/styles';

import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';

import { Table, TableContainer , TableHead , TableRow ,TableBody   } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import Medalla from '@mui/icons-material/GavelRounded';

import VisibilityIcon from '@mui/icons-material/Visibility';

import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useHistory, useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { eventoService } from '../../services/evento.service';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { format } from 'date-fns';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import Snackbar from '@mui/material/Snackbar';

import { storage } from "../../storage.js";
import ReactPlayer from 'react-player';
// import imagenes from '../../components/subasta/imagenes.js'

import barra from '../../assets/images/barra.jpg'

import Cookies from 'universal-cookie';
const cookies = new Cookies();

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 360,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
};

const ScrollContext = createContext();

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const Item = (props) => {


    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [openDetalles, setOpenDetalles] = useState(false);


    const [openMsg, setOpenMsg] = React.useState(false);
    const [serverTime, setServerTime] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenDetalles = () => setOpenDetalles(true);
    const handleCloseDetalles = () => setOpenDetalles(false);

    const handleClickOpenMsg = () => setOpenMsg(true);
    const handleCloseMsg = () => setOpenMsg(false);
    const [subastasPuja, setSubastasPuja] = React.useState([]);

    const fetchServerTime = async () => {
        try {

            let _body = { Accion: "BUSCARTODOS", Emp_cCodigo: storage.GetStorage("Emp_cCodigo") }

            return await eventoService.horaservidor(_body).then(
                (res) => {
                    const timeString = res.time;
                    const [hours, minutes, seconds] = timeString.split(':');
                    const date = new Date();
                    date.setHours(hours);
                    date.setMinutes(minutes);
                    date.setSeconds(seconds);

                    setCurrentTime(date);
                },
                (error) => {
                    console.log(error);

                }
            );


        } catch (error) {
            console.error('Error fetching server time:', error);
        }
    };


    useEffect(() => {
        const scrollPosition = localStorage.getItem('scrollPosition');
        if (scrollPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(scrollPosition, 10));
                localStorage.removeItem('scrollPosition'); // Limpiar después de restaurar
            }, 500); // Aumentar el tiempo aquí si es necesario
        }
    }, []);

    const handleVerDetalle = async () => {

        // Guarda la posición actual del scroll en sessionStorage
        const currentScrollY = window.scrollY;
        localStorage.setItem('scrollPosition', currentScrollY);
        console.log("Scroll guardado:", currentScrollY); // Verifica el valor guardado



        cookies.set('PosImagen', props.keyImagen, { path: "/" });


        await fetchServerTime();


        const fechaHora1 = currentTime;
        const fechaHora2 = new Date(props.Final);

        const estado = props.Estado;
        //console.log(fechaHora1);
        //console.log(fechaHora2);

        if (estado == 'CERRADO') {
            handleClickOpenMsg();
        }
        else {


            //      if (fechaHora1 < fechaHora2) {
            if (props.IndicePanel == 0) {


                // history.push(`/Subasta/detalle/${props.Cab_cCatalogo}/${props.Dvm_cNummov}/${props.IndicePanel}/${props.Per_cPeriodo}`);
                window.location.href = `/Subasta/detalle/${props.Cab_cCatalogo}/${props.Dvm_cNummov}/${props.IndicePanel}/${props.Per_cPeriodo}`;
            }
            else {
                handleClickOpenMsg();


            }

            //    } else {
            //handleClickOpenMsg();
            //}
        }

    }


    const [nPujas, setnPujas] = React.useState(0);
    const [nImporte, setImporte] = React.useState(0);
    // Estado para controlar el color del IconButton
    const [iconColor, setIconColor] = useState('black');
    // Estado para controlar si el botón está siendo presionado
    const [isPressed, setIsPressed] = useState(false);


    const obtenerEventoDetalleSel = async (pDvm_cNummov, pCab_cCatalogo) => {
        let _body = { Accion: "EVENTO_DET_PUJA", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio"), Dvm_cNummov: pDvm_cNummov, Cab_cCatalogo: pCab_cCatalogo }
        let _result;
        return await eventoService.obtenerEventosDet(_body).then(

            (res) => {
                _result = res[0];

                _result.map((item) => (
                    setnPujas(item.pujas)
                ))
            },
            (error) => {
                console.log(error);
            }
        );
    };


    useEffect(() => {
    const obtenerMayorImporte = async () => {
        const _body = {
        Accion: "EVENTO_DET_PUJA",
        Emp_cCodigo: storage.GetStorage("Emp_cCodigo"),
        Pan_cAnio: storage.GetStorage("Pan_cAnio"),
        Dvm_cNummov: props.Dvm_cNummov,
        Cab_cCatalogo: props.Cab_cCatalogo
        };

        try {
        const res = await eventoService.obtenerEventosDet(_body);
        if (res.length > 0) {
            const item = res[0][0];

            setImporte(item?.mayorimporte ?? 0);

        }
        } catch (error) {
        console.error("Error al obtener el mayor importe:", error);
        }
    };

    if (props.Dvm_cNummov && props.Cab_cCatalogo) {
        obtenerMayorImporte();
    }
    }, [props.Dvm_cNummov, props.Cab_cCatalogo]);


    const handleClick = async () => {
        setIsPressed(true);
        setIconColor('red');
        await obtenerEventoDetalleSel(props.Dvm_cNummov, props.Cab_cCatalogo)
    };

    const handleRelease = () => {
        setIsPressed(false);
        setIconColor('black');
    };

    const [imageSrc, setImageSrc] = useState('');

    // Importa imágenes usando `require.context`
    const imagesContext = require.context('../../assets/ejemplares', false, /\.(jpg|jpeg|png)$/);
    const imagesMap = imagesContext.keys().reduce((acc, path) => {
        const imageName = path.split('/').pop().split('.')[0];
        acc[imageName] = imagesContext(path);
        return acc;
    }, {});

    const obtenerPujasDetalle = async (pCab_cCatalogo, pDvm_cNummov) => {
        let accion = props.Estado === 'CERRADO' ? "EVENTOABIERTO_DET_PUJA_TOP_GANADOR" : "EVENTOABIERTO_DET_PUJA_TOP5"; // Condición para TOP 1 o TOP 5
        let _body = { 
            Accion: accion, // Define si es top 1 o top 5
            Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), 
            Pan_cAnio: storage.GetStorage("Pan_cAnio"), 
            Dvm_cNummov: pDvm_cNummov, 
            Cab_cCatalogo: pCab_cCatalogo 
        };


    
        return await eventoService.obtenerEventosDetPuja(_body).then(
            (res) => {
                setSubastasPuja(res[0]);


            },
            (error) => {
                console.log(error);
            }
        );
    };

    useEffect(() => {
        setnPujas(props.pujas);

        obtenerPujasDetalle(props.Cab_cCatalogo, props.Dvm_cNummov);

        if (props.cab_cenlace) {
            const imageName = props.cab_cenlace.split('/').pop().split('.')[0];
            setImageSrc(imagesMap[imageName] || ''); // Imagen por defecto si no se encuentra
        }
    }, [props.cab_cenlace, props.pujas]);



     // Función para formatear nombres y apellidos
  const formatNombreApellido = (nombres, apellidos) => {
    const nombrePartes = nombres.split(" ");
    const apellidoPartes = apellidos.split(" ");

    const primerNombre = nombrePartes[0]; // Primer nombre
    const inicialSegundoNombre = nombrePartes[1] ? `${nombrePartes[1][0]}.` : '';

    const primerApellido = apellidoPartes[0]; // Primer apellido
    const inicialSegundoApellido = apellidoPartes[1] ? `${apellidoPartes[1][0]}.` : '';

    return `${primerNombre} ${inicialSegundoNombre}, ${primerApellido} ${inicialSegundoApellido}`;
  };



        const [openVideo, setOpenVideo] = useState(false);

        const handleOpenVideo = () => setOpenVideo(true);
        const handleCloseVideo = () => setOpenVideo(false);

        // Convierte url Drive para ReactPlayer
            const getDrivePreviewUrl = (url) => {
            if (!url) return '';
            const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
            return '';
            };



            const [imgSrc, setImgSrc] = useState(null);

            useEffect(() => {
                const exts = [".jpg", ".jpeg", ".png", ".webp"];
                const tryLoad = async () => {
                    let found = false;
                for (let ext of exts) {
                    const path = `${props.cab_cenlace}${ext}`;
                    try {
                    const res = await fetch(path, { method: "HEAD" });
                    //console.log(res)
                    if (res.ok) {
                        setImgSrc(path);
                        break;
                    }
                    } catch (err) {
                    console.log("Imagen no disponible")
                    }
                }
                    if (!found) {
                        console.log("Imagen no disponible") // imagen de respaldo
                    }
                };
                tryLoad();
            }, [props.cab_cenlace]);

        const [imagenCargada, setImagenCargada] = useState(false);
        const [showShareOptions, setShowShareOptions] = useState(false);

        const shareBoxRef = useRef(null);
        const [copiado, setCopiado] = useState(false);

        useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareBoxRef.current && !shareBoxRef.current.contains(event.target)) {
            setShowShareOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        }, []);



    return (
        <div>

            <Dialog open={openMsg} onClose={handleCloseMsg} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Puja"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Solo se puede iniciar una Puja activa.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMsg} autoFocus >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Paper
                sx={{
                    p: 1,
                    margin: 0.5,
                    maxWidth: 'auto',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        props.Estado === 'CERRADO' ? '#EAEDED' : '#fff',
                }}


            >
                <ImageListItem >

                    <img src={barra} srcSet={barra} />

                    {props.Estado != 'CERRADO' &&

                        <ImageListItemBar

                            sx={{
                                background:
                                    'white',
                                "& .MuiImageListItemBar-title": { color: isPressed ? 'red' : 'black' }, //styles for title                                
                            }}


                            title={
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <span>. Pujas : {nPujas}</span>
                                {/* <span style={{ color: '#003366', fontWeight: 'bold'}}>
                                S/. {nImporte ? parseFloat(nImporte).toFixed(2) : "0.00"}
                                </span> */}

                            </Box>
                            }



                            actionIcon={
                                <IconButton
                                    sx={{ color: 'black' }}
                                    aria-label={`star ${props.pujas}`}
                                    onClick={handleClick}
                                    onMouseLeave={handleRelease}

                                    style={{ color: isPressed ? 'red' : 'black' }}
                                >
                                    <Medalla />
                                </IconButton>
                            }
                            position="top"
                            actionPosition="left"

                        />

                    }
                </ImageListItem>


                <ImageListItem >


                    <img
                        src={`${imgSrc}?w=248&fit=crop&auto=format`}
                        srcSet={`${imgSrc}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt="Ejemplar"
                        onLoad={() => setImagenCargada(true)} // ← Detecta que cargó
                        loading="lazy"
                        />


                    
                    {/* {imagenCargada && (
                    <Box
                        sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        userSelect: 'none',
                        fontSize: '14px',
                        zIndex: 1,
                        }}
                    >
                        PLACA: {props.Placa}
                    </Box>
                    )} */}



                    {imagenCargada && (


                        <Box
                        ref={shareBoxRef}
                            sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            }}
                        >
                            {/* Botón principal: Compartir */}
                            <IconButton
                            size="small"
                            onClick={() => setShowShareOptions(!showShareOptions)}
                            sx={{ 
                                backgroundColor: 'rgba(255,255,255,0.6)',
                                borderRadius: '15px',
                                mb: showShareOptions ? 1 : 0,
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                backgroundColor: 'rgba(0, 51, 102, 0.4)', // Azul oscuro con transparencia
                                color: 'white',
                                },
                            }}
                            >
                            <ShareIcon fontSize="small" />
                            </IconButton>

                            {/* Botones desplegables */}
                            {showShareOptions && (
                            <Box
                                sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                backgroundColor: 'rgba(255,255,255,1)',
                                borderRadius: '8px',
                                p: 1,
                                }}
                            >
                                <Snackbar
                                open={copiado}
                                autoHideDuration={900}
                                onClose={() => setCopiado(false)}
                                message="Enlace copiado al portapapeles"
                                />

                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        const texto = `Mira esta subasta: Placa ${props.Placa}\nUrl: ${window.location.href}`;
                                        navigator.clipboard.writeText(texto)
                                        .then(() => setCopiado(true))
                                        .catch(err => console.error('Error al copiar: ', err));
                                    }}
                                    sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                        '&:hover': {
                                        backgroundColor: 'rgba(0, 51, 102, 0.1)',
                                        },
                                    }}
                                    >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    color="success"
                                    size="small"
                                    component="a"
                                    href={`https://wa.me/?text=${encodeURIComponent(`Mira esta subasta: Placa ${props.Placa}\nLink: `)}%20${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                    <WhatsAppIcon fontSize="small" />
                                </IconButton>

                            </Box>
                            )}
                        </Box>
                        )}








                    <Grid container spacing={1}>


                        {/* <Grid item xs={12} lg={12}>
                            <Typography variant='body1' style={{ fontStyle: 'normal', fontWeight: 'bold' }}>
                                {`PUJAR POR: ${props.Placa}`}
                            </Typography>
                        </Grid> */}

                        <Grid container item xs={12} lg={12} alignItems="center">
                            {/* Texto a la izquierda */}
                            <Grid item xs={6}>
                                <Typography variant='body1' style={{ fontStyle: 'normal', fontWeight: 'bold' }}>
                                    {`PUJAR POR: ${props.Placa}`}
                                </Typography>
                            </Grid>

                            {/* Texto a la derecha con tamaño personalizado */}
                            <Grid item xs={6}>
                                <Typography variant='body1' align="right" style={{ fontSize: '12px', fontStyle: 'italic', color: 'gray' }}>
                                    {/* Texto personalizado a la derecha */}
                                    {`(${props.Cab_cCatalogo})`}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} lg={12}>
                            <Typography variant='caption' style={{ fontStyle: 'normal', fontWeight: 'normal' }}>
                                {`PROPIETARIO:${props.Propietario}`}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} lg={12}>
                            <Typography variant='caption' style={{ fontStyle: 'normal', fontWeight: 'normal' }}>
                                {`INICIO: ${props.Dvd_dInicio}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <Typography variant='caption' style={{ fontStyle: 'normal', fontWeight: 'normal' }}>
                                {`FIN: ${props.Dvd_dFin}`}
                            </Typography>
                        </Grid>

                        {props.Estado === 'ACTIVO' && (
                        <Grid item xs={12} lg={12}>
                            <Typography
                            variant="caption"
                            style={{ fontStyle: 'normal', fontWeight: 'normal' }}
                            >
                            {`VALOR ACTUAL: S/. ${
                                Number(nImporte || 0).toLocaleString('es-PE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                                })
                            }`}
                            </Typography>
                        </Grid>
                        )}

                        <Grid item xs={12} lg={12}>
                            <Typography variant='caption' style={{ fontStyle: 'normal', fontWeight: 'bold' }} color={props.Estado === 'ACTIVO' ? 'primary' : 'error'}>
                                {`ESTADO: ${props.Estado}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={6} lg={6}>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>


                                    <Button variant="outlined" size="small" color="primary" onClick={handleOpenDetalles} style={{
                                        backgroundColor: props.Estado != 'CERRADO' ? 'white' : 'red',
                                        color: props.Estado != 'CERRADO' ? 'darkblue' : 'white',
                                    }}>Detalles</Button>
                                    <Modal
                                        open={openDetalles}
                                        onClose={handleCloseDetalles}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <h3><b>INFORMACION:</b></h3>
                                            <p><b>Precio Base:</b> S/. {props.Dvd_nImporte}</p>
                                            <p><b>Placa:</b> {props.Placa}</p>
                                            <p><b>Propietario</b>: {props.Propietario}</p>
                                            <p><b>Padre:</b> {props.Padre}</p>
                                            <p><b>Madre:</b> {props.Madre}</p>
                                            <p><b>Edad:</b> {props.Info}</p>
                                            <p><b>Detalles:</b> {props.Cab_cDescripcion}</p>
                                            <p><b>Codigo:</b> {props.Cab_cCatalogo}</p>
                                            <p><b>Observaciones:</b> {props.Cab_cObservaciones}</p>
                                            {props.Cab_cVideo && props.Cab_cVideo.startsWith("http") ? (
                                             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button variant="contained" onClick={handleOpenVideo}>
                                                Ver Video
                                                </Button>
                                            </div>
                                            ) : null}

                                        </Box>
                                    </Modal>

                                    <Modal
                                        open={openVideo}
                                        onClose={handleCloseVideo}
                                        aria-labelledby="modal-video-title"
                                        aria-describedby="modal-video-description"
                                        >
                                        <Box
                                            sx={{
                                            ...style,
                                            width: '80vw',
                                            maxWidth: 1000,
                                            height: 'auto',
                                            textAlign: 'left', // Centra el contenido
                                            }}
                                        >
                                            <h4 style={{ marginBottom: '14px' , textAlign:'center'}}>{props.Cab_cObservaciones}</h4>

                                            <iframe
                                            src={getDrivePreviewUrl(props.Cab_cVideo)}
                                            width="100%"
                                            height="480px"
                                            allow="autoplay"
                                            frameBorder="0"
                                            allowFullScreen
                                            title="Video"
                                            />

                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <Button
                                                    onClick={handleCloseVideo}
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ mt: 2 }}
                                                    >
                                                    Cerrar Video
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                        </Modal>


                                    
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        onClick={handleOpen}
                                        sx={{
                                            backgroundColor: props.Estado !== 'CERRADO' ? 'white' : 'red',
                                            color: props.Estado !== 'CERRADO' ? 'darkblue' : 'white',
                                            '@media (max-width: 600px)': { // Estilo responsive para pantallas pequeñas
                                                fontSize: '0.8rem',
                                                padding: '5px',  // Reducir el padding en pantallas pequeñas
                                            }
                                        }}
                                    >
                                        <VisibilityIcon /> {/* Ícono de ojo */}
                                    </Button>

                                    {/* Modal con la tabla */}
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-title"
                                        aria-describedby="modal-description"
                                    >
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: {
                                                xs: '90%', // Ancho del modal en pantallas pequeñas
                                                sm: '70%', // Ancho en pantallas medianas
                                                md: '40%', // Ancho en pantallas grandes
                                            },
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: {
                                                xs: 2, // Padding más pequeño en pantallas pequeñas
                                                sm: 3, // Padding mediano en pantallas medianas
                                                md: 4, // Padding estándar en pantallas grandes
                                            },
                                        }}>
                                            <Typography id="modal-title" variant="h6" component="h2" align="center" gutterBottom>
                                                {`Listado de Pujas - Placa: ${props.Placa}`}
                                            </Typography>

                                            {/* Tabla dentro del modal */}
                                            <TableContainer component={Paper}>
                                                <Table aria-label="customized table">
                                                    <TableHead>
                                                        <TableRow>
                                                        <StyledTableCell align="left">N°</StyledTableCell>
                                                            <StyledTableCell align="left">Nombre</StyledTableCell>
                                                            <StyledTableCell align="center">Puja</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                    {subastasPuja.map((row) => (
                                                        <StyledTableRow key={row.Dvd_nCorrel}>
                                                            <StyledTableCell align="left">{row.Item}</StyledTableCell>
                                                            <StyledTableCell align="left">  {formatNombreApellido(row.Dvd_cNombres, row.Dvd_cApellidos)}</StyledTableCell>
                                                            <StyledTableCell align="center">{row.Dvd_nImporte}</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                                </Table>
                                            </TableContainer>

                                            {/* Botón para cerrar el modal */}
                                            <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                                                Cerrar
                                            </Button>
                                        </Box>
                                    </Modal>
                                    </Box>

                                </Grid>



                                <Grid item xs={6} lg={6}>
                                <Box sx={{ display: 'flex' }}>

                                    {props.Estado != 'CERRADO' &&
                                        <Button variant="contained" size="small" color="primary" onClick={handleVerDetalle}  
                                        style={{
                                            width: '80px',   // Tamaño del botón
                                            marginLeft: 'auto', // Empuja el botón hacia la derecha
                                        }}
                                        
                                        >Pujar</Button>
                                    }
                                </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ImageListItem>
            </Paper>

        </div>
    );
};

export default Item;


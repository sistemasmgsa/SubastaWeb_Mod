import React, { Fragment, useState, useEffect, useLayoutEffect } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import Modal from '@mui/material/Modal';
import { eventoService } from '../../services/evento.service';

import { storage } from "../../storage.js";


import { Divider } from '@mui/material';

//import imagenes from '../../components/subasta/imagenes.js'

// Función para hacer la solicitud a la API
const obtenerDetalleEvento = async (pCab_cCatalogo, pDvm_cNummov) => {
    try {
        const body = { Accion: "EVENTO_DET", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio"), Dvm_cNummov: pDvm_cNummov, Cab_cCatalogo: pCab_cCatalogo };

        const response = await eventoService.obtenerEventosDet(body);

        if (!response || response.length === 0) {
            throw new Error("Respuesta inválida de la API");
        }

        return response[0];

    } catch (error) {
        console.log(error);
        throw error; // Lanzar el error para que el componente lo pueda manejar
    }
};

const obtenerImagenes = async (pCab_cCatalogo, pDvm_cNummov) => {
    try {
        const body = { Accion: "BUSCARREGISTRO", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio"), Dvm_cNummov: pDvm_cNummov, Cab_cCatalogo: pCab_cCatalogo };


        const response = await eventoService.obtenerCatalogoDetImagenes(body);


        if (!response || response.length === 0) {
            throw new Error("Respuesta inválida de la API");
        }

        return response[0];

    } catch (error) {
        console.log(error);
        throw error; // Lanzar el error para que el componente lo pueda manejar
    }
};

const ItemDetalle = (props) => {


    const [imagenesSlide, setImagenesSlide] = React.useState([]);
    const [detalle, setDetalleEvento] = React.useState([]);



    useEffect(() => {
        const fetchDetalleEvento = async (pCab_cCatalogo, pDvm_cNummov) => {
            const detalleEvento = await obtenerDetalleEvento(pCab_cCatalogo, pDvm_cNummov);



            setDetalleEvento(detalleEvento[0]);


        };

        fetchDetalleEvento(props.pCab_cCatalogo, props.pDvm_cNummov);


    }, []);


    useEffect(() => {



        //  console.log(detalle);
    }, [detalle]);


    const obtenerSubastaSlider = async () => {
        return await obtenerImagenes(props.pCab_cCatalogo, props.pDvm_cNummov).then(
            (res) => {

                setImagenesSlide(res)
                handleOpen()
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const handleImageClick = () => {
        setIsImageExpanded(!isImageExpanded);
    };


    const [imagenesCargadas, setImagenesCargadas] = useState({});

    const getValidImage = async (basePath) => {
        const exts = [".jpg", ".jpeg", ".png", ".webp"];
        for (let ext of exts) {
            // Ajusta la ruta para que no se agregue incorrectamente al path actual
            const fullPath = `${basePath}${ext}`.replace('../../', '/'); 
            try {
                const res = await fetch(fullPath, { method: "HEAD" });
                if (res.ok) return fullPath;
            } catch (_) {}
        }
        return null;
    };


  
    useEffect(() => {
    const cargarImagenes = async () => {
        const nuevasImagenes = {};
        if (detalle?.cab_cenlace) {
        const img = await getValidImage(detalle.cab_cenlace);

        nuevasImagenes[detalle.cab_cenlace] = img;

        }
        setImagenesCargadas(nuevasImagenes);

    };

    if (detalle && detalle.cab_cenlace) {
        cargarImagenes();
    }
    }, [detalle]);

    const [diasRestantes, setDiasRestantes] = useState(null);
    const [horasRestantes, setHorasRestantes] = useState(null);
    const [minutosRestantes, setMinutosRestantes] = useState(null);
    const [segundosRestantes, setSegundosRestantes] = useState(null);


useEffect(() => {
    const interval = setInterval(() => {
        const obtenerFechaCierre = async () => {
            try {
                const body = {
                    Accion: "FECHA_CIERRE",
                    Emp_cCodigo: storage.GetStorage("Emp_cCodigo"),
                    Pan_cAnio: storage.GetStorage("Pan_cAnio"),
                    Dvm_cNummov: props.pDvm_cNummov,
                    Cab_cCatalogo: props.pCab_cCatalogo
                };

                const response = await eventoService.obtenerEventosDet(body);

                if (!response || response.length === 0) {
                    throw new Error("Respuesta inválida de la API");
                }

                const resultado = response[0][0];

                setDiasRestantes(Math.max(0, resultado.Dias));
                setHorasRestantes(Math.max(0, resultado.Horas));
                setMinutosRestantes(Math.max(0, resultado.Minutos));
                setSegundosRestantes(Math.max(0, resultado.Segundos));

            } catch (error) {
                console.log(error);
            }
        };

        obtenerFechaCierre();
    }, 100); 

    return () => clearInterval(interval); 
}, [props.pCab_cCatalogo, props.pDvm_cNummov]);




        

    return (
        <div>

            <Paper
                sx={{
                    p: 2,
                    margin: 1,
                    maxWidth: 'auto',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >

                <Grid container spacing={2}>
                    <Grid item >
                        <div >

                            <Grid container justify="center" alignItems="center">
                                <Grid item>

                                    {imagenesCargadas[detalle.cab_cenlace] ? (
                                    <img
                                        src={imagenesCargadas[detalle.cab_cenlace]}
                                        alt="Ejemplar"
                                        // onClick={handleImageClick}
                                        style={{
                                            // cursor: 'pointer',
                                            width: isImageExpanded ? 'auto' : '150px',
                                            height: isImageExpanded ? '100vh' : 'auto',
                                        }}
                                    />
                                    ) : (
                                    <span style={{ fontSize: '12px', color: '#999' }}>Sin imagen</span>
                                    )}
                                    

                                </Grid>
                                {/* <Modal open={isImageExpanded} onClose={handleImageClick}>
                                    <img
                                        src={`../../../${detalle.cab_cenlace}`}
                                        alt="Imagen"
                                        onClick={handleImageClick}
                                        style={{
                                            cursor: 'pointer',
                                            width: isImageExpanded ? 'auto' : '150px',
                                            height: isImageExpanded ? '100vh' : 'auto',
                                        }}
                                    />
                                </Modal> */}
                            </Grid>
                        </div>

                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2} >
                            <Grid item xs={12} lg={6}>
                                <Typography gutterBottom variant="subtitle1" component="div" align="left">

                                    <b>PUJAR POR N° {detalle.Placa}</b>

                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <b>PROPIETARIO</b>: {detalle.Propietario}

                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="left">
                                    <b>PADRE:</b> {detalle.Padre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="left">
                                    <b>MADRE:</b> {detalle.Madre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="left">
                                    <b>EDAD:</b> {detalle.Info}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="left">
                                    <b>DETALLE:</b> {detalle.Cab_cDescripcion}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="left">
                                    <b>CODIGO:</b> {detalle.Cab_cCatalogo}
                                </Typography>                                
                                <Typography variant="body2" color="text.secondary" align="left">
                                    <b>OBSERVACIONES:</b> {detalle.Cab_cObservaciones}
                                </Typography>


                            </Grid>

                        </Grid>
                        <Grid item xs={12} lg={6} >
                            <Typography variant="h6" component="div" color="primary">

                                <b>Precio Base : S/. {detalle.Dvd_nImporte}</b>
                            </Typography>
                        </Grid>
                            <Grid item xs={12} lg={6}>
                            <Divider sx={{ mb: 1 }} /> 
                            
                            <Typography variant="h6" component="div" color="primary">
                                <b>Cierra: </b>
                            </Typography>

                            {diasRestantes !== null && horasRestantes !== null && minutosRestantes !== null  && segundosRestantes !== null && (
                                <Typography variant="h6" component="div" color="primary">
                                <b>{diasRestantes} días | {horasRestantes} horas | {minutosRestantes} minutos | {segundosRestantes} segundos</b>
                                </Typography>
                            )}
                            <Divider sx={{ mb: 1 }} /> 
                            </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default ItemDetalle;

import React, { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import { css, useTheme } from 'styled-components';
import { styled } from '@mui/material/styles';
import imagenes from '../../assets/images/imagenes';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Typography } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core'; // import incorrecto. makeStyles viene de @mui/styles
import { makeStyles } from '@mui/styles';
import { storage } from "../../storage.js";


//import { ASDAS } from "../../assets/images/";


import { eventoService } from '../../services/evento.service';

const useStyles = makeStyles((theme) => ({
    paragraph: {
        margin: theme.spacing(2),
    },
    list: {
        listStyleType: 'decimal',
        paddingLeft: '20px',
        padding: '7px',
    },
    bullet: {
        display: 'list-item',
        paddingLeft: '40px',
    },
}));



const ListItem = ({ children }) => {
    const classes = useStyles();
    return (
        <Typography component="li" className={classes.list}>
            {children}
        </Typography>
    );
};

const ListItemBullet = ({ children }) => {
    const classes = useStyles();
    return (
        <Typography component="ul" className={classes.bullet}>
            {children}
        </Typography>
    );
};

const Bases = () => {
    const classes = useStyles();

    const [data, setData] = useState([]);
    const [estadoBase, setEstadoBase] = useState("");
    // Load de pagina
    useEffect(() => {
        listar();
        listarEstado();
    }, []);
    
    
        // procedimiento para CONSULTA un catalogo con SP MySQL
        const listar = async () => {
            let _body = { Accion: "BUSCARBASE", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio") }
    
            // console.log(_body);

            return await eventoService.obtenerBaseCabAuth(_body).then(
                (res) => {
                    // console.log(res);
                    setData(res[0]);
                },
                (error) => {
                    console.log(error);
    
                }
            );
        };
    
        // procedimiento para CONSULTA un catalogo con SP MySQL
        const listarEstado = async () => {
            let _body = { 
                Accion: "ESTADOBASE", 
                Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), 
                Pan_cAnio: storage.GetStorage("Pan_cAnio") 
            };
        
            return await eventoService.obtenerBaseCabAuth(_body).then(
                (res) => {
                    //console.log(res);

                    setEstadoBase(res[0][0]?.Dvm_cEstado || "");
                },
                (error) => {
                    console.log(error);
                }
            );
        };
        //console.log(estadoBase)



        const [espera, setEspera] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEspera(false);
        }, 2000); 

        return () => clearTimeout(timer); // limpieza
    }, []);

        

    return (
        <div >
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
          

                <div>
                      {/* <ListItem>La subasta iniciará el día lunes 26 de agosto a las 12:00 am y culminará el día miércoles 28 de agosto a las 8:00 pm, momento en el que se determinarán a los ganadores de los ejemplares subastados.</ListItem>
                    <ListItem>Cada puja se realizará por múltiplos de S/50.00 (cincuenta soles) sobre el precio base de cada ejemplar.</ListItem>
                    <ListItem>De existir 2 (dos) o más pujas por algún ejemplar a falta de 10 (diez) minutos para el cierre de la subasta, se aumentarán 10 (diez) minutos adicionales, generando una nueva hora de cierre, y así sucesivamente, hasta definir a un ganador.</ListItem>
                    <ListItem>Se eliminarán las pujas de quienes coloquen DNI y/o celular falsos o de otra persona. Toda puja se verificará por vía telefónica, por transparencia.</ListItem>
                    <ListItem>Nos comunicaremos, previo abono, con los ganadores para coordinar la recepción o envío de los ejemplares. El pago deberá realizarse dentro de las 24 (veinticuatro) horas posteriores a la finalización de la subasta.</ListItem>
                    <ListItem>Si el ganador de algún ejemplar no respondiera o no realizara el pago en el plazo indicado, se dará por nuevo ganador a quien realizó la siguiente puja más alta y así sucesivamente.</ListItem>
                    <ListItem>Los pagos serán realizados a la siguiente cuenta a nombre de Luis Enrique Torres Figueroa:</ListItem>

                    <ListItemBullet className={classes.bullet}>- BCP soles: 1939606822004, CCI: 00219300960682200413.</ListItemBullet>
                    <ListItemBullet className={classes.bullet}>- Scotiabank soles: 0367663671 , CCI: 00922320036766367197.</ListItemBullet>

                    <ListItem>Enviar el comprobante de pago al celular 950793210. De contar con otro medio de pago, se deberá coordinar previamente.</ListItem>
                    <ListItem>El ganador se encargará de todos los gastos de envío del ejemplar adjudicado y el plazo máximo para el recojo de las aves es de 7 (siete) días. No se entregarán animales sin la previa comprobación del pago e identidad de los ganadores.</ListItem>
                    <ListItem>Cualquier controversia que surgiera en la presente subasta será resuelta por la organización.</ListItem> */}

                {estadoBase === "A" ? (
                data.length > 0 &&
                data.map((item, index) =>
                    item.Pdd_cTexto ? (
                    <ListItem key={index}>{item.Pdd_cTexto}</ListItem>
                    ) : (
                    <ListItemBullet key={index}>{item.Pdd_cSubTexto}</ListItemBullet>
                    )
                )
                ) : (
                <ListItem>
                    {espera ? (
                    "Cargando subastas..."
                    ) : (
                    <>
                        Gracias por visitarnos, actualmente no tenemos subastas activas. Muy pronto estaremos informando una nueva apertura.{" "}
                        <a href="https://subasta0825.galpon-legado.com/" className="text-blue-600 underline">
                        Ver más
                        </a>
                    </>
                    )}
                </ListItem>
                )}

{/* <ListItem>------------------------------</ListItem>
                    <ListItem>La subasta iniciará el día martes 27 de febrero a las 12:00 pm y culminará el día jueves 29 a las 8:00 pm, momento en el que se determinarán a los ganadores de los ejemplares subastados.</ListItem>
                    <ListItem>Cada puja se realizará por múltiplos de S/50.00 (cincuenta soles) sobre el precio base de cada ejemplar.</ListItem>
                    <ListItem>De existir 2 (dos) o más pujas por algún ejemplar a falta de 10 (diez) minutos para el cierre de la subasta, se aumentarán 10 (diez) minutos adicionales, generando una nueva hora de cierre, y así sucesivamente, hasta definir a un ganador.</ListItem>
                    <ListItem>Se eliminarán las pujas de quienes coloquen DNI y/o celular falsos o de otra persona. Toda puja se verificará por vía telefónica, por transparencia.</ListItem>
                    <ListItem>Nos comunicaremos, previo abono, con los ganadores para coordinar la recepción o envío de los ejemplares. El pago deberá realizarse dentro de las 24 (veinticuatro) horas posteriores a la finalización de la subasta.</ListItem>
                    <ListItem>Si el ganador de algún ejemplar no respondiera o no realizara el pago en el plazo indicado, se dará por nuevo ganador a quien realizó la siguiente puja más alta y así sucesivamente.</ListItem> */}


                    {/* <ListItem>Enviar el comprobante de pago al celular 948432613. De contar con otro medio de pago, se deberá coordinar previamente.</ListItem>
                    <ListItem>El ganador se encargará de todos los gastos de envío del ejemplar adjudicado y el plazo máximo para el recojo de las aves es de 7 (siete) días. No se entregarán animales sin la previa comprobación del pago e identidad de los ganadores.</ListItem>
                    <ListItem>Cualquier controversia que surgiera en la presente subasta será resuelta por la  organización.</ListItem>  */}


                    {/* <ListItem>Enviar el comprobante de pago al celular 950793210. De contar con otro medio de pago, se deberá coordinar previamente.</ListItem>
                    <ListItem>El ganador se encargará de todos los gastos de envío del ejemplar adjudicado y el plazo máximo para el recojo de las aves es de 7 (siete) días. No se entregarán animales sin la previa comprobación del pago e identidad de los ganadores.</ListItem>
                    <ListItem>Cualquier controversia que surgiera en la presente subasta será resuelta por la organización.</ListItem>
                    {/* <ListItemBullet className={classes.bullet}>- Interbank soles: 052-3385487907</ListItemBullet>
                    <ListItemBullet className={classes.bullet}>- Interbank CCI: 003-052-013385487907-88</ListItemBullet>
                    <ListItemBullet className={classes.bullet}>- Banco de la Nación soles: 04-039-905758</ListItemBullet>
                    <ListItemBullet className={classes.bullet}>- Banco de la Nación CCI: 018-000-004039905758-03</ListItemBullet> */}

                    {/* <ListItem>Los pagos serán realizados a la siguiente cuenta a nombre de Luis Enrique Torres Figueroa:</ListItem> 

                    <ListItemBullet className={classes.bullet}>- BCP soles: 193-17297396-0-15.</ListItemBullet>
                    <ListItemBullet className={classes.bullet}>- CCI: 002-193-117297396-0-1512.</ListItemBullet> */}


                </div>



            </Paper>
        </div>
    );
};

export default Bases; 1

//----------------- comando para compilar proyecto react -----------------
// npm run build
//------------------------------------------------------------------------
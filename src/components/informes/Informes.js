import React, { Fragment, useState, useEffect, Component } from 'react';
import Cookies from 'universal-cookie';
import Box from '@mui/material/Box';
import { eventoService } from '../../services/evento.service';
import Paper from '@mui/material/Paper';
import SimpleBarChart from '../informes/SimpleBarChart'
import { storage } from "../../storage.js";

const datass = [
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-18', importe: 1000 },
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-19', importe: 1500 },
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-20', importe: 900 },
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-21', importe: 800 },
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-22', importe: 500 },
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-23', importe: 100 },
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-24', importe: 0 },
    { EventoCodigo: '0000000016', DescripEvento: 'Evento 23 Nov. 2023', fecha: '2023-11-25', importe: 0 },


    { EventoCodigo: '0000000017', DescripEvento: 'Evento 24 Nov. 2023', fecha: '2023-11-28', importe: 1000 },

];



const cookies = new Cookies();

const Informes = (props) => {

    const [data, setData] = useState([]);

    // Load de pagina
    useEffect(() => {
        listar();
    }, []);

    // procedimiento para CONSULTA un catalogo con SP MySQL
    const listar = async () => {
        let _body = { Accion: "VENTAS_EVENTOS", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio") }
        console.log(_body);
        return await eventoService.obtenerEventosCabAuth(_body).then(
            (res) => {
                setData(res[0]);
            },
            (error) => {
                console.log(error);

            }
        );
    };

    // Agrupar los datos por EventoCodigo
    const eventosUnicos = [...new Set((data || []).map(item => item.EventoCodigo))];


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
                <h2>VENTAS POR EVENTO :</h2>

                <Box sx={{ p: 2, width: '100%' }}>
                    <div >

                        <div>


                            {eventosUnicos.map(eventoCodigo => {
                                const datosEvento = data.filter(item => item.EventoCodigo === eventoCodigo);


                                return (
                                    <div key={eventoCodigo}>
                                        <h6>{datosEvento[0].DescripEvento}</h6>

                                        <SimpleBarChart data={datosEvento} tooltip={{ trigger: 'item' }} />
                                    </div>
                                );
                            })}



                        </div>

                        {/* <ListaGanadores /> */}
                    </div>

                </Box>

            </Paper>
        </div>
    );

};

export default Informes;

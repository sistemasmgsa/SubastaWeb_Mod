import React, { Fragment, useState, useEffect, Component } from 'react';
import ListaEstadoEjemplar from '../components/mantenimientos/EstadosEjemplar/ListaEstadoEjemplar';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class MantEstadoEjemplar extends Component {

    componentDidMount() {
        // if (!cookies.get('Sgm_cUsuario')) {
        //     window.location.href = "./subasta";
        // }
    };

    render() {
        return (
            <div >

                <div>
                    <h3>Mantenimiento - Estados Ejemplares</h3>
                </div>

                <ListaEstadoEjemplar />      
            </div>
        );
    }
};

export default MantEstadoEjemplar;

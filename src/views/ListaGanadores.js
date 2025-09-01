import React, { Fragment, useState, useEffect, Component } from 'react';
import ListaGanadoresTodos from '../components/mantenimientos/Ganadores/ListaGanadoresCierre';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class ListaGanadores extends Component {

    componentDidMount() {
        // if (!cookies.get('Sgm_cUsuario')) {
        //     window.location.href = "./login";
        // }
    };

    render() {
        return (
            <div>
                <div>
                    <h3 style={{ textAlign: 'center' }}>Lista Ganadores</h3>
                    <h5 style={{ textAlign: 'center' }}>"Pujas Cerradas"</h5>
                </div>
                <ListaGanadoresTodos />
            </div>
        );
    }
};

export default ListaGanadores;

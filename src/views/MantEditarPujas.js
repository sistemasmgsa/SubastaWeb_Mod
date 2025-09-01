import React, { Fragment, useState, useEffect, Component } from 'react';
import EditaPujas from '../components/mantenimientos/EditarPujas/EditarPujas';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class MantEditarPujas extends Component {

    componentDidMount() {
        // if (!cookies.get('Sgm_cUsuario')) {
        //     window.location.href = "./subasta";
        // }
    };

    render() {
        return (
            <div >

                <div>
                    <h3>Mantenimiento - Editar Pujas</h3>
                </div>

                <EditaPujas />                  
            </div>
        );
    }
};

export default MantEditarPujas;

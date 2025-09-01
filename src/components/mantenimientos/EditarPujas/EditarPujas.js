import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { eventoService } from '../../../services/evento.service.js';
import CustomAlert from '../../mensajes/CustomAlert.js';
import { storage } from "../../../storage.js";
import Typography from '@mui/material/Typography';


function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

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

const EditaPujas = (props) => {

  const history = useHistory();
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);


  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterDocID, setFilterDocID] = useState('');
  const [filterNombres, setFilterNombres] = useState('');

  const [filteredData, setFilteredData] = useState(data);

      //#region Alerta
        const [confirmOpen, setConfirmOpen] = useState(false);
      const [alertMessage, setAlertMessage] = useState('');
      const [alertType, setAlertType] = useState('');
      const [alertOpen, setAlertOpen] = useState(false);

      const [accionConfirmar, setAccionConfirmar] = useState(null); // "ACTIVAR" o "DESACTIVAR"

  
      const handleAlertOpen = () => {
          setAlertOpen(true);
      };
      const handleAlertClose = () => {
          setAlertOpen(false);
      };

  // Load de pagina
  useEffect(() => {
    listar();

  }, []);

  // procedimiento para CONSULTA un catalogo con SP MySQL
  const listar = async () => {
    let _body = { Accion: "BUSCARTODOS", Emp_cCodigo: storage.GetStorage("Emp_cCodigo") }

    return await eventoService.obtenerEventosDetPujaAuth(_body).then(
      (res) => {
        setData(res[0]);
        setFilteredData(res[0]);
      },
      (error) => {
        console.log(error);
      }
    );
  };


  // procedimiento para ELIMINAR un catalogo con SP MySQL
  const eliminar = async (Emp_cCodigo, Pan_cAnio, Per_cPeriodo, Dvm_cNummov, Cab_cCatalogo, Dvd_nCorrel) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      try {
        let _result;
        let _body = ({ Accion: "ELIMINAR", Emp_cCodigo: Emp_cCodigo, Pan_cAnio: Pan_cAnio, Per_cPeriodo: Per_cPeriodo, Dvm_cNummov: Dvm_cNummov, Cab_cCatalogo: Cab_cCatalogo, Dvd_nCorrel: Dvd_nCorrel })

        await eventoService.obtenerEventosDetPujaAuth(_body).then(
          (res) => {
            _result = res;
          },
          (error) => {
            console.log(error);
          }
        );

        if (_result.error) {
          throw _result.error;
        }

        alert('El registro fue eliminado');

        listar();

      } catch (error) {
        alert(error);
      }
    }
  };



  // procedimiento para EDITAR un catalogo con SP MySQL
  const editar = (Emp_cCodigo, Pan_cAnio, Per_cPeriodo, Dvm_cNummov, Cab_cCatalogo, Dvd_nCorrel) => {
    history.push({
      pathname: `/editareventodetpuja/${Emp_cCodigo}/${Pan_cAnio}/${Per_cPeriodo}/${Dvm_cNummov}/${Cab_cCatalogo}/${Dvd_nCorrel}`,
      state: { props }
    });
  }

  // procedimiento para CREAR un catalogo con SP MySQL
  const crear = () => {
    history.push({
      pathname: '/creareventodetpuja',
      state: { props }
    });
  }


  const handleFilterChangePlaca = (event) => {
    setFilterPlaca(event.target.value);
  };
  const handleFilterChangeDocID = (event) => {
    setFilterDocID(event.target.value);
  };
  const handleFilterChangeNombres = (event) => {
    setFilterNombres(event.target.value);
  };

  const handleFilterSubmit = () => {
    let filtered;
    filtered = data.filter(item => item.Placa.toLowerCase().includes(filterPlaca.toLowerCase()));
    filtered = filtered.filter(item => item.Dvd_cDocID.toLowerCase().includes(filterDocID.toLowerCase()));
    filtered = filtered.filter(item => item.Dvd_cNombres.toLowerCase().includes(filterNombres.toLowerCase()));

    setFilteredData(filtered);
  };

    const [selectedNummov, setSelectedNummov] = useState(null);
    const [selectedCatalogo, setSelectedCatalogo] = useState(null);
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
      const [selectedCorrel, setSelectedCorrel] = useState(null);

        const handleConfirmOpen = (pNummov, pCatalogo, pPeriodo , pCorrel, accion) => {
  
          let _mensaje = "";
  
          if (_mensaje != "") {
  
              setAlertMessage(_mensaje);
              setAlertType("alert");
              handleAlertOpen();
          }
          else {
              setSelectedNummov(pNummov);        
              setSelectedCatalogo(pCatalogo);
              
              setSelectedPeriodo(pPeriodo);
              setSelectedCorrel(pCorrel);
              setAccionConfirmar(accion);
                 
              const mensajeConfirmacion = accion === "DESACTIVAR"
                ? "¿Deseas desactivar la puja?"
                : "¿Deseas activar la puja?";
              setAlertMessage(mensajeConfirmacion);
              setConfirmOpen(true);
          }
  
      };

      
      const handleConfirmClose = (result) => {
        if (result) {
          if (accionConfirmar === "DESACTIVAR") {
            desactivarPuja(selectedNummov, selectedCatalogo, selectedPeriodo, selectedCorrel);
          } else if (accionConfirmar === "ACTIVAR") {
            ActivarPuja(selectedNummov, selectedCatalogo, selectedPeriodo, selectedCorrel);
          }
        }
        setConfirmOpen(false);
        setAccionConfirmar(null); // Limpias la acción después
      };



        const desactivarPuja = async (pNummov, pCatalogo,pPeriodo , pCorrel ) => {
          try {
      
            let _body = {


              Accion: "DESACTIVAR_PUJA", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio")
              , Per_cPeriodo: pPeriodo,
                    Dvm_cNummov: pNummov, Cab_cCatalogo: pCatalogo, Dvd_nCorrel: pCorrel,
                    Dvd_cDocID: null, Dvd_cNombres: null, Dvd_cApellidos: null,
                    Dvd_cTelefono: null, Dvd_cCorreo: null, Dvd_nImporte: null,
                    Dvd_cEstado: null, Dvd_cComentario: null, Dvd_dFechaModificacion: null

            }

      
             await eventoService.obtenerEventosDetPujaAuth(_body).then(
              (res) => {
                setData(res[0]);
              },
              (error) => {
                console.log(error)
                setError(error);
              }
            );
      
      
            alert('El registro fue actualizado');
            listar();
    
      
          } catch (error) {
            alert(error);
      
      
          } finally {
            setLoading(false);
          }
        }
    
        const ActivarPuja = async (pNummov, pCatalogo,pPeriodo , pCorrel ) => {
          try {
      
            let _body = {


              Accion: "ACTIVAR_PUJA", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio")
              , Per_cPeriodo: pPeriodo,
                    Dvm_cNummov: pNummov, Cab_cCatalogo: pCatalogo, Dvd_nCorrel: pCorrel,
                    Dvd_cDocID: null, Dvd_cNombres: null, Dvd_cApellidos: null,
                    Dvd_cTelefono: null, Dvd_cCorreo: null, Dvd_nImporte: null,
                    Dvd_cEstado: null, Dvd_cComentario: null, Dvd_dFechaModificacion: null

            }

      
             await eventoService.obtenerEventosDetPujaAuth(_body).then(
              (res) => {
                setData(res[0]);
              },
              (error) => {
                console.log(error)
                setError(error);
              }
            );
      
      
            alert('El registro fue actualizado');
            listar();
    
      
          } catch (error) {
            alert(error);
      
      
          } finally {
            setLoading(false);
          }
        }

            const handleVerDetalle = async () => {
      setFilterPlaca("")
      setFilterDocID("")
      listar();
        
    }

  return (
    <div>
            <CustomAlert
                      type={alertType}
                      message={alertMessage}
                      open={alertOpen}
                      onClose={handleAlertClose}
                  />
                  <CustomAlert
                      type="confirm"
                      message={alertMessage}
                      open={confirmOpen}
                      onClose={handleConfirmClose}
                  />

      <Box sx={{ flexGrow: 1 }}>
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
          <Grid container spacing={1}>
            <Grid item xs={12} >


              <div>
                <Grid container spacing={1}>
                  <Grid item xs={5} lg={3}>
                    <TextField label="Filtrar por Placa" value={filterPlaca} onChange={handleFilterChangePlaca} />
                  </Grid>
                  <Grid item xs={7} lg={3}>
                    <TextField label="Filtrar por Doc ID" value={filterDocID} onChange={handleFilterChangeDocID} />
                  </Grid>
                  {/* <Grid item xs={8} lg={3}>
                    <TextField label="Filtrar por Nombres" value={filterNombres} onChange={handleFilterChangeNombres} />
                  </Grid> */}

                  <Grid item xs={4} lg={3}>
                    <Button variant="contained" color="primary" onClick={handleFilterSubmit}>
                      Filtrar
                    </Button>
                  </Grid>

                  
                  


                </Grid>
              </div>

            <div>.</div>
              
             <Button variant="contained" size="small" color="primary" onClick={handleVerDetalle}  >Actualizar Todas las pujas</Button>
             <div>.</div>

            </Grid>
            <Grid item xs={12} >
              <TableContainer component={Paper}>




                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left"><strong>Pujas</strong></StyledTableCell>
                      <StyledTableCell align="left"><strong>Acción</strong></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((item, idx) => (
                      <StyledTableRow item={item} key={idx}>
                        <StyledTableCell align="left">
                          <div style={{ whiteSpace: 'pre-line' }}>
                            <strong>Catálogo:</strong> {item.Cab_cCatalogo}{"\n"}
                            <strong>Placa:</strong> {item.Placa}{"\n"}
                            <strong>Doc ID:</strong> {item.Dvd_cDocID}{"\n"}
                            <strong>Nombres:</strong> {item.Dvd_cNombres}{"\n"}
                            <strong>Apellidos:</strong> {item.Dvd_cApellidos}{"\n"}
                            <strong>Teléfono:</strong> {item.Dvd_cTelefono}{"\n"}
                            <strong>Importe:</strong> {ccyFormat(item.Dvd_nImporte)}{"\n"}
                            <strong>Estado:</strong> {item.Dvd_cEstado}{"\n"}
                            
                            <strong>Fecha:</strong> {item.Dvd_dFechaPuja}{"\n"}
                            <strong>Comentario:</strong> {item.Dvd_cComentario}{"\n"}

                            <Typography
                            variant="body2"
                            color={item.Dvd_cEstado === 'A' ? 'primary' : 'error'}
                            style={{fontSize:'16px'}}
                            >
                            <strong>Puja:</strong> {item.Dvd_cEstado === 'A' ? 'ACTIVA' : 'INACTIVA'}
                            </Typography>

 
                          </div>
                        </StyledTableCell>


                        <StyledTableCell align="left">
                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleConfirmOpen(
                                  item.Dvm_cNummov,
                                  item.Cab_cCatalogo,
                                  item.Per_cPeriodo,
                                  item.Dvd_nCorrel,
                                  "ACTIVAR"
                                )
                              }
                            >
                              Activar Puja
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() =>
                                handleConfirmOpen(
                                  item.Dvm_cNummov,
                                  item.Cab_cCatalogo,
                                  item.Per_cPeriodo,
                                  item.Dvd_nCorrel,
                                  "DESACTIVAR"
                                )
                              }
                            >
                               Desactivar Puja
                            </Button>
                          </Box>
                        </StyledTableCell>

                        {/* <StyledTableCell align="left"><Button variant="contained" size="small" color="primary" onClick={() => eliminar(item.Emp_cCodigo, item.Pan_cAnio, item.Per_cPeriodo, item.Dvm_cNummov, item.Cab_cCatalogo, item.Dvd_nCorrel)} >Eliminar</Button></StyledTableCell> */}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>


              </TableContainer>
            </Grid>
          </Grid>
        </Paper>


      </Box >


    </div >
  )
}

export default EditaPujas
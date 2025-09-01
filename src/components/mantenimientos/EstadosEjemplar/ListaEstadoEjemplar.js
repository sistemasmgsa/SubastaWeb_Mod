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
import Box from '@mui/material/Box';
import { eventoService } from '../../../services/evento.service';
import CustomAlert from '../../mensajes/CustomAlert.js';
import Grid from '@mui/material/Grid';
import { storage } from "../../../storage.js";
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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

const ListaEstadoEjemplar = (props) => {

  const history = useHistory();
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);

  // Load de pagina
  useEffect(() => {
    listar();
  }, []);

  // procedimiento para CONSULTA un catalogo con SP MySQL
  const listar = async () => {
    let _body = { Accion: "BUSCARTODOS", Emp_cCodigo: storage.GetStorage("Emp_cCodigo") }

    return await eventoService.obtenerEventosDetAuth(_body).then(
      (res) => {
        setData(res[0]);

         setDataOriginal(res[0]);
      },
      (error) => {
        console.log(error);
      }
    );
  };


  // procedimiento para ELIMINAR un catalogo con SP MySQL
  const eliminar = async (Emp_cCodigo, Pan_cAnio, Per_cPeriodo, Dvm_cNummov, Cab_cCatalogo) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      try {
        let _result;
        let _body = ({ Accion: "ELIMINAR", Emp_cCodigo: Emp_cCodigo, Pan_cAnio: Pan_cAnio, Per_cPeriodo: Per_cPeriodo, Dvm_cNummov: Dvm_cNummov, Cab_cCatalogo: Cab_cCatalogo })

        await eventoService.obtenerEventosDetAuth(_body).then(
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
  const editar = (Emp_cCodigo, Pan_cAnio, Per_cPeriodo, Dvm_cNummov, Cab_cCatalogo) => {
    history.push({
      pathname: `/editareventodet/${Emp_cCodigo}/${Pan_cAnio}/${Per_cPeriodo}/${Dvm_cNummov}/${Cab_cCatalogo}`,
      state: { props }
    });
  }

  // procedimiento para CREAR un catalogo con SP MySQL
  const crear = () => {
    history.push({
      pathname: '/creareventodet',
      state: { props }
    });
  }

      //#region Alerta
      const [alertMessage, setAlertMessage] = useState('');
      const [alertType, setAlertType] = useState('');
      const [alertOpen, setAlertOpen] = useState(false);
  
      const handleAlertOpen = () => {
          setAlertOpen(true);
      };
      const handleAlertClose = () => {
          setAlertOpen(false);
      };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedNummov, setSelectedNummov] = useState(null);
const [selectedCatalogo, setSelectedCatalogo] = useState(null);

      const [accionConfirmar, setAccionConfirmar] = useState(null); // "ACTIVAR" o "DESACTIVAR"
  
      const handleConfirmOpen = (pNummov, pCatalogo,accion) => {

  
          let _mensaje = "";
  
          if (_mensaje != "") {
  
              setAlertMessage(_mensaje);
              setAlertType("alert");
              handleAlertOpen();
          }
          else {
              setSelectedNummov(pNummov);        
              setSelectedCatalogo(pCatalogo);   
              setAccionConfirmar(accion);

              const mensajeConfirmacion = accion === "DESACTIVAR"
                ? "¿Deseas confirmar el Cierre del Ejemplar " + pCatalogo + "?"
                
                : "¿Deseas abrir el Ejemplar " + pCatalogo + "?";
              setAlertMessage(mensajeConfirmacion);

              setConfirmOpen(true);
          }
  
      };


      const handleConfirmClose = (result) => {
        if (result) {
          if (accionConfirmar === "DESACTIVAR") {
            CerrarEjemplar(selectedNummov, selectedCatalogo);
          } else if (accionConfirmar === "ACTIVAR") {
            abrirEjemplar(selectedNummov, selectedCatalogo);
          }
        }
        setConfirmOpen(false);
        setAccionConfirmar(null); // Limpias la acción después
      };




    const CerrarEjemplar = async (pNummov, pCatalogo) => {
      try {
  
        let _body = {
          Accion: "CERRAR_EJEMPLAR", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio"),
          Per_cPeriodo: null, Dvm_cNummov: pNummov,
          Cab_cCatalogo: pCatalogo, Dvd_nOrden: null,
          Dvd_nTopeImporte: null, Dvd_cEstado: null,
          Dvd_dInicio: null, Dvd_dFin: null, Dvd_cComentario: null
        }

 
  
        await eventoService.obtenerEventosDetAuth(_body).then(
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


      const [filterPlaca, setFilterPlaca] = useState('');
      const [filterCatalogo, setCatalogo] = useState('');
      const [filterNombres, setFilterNombres] = useState('');
      const [dataOriginal, setDataOriginal] = useState([]);
    
        const handleFilterChangePlaca = (event) => {
    setFilterPlaca(event.target.value);
  };
  const handleFilterChangeCatalogo = (event) => {
    setCatalogo(event.target.value);
  };


  const handleFilterSubmit = () => {
    let filtered = dataOriginal;

    if (filterPlaca.trim() !== '') {
      filtered = filtered.filter(item =>
        item.Placa?.toLowerCase().includes(filterPlaca.toLowerCase())
      );
    }

    if (filterCatalogo.trim() !== '') {
      filtered = filtered.filter(item =>
        item.Cab_cCatalogo?.toLowerCase().includes(filterCatalogo.toLowerCase())
      );
    }

    setData(filtered);
  };


  
     const [imagenesCargadas, setImagenesCargadas] = useState({});
    
      const getValidImage = async (basePath) => {
      const exts = [".jpg", ".jpeg", ".png", ".webp"];
      for (let ext of exts) {
        const fullPath = `${basePath}${ext}`;
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
          for (const item of data) {
            const img = await getValidImage(item.Cab_cEnlace);
            nuevasImagenes[item.Cab_cEnlace] = img;
          }
          setImagenesCargadas(nuevasImagenes);
        };
    
        // if (data.length > 0) {
           cargarImagenes();
        // }
      }, [data]);


    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);


  const handleOpenModal = (item) => {
  setSelectedItem(item);
  // setFechaFin(item.Dvd_dFin ? new Date(item.Dvd_dFin).toISOString().slice(0,16) : '');
  setOpenModal(true);
  };

  const handleCloseModal = () => {
  setOpenModal(false);
  setSelectedItem(null);
  };

  
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const now = new Date();

    // Sumar 10 minutos a la hora actual local (ya está en hora de Perú)
    now.setMinutes(now.getMinutes() + 10);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
    setFechaFin(formatted);
  }, []);


  const convertirFormatoFecha = (fechaLocalInput) => {
  if (!fechaLocalInput) return null;
  const fecha = new Date(fechaLocalInput);
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const hora = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const segundos = String(fecha.getSeconds()).padStart(2, '0');
  return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
};


  const abrirEjemplar = async (pNummov, pCatalogo) => {
      try {


        const fechaFormateada = convertirFormatoFecha(fechaFin);
        // console.log(fechaFormateada)


        let _body = {
          Accion: "ABRIR_EJEMPLAR", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio"),
          Per_cPeriodo: null, Dvm_cNummov: pNummov,
          Cab_cCatalogo: pCatalogo, Dvd_nOrden: null,
          Dvd_nTopeImporte: null, Dvd_cEstado: null,
          Dvd_dInicio: null, Dvd_dFin: fechaFormateada, Dvd_cComentario: null
        }
 
        // console.log(_body)
  
        await eventoService.obtenerEventosDetAuth(_body).then(
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
        handleCloseModal();

  
      } catch (error) {
        alert(error);
  
  
      } finally {
        setLoading(false);
      }
    }

        
    const handleVerDetalle = async () => {
      setFilterPlaca("")
      setCatalogo("")
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
                    <TextField label="Filtrar por Catalogo" value={filterCatalogo} onChange={handleFilterChangeCatalogo} />
                  </Grid>

                  <Grid item xs={4} lg={3}>
                    <Button variant="contained" color="primary" onClick={handleFilterSubmit}>
                      Filtrar
                    </Button>
                  </Grid>
                </Grid>
              </div>

            </Grid>
            </Grid>
        <Box>

          <table>
            <tbody>
            <div>.</div>

            <Button variant="contained" size="small" color="primary" onClick={handleVerDetalle}  >Actualizar Todos los ejemplares</Button>
            <div>.</div>

              {/* <tr>
                <td>
                  <Button variant="contained" size="small" color="primary"
                    onClick={() => crear()} >Nuevo
                  </Button>
                </td>
                
              </tr> */}

              {/* <tr>
                <td>
                  <p>.</p>
                </td>
              </tr> */}
              <tr>
                <td>
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>

                          <StyledTableCell align="center">Ejemplares</StyledTableCell>
                          <StyledTableCell align="center">Accion</StyledTableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(data ?? []).map((item, idx) => (
                          <StyledTableRow item={item} key={idx}>


                        <StyledTableCell align="left">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              gap: '12px',
                              flexWrap: 'wrap',
                            }}
                          >
                            {/* Imagen */}
                            {imagenesCargadas[item.Cab_cEnlace] ? (
                              <img
                                src={imagenesCargadas[item.Cab_cEnlace]}
                                alt="Ejemplar"
                                style={{
                                  width: '150px',
                                  height: 'auto',
                                  borderRadius: '4px',
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '150px',
                                  height: '100px',
                                  backgroundColor: '#f0f0f0',
                                  fontSize: '12px',
                                  color: '#999',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                Sin imagen
                              </div>
                            )}

                            {/* Datos */}
                            <div
                              style={{
                                fontSize: '14px',
                                lineHeight: '1.5',
                                minWidth: '180px',
                                flexGrow: 1,
                              }}
                            >
                              <div><strong>Catálogo:</strong> {item.Cab_cCatalogo}</div>
                              <div><strong>Placa:</strong> {item.Placa}</div>
                              <div><strong>Orden:</strong> {item.Dvd_nOrden}</div>
                              <div><strong>Importe:</strong> {ccyFormat(item.Dvd_nImporte)}</div>
                              <div><strong>Tope:</strong> {ccyFormat(item.Dvd_nTopeImporte)}</div>
                              {/* <div><strong>Estado:</strong> {item.Dvd_cEstado}</div> */}
                              <div><strong>Inicio:</strong> {item.Dvd_dInicio}</div>
                              <div><strong>Fin:</strong> {item.Dvd_dFin}</div>
                              <div><strong>Comentario:</strong> {item.Dvd_cComentario}</div>

                              <Typography
                                variant="body2"
                                color={item.Estadoejemplar === 'A' ? 'primary' : 'error'}
                                style={{fontSize:'16px'}}
                              >
                                <strong>Estado:</strong> {item.Estadoejemplar === 'A' ? 'ABIERTO' : 'CERRADO'}
                              </Typography>

                            </div>
                          </div>


                        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                          <DialogTitle>
                            {selectedItem ? `Detalles del Ejemplar - Placa ${selectedItem.Placa}` : 'Detalles del Ejemplar'}
                          </DialogTitle>

                          <DialogContent dividers>
                            {selectedItem && (
                              <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                                {/* Imagen */}
                                {imagenesCargadas[selectedItem.Cab_cEnlace] ? (
                                  <img
                                    src={imagenesCargadas[selectedItem.Cab_cEnlace]}
                                    alt="Ejemplar"
                                    style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '6px' }}
                                  />
                                ) : (
                                  <Box
                                    width="100%"
                                    maxWidth="300px"
                                    height="150px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    bgcolor="#f0f0f0"
                                    color="#999"
                                    fontSize="14px"
                                    borderRadius="6px"
                                  >
                                    Sin imagen
                                  </Box>
                                )}

                                {/* Campo editable de fecha */}
                                <Box width="100%">
                                  <Typography variant="subtitle1" gutterBottom><strong>Fecha de finalización:</strong></Typography>
                                  <input
                                    type="datetime-local"
                                    style={{
                                      width: '100%',
                                      padding: '10px',
                                      borderRadius: '6px',
                                      border: '1px solid #ccc',
                                      fontSize: '16px'
                                    }}
                                    value={fechaFin || ''}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                  />
                                </Box>
                              </Box>
                            )}
                          </DialogContent>

                          <DialogActions>
                            <Button onClick={handleCloseModal} color="error">Cerrar</Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleConfirmOpen(selectedItem.Dvm_cNummov, selectedItem.Cab_cCatalogo, "ACTIVAR")
                              }
                            >
                              Actualizar Fecha
                            </Button>
                            {/* <Button onClick={handleConfirmOpen(item.Dvm_cNummov, item.Cab_cCatalogo,"ACTIVAR")} variant="contained" color="primary">Actualizar Fecha</Button> */}
                          </DialogActions>
                        </Dialog>


                        </StyledTableCell>


                        <StyledTableCell align="left">
                          <Box
                            display="flex"
                            flexDirection="row"
                            flexWrap="wrap"
                            gap={1}
                            justifyContent="flex-start"
                          >
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleOpenModal(item)}
                          >
                            Abrir Ejemplar
                          </Button>

                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() =>
                                handleConfirmOpen(item.Dvm_cNummov, item.Cab_cCatalogo, "DESACTIVAR")
                              }
                            >
                              Cerrar Ejemplar
                            </Button>
                          </Box>
                        </StyledTableCell>


                        
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </td>
              </tr>
            </tbody>
          </table>




        </Box>

      </Paper>
    </div>
  )
}

export default ListaEstadoEjemplar
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
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { storage } from "../../../storage.js";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs'; 

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

const ListaGanadores = (props) => {

  const history = useHistory();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);


  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterDocID, setFilterDocID] = useState('');
  const [filterNombres, setFilterNombres] = useState('');

  const [filteredData, setFilteredData] = useState(data);
  const [filteredData2, setFilteredData2] = useState(data);
  const total = CalculaTotal(filteredData);
  const cantidad = CalculaCantidad(filteredData);
  const cantidadItems = CalculaCantidadItems(filteredData);

  // procedimiento para CONSULTA un catalogo con SP MySQL
  const listar = async () => {
    let _body = { Accion: "LISTA_GANADORES", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio") }

    return await eventoService.obtenerEventosDetPujaAuth(_body).then(
      (res) => {

        setData(res[0]);
        console.log(res)
        setFilteredData(res[0]);
      },
      (error) => {
        console.log(error);

      }
    );
  };


  
const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ListaGanadores');

  const headers = [
    'Placa', 'Catalogo', 'Doc ID', 'Nombres', 'Apellidos',
    'Telefono', 'Estado', 'N° Pujas', 'Importe Ganador',
    'Puja', 'Inicio', 'Fin'
  ];

  // Agregar encabezado con estilo
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF002060' }
    };
  });

  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  // 🔽 Ordenar únicamente por Importe Ganador de mayor a menor
  const sortedData = [...filteredData].sort((a, b) => b.Dvd_nImporte - a.Dvd_nImporte);

  // Agregar filas sin colores ni agrupaciones
  sortedData.forEach(item => {
    worksheet.addRow([
      item.Placa,
      item.Cab_cCatalogo,
      item.Dvd_cDocID,
      item.Dvd_cNombres,
      item.Dvd_cApellidos,
      item.Dvd_cTelefono,
      item.Estado,
      item.Contador,
      item.Dvd_nImporte,
      item.Dvd_dFechaPuja,
      item.Dvd_dInicio,
      item.Dvd_dFin
    ]);
  });

  // Definir anchos personalizados para columnas A hasta L
  worksheet.getColumn(1).width = 6;   
  worksheet.getColumn(2).width = 8;  
  worksheet.getColumn(3).width = 9;   
  worksheet.getColumn(4).width = 20; 
  worksheet.getColumn(5).width = 25; 
  worksheet.getColumn(6).width = 10; 
  worksheet.getColumn(7).width = 11;   
  worksheet.getColumn(8).width = 8;   
  worksheet.getColumn(9).width = 15;  
  worksheet.getColumn(10).width = 29; 
  worksheet.getColumn(11).width = 23; 
  worksheet.getColumn(12).width = 23;

  // Para columnas M en adelante (13 en adelante), poner ancho 15 si hay más columnas
  for (let i = 13; i <= worksheet.columnCount; i++) {
    worksheet.getColumn(i).width = 15;
  }


  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const now = new Date();
  const fechaHora = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

  saveAs(blob, `reporte_lista_ganadores_${fechaHora}.xlsx`);
};






    // procedimiento para CONSULTA un catalogo con SP MySQL
  const listarUltimasPujas = async () => {
    let _body = { Accion: "LISTA_TRES_ULTIMAS_PUJAS", Emp_cCodigo: storage.GetStorage("Emp_cCodigo"), Pan_cAnio: storage.GetStorage("Pan_cAnio") }

    return await eventoService.obtenerEventosDetPujaAuth(_body).then(
      (res) => {

        setData2(res[0]);
        setFilteredData2(res[0]);
      },
      (error) => {
        console.log(error);

      }
    );
  };

  const exportToExcel2 = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('TresUltimasPujas');

  const headers = [
    'Catalogo', 'Placa', 'Item', 'Doc ID', 'Nombres', 'Apellidos', 
    'Telefono', 'Correo', 'Importe', 'Estado', 'Fecha Puja', 
    'Comentario', 'Fecha Modificacion'
  ];
    // Agregar la fila de encabezado
  const headerRow = worksheet.addRow(headers);

  // Aplicar estilo: fondo azul y texto blanco
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // blanco
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF002060' } // azul (puedes usar otro si prefieres)
    };
  });

  worksheet.views = [
  { state: 'frozen', ySplit: 1 }
  ];

  // Agrupar por Cab_cCatalogo
  const grouped = {};
  filteredData2.forEach(item => {
    const key = item.Cab_cCatalogo;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  // Colores pastel suaves
  const colors = ['FFEBEE', 'E3F2FD', 'E8F5E9', 'FFF3E0', 'F3E5F5', 'F1F8E9'];
  let colorIndex = 0;

  for (const [catalogo, items] of Object.entries(grouped)) {
    // Fila de separación con el nombre del catálogo
    worksheet.addRow([`Catálogo: ${catalogo}`]).font = { italic: true, bold: true };
    
    // Pintar grupo con color
    const fillColor = colors[colorIndex % colors.length];
    colorIndex++;

    items.forEach(item => {
      const row = worksheet.addRow([
        item.Cab_cCatalogo,
        item.Placa,
        item.Dvd_nCorrel,
        item.Dvd_cDocID,
        item.Dvd_cNombres,
        item.Dvd_cApellidos,
        item.Dvd_cTelefono,
        item.Dvd_cCorreo,
        item.Dvd_nImporte,
        item.Dvd_cEstado,
        item.Dvd_dFechaPuja,
        item.Dvd_cComentario,
        item.Dvd_dFechaModificacion
      ]);
      row.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
      });
    });

    // Fila vacía entre grupos
    worksheet.addRow([]);
  }

  worksheet.columns.forEach(column => {
    column.width = 20;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const now = new Date();
  const fechaHora = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

  saveAs(blob, `reporte_tres_ultimas_pujas_${fechaHora}.xlsx`);
  };



  function CalculaTotal(items) {
    return items.map(({ Dvd_nImporte }) => Dvd_nImporte).reduce((sum, i) => sum + i, 0);
  }

  function CalculaCantidadItems(items) {
    return items.map(({ Quantity }) => Quantity).reduce((sum, i) => sum + i, 0);
  }


  function CalculaCantidad(items) {
    return items
      .filter(({ Dvd_nImporte }) => Dvd_nImporte > 0)
      .map(({ Quantity }) => Quantity)
      .reduce((sum, i) => sum + i, 0);
  }


  // Load de pagina
  useEffect(() => {
    listar();
    listarUltimasPujas();
  }, []);



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



  return (
    <div>
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
                  <Grid item xs={5} lg={4}>
                    <TextField label="Filtrar por Placa" value={filterPlaca} onChange={handleFilterChangePlaca} />
                  </Grid>
                  <Grid item xs={7} lg={4}>
                    <TextField label="Filtrar por Doc ID" value={filterDocID} onChange={handleFilterChangeDocID} />
                  </Grid>
                  <Grid item xs={6} lg={4}>
                    <TextField label="Filtrar por Nombres" value={filterNombres} onChange={handleFilterChangeNombres} />
                  </Grid>
                  <Grid item xs={3} lg={4}>
                    <Button variant="contained" color="primary" onClick={handleFilterSubmit}>
                      Filtrar
                    </Button>
                  </Grid>
                  
                   <Grid item xs={12} lg={8}>
          <Grid container spacing={2} direction="row">
            <Grid item>
              <Button variant="outlined" color="primary" onClick={listar}>
                Actualizar
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success"  onClick={exportToExcel}>
                Reporte de lista ganadores.
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={exportToExcel2}>
                Reporte de tres ultimas pujas.
              </Button>
            </Grid>
              </Grid>

                  </Grid>
                </Grid>
              </div>

            </Grid>
            <Grid item xs={12} >
              <TableContainer component={Paper}>




                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">Placa</StyledTableCell>
                      <StyledTableCell align="left">Catalogo</StyledTableCell>
                      <StyledTableCell align="left">Doc ID</StyledTableCell>
                      <StyledTableCell align="left">Nombres</StyledTableCell>
                      <StyledTableCell align="left">Apellidos</StyledTableCell>
                      <StyledTableCell align="left">Telefono</StyledTableCell>
                      <StyledTableCell align="left">Estado</StyledTableCell>
                      <StyledTableCell align="right">N° Pujas</StyledTableCell>
                      <StyledTableCell align="left">Importe Ganador</StyledTableCell>
                      <StyledTableCell align="left">Puja</StyledTableCell>
                      <StyledTableCell align="left">Inicio</StyledTableCell>
                      <StyledTableCell align="left">Fin</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((item, idx) => (
                      <StyledTableRow item={item} key={idx}>

  
                        <StyledTableCell align="left">{item.Placa}</StyledTableCell>
                        <StyledTableCell align="left">{item.Cab_cCatalogo}</StyledTableCell>
                        <StyledTableCell align="left">{item.Dvd_cDocID}</StyledTableCell>
                        <StyledTableCell align="left">{item.Dvd_cNombres}</StyledTableCell>
                        <StyledTableCell align="left">{item.Dvd_cApellidos}</StyledTableCell>
                        <StyledTableCell align="left">{item.Dvd_cTelefono}</StyledTableCell>
                        <StyledTableCell align="left">{item.Estado}</StyledTableCell>

                        <StyledTableCell align="right">{item.Contador}</StyledTableCell>

                        <StyledTableCell align="right">{ccyFormat(item.Dvd_nImporte)}</StyledTableCell>
                        <StyledTableCell align="left">{item.Dvd_dFechaPuja}</StyledTableCell>
                        <StyledTableCell align="left">{item.Dvd_dInicio}</StyledTableCell>
                        <StyledTableCell align="left">{item.Dvd_dFin}</StyledTableCell>

                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>


              </TableContainer>
            </Grid>
            <Grid item xs={12} >
              <div className='cart-total'>
                <h4>Cantidad de Items:</h4>
                <span className='total-pagar-sm'>{cantidadItems}</span>
              </div>
            </Grid>
            <Grid item xs={12} >
              <div className='cart-total'>
                <h4>Items Pujados:</h4>
                <span className='total-pagar-sm'>{cantidad}</span>
              </div>
            </Grid>
            <Grid item xs={12} >
              <div className='cart-total'>
                <h4>Puja Total:</h4>
                <span className='total-pagar-sm'>S/.{ccyFormat(total)}</span>
              </div>

            </Grid>
          </Grid>
        </Paper>


      </Box >


    </div >
  )
}


export default ListaGanadores
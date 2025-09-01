import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles } from '@mui/styles';
import fondo from '../assets/images/fondogallos.png';
import { eventoService } from '../services/evento.service';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid } from '@mui/material';
import logoGallos from '../assets/images/logoGallos.png';

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${fondo})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh'
  },
  dialogPaper: {
    width: '400px', // Ajusta el ancho del cuadro de diálogo
    maxWidth: 'none', // Evita que el maxWidth del Dialog sobrescriba tu ancho personalizado
	minHeight: '470px', // Ajusta la altura mínima del cuadro de diálogo
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    opacity: '1',
    height: 'auto', // Ajusta la altura del contenedor
    marginTop: theme.spacing(2),
    width: '100%', // El contenedor ocupará el 100% del ancho del Dialog
	display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center' // Centra el contenido verticalmente
  },
  div: {
    marginTop: theme.spacing(-3),
    display: 'flex',
    flexDirection: 'column',
	flexGrow: 1, // Permite que el contenedor div ocupe el espacio disponible
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%',

    marginTop: theme.spacing(0),
	flexGrow: 1 // Permite que el formulario ocupe el espacio disponible

  },
  button: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const BuscarToken = async () => {
    try {
      let _body = { Accion: "BUSCARREGISTRO", Sgm_cUsuario: username, Sgm_cContrasena: md5(password) };
      const res = await eventoService.obtenerToken(_body);
      if (res) {
        cookies.set('token', res.token, { path: "/" });
        return true;
      } else {
        throw new Error("Token no encontrado");
      }
    } catch (error) {
      console.log("Error in BuscarToken:", error);
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      const tokenObtained = await BuscarToken();
      if (!tokenObtained || !cookies.get('token')) {
        throw new Error("Error: Token no existe o no se pudo obtener");
      }
      let _body = { Accion: "BUSCARREGISTRO", Sgm_cUsuario: username, Sgm_cContrasena: md5(password) };
      const res = await eventoService.obtenerUsuario(_body);
      if (res && Array.isArray(res) && res.length > 0 && Array.isArray(res[0]) && res[0].length > 0) {
        let user = res[0][0];
        if (user.Sgm_cUsuario === username) {
          cookies.set('Sgm_cUsuario', user.Sgm_cUsuario, { path: "/" });
          cookies.set('Sgm_cNombre', user.Sgm_cNombre, { path: "/" });
          cookies.set('Sgm_cContrasena', user.Sgm_cContrasena, { path: "/" });
          cookies.set('Sgm_cObservaciones', user.Sgm_cObservaciones, { path: "/" });
          cookies.set('Sgm_cPerfil', user.Sgm_cPerfil, { path: "/" });
          cookies.set('IsLoged', true, { path: "/" });
          window.location.href = "./inicio";
        } else {
          throw new Error("Usuario no coincide con el nombre de usuario proporcionado");
        }
      } else {
        throw new Error("Respuesta de usuario en formato incorrecto o vacía");
      }
    } catch (error) {
      console.log("Error in handleLogin:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: classes.dialogPaper }} // Aplica el estilo personalizado al diálogo
    >

      <DialogContent>
        <Container component={Paper} elevation={100} className={classes.container}>
          <div className={classes.div}>
            <Grid container spacing={1}>
              <Grid item xs={12}>

				<IconButton
					edge="end"
					color="inherit"
					onClick={onClose}
					aria-label="close"
					style={{ right: -283, top: 5 }}
				>
					<CloseIcon />
				</IconButton>


				<Typography component='h1' variant='h6' align="center" style={{ fontSize: '14px' }}>
				BIENVENIDO A:
				</Typography>

              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <img
                  src={logoGallos}
                  alt="Descripción de la imagen"
                  style={{ width: '60%', height: 'auto', marginTop: '0px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography component='h1' variant='h6' style={{ fontSize: '13px' }} align="center">
                  INICIAR SESIÓN
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <form className={classes.form}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        autoFocus
                        color='primary'
                        margin='normal'
                        variant='outlined'
                        label='Usuario'
                        name='nickname'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        color='primary'
                        margin='normal'
                        variant='outlined'
                        label='Contraseña'
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: '#000000',
                          color: '#fff',
                          padding: '10px',
                          fontSize: '18px',
                          '&:hover': {
                            backgroundColor: '#990000',
                          },
                        }}
                        onClick={handleLogin}
                      >
                        Ingresar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </div>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default Login;

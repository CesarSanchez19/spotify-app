import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

// Importar íconos más apropiados para una app de música
import HeadphonesIcon from "@mui/icons-material/Headphones";
import HomeIcon from "@mui/icons-material/Home";

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: "linear-gradient(90deg, #1DB954 0%, #191414 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo para pantallas medianas y grandes */}
          <HeadphonesIcon 
            sx={{ 
              display: { xs: "none", md: "flex" }, 
              mr: 1,
              fontSize: 32,
              color: "#FFFFFF"
            }} 
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: ".1rem",
              color: "#FFFFFF",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1.5rem",
              textShadow: "0px 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            Cesar Sanchez
          </Typography>

          {/* Menú móvil */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#FFFFFF" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ 
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": {
                  backgroundColor: "#191414",
                  color: "#FFFFFF"
                }
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={Link} to="/playlists">
                <Typography sx={{ textAlign: "center", display: "flex", alignItems: "center" }}>
                  <HomeIcon sx={{ mr: 1, fontSize: 20 }} /> Playlists
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={Link} to="/artists">
                <Typography sx={{ textAlign: "center", display: "flex", alignItems: "center" }}>
                  <HomeIcon sx={{ mr: 1, fontSize: 20 }} /> Artistas
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={Link} to="/audiobooks">
                <Typography sx={{ textAlign: "center", display: "flex", alignItems: "center" }}>
                  <HomeIcon sx={{ mr: 1, fontSize: 20 }} /> Audio Libros
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={Link} to="/episodes">
                <Typography sx={{ textAlign: "center", display: "flex", alignItems: "center" }}>
                  <HomeIcon sx={{ mr: 1, fontSize: 20 }} /> Episodios
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Menú de navegación para pantallas medianas y grandes */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 2
            }}
          >
            <Button
              component={Link}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "#FFFFFF", 
                display: "flex", 
                alignItems: "center",
                fontWeight: 600,
                borderRadius: "50px",
                px: 3,
                py: 1,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Inicio
            </Button>
            <Button
              component={Link}
              to="/artists"
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "#FFFFFF", 
                display: "flex", 
                alignItems: "center",
                fontWeight: 600,
                borderRadius: "50px",
                px: 3,
                py: 1,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Artistas
            </Button>
            <Button
              component={Link}
              to="/tracks"
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "#FFFFFF", 
                display: "flex", 
                alignItems: "center",
                fontWeight: 600,
                borderRadius: "50px",
                px: 3,
                py: 1,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Canciones
            </Button>
            <Button
              component={Link}
              to="/podcasts"
              onClick={handleCloseNavMenu}
              sx={{ 
                color: "#FFFFFF", 
                display: "flex", 
                alignItems: "center",
                fontWeight: 600,
                borderRadius: "50px",
                px: 3,
                py: 1,
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              PodCasts
            </Button>
          </Box>

          {/* Buscador y perfil */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              aria-label="search"
              color="inherit"
              sx={{ 
                mr: 2,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }
              }}
            >
            </IconButton>
            
            <Tooltip title="Perfil">
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0,
                  border: "2px solid #1DB954",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 0 10px rgba(29, 185, 84, 0.5)"
                  }
                }}
              >
                <Avatar 
                  alt="Cesar Sanchez" 
                  src="https://avatars.githubusercontent.com/u/181114153?v=4" 
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ 
                mt: "45px",
                "& .MuiPaper-root": {
                  backgroundColor: "#191414",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)"
                }
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem component={Link} to="/aboutus" onClick={handleCloseUserMenu}>
                <Typography sx={{ 
                  color: "#FFFFFF", 
                  fontWeight: 500,
                  px: 1
                }}>
                  About Me
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/login" onClick={handleCloseUserMenu}>
                <Typography sx={{ 
                  color: "#FFFFFF", 
                  fontWeight: 500,
                  px: 1
                }}>
                  Iniciar Sesion
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
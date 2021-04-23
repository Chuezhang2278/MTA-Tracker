import React from "react";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import {
  CssBaseline,
  Typography,
  createMuiTheme,
  Container,
  Box,
  Grid,
  Divider,
  IconButton,
  Backdrop,
  TextField,
} from "@material-ui/core";
import clsx from "clsx";
// Custom Component
import NavBar from '../components/NavBar'
import AboutUsCard from '../components/AboutUsCard'
import czImage from "../imgs/github_img/chue.png"
import jmImage from "../imgs/github_img/jiaming.png"
import xmImage from "../imgs/github_img/sunny.png"

const czRepo = "https://github.com/Chuezhang2278"
const jmRepo = "https://github.com/jma8774"
const xmRepo = "https://github.com/mxmsunny"

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 100,
  },
  gridClass: {
    marginTop: theme.spacing(10),
  },
}));

// Material UI Theme
const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

export default function AboutUsPage(props) {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <NavBar/>
      <CssBaseline />
      <Container>
        <Box mt={4}>
          <Typography variant = "h3" align = "center"> <b>Team 1UP</b> </Typography>
          <br/>
          <Typography variant = "body1" className = {classes.textClass} align = "center"> 
            This project was created as part of the CUNY Tech Prep program. We wanted to make something impactful and useful for fellow New Yorkers.
          </Typography>
        </Box>

        <Grid container 
              direction="row"
              justify="center"
              alignItems="center"
              alignContent="center"
              className={classes.gridClass}
              spacing={3}
        >
          <Grid item xs={12} md={4} align="center">
            <AboutUsCard message = {"Small description about what Sunny does maybe and his role in the project blah blah blah"}
                          Image = {czImage}
                          Link = {czRepo}
                          Name = {"Chue Zhang"}
            />
          </Grid>
          <Grid item xs={12} md={4} align="center">
            <AboutUsCard message = {"Small description about what Sunny does maybe and his role in the project blah blah blah"}
                          Image = {jmImage}
                          Link = {jmRepo}
                          Name = {"Jia Ming Ma"}
            />
          </Grid>
            <Grid item xs={12} md={4} align="center">
            <AboutUsCard message = {"Small description about what Sunny does maybe and his role in the project blah blah blah"}
                          Image = {xmImage}
                          Link = {xmRepo}
                          Name = {"Xiang Min Mo"}
            />
            </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

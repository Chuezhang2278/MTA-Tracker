import 'fontsource-roboto';
import { useParams } from 'react-router';
import axios from 'axios';
import React from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { 
  CssBaseline, 
  Typography,  
  Container, 
  Box, 
  Grid, 
  Divider, 
  IconButton, 
  Backdrop, 
  TextField, 
  Tooltip
} from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import TimerIcon from '@material-ui/icons/Timer';
// Custom Components
import StopCard from '../components/StopCard.js'
import NavBar from '../components/NavBar'
import TrainIcon from '../components/TrainIcon.js'
import AlertSnackbar from '../components/AlertSnackbar'

// Material UI CSS
const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
}));

// Material UI Theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

// Train Descrpitions
const descriptions = {
  '1': 'Trains operate between 242 St in the Bronx and South Ferry in Manhattan, at all times',
  '2': 'Trains operate between Wakefield-241 St, Bronx, and Flatbush Av-Brooklyn College, Brooklyn, at all times. Trains operate local in Bronx and Brooklyn. Trains operate express in Manhattan except late night when it operates local.',
  '3': 'Trains operate between 148 St, 7 Av, Manhattan, and New Lots Av, Brooklyn, at all times except late nights. During late nights, trains operate only in Manhattan between 148 St, 7 Av and Times Square-42 St.',
  '4': 'Trains operate daily between Woodlawn/Jerome Av, Bronx, and Utica Av/Eastern Pkwy, Brooklyn, running express in Manhattan and Brooklyn. During late night and early morning hours, trains run local in Manhattan and Brooklyn, and extend beyond Utica Av to New Lots/Livonia Avs, Brooklyn.',
  '5': 'Weekdays daytime, most trains operate between either Dyre Av or 238 St-Nereid Av, Bronx, and Flatbush Av-Brooklyn College, Brooklyn.',
  '5x': 'Weekdays daytime, most trains operate between either Dyre Av or 238 St-Nereid Av, Bronx, and Flatbush Av-Brooklyn College, Brooklyn.',
  '6': 'Local trains operate between Pelham Bay Park/Bruckner Expwy, Bronx, and Brooklyn Bridge/City Hall, Manhattan, at all times.',
  '6x': 'Express trains operate between Pelham Bay Park/Bruckner Expwy, Bronx, and Brooklyn Bridge/City Hall, Manhattan, weekday mornings express in the Bronx toward Manhattan. Weekday afternoons and evenings, these trains operate express in the Bronx toward Pelham Bay Park.',
  '7': 'Trains operate between Main St-Flushing, Queens, and 34th-Hudson Yards, Manhattan, at all times. ',
  '7x': 'Trains operate between Main St-Flushing, Queens, and 34th St-Hudson Yards, Manhattan, weekday mornings toward Manhattan. Weekday afternoons and evenings, these trains operate express to Queens.',
  'a': 'Trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times.',
  'b': 'Trains operate, weekdays only, between 145 St, Manhattan, and Brighton Beach, Brooklyn at all times except late nights. The route extends to Bedford Park Blvd, Bronx, during rush hours.',
  'c': 'Trains operate between 168 St, Manhattan, and Euclid Av, Brooklyn, daily from about 6 AM to 11 PM.',
  'd': 'Trains operate, at all times, from 205 Street, Bronx, to Stillwell Avenue, Brooklyn via Central Park West and 6th Avenue in Manhattan, and via the Manhattan Bridge to and from Brooklyn.',
  'e': 'Trains operate between Jamaica Center (Parsons/Archer), Queens, and World Trade Center, Manhattan, at all times. E trains operate express in Queens at all times except late nights when they operate local.',
  'f': 'Trains operate at all times between Jamaica-179 St, Queens, and Stillwell Av, Brooklyn via the 63 St Connector (serving 21 St-Queensbridge, Roosevelt Island, Lexington Av-63 St, and 57 St-6 Av). F trains operate local in Manhattan and express in Queens at all times.',
  'g': 'Trains operate between Court Square, Queens and Church Av, Brooklyn on weekdays, late nights, and weekends.',
  'h': 'Service operates at all times between Broad Channel, and Rockaway Park, Queens.',
  'j': 'Trains operate weekdays between Jamaica Center (Parsons/Archer), Queens, and Broad St, Manhattan at all times.',
  'l': 'Trains operate between 8 Av/14 St, Manhattan, and Rockaway Pkwy/Canarsie, Brooklyn, at all times.',
  'm': 'Trains operate between Middle Village-Metropolitan Avenue, Queens and Myrtle Avenue, Brooklyn at all times. Service is extended weekdays (except late nights) Continental Ave, Queens, All trains provide local service.',
  'n': 'Trains operate from Astoria-Ditmars Boulevard, Queens, to Stillwell Avenue, Brooklyn, at all times.',
  'q': 'Trains operate between 96 St-2 Av, Manhattan, and Stillwell Av, Brooklyn at all times. Trains operate local in Brooklyn at all times. Train operate express in Manhattan at all times, except late nights when trains operate local in Manhattan.',
  'r': 'Trains operate local between Forest Hills-71 Av, Queens, and 95 St/4 Av, Brooklyn, at all times except late nights. During late nights, trains operate only in Brooklyn between 36 St and 95 St/4 Av.',
  'si': 'Service runs 24 hours a day between the St George and Tottenville terminals. At the St George terminal, customers can make connections with Staten Island Ferry service to Manhattan.',
  'w': 'Trains operate from Astoria-Ditmars Boulevard, Queens, to Whitehall St, Manhattan, on weekdays only.',
  'z': 'Trains operate weekday rush hours only. During weekday rush hours, J and Z trains provide skip-stop service.'

}

export default function LinePage(props) {
  const classes = useStyles()
  const { train } = useParams()
  const curTime = new Date()
  const [stops, setStops] = React.useState(null)
  const [favorites, setFavorites] = React.useState(new Set([]))
  const [status, setStatus] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const handleReverse = () => {
    setStops(stops.slice().reverse())
  }

  React.useEffect(() => {
    window.scrollTo(0, 0)

    function fetchFavorites() {
      axios.get('http://localhost:8080/api/user/favorite/', {withCredentials: true})
      .then(res => {
        console.log("Favorites", res.data)
        const data = res.data
        setFavorites(new Set(data))
      })
      .catch(error =>
        console.log(error)
      )
    }
    function fetchData() {
      setStatus(false)
      axios.get('http://localhost:8080/api/line/' + train.toUpperCase(), {withCredentials: true})
      .then(res => {
        console.log('Data refreshed')
        console.log("Stations", res.data)
        const data = res.data
        var tmp = []
        for(var i in data) 
          if(data[i].stopName)
            tmp.push([i, data[i]]);
        setStops(Object.keys(data).length > 0 ? tmp : null);
        setStatus(true)
      })
      .catch(error =>
        console.log(error)
      )
    }
    fetchFavorites()
    fetchData()
    const interval = setInterval(fetchData, 10000)

    // Return does something when the page dismounts
    return () => clearInterval(interval);
  }, [train]);
  
  if(train.toLowerCase() in descriptions)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar/>
        { status &&
        <AlertSnackbar msg="Stops updated!" duration={2000} severity='success'/>
        }
        <Container className={classes.root}>
          <Box my={4}>
            <TrainIcon train={train} width={75}/>
          </Box>
          <Typography variant="h6" color="textSecondary">
            {descriptions[train.toLowerCase()]}
          </Typography>
          <Divider className={classes.divider} variant="middle"/>
          {
          stops
          ?
            <React.Fragment>
              <Grid container justify="flex-end">
                <Box mr={1} mt={2}>
                  <Tooltip title={<Typography variant='caption'>Information is refreshed every 10 seconds</Typography>}>
                    <TimerIcon/>
                  </Tooltip>
                </Box>
                <Box mr={2} mt={2}>
                  <Tooltip title={<Typography variant='caption'>Click on any of the supported train icons to go to their respected page</Typography>}>
                    <HelpOutlineIcon/>
                  </Tooltip>
                </Box>
                <Autocomplete
                  id="search-stop"
                  options={stops}
                  getOptionLabel={(option) => option[1].stopName}
                  style={{ width: theme.spacing(30)}}
                  onChange={(e, val) => setSearch(val ? val[1].stopName : '')}
                  renderInput={(params) => <TextField {...params} label="Search" variant="outlined"/>}
                />
                <Box mr={3}>
                  <Tooltip title={<Typography variant='caption'>Reverse Order</Typography>}>
                    <IconButton aria-label="sort" onClick={handleReverse}>
                      <ReorderIcon fontSize="large"/>
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid container align="center">
                { 
                  stops.map((val, i) => 
                    val[1].stopName.toLowerCase().includes(search.toLowerCase()) &&
                    <Grid key={val[0]} item xs={12} md={6} lg={4}>
                      <Box mt={3}>
                        <StopCard stopId = {val[0]} stopInfo={val[1]} curTime={curTime} isFavorite={favorites.has(val[0]) ? "secondary" : "default"}/>
                      </Box>
                    </Grid>
                  )
                }
              </Grid>
            </React.Fragment>
            :
              <Backdrop open={!stops}>
                <Box>
                  <Typography variant="h5" color="initial"> Please wait, fetching information... </Typography>
                  <Typography variant="subtitle1" color="textSecondary"> Pleaes refresh the page if it takes longer than 5 seconds. Either that train is not currently running or the fetch from MTA failed. </Typography>
                </Box>
              </Backdrop>
          }
          <Box my={4}/>
        </Container>
      </ThemeProvider>
    )
  else
    return (
      <Box className={classes.root} mt={3}> 
        <Typography variant="h5">
          Train not supported 
        </Typography>
      </Box>
    )
}

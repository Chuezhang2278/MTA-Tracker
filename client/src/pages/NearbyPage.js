import 'fontsource-roboto';
import axios from 'axios';
import { isMobile } from 'react-device-detect';
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
  CircularProgress,
  Tooltip
} from "@material-ui/core";
import ReorderIcon from '@material-ui/icons/Reorder';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import TimerIcon from '@material-ui/icons/Timer';
// Custom Components
import { StopCard, NavBar, AlertSnackbar, StopCardMobile, BackToTop } from '../components/index';


// Material UI CSS
const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  backdrop: {
    zIndex: 2,
    backgroundColor: '#242424',
  },
}));

// Material UI Theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function NearbyPage(props) {
  const classes = useStyles()
  const curTime = new Date()
  const [stops, setStops] = React.useState(null)
  const [locationBackdrop, setLocationBackdrop] = React.useState(true)
  const [fetchBackdrop, setFetchBackdrop] = React.useState(true)
  const [location, setLocation] = React.useState(null)
  const [status, setStatus] = React.useState(false)
  const [favorites, setFavorites] = React.useState(new Set([]))
  const [search, setSearch] = React.useState('')
  const [disableReverse, setDisableReverse] = React.useState(false)
  const [reverse, setReverse] = React.useState(false)
  const handleReverse = () => {
    setDisableReverse(true)
  }
  
  React.useEffect(() => {
    // If disableReverse change from true to false, ignore the call
    if(!disableReverse)
      return

    setReverse(reverse => !reverse)

    let timer = setTimeout(() => setDisableReverse(false), 2000)
    
    return(() => { clearTimeout(timer) })
  }, [disableReverse])

  const successHandler = function(position) { 
    var obj = {}
    obj['lat'] = position.coords.latitude
    obj['lon'] = position.coords.longitude
    setLocation(obj)
    setLocationBackdrop(false)
  }; 
    
  const errorHandler = function (errorObj) { 
    console.log(errorObj.code + ": " + errorObj.message); 
    alert(errorObj.code + ": " + errorObj.message); 
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition( 
      successHandler, 
      errorHandler, 
      {enableHighAccuracy: true, maximumAge: 10000}
    );
  }, []);

  React.useEffect(() => {
    if(location === null)
      return
    window.scrollTo(0, 0)

    async function fetchData() {
      // Fetch favorites first
      const favorites = await axios.get('/api/user/favorite/', {withCredentials: true})
      console.log("Favorite Stations", favorites.data)
      const data = favorites.data
      setFavorites(new Set(data))

      setStatus(false)
      axios.get(`/api/nearby/lat/${location.lat}/lon/${location.lon}/dist/2`, {withCredentials: true})
      .then(res => {
        console.log("Updated Stations")
        const data = res.data
        var tmp = []
        for(var i in data) 
          if(data[i].stopName)
          tmp.push([i, data[i]]);
        setStops(Object.keys(data).length > 0 ? tmp : null);
        setStatus(true)
      })
      .catch(error =>
        console.log("Error", error)
      )
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)

    // Return does something when the page dismounts
    return () => clearInterval(interval);
  }, [location]);
  
  const renderCards = (val, i) => {
    return ( 
      val[1].stopName.toLowerCase().includes(search.toLowerCase()) &&
      <Grid key={i} item xs={12} md={6} lg={4}>
        <Box mt={3}>
          {
            isMobile
            ? <StopCardMobile stopId={val[0]} stopName={val[1].stopName} trains={val[1].trains} coordinates={val[1].coordinates} curTime={curTime} isFavorite={favorites.has(val[0]) ? "secondary" : "default"}/>
            : <StopCard stopId={val[0]} stopName={val[1].stopName} trains={val[1].trains} coordinates={val[1].coordinates} curTime={curTime} isFavorite={favorites.has(val[0]) ? "secondary" : "default"}/>
          }
        </Box>
      </Grid>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar/>
      <BackToTop />
      { status &&
        <AlertSnackbar msg="Stops updated!" duration={2000} severity='success'/>
      }
      <Container className={classes.root}>
        <Box my={4}>
          <Typography variant="h3">
            <b>Nearby Stops</b>
          </Typography>
        </Box>
        <Typography variant="h6" color="textSecondary">
          If your browser allows it and you give permission, we can help look for stops near your location at a 2 KM radius.
        </Typography>
        <Divider className={classes.divider} variant="middle"/>
          {
            location === null
            ? 
            <Backdrop className={classes.backdrop} open={locationBackdrop && location===null} onClick={() => {setLocationBackdrop(false)}}>
              <Box>
                <Typography variant="h6" color="initial"> 
                  Geolocation is either not supported by your browser, or you have not given permission.
                </Typography>
                <Box mt={2}/>
                <Typography variant="subtitle2" color="textSecondary"> Click anywhere to close message </Typography>
                <Box mt={5}/>
                <CircularProgress/>
              </Box>
            </Backdrop>
            : 
            stops
              ?
                <React.Fragment>
                  <Grid container justify="flex-end">
                    <Box mr={1} mt={2}>
                      <Tooltip title={<Typography variant='caption'>Information is refreshed every 30 seconds</Typography>}>
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
                      style={{ width: theme.spacing(25)}}
                      onChange={(e, val) => setSearch(val ? val[1].stopName : '')}
                      renderInput={(params) => <TextField {...params} label="Search" variant="outlined"/>}
                    />
                    <Box mr={3}>
                      <Tooltip title={<Typography variant='caption'>Reverse Order</Typography>}>
                        <span>
                        <IconButton aria-label="sort" disabled={disableReverse} onClick={handleReverse}>
                          <ReorderIcon fontSize="large"/>
                        </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid container align="center">
                  { 
                    reverse
                    ?
                    stops.slice().reverse().map((val, i) => renderCards(val, i))
                    :
                    stops.map((val, i) => renderCards(val, i))
                  }
                  </Grid>
                </React.Fragment>
              :
                <Backdrop className={classes.backdrop} open={fetchBackdrop && !stops} onClick={() => setFetchBackdrop(false)}>
                  <Box>
                    <Typography variant="h5" color="initial"> 
                      Please wait, fetching information...
                    </Typography>
                    <Typography variant="body1" color="initial"> 
                      If it takes longer than a few seconds, then either that train is not currently running or the fetch from MTA failed.
                    </Typography>
                    <Box mt={2}/>
                    <Typography variant="subtitle2" color="textSecondary"> Click anywhere to close message </Typography>
                    <Box mt={5}/>
                    <CircularProgress/>
                  </Box>
                </Backdrop>
          }
      <Box my={4}/>
      </Container>
    </ThemeProvider>
  )
}

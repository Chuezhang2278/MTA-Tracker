import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import train1 from '../imgs/svg/1.svg';
import train2 from '../imgs/svg/2.svg';
import train3 from '../imgs/svg/3.svg';
import train4 from '../imgs/svg/4.svg';
import train5 from '../imgs/svg/5.svg';
import train5x from '../imgs/svg/5x.svg';
import train6 from '../imgs/svg/6.svg';
import train6x from '../imgs/svg/6x.svg';
import train7 from '../imgs/svg/7.svg';
import train7x from '../imgs/svg/7x.svg';
import traina from '../imgs/svg/a.svg';
import trainb from '../imgs/svg/b.svg';
import trainc from '../imgs/svg/c.svg';
import traind from '../imgs/svg/d.svg';
import traine from '../imgs/svg/e.svg';
import trainf from '../imgs/svg/f.svg';
import traing from '../imgs/svg/g.svg';
import trainh from '../imgs/svg/h.svg';
import trainj from '../imgs/svg/j.svg';
import trainl from '../imgs/svg/l.svg';
import trainm from '../imgs/svg/m.svg';
import trainn from '../imgs/svg/n.svg';
import trainq from '../imgs/svg/q.svg';
import trainr from '../imgs/svg/r.svg';
import trainsir from '../imgs/svg/sir.svg';
import trainw from '../imgs/svg/w.svg';
import trainz from '../imgs/svg/z.svg';
import trainna from '../imgs/svg/na.svg';


const paths = {
  '1': train1,
  '2': train2,
  '3': train3,
  '4': train4,
  '5': train5,
  '5x': train5x,
  '6': train6,
  '6x': train6x,
  '7': train7,
  '7x': train7x,
  'a': traina,
  'b': trainb,
  'c': trainc,
  'd': traind,
  'e': traine,
  'f': trainf,
  'g': traing,
  'h': trainh,
  'j': trainj,
  'l': trainl,
  'm': trainm,
  'n': trainn,
  'q': trainq,
  'r': trainr,
  'si': trainsir,
  'w': trainw,
  'z': trainz,
  'n/a': trainna
}
const useStyles = makeStyles((theme) => ({
  imageIcon: {
    height: '100%',
    verticalAlign: "middle",
  },
  iconRoot: {
    textAlign: 'center'
  }
}));


export default function TrainIcon(props) {
  var { train, width} = props
  const classes = useStyles();
  train = train.toLowerCase()
  
  return (
    <img alt="Train Icon" 
      className={classes.imageIcon} 
      width={width ? width : 25} 
      src={
        train in paths
        ?
          paths[train]
        :
          paths['n/a']
      }
    />
  )
}

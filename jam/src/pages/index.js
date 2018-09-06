import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Layout from '../components/layout'
import Grid from '@material-ui/core/Grid';
import { Paper, Typography } from '@material-ui/core';
import MeetupMonthGraph from '../components/MeetupMonthGraph';
import MeetupWeekdayGraph from '../components/MeetupWeekdayGraph';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});


const IndexPage = (props) => {
  const { classes } = props;
  return (
    <Layout>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} className={classes.grid}>
            <Paper className={classes.paper}>
              <Typography variant="display1" color="inherit" noWrap>
                Monthly Meetup Count
              </Typography>
              <MeetupMonthGraph />
            </Paper>
          </Grid>
          <Grid item xs={12} className={classes.grid}>
            <Paper className={classes.paper}>
              <Typography variant="display1" color="inherit" noWrap>
                Meetup Day of Week
              </Typography>
              <MeetupWeekdayGraph />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default withStyles(styles, { withTheme: true })(IndexPage)

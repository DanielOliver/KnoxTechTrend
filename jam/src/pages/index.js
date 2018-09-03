import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Layout from '../components/layout'
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import MeetupMonthGraph from '../components/MeetupMonthGraph';

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
              <h3>Monthly Meetup count</h3>
              <MeetupMonthGraph />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default withStyles(styles, { withTheme: true })(IndexPage)

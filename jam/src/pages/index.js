import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Layout from '../components/layout'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MeetupMonthGraph from '../components/MeetupMonthGraph';
import { StaticQuery, graphql } from "gatsby"
import MeetupWeekdayGraph from '../components/MeetupWeekdayGraph';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 1.2,
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
              <StaticQuery
                query={graphql`
      query meetupDateList {
        allMeetupEvents(sort: {fields: [MeetupDateLocal], order: ASC}) {
          edges {
            node {
              MeetupDay: MeetupDateLocal(formatString: "MMMM DD, YYYY")
              MeetupMonth: MeetupDateLocal(formatString: "MMMM 1, YYYY")
              SortOrder: MeetupDateLocal(formatString: "YYYY-MM")
              Day: MeetupDateLocal(formatString: "YYYY-MM-dd")
              UtcTime: MeetupDateUtc
            }
          }
        }
      }
      `}
                render={data => {
                  return (
                    <MeetupMonthGraph meetupEvents={data.allMeetupEvents.edges} />
                  )
                }
                }
              />
            </Paper>
          </Grid>
          <Grid item xs={12} className={classes.grid}>
            <Paper className={classes.paper}>
              <Typography variant="display1" color="inherit" noWrap>
                Meetups Per Day of Week
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

import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import Layout from '../components/layout'
import EventTable from '../components/EventTable';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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

const EventList = () => (
  <StaticQuery
    query={graphql`
    query eventsFrontPage {
        events: allMeetupEvents(sort: {fields: [MeetupDateLocal], order: DESC}) {
            edges {
                node {
                    Name
                    RowKey
                    MeetupDateLocal(formatString: "MMMM DD, YYYY")
                    Link
                    trendURL
                    MeetupName: PartitionKey
                    id
                    RsvpCount
                    VenueName
                }
            }
        }
    }
    
    `}
    render={data => (
      <EventTable
        includeMeetup={true}
        rows={data.events.edges} />)
    }
  />
)

const EventPage = (props) => {
  const { classes } = props;
  return (
    <Layout>
      <div>
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12} className={classes.grid}>
              <EventList />
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  )
}

export default withStyles(styles, { withTheme: true })(EventPage)


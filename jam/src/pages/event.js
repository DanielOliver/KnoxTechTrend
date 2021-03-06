import React from 'react'
import { StaticQuery, graphql } from "gatsby"
// import Layout from '../components/layout'
import EventTable from '../components/EventTable';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from "react-helmet";

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
                    PartitionKey
                }
            }
        }
        allMeetup {
            edges {
              node {
                FullName
                UrlName
                trendURL
                RowKey
                PartitionKey
              }
            }
          }
    }
    
    `}
    render={data => {
      data.events.edges.forEach(({ node }) => {
        let meetup = data.allMeetup.edges.map((x) => x.node).find(x => x.UrlName === node.PartitionKey) || {}
        node.MeetupName = meetup.FullName
      })

      return (
        <EventTable
          includeMeetup={true}
          rows={data.events.edges} />)
    }
    }
  />
)

const EventPage = (props) => {
  const { classes } = props;
  return (
    <>
      <Helmet>
        <title>Knox Tech Trend - Events</title>
        <meta name="description" content="Knox Tech Trend - Events" />
      </Helmet>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} className={classes.grid}>
            <EventList />
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default withStyles(styles, { withTheme: true, name: 'eventOverviewCSS' })(EventPage)


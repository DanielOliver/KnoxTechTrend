import React from "react"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import EventTable from "../components/EventTable";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MeetupMonthGraph from '../components/MeetupMonthGraph';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

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

const MeetupTemplate = (props) => {
    const { classes } = props;
    const meetup = props.data.meetup
    const events = props.data.events.edges
    return (
        <Layout>
            <Typography variant="display2" color="inherit" noWrap>
                {meetup.FullName}
            </Typography>
            <div className={classes.root}>
                <Grid container>
                    <Grid item xs={12} className={classes.grid}>
                        <Paper className={classes.paper}>
                            <Typography variant="display1" color="inherit" noWrap>
                                Events
                            </Typography>
                            <EventTable rows={events} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} className={classes.grid}>
                        <Paper className={classes.paper}>
                            <Typography variant="display1" color="inherit" noWrap>
                                Monthly Meetup Count
                            </Typography>
                            <MeetupMonthGraph meetupEvents={events} />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    )
}

export default withStyles(styles, { withTheme: true })(MeetupTemplate)

export const pageQuery = graphql`
    query($meetupName: String!) {
        meetup(UrlName: { eq: $meetupName }) {
            FullName
            UrlName
        }        
        events: allMeetupEvents(filter: {PartitionKey: { eq: $meetupName }}, sort: {fields: [MeetupDateLocal], order: DESC}) {
            edges {
                node {
                    Name
                    RowKey
                    MeetupDateLocal(formatString: "MMMM DD, YYYY")
                    Link
                    trendURL
                    RsvpCount
                    VenueName
                    id

                    
                    MeetupDay: MeetupDateLocal(formatString: "MMMM DD, YYYY")
                    MeetupMonth: MeetupDateLocal(formatString: "MMMM 1, YYYY")
                    SortOrder: MeetupDateLocal(formatString: "YYYY-MM")
                    Day: MeetupDateLocal(formatString: "YYYY-MM-dd")
                    UtcTime: MeetupDateUtc
                }
            }
        }
    }
`
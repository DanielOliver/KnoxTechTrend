import React from "react"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import EventTable from "../components/EventTable";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MeetupMonthGraph from '../components/MeetupMonthGraph';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MeetupWeekdayGraph from "../components/MeetupWeekdayGraph";
import {Helmet} from "react-helmet";

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

class MeetupTemplate extends React.Component {

    render() {
        const { classes } = this.props;
        const meetup = this.props.data.meetup
        const events = (this.props.data.events || { edges: [] }).edges
        const { eventsByMonth, eventsByWeekday, seoTitle, seoDescription } = this.props.pageContext

        return (
            <Layout>
                <Helmet>
                    <title>{seoTitle}</title>
                    <meta name="description" content={seoDescription} />
                </Helmet>
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
                                    Monthly Meetup Count (past year)
                                </Typography>
                                <MeetupMonthGraph eventsByMonth={eventsByMonth} meetupEvents={events} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} className={classes.grid}>
                            <Paper className={classes.paper}>
                                <Typography variant="display1" color="inherit" noWrap>
                                    Meetups Per Day of Week (past year)
                                </Typography>
                                <MeetupWeekdayGraph eventsByWeekday={eventsByWeekday} meetupEvents={events} />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Layout>
        )
    }
}

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
                    MeetupDayOfWeek: MeetupDateLocal(formatString: "dddd")
                    MeetupMonthName: MeetupDateLocal(formatString: "MMMM")
                }
            }
        }
    }
`

export default withStyles(styles, { withTheme: true, name: 'meetupTemplateCSS' })(MeetupTemplate)

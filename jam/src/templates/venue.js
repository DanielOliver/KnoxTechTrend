import React from "react"
import { graphql } from "gatsby"
// import Layout from '../components/layout'
// import { Link } from 'gatsby'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EventTable from "../components/EventTable";
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
class VenueTemplate extends React.Component {
    render() {
        const event = this.props.data.event;
        const { classes } = this.props;
        const meetupEvents = (this.props.data.meetupEvents || { edges: [] }).edges
        const { seoTitle, seoDescription } = this.props.pageContext

        return (
            <div className={classes.root}>
                <Helmet>
                    <title>{seoTitle}</title>
                    <meta name="description" content={seoDescription} />
                </Helmet>
                <Typography variant="display2" color="inherit">
                    {event.VenueName}
                </Typography>
                <Typography variant="display1" color="inherit">
                    <p>{event.VenueAddress1}
                        {event.VenueAddress2 && <> <br /> {event.VenueAddress2} </>}
                        {event.VenueCity && <> <br /> {event.VenueCity} </>}
                        {event.VenueZip && <>, {event.VenueZip} </>}
                        {event.VenueState && <> <br /> {event.VenueState} </>}
                    </p>
                </Typography>
                <Grid container>
                    <Grid item xs={12} className={classes.grid}>
                        <Paper className={classes.paper}>
                            <Typography variant="display1" color="inherit" noWrap>
                                Events
                                </Typography>
                            <EventTable rows={meetupEvents} />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true, name: 'venueTemplateCSS' })(VenueTemplate)

export const pageQuery = graphql`
    query($venueID: Int!, $venueName: String!) {
        event: meetupEvents(VenueID: {eq: $venueID }) {
                Name
                RowKey
                Description
                MeetupDateLocal(formatString: "MMMM DD, YYYY")
                Link

                VenueLongitude
                VenueLatitude
                VenueName
                VenueAddress1
                VenueAddress2
                VenueCity
                VenueState
                VenueZip
            }
        meetupEvents: allMeetupEvents(filter: {VenueName: { eq: $venueName }}, sort: {fields: [MeetupDateLocal], order: DESC}) {
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
                }
            }
        }
    }
`
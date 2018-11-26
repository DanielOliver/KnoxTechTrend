import React from "react"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import { Link } from 'gatsby'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


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
class EventTemplate extends React.Component {
    render() {
        const meetup = this.props.data.meetup
        const event = this.props.data.event
        return (
            <Layout>
                <div>
                    <Typography variant="display2" color="inherit">
                        {event.Name}
                    </Typography>
                    <Typography variant="display1" color="inherit">
                        <p>
                            {event.VenueName && event.venueURL && <> <Link to={event.venueURL}>{event.VenueName}</Link> <br/ > </>}
                            {event.MeetupDateLocal}
                            <br />
                            <Link to={meetup.trendURL}>{this.props.pageContext.meetupName}</Link>
                        </p>
                    </Typography>

                    <hr />
                    <div dangerouslySetInnerHTML={{ __html: event.Description }} />
                </div>
            </Layout>
        )
    }
}

export default withStyles(styles, { withTheme: true })(EventTemplate)

export const pageQuery = graphql`
    query($meetupUrl: String!, $eventID: String!) {
        meetup(UrlName: {eq: $meetupUrl }) {
            FullName
            UrlName
            trendURL
        }
        event: meetupEvents(RowKey: {eq: $eventID }) {
                Name
                RowKey
                Description
                MeetupDateLocal(formatString: "MMMM DD, YYYY")
                Link
                VenueLongitude
                VenueLatitude
                VenueName
                venueURL
            }
        }
`
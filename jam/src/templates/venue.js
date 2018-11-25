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
class VenueTemplate extends React.Component {
    render() {
        const event = this.props.data.event;

        return (
            <Layout>
                <div>
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
                </div>
            </Layout>
        )
    }
}

export default withStyles(styles, { withTheme: true })(VenueTemplate)

export const pageQuery = graphql`
    query($venueID: Int!) {
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
        }
`
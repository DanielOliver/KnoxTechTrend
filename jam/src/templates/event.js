import React from "react"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import { Link } from 'gatsby'

class EventTemplate extends React.Component {
    render() {
        const meetup = this.props.data.meetup
        const event = this.props.data.event
        return (
            <Layout>
                <div>
                    <h1><Link to={meetup.trendURL}>{meetup.FullName}</Link></h1>
                    <h2>{event.Name}</h2>
                    <p>{event.MeetupDateLocal}</p>
                </div>
            </Layout>
        )
    }
}

export default EventTemplate

export const pageQuery = graphql`
    query($meetupName: String!, $eventID: String!) {
                    meetup(UrlName: {eq: $meetupName }) {
                    FullName
            UrlName
                trendURL
            }
        event: meetupEvents(RowKey: {eq: $eventID }) {
                    Name
            RowKey
                MeetupDateLocal(formatString: "MMMM DD, YYYY")
                Link
                VenueLongitude
                VenueLatitude
                VenueName
            }
        }
`
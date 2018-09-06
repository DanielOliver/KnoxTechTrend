import React from "react"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import EventTable from "../components/EventTable";

class MeetupTemplate extends React.Component {

    renderEvents(events) {        
        return (
            <EventTable
                rows={events}
                />
        )
    }

    render() {
        const meetup = this.props.data.meetup
        const events = this.props.data.events.edges        
        return (
            <Layout>
                <div>
                    <h1>{meetup.FullName}</h1>
                    {events && this.renderEvents(events)}
                </div>
            </Layout>
        )
    }
}

export default MeetupTemplate

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
                }
            }
        }
    }
`
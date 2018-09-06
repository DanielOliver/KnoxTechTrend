import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import Layout from '../components/layout'
import EventTable from '../components/EventTable';


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

const EventPage = () => (
  <Layout>
    <div>
      <EventList />
    </div>
  </Layout>
)

export default EventPage

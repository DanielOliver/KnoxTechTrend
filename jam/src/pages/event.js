import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"

import Layout from '../components/layout'

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
                }
            }
        }
    }
    
    `}
    render={data => (<ul>
      {data.events.edges.map(x =>
          (<li key={x.node.RowKey}>
              <p>{x.node.MeetupName}
              
              <Link to={x.node.trendURL}>{x.node.Name}</Link>
              
              {x.node.MeetupDateLocal}</p>
          </li>)
      )
      }
  </ul>)}
  />
)

const EventPage = () => (
  <Layout>
    <div>
      <EventList/>
    </div>
  </Layout>
)

export default EventPage

import React from 'react'
// import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"

import Layout from '../components/layout'


const MeetupList = () => (  
  <StaticQuery
    query={graphql`
    query meetupFrontPage {
      allMeetup {
        edges {
          node {
            PartitionKey
            RowKey
            LastEventsQueriedUTC
            LastQueriedUTC
            Timestamp
            FullName
            MembersCount
            City
            State
            Country
            Timezone
            Link
            id
            trendURL
          }
        }
      }
    }
    
    `}
    render={data => (
      <ul>
      {data.allMeetup.edges.map(x => (
        <li key={x.node.id}>
          <a href={x.node.trendURL}>{x.node.FullName}</a>
        </li>
        )
      )
      }
      </ul>
    )}
  />
)

const IndexPage = () => (
  <Layout>
    <div>
      <MeetupList/>
    </div>
  </Layout>
)

export default IndexPage

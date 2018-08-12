import React from "react"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import { Link } from 'gatsby'

class MeetupTemplate extends React.Component {

    renderEvents(events) {        
        return (<ul>
            {events.edges.map(x =>
                (<li key={x.node.RowKey}>
                    <Link to={x.node.trendURL}>{x.node.Name}</Link>
                    <p>{x.node.MeetupDateLocal}</p>
                </li>)
            )
            }
        </ul>)
    }

    render() {
        const meetup = this.props.data.meetup
        const events = this.props.data.events
        return (
            <Layout>
                <div>
                    <h1>{meetup.FullName}</h1>
                    {this.renderEvents(events)}
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
                }
            }
        }
    }
`
import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"
import Layout from '../components/layout'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const EventTable = ({ rows }) => {

    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Meetup</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Event</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map(row => {
                    return (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {row.Name}
                            </TableCell>
                            <TableCell>{row.MeetupName}</TableCell>
                            <TableCell>{row.MeetupDateLocal}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>

    );
};

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
            <EventList />
        </div>
    </Layout>
)

export default EventPage

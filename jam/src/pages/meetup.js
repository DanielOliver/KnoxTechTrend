import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"
import Layout from '../components/layout'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const MeetupTable = ({ rows }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Meetup</TableCell>
          <TableCell numeric>Members</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.filter(x => x.node.FullName).map(x => {
          const row = x.node;
          return (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <Link to={row.trendURL}>{row.FullName}</Link>
              </TableCell>
              <TableCell numeric>
                {row.MembersCount}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const MeetupList = () => (
  <StaticQuery
    query={graphql`
    query meetupFrontPage {
      meetups: allMeetup(sort: {fields: [MembersCount], order: DESC}) {
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
    render={data => (<MeetupTable rows={data.meetups.edges} />)}
  />
)

const MeetupPage = () => (
  <Layout>
    <div>
      <MeetupList />
    </div>
  </Layout>
)

export default MeetupPage
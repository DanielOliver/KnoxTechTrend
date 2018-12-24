import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"
// import Layout from '../components/layout'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from "react-helmet";

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

const MeetupTable = ({ rows }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Meetup</TableCell>
          <TableCell align="right">Members</TableCell>
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
              <TableCell align="right">
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

const MeetupPage = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Helmet>
        <title>Knox Tech Trend - Meetups</title>
        <meta name="description" content="Knox Tech Trend - Meetups" />
      </Helmet>
      <Grid container>
        <Grid item xs={12} className={classes.grid}>
          <MeetupList />
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles, { withTheme: true, name: 'meetupOverviewCSS' })(MeetupPage)

import React from 'react'
import Layout from '../components/layout'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'gatsby'

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


const VenueTable = ({ rows }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Venue</TableCell>
          <TableCell align="right">Event Count</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.sort(function (a, b) {
                    return b.EventCount - a.EventCount;
                }).map(row => {
          return (
            <TableRow key={row.venueID}>
              <TableCell component="th" scope="row">
                <Link to={row.venueURL}>{row.venueName}</Link>
              </TableCell>
              <TableCell align="right">
                {row.EventCount}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const VenuePage = (props) => {
  const { classes, pageContext } = props;
  return (
    <Layout>
      <div>
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12} className={classes.grid}>
              <VenueTable rows={pageContext.rows} />
            </Grid>
          </Grid>
        </div>
      </div>
    </Layout>
  )
}

export default withStyles(styles, { withTheme: true })(VenuePage)



class MeetupList extends React.Component {
    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Meetup</TableCell>
                        <TableCell numeric>Members</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(x => {
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
}

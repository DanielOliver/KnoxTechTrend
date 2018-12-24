import React from 'react'
import { VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalBarSeries, FlexibleWidthXYPlot } from 'react-vis'

class MeetupMonthGraph extends React.Component {
    constructor(props) {
        super(props);

        if (props.eventsByMonth) {
            this.state = props.eventsByMonth
        }
        else {
            var oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            if (!Array.isArray(props.meetupEvents) || !props.meetupEvents.length) {
                this.state = { monthData: [], hasData: 0 };
            } else {
                const monthObject =
                    props.meetupEvents
                        .filter(x => Date.parse(x.node.MeetupMonth) > oneYearAgo)
                        .map(x => ({
                            x: x.node.MeetupMonthName,
                            y: 1,
                            z: x.node.MeetupMonth
                        })).reduce(function (r, a) {
                            r[a.x] = r[a.x] || { x: a.x, y: 0 };
                            r[a.x].z = a.z;
                            r[a.x].y += 1;
                            return r;
                        }, Object.create(null));

                const values =
                    Object.values(monthObject).sort(function (a, b) {
                        return Date.parse(a.z) - Date.parse(b.z);
                    })

                if (values.length > 0) {
                    this.state = { monthData: values, hasData: 1 };
                } else {
                    this.state = { monthData: [], hasData: 0 };
                }
            }
        }
    }

    render() {
        const { monthData, hasData } = this.state;
        if (hasData >= 1) {
            return (
                <FlexibleWidthXYPlot
                    xType="ordinal"
                    height={500}
                >
                    <XAxis />
                    <YAxis />
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <VerticalBarSeries
                        className="vertical-bar-series-example"
                        data={monthData}
                    />
                </FlexibleWidthXYPlot>
            )
        } else {
            return <div />
        }
    }
}

export default MeetupMonthGraph;

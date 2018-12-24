import React from 'react'
import { VerticalGridLines, HorizontalGridLines, XAxis, YAxis, FlexibleWidthXYPlot, VerticalBarSeries } from 'react-vis'

class MeetupWeekdayGraph extends React.Component {
    constructor(props) {
        super(props)

        if (props.eventsByWeekday) {
            this.state = props.eventsByWeekday
        } else {

            var oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            if (!Array.isArray(props.meetupEvents) || !props.meetupEvents.length) {
                this.state = { values: [], hasData: 0 };
            } else {
                const weekdayObject =
                    props.meetupEvents
                        .filter(x => Date.parse(x.node.MeetupMonth) > oneYearAgo)
                        .map(x => ({
                            x: x.node.MeetupDayOfWeek,
                            y: 1
                        })).reduce(function (r, a) {
                            r[a.x] = r[a.x] || { x: a.x, y: 0 };
                            r[a.x].y += 1;
                            return r;
                        }, Object.create(null));

                const values =
                    Object.values(weekdayObject).sort(function (a, b) {
                        return b.y - a.y;
                    })

                this.state = { values: values, hasData: values.length };
            }
        }
    }

    render() {
        const { values, hasData } = this.state
        if (hasData >= 1) {
            return (
                <FlexibleWidthXYPlot
                    height={500}
                    xType="ordinal"
                >
                    <XAxis />
                    <YAxis />
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <VerticalBarSeries
                        className="vertical-bar-series-example"
                        data={values}
                    />
                </FlexibleWidthXYPlot >
            )
        } else {
            return <div />
        }
    }
}

export default MeetupWeekdayGraph;

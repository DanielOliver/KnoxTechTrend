import React from 'react'
import ONE_DAY from '../components/constants'
import { VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalRectSeries, FlexibleWidthXYPlot } from 'react-vis'

class MeetupMonthGraph extends React.Component {
    constructor(props) {
        super(props);
        var oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        if (!Array.isArray(props.meetupEvents) || !props.meetupEvents.length) {
            this.state = { tickValues: [], monthData: [], hasData: 0 };
        } else {
            const monthObject = 
                props.meetupEvents
                .filter(x => Date.parse(x.node.MeetupMonth) > oneYearAgo)
                .map(x => ({
                    x: Date.parse(x.node.MeetupMonth),
                    y: 1
                })).reduce(function (r, a) {
                    r[a.x] = r[a.x] || { x: a.x, y: 0 };
                    r[a.x].y += 1;
                    return r;
                }, Object.create(null));

            const monthData = Object.values(monthObject)
                .map(el => ({ x0: el.x, x: el.x + (ONE_DAY * 25), y: el.y }));

            if(monthData.length > 0) {
                const tickValues = Array.from(Array(1 + Math.max.apply(null, monthData.map(x => x.y))).keys());
                this.state = { tickValues: tickValues, monthData: monthData, hasData: 1 };
            } else {
                this.state = { tickValues: [], monthData: [], hasData: 0 };
            }
        }
    }

    render() {
        const { tickValues, monthData, hasData } = this.state;
        if(hasData >= 1) {
            return (
                <FlexibleWidthXYPlot
                    xType="time"
                    height={500}
                >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis title="Time" tickLabelAngle={-10} left={60} />
                    <YAxis tickValues={tickValues} />
                    <VerticalRectSeries
                        data={monthData}
                    />
                </FlexibleWidthXYPlot>
            )
        } else {
            return <div/>
        }
    }
}

export default MeetupMonthGraph;

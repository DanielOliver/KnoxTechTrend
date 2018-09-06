import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import { VerticalGridLines, HorizontalGridLines, XAxis, YAxis, FlexibleWidthXYPlot, VerticalBarSeries } from 'react-vis'

class MeetupWeekdayGraph extends React.Component {
    state = {
        hoveredSection: false
    }

    render() {
        return (
            <StaticQuery
                query={graphql`
      query meetupWeekdayList {
        allMeetupEvents(sort: {fields: [MeetupDateLocal], order: ASC}) {
          edges {
            node {
              MeetupMonth: MeetupDateLocal(formatString: "MMMM 1, YYYY")
              MeetupDayOfWeek: MeetupDateLocal(formatString: "dddd")
            }
          }
        }
      }
      `}
                render={data => {
                    var oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                    const weekdayObject = data.allMeetupEvents.edges
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
                }
                }
            />
        )
    }
}

export default MeetupWeekdayGraph;

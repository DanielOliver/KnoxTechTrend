import React from 'react'
import { Link } from 'gatsby'
import { StaticQuery, graphql } from "gatsby"

import Layout from '../components/layout'
import ONE_DAY from '../components/constants'

import { XYPlot, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalRectSeries } from 'react-vis'


const MeetupMonthGraph = () => (
  <StaticQuery
    query={graphql`
    query meetupDateList {
      allMeetupEvents(sort: {fields: [MeetupDateLocal], order: ASC}) {
        edges {
          node {
            MeetupDay: MeetupDateLocal(formatString: "MMMM DD, YYYY")
            MeetupMonth: MeetupDateLocal(formatString: "MMMM 1, YYYY")
            SortOrder: MeetupDateLocal(formatString: "YYYY-MM")
            Day: MeetupDateLocal(formatString: "YYYY-MM-dd")
            UtcTime: MeetupDateUtc
          }
        }
      }
    }
    `}
    render={data => {
      var oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const monthObject = data.allMeetupEvents.edges
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

      const tickValues = Array.from(Array(1 + Math.max.apply(null, monthData.map(x => x.y))).keys());

      return (
        <XYPlot
          xType="time"
          width={1000}
          height={600}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis title="Time" />
          <YAxis title="Monthly Meetup count" tickValues={tickValues} />
          <VerticalRectSeries
            data={monthData}
          />
        </XYPlot>
      )
    }
    }
  />
)

const IndexPage = () => (
  <Layout>
    <div>
      <Link to="/meetup">Meetups</Link>
      <br />
      <Link to="/event">Events</Link>
      <br />
      <br />
      <br />
      <br />
      <MeetupMonthGraph />
    </div>
  </Layout>
)

export default IndexPage

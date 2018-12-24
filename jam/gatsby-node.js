const path = require('path')
const { GraphQLString } = require('gatsby/graphql')
const _ = require('lodash')

const siteTitle = "Knox Tech Trend"

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
    if (type.name === `meetup`) {
        return {
            trendURL: {
                type: GraphQLString,
                resolve: (source) => {
                    return `/meetup/${source.UrlName}`
                }
            }
        }
    }
    if (type.name === `meetupEvents`) {
        return {
            trendURL: {
                type: GraphQLString,
                resolve: (source) => {
                    return `/event/${source.RowKey}`
                }
            },
            venueURL: {
                type: GraphQLString,
                resolve: (source) => {
                    return `/venue/${_.kebabCase(source.VenueName)}`
                }
            }
        }
    }
    return {}
}

const createMeetupByMonthObject = (meetupEvents) => {
    var oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (!Array.isArray(meetupEvents) || !meetupEvents.length) {
        return { monthData: [], hasData: 0 };
    } else {
        const monthObject =
            meetupEvents
                .filter(x => Date.parse(x.MeetupMonth) > oneYearAgo)
                .map(x => ({
                    x: x.MeetupMonthName,
                    y: 1,
                    z: x.MeetupMonth
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
            return { monthData: values, hasData: 1 };
        } else {
            return { monthData: [], hasData: 0 };
        }
    }
}


const createMeetupByWeekdayObject = (meetupEvents) => {
    var oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (!Array.isArray(meetupEvents) || !meetupEvents.length) {
        return { values: [], hasData: 0 };
    } else {
        const weekdayObject =
            meetupEvents
                .filter(x => Date.parse(x.MeetupMonth) > oneYearAgo)
                .map(x => ({
                    x: x.MeetupDayOfWeek,
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

        return { values: values, hasData: values.length };
    }
}


exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    const meetupTemplate = path.resolve(`src/templates/meetup.js`)
    const eventTemplate = path.resolve(`src/templates/event.js`)
    const venueTemplate = path.resolve(`src/templates/venue.js`)
    const venueOverviewTemplate = path.resolve(`src/templates/venueOverview.js`)

    const meetupPromise = graphql(`
      {
        allMeetup {
            edges {
              node {
                FullName
                UrlName
                trendURL
                RowKey
              }
            }
          }
      }
    `)

    const eventPromise = graphql(`
    {
      allMeetupEvents {
          edges {
            node {
                Name
                RowKey
                MeetupDateLocal
                Link
                trendURL
                PartitionKey
                venueURL
                VenueID
                VenueName
                    
                MeetupDay: MeetupDateLocal(formatString: "MMMM DD, YYYY")
                MeetupMonth: MeetupDateLocal(formatString: "MMMM 1, YYYY")
                SortOrder: MeetupDateLocal(formatString: "YYYY-MM")
                Day: MeetupDateLocal(formatString: "YYYY-MM-dd")
                UtcTime: MeetupDateUtc
                MeetupDayOfWeek: MeetupDateLocal(formatString: "dddd")
                MeetupMonthName: MeetupDateLocal(formatString: "MMMM")
            }
          }
        }
    }
  `)


    Promise.all([meetupPromise, eventPromise])
        .then(result => {
            if (result.errors) {
                return Promise.reject(result.errors)
            }

            let [meetups, events] = result

            let meetupList = meetups.data.allMeetup.edges.filter(({ node }) => node.FullName && node.FullName != "").map(({ node }) => node)
            let eventList = events.data.allMeetupEvents.edges.map(({ node }) => node)
            let venueList = {}

            meetupList.forEach((node) => {
                let events = eventList.filter(x => node.UrlName === x.PartitionKey)

                createPage({
                    path: node.trendURL,
                    component: meetupTemplate,
                    context: {
                        meetupName: node.UrlName,
                        eventsByMonth: createMeetupByMonthObject( events  ),
                        eventsByWeekday: createMeetupByWeekdayObject( events ),
                        seoTitle: `${siteTitle} - Meetup: ${node.Name}`,
                        seoDescription: `${siteTitle} - Meetup: ${node.FullName}`
                    }
                })
            })

            eventList.forEach((node) => {
                let meetup = meetupList.find(x => x.UrlName === node.PartitionKey) || {}

                createPage({
                    path: node.trendURL,
                    component: eventTemplate,
                    context: {
                        meetupUrl: node.PartitionKey,
                        eventID: node.RowKey,
                        meetupName: meetup.FullName,
                        seoTitle: `${siteTitle} - Event: ${node.Name}`,
                        seoDescription: `${siteTitle} - Event for ${meetup.FullName}: ${node.Name}`
                    }
                })

                if (node.venueURL && node.VenueID) {
                    let venue = venueList[node.venueURL];
                    if (venue) {
                        venue.EventCount += 1
                    } else {
                        venueList[node.venueURL] = {
                            venueID: node.VenueID,
                            venueName: node.VenueName,
                            venueURL: node.venueURL,
                            EventCount: 1
                        }

                        createPage({
                            path: node.venueURL,
                            component: venueTemplate,
                            context: {
                                venueID: node.VenueID,
                                venueName: node.VenueName,
                                seoTitle: `${siteTitle} - Venue: ${node.VenueName}`,
                                seoDescription: `${siteTitle} - Venue: ${node.VenueName}`
                            }
                        })
                    }
                }
            })

            createPage({
                path: 'venue',
                component: venueOverviewTemplate,
                context: {
                    rows: Object.values(venueList)
                }
            })


        })

    return Promise.all([meetupPromise, eventPromise])
}

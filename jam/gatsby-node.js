const path = require('path')
const { GraphQLString } = require('gatsby/graphql')
const _ = require('lodash')

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

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    const meetupTemplate = path.resolve(`src/templates/meetup.js`)
    const eventTemplate = path.resolve(`src/templates/event.js`)
    const venueTemplate = path.resolve(`src/templates/venue.js`)

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

            meetupList.forEach((node) => {
                createPage({
                    path: node.trendURL,
                    component: meetupTemplate,
                    context: {
                        meetupName: node.UrlName
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
                        meetupName: meetup.FullName
                    }
                })

                if (!(typeof node.venueURL === 'undefined')) {
                    createPage({
                        path: node.venueURL,
                        component: venueTemplate,
                        context: {
                            venueID: node.VenueID,
                            venueName: node.VenueName
                        }
                    })
                }
            })
        })

    return Promise.all([meetupPromise, eventPromise])
}

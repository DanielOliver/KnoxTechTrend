var path = require('path')
var { GraphQLString } = require('gatsby/graphql')

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
            }
        }
    }
    return {}
}

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    const meetupTemplate = path.resolve(`src/templates/meetup.js`)
    const eventTemplate = path.resolve(`src/templates/event.js`)

    const meetupPromise = graphql(`
      {
        allMeetup {
            edges {
              node {
                FullName
                UrlName
                trendURL
              }
            }
          }
      }
    `).then(result => {
            if (result.errors) {
                return Promise.reject(result.errors)
            }

            result.data.allMeetup.edges.filter(({node}) => node.FullName && node.FullName != "").forEach(({ node }) => {
                createPage({
                    path: node.trendURL,
                    component: meetupTemplate,
                    context: {
                        meetupName: node.UrlName
                    }
                })
            })
        })

        
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
            }
          }
        }
    }
  `).then(result => {
          if (result.errors) {
              return Promise.reject(result.errors)
          }

          result.data.allMeetupEvents.edges.forEach(({ node }) => {
              createPage({
                  path: node.trendURL,
                  component: eventTemplate,
                  context: {
                      meetupName: node.PartitionKey,
                      eventID: node.RowKey
                  }
              })
          })
      })

    return Promise.all([ meetupPromise, eventPromise ])
}

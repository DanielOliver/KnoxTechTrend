module.exports = {
    siteMetadata: {
        title: 'Knoxville Tech Trends',
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        {
            resolve: "gatsby-source-azure-storage",
            options: {
                tables: [
                    {
                        name: "meetup"
                    },
                    {
                        name: "events",
                        type: "eventTypeName"
                    }
                ]
            },
        }
    ],
}

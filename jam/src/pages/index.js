import React from 'react'
import { Link } from 'gatsby'
// import { StaticQuery, graphql } from "gatsby"

import Layout from '../components/layout'


const IndexPage = () => (
  <Layout>
    <div>
      <Link to="/meetup">Meetups</Link>
      <br/>
      <Link to="/event">Events</Link>
    </div>
  </Layout>
)

export default IndexPage

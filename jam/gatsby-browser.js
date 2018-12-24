/* eslint-disable react/no-danger */

import React from "react"
import ReactDOM from "react-dom"
import Layout from "./src/components/layout"

export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (<Layout {...props}>{element}</Layout>)
}

// export const wrapRootElement = ({ element }) => {
//   // props provide same data to Layout as Page element will get
//   // including location, data, etc - you don't need to pass it
//   return (<Layout>{element}</Layout>)
// }

export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.render(element, container, callback)
  }
}

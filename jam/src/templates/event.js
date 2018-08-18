import React, { Fragment } from "react"
// import ReactDOM from "react-dom"
import { graphql } from "gatsby"
import Layout from '../components/layout'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet-universal'


class LeafletMap extends React.Component {
    render() {
        const position = [this.props.latitude, this.props.longitude];
        const venueName = this.props.venueName;

        return (
            <Map center={position} zoom={14} style={{ "height": "400px", "width": "400px" }}>{
                () => {
                    return (
                        <Fragment>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            />
                            <Marker position={position}>
                                <Popup>
                                    <span>{venueName}</span>
                                </Popup>
                            </Marker>
                        </Fragment>
                    );
                }}
            </Map>
        )
    }
}

class EventTemplate extends React.Component {
    getMap(latitude, longitude, venueName) {
        if (latitude == null || longitude == null) {
            return (
                <p>No Location Information</p>
            )
        } else {
            return (
                <LeafletMap longitude={longitude} latitude={latitude} venueName={venueName} />
            )
        }
    }

    render() {
        const meetup = this.props.data.meetup
        const event = this.props.data.event
        return (
            <Layout>
                <div>
                    <Helmet>
                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.3/dist/leaflet.css"
                            integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
                            crossorigin="" />
                        {/* <script src="https://unpkg.com/leaflet@1.3.3/dist/leaflet.js"
                            integrity="sha512-tAGcCfR4Sc5ZP5ZoVz0quoZDYX5aCtEm/eu1KhSLj2c9eFrylXZknQYmxUssFaVJKvvc0dJQixhGjG2yXWiV9Q=="
                            crossorigin=""></script> */}
                    </Helmet>
                    <h1><Link to={meetup.trendURL}>{meetup.FullName}</Link></h1>
                    <h2>{event.Name}</h2>
                    <p>{event.MeetupDateLocal}</p>
                    {this.getMap(event.VenueLatitude, event.VenueLongitude, event.VenueName)}
                </div>
            </Layout>
        )
    }
}

export default EventTemplate

export const pageQuery = graphql`
    query($meetupName: String!, $eventID: String!) {
                    meetup(UrlName: {eq: $meetupName }) {
                    FullName
            UrlName
                trendURL
            }
        event: meetupEvents(RowKey: {eq: $eventID }) {
                    Name
            RowKey
                MeetupDateLocal(formatString: "MMMM DD, YYYY")
                Link
                VenueLongitude
                VenueLatitude
                VenueName
            }
        }
`
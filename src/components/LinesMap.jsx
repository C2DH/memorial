import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMapboxGl, { MapContext, ZoomControl, Cluster, Marker } from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker' // eslint-disable-line import/no-webpack-loader-syntax
import '../styles/components/LinesMap.css'
import LinesMapLineLayer from './LinesMapLineLayer'

import 'mapbox-gl/dist/mapbox-gl.css'

const Map = ReactMapboxGl({
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
  projection: 'naturalEarth',
})

export const FitBoundsOptionsSm = {
  padding: {
    top: 100,
    bottom: 50,
    left: 100,
    right: 100,
  },
}

// Load worker code separately with worker-loader
mapboxgl.workerClass = MapboxWorker // Wire up loaded worker to be used instead of the default

const LinesMap = ({
  width = 200,
  height = 200,
  eventsByPlace = {}, // object where keys are places slug
  events = [
    {
      A: [18.73675, 49.7358],
      B: [21.01178, 52.22977],
      n: 12,
    },
    {
      A: [21.01178, 52.22977],
      B: [7.26608, 43.70313],
      n: 136,
    },
  ],
  people = [],
  places = [],
  className,
  showLines = false,
  fitBoundsOnLoad = true,
}) => {
  const mapRef = useRef()
  const [zoom, setZoom] = useState(7)
  const [fitBounds, setFitBounds] = useState(null)
  const [center, setCenter] = useState([2.1008033, 47.6148384])
  // create a map of events (different lines crossing) by place slug

  console.debug('[LinesMap] places:', places.length, events.length, events)

  const ClusterMarkerFactory = (coordinates, pointCount, getLeaves, ...rest) => {
    const clickHandler = (e, f) => {
      let leaves = getLeaves()
      console.info(
        '[ClusterMarkerFactory]',
        rest,
        // leaves.map((c) => c.props.coordinates),
      )
      //   .map(marker => find(events, {id: parseInt(marker.key)}))
      const bounds = new mapboxgl.LngLatBounds()
      leaves.forEach((c) => bounds.extend(c.props.coordinates))
      setFitBounds(bounds.toArray())
      // // Check if all events are at the same place
      // if(zoom > 12 || clusterEvents.filter(event => event.place.id !== clusterEvents[0].place.id).length === 0) {
      //   clusterEvents = sortBy(clusterEvents, ['data.date']);
      //   marker_clickHandler(clusterEvents);
      // } else {
      //   let bounds = new mapboxgl.LngLatBounds();
      //   clusterEvents.forEach(event => bounds.extend(event.coordinates));
      //   setFitBounds(bounds.toArray());
      // }
    }

    return (
      <Marker
        coordinates={coordinates}
        onClick={clickHandler}
        key={coordinates.toString()}
        className="cluster"
      >
        <div className="Linesmap_cluster">{pointCount}</div>
      </Marker>
    )
  }

  useEffect(() => {
    if (places.length === 0) return
    if (fitBoundsOnLoad) {
      let bounds = new mapboxgl.LngLatBounds()
      places.forEach((d) => bounds.extend(d.data.coords))
      setTimeout(() => setFitBounds(bounds.toArray()))
    } else setCenter(places[0].data.coords)
    // To fix the issue when the map is resized in the search page
    mapRef.current?.resize()
  }, [places, fitBoundsOnLoad])

  return (
    <div className={`LinesMap ${className}`} style={{ width, height, overflow: 'hidden' }}>
      <Map
        style={`${import.meta.env.VITE_MAPBOX_STYLE_URL}?optimize=true`}
        className="map h-100 w-100"
        center={center}
        zoom={[zoom]}
        fitBounds={fitBounds}
        fitBoundsOptions={FitBoundsOptionsSm}
        renderChildrenInPortal={true}
        // onClick={() => setSelectedEvents(null)}
        onZoomEnd={(map) => setZoom(map.transform._zoom)}
      >
        <ZoomControl position="bottomRight" className="zoomControl" />
        {/* <Cluster
          ClusterMarkerFactory={ClusterMarkerFactory}
          className="position-absolute top-0"
          maxZoom={20}
        >
          {places.map((place, i) => (
            <Marker key={place.id} coordinates={place.data.coords}>
              <div className="Linesmap_marker">
                <label>{place.title}</label>
              </div>
            </Marker>
          ))}
        </Cluster> */}
        {people.map(({ data }, i) => (
          <LinesMapLineLayer key={i} points={data.events.map((e) => e.coords)} />
        ))}
        {places.map((place, i) => {
          const eventsForThisPlace = eventsByPlace[place.slug]
          return (
            <Marker key={place.id} coordinates={place.data.coords}>
              <div className="Linesmap_marker">
                <label title={place.title}>{eventsForThisPlace.count}</label>
              </div>
            </Marker>
          )
        })}
        <MapContext.Consumer>
          {(map) => {
            mapRef.current = map
            map.on(
              'wheel',
              (e) => !e.originalEvent.ctrlKey && !e.originalEvent.metaKey && e.preventDefault(),
            )
          }}
        </MapContext.Consumer>
      </Map>
    </div>
  )
}

export default LinesMap

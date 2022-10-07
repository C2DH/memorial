import { useEffect, useRef, useState } from 'react'
import ReactMapboxGl, { MapContext, ZoomControl, Cluster, Marker } from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker' // eslint-disable-line import/no-webpack-loader-syntax
import { MapPin } from 'react-feather'
import '../styles/components/LinesMap.css'
import LinesMapLineLayer from './LinesMapLineLayer'

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibGVnaW9ubmFpcmVzIiwiYSI6ImNrcm02cGxvYTAwa2IzMm85MG02b2VqMjYifQ.OuFSbi7i0SVS8O8QnOjpKA',
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
  places = [],
  className,
  showLines = false,
  fitBoundsOnLoad = true,
}) => {
  const mapRef = useRef()
  const [zoom, setZoom] = useState(7)
  const [fitBounds, setFitBounds] = useState(null)
  const [center, setCenter] = useState([2.1008033, 47.6148384])
  console.debug('[LinesMap] places:', places.length, places)

  const clusterMarker = (coordinates, pointCount, getLeaves) => {
    // const clickHandler  = (e, f) => {
    //   let clusterEvents = getLeaves()
    //     .map(marker => find(events, {id: parseInt(marker.key)}))

    //   // Check if all events are at the same place
    //   if(zoom > 12 || clusterEvents.filter(event => event.place.id !== clusterEvents[0].place.id).length === 0) {
    //     clusterEvents = sortBy(clusterEvents, ['data.date']);
    //     marker_clickHandler(clusterEvents);
    //   } else {
    //     let bounds = new mapboxgl.LngLatBounds();
    //     clusterEvents.forEach(event => bounds.extend(event.coordinates));
    //     setFitBounds(bounds.toArray());
    //   }
    // }

    return (
      <Marker coordinates={coordinates} key={coordinates.toString()} className="cluster">
        {pointCount < 10 ? pointCount : '9+'}
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
        style={`mapbox://styles/mapbox/light-v10`} // mapbox://styles/legionnaires/ckto0cfh40okl17pmek6tmiuz?optimize=true`}
        className="map h-100 w-100"
        center={center}
        zoom={[zoom]}
        fitBounds={fitBounds}
        fitBoundsOptions={FitBoundsOptionsSm}
        renderChildrenInPortal={true}
        // onClick={() => setSelectedEvents(null)}
        onZoomEnd={(map) => setZoom(map.transform._zoom)}
      >
        <ZoomControl position="topLeft" className="zoomControl" />
        <Cluster
          ClusterMarkerFactory={clusterMarker}
          className="position-absolute top-0"
          maxZoom={20}
        >
          {places.map((place, i) => (
            <Marker key={place.id} coordinates={place.data.coords} className="Linesmap_marker">
              <div className="Linesmap_marker_point">
                <MapPin fill="var(--bs-primary)" />
              </div>
              <div>{place.title}</div>
            </Marker>
          ))}
        </Cluster>
        {events.map(({ A, B, n }, i) => (
          <LinesMapLineLayer key={i} coordsA={A} coordsB={B} n={n} w={0.5} />
        ))}
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

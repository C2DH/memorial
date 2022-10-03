import { useRef, useState } from 'react'
import ReactMapboxGl, { MapContext, ZoomControl } from 'react-mapbox-gl'

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibGVnaW9ubmFpcmVzIiwiYSI6ImNrcm02cGxvYTAwa2IzMm85MG02b2VqMjYifQ.OuFSbi7i0SVS8O8QnOjpKA',
})

export const FitBoundsOptionsSm = {
  padding: {
    top: 50,
    bottom: 50,
    left: 100,
    right: 100,
  },
}

const LinesMap = ({
  width = 200,
  height = 200,
  events = [],
  className,
  showLines = false,
  fitBoundsOnLoad = false,
}) => {
  const mapRef = useRef()
  const [zoom, setZoom] = useState(7)
  const [fitBounds, setFitBounds] = useState(null)
  const [center, setCenter] = useState([2.1008033, 47.6148384])

  return (
    <div className={`LinesMap ${className}`} style={{ width, height, overflow: 'hidden' }}>
      <Map
        style={`mapbox://styles/legionnaires/ckto0cfh40okl17pmek6tmiuz`}
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

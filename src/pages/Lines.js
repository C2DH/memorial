import LinesMap from '../components/LinesMap'
import { useCurrentWindowDimensions } from '../hooks/viewport'
const Lines = ({ isMobile }) => {
  const { width, height } = useCurrentWindowDimensions(isMobile)
  return <LinesMap className="position-absolute top-0" width={width} height={height} />
}
export default Lines

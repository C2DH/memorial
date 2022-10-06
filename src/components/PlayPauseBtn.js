import { PauseIcon, PlayIcon } from './SvgIcons'
import '../styles/components/PlayPauseBtn.css'

const PlayPauseBtn = ({ playPause }) => {
  return (
    <div
      className="PlayBtn position-absolute"
      onClick={() => playPause.func(!playPause.playing)}
      style={{ zIndex: 1001, bottom: '40px', right: '40px' }}
    >
      {playPause.playing ? <PauseIcon></PauseIcon> : <PlayIcon></PlayIcon>}
    </div>
  )
}

export default PlayPauseBtn

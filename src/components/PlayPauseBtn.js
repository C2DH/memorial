import { PauseIcon, PlayIcon } from './SvgIcons'
import '../styles/components/PlayPauseBtn.css'

const PlayPauseBtn = ({ playPause }) => {
  return (
    <div
      className="PlayBtn position-absolute"
      onClick={() => playPause.func(!playPause.playing)}
      style={{ zIndex: 1001, bottom: '30px', right: '30px' }}
    >
      {playPause.playing ? <PauseIcon></PauseIcon> : <PlayIcon></PlayIcon>}
    </div>
  )
}

export default PlayPauseBtn

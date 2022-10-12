import '../styles/components/PlayPauseBtn.css'
import { Play, Pause } from 'react-feather'

const PlayPauseBtn = ({ playPause }) => {
  return (
    <div
      className="PlayBtn position-absolute"
      onClick={() => playPause.func(!playPause.playing)}
      style={{ zIndex: 1001, bottom: '30px', right: '30px' }}
    >
      {playPause.playing ? <Pause /> : <Play className="play-icon" />}
    </div>
  )
}

export default PlayPauseBtn

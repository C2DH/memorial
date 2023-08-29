import './create.css'
import { usePebblesStore } from '../store'

export const CreatePebble = () => {
  const hasCreate = usePebblesStore((state) => state.hasCreate)
  const setHasCreate = usePebblesStore((state) => state.setHasCreate)

  if (!hasCreate) return null

  return (
    <div className="creator-wrapper">
      <div className="selector">
        <div className="title">Your pebble</div>
        <div className="images">
          <div className="image"></div>
          <div className="controls">
            <div className="">←</div>
            <div className="">→</div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="names">
          <div className="in-memory-of">in memory of</div>
          <div className="bio-selector">
            <div className="select-biography">select biography</div>
          </div>
        </div>
        <button className="button">Add pebble</button>
      </div>
      <div className="close" onClick={() => setHasCreate(false)}>
        ❌
      </div>
    </div>
  )
}

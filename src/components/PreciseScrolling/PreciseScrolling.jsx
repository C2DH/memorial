import React, { useRef, useLayoutEffect } from 'react'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

export const DirectionDown = 'DOWN'
export const DirectionUp = 'UP'

class PreciseScrollingStep {
  constructor({
    idx = -1,
    coverage = 0,
    focus = false,
    ratio = 0
  }) {
    this.idx = idx
    this.coverage = coverage
    this.focus = focus
    this.ratio = ratio
  }
}

const PreciseScrolling = ({
  children,
  // listener: onScroll({ activeSteps, direction })
  onScroll,
  // listener: onFocusChange({ step, direction })
  onFocusChange
}) => {
  const elementRef = useRef(null)
  const positions = useRef([])
  const offsetTops = useRef([])
  const timer = useRef(null)
  const viewport = useRef([0, 0])
  const focus = useRef(null)

  const evaluateChildrenPositions = () => {
    if (elementRef.current) {
      const currentPositions = [];
      const currentOffsetTops = [];
      const numKids = elementRef.current.childElementCount;
      for (var i = 0; i < numKids; ++i) {
        const rect = elementRef.current.children[i].getBoundingClientRect();
        currentPositions.push({
          height: rect.height,
          width: rect.width
        });
        currentOffsetTops.push(elementRef.current.children[i].offsetTop);
      }
      console.debug(
        '[PreciseScrolling] evaluateChildrenPositions',
        '\n - numKids:', numKids
      );
      positions.current = currentPositions;
      offsetTops.current = currentOffsetTops;
    }
  };

  const throttleResize = React.useCallback(() => {
    clearTimeout(timer.current);
    console.info("@resize scheduled...");
    timer.current = setTimeout(() => {
      viewport.current = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      console.info("@resize done.", viewport.current);
      evaluateChildrenPositions();
    }, 200);
  }, []);

  useLayoutEffect(() => {
    viewport.current = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    evaluateChildrenPositions();
    window.addEventListener("resize", throttleResize);
    return () => {
      window.removeEventListener("resize", throttleResize);
    };
  }, [throttleResize]);

  useScrollPosition(({ prevPos, currPos }) => {
    const direction = prevPos.y < currPos.y
      ? DirectionDown
      : DirectionUp
    const activeSteps = []
    let focusChanged = false
    // this is computated on window ONLY.
    // currPos.y it's always positive
    for(let i = 0; i < offsetTops.current.length; i += 1) {
      if (offsetTops.current[i] + positions.current[i].height < currPos.y) {
        // disappeared on top
        continue
      }
      if (offsetTops.current[i] > currPos.y + viewport.current.height) {
        // disapperead below viewport
        break
      }
      // calculate percentage of element coverage (for reading position mainly)
      const relativeOffsetTop = offsetTops.current[i] - currPos.y
      let visibleHeight = 0
      if (relativeOffsetTop < 0) {
        visibleHeight = positions.current[i].height + relativeOffsetTop
      } else if(positions.current[i].height + relativeOffsetTop < viewport.current.height) {
        visibleHeight = positions.current[i].height
      } else {
        visibleHeight = viewport.current.height - relativeOffsetTop
      }
      const viewportCoverage = visibleHeight / viewport.current.height
      const isFocused = relativeOffsetTop < viewport.current.height / 2
        && positions.current[i].height + relativeOffsetTop > viewport.current.height / 2
      const step = new PreciseScrollingStep({
        idx: i,
        coverage: viewportCoverage,
        focus: isFocused,
        ratio: visibleHeight/positions.current[i].height
      })
      // console.debug(
      //   'visible', i,
      //   '\n - relativeOffsetTop:',relativeOffsetTop,
      //   '\n - height: ', positions.current[i].height,
      //   '\n - visibleHeight:', visibleHeight,
      //   '\n - viewPortCoverage:', viewportCoverage,
      //   '\n - isFocused:', isFocused
      // )
      if (isFocused) {
        if (!focus.current || focus.current.idx !== i) {
          focus.current = step
          focusChanged = true
        }
      }
      activeSteps.push(step)
    }
    if (typeof onScroll === 'function') {
      onScroll({ activeSteps, direction })
    }
    if (focusChanged && typeof onFocusChange === 'function') {
      onFocusChange({ step: focus.current, direction })
    }
    console.debug(
      '[PreciseScrolling] @useScrollPosition',
      '\n - currPos:', currPos,
      '\n - direction:', direction,
      '\n - main step: ', focus.current
    );
  }, [], elementRef, true, 200)

  console.debug('[PreciseScrolling] rendered')
  return (
    <div
      className="PreciseScrolling"
      ref={elementRef}
    >
      {children}
    </div>
  )
}

export default PreciseScrolling
// export default React.memo(PreciseScrolling, (prevProps, nextProps) => {
//   return prevProps.memoid === nextProps.memoid
// })

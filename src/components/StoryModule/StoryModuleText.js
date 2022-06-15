import React from 'react'
import ModuleText from './ModuleText'

const StoryModuleText = ({
  text,
  // footnotes
}) => {
  return (
    <section className="StoryModuleText mb-5">
      <ModuleText content={text?.content} footnotes={text?.footnotes} />
    </section>
  )
}

export default StoryModuleText

import React from 'react'
import ModuleText from './ModuleText'

const StoryModuleText = ({
  text,
  language = 'en_GB',
  // footnotes
}) => {
  return (
    <section className="StoryModuleText mb-5">
      <ModuleText content={text?.content[language]} footnotes={text?.footnotes} />
    </section>
  )
}

export default StoryModuleText

import React from 'react'
import StoryModuleText from './StoryModuleText'
import StoryModuleNotFound from './StoryModuleNotFound'

const StoryModule = (args) => {
  switch (args.module) {
    case 'text':
      return <StoryModuleText {...args} />
    default:
      return <StoryModuleNotFound {...args} />
  }
}

export default StoryModule

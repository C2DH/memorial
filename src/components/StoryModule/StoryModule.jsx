import StoryModuleText from './StoryModuleText'
import StoryModuleNotFound from './StoryModuleNotFound'
import '../../styles/components/StoryModule.css'

const StoryModule = (args) => {
  switch (args.module) {
    case 'text':
      return <StoryModuleText {...args} />
    default:
      return <StoryModuleNotFound {...args} />
  }
}

export default StoryModule

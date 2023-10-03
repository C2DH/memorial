import ModuleText from './ModuleText'

const StoryModuleText = ({
  className = '',
  text,
  language = 'en_GB',
  printFootnotes = true,
  // footnotes
}) => {
  return (
    <section className={`${className} StoryModuleText mb-5`}>
      <ModuleText
        content={text?.content[language]}
        footnotes={text?.footnotes}
        printFootnotes={printFootnotes}
      />
    </section>
  )
}

export default StoryModuleText

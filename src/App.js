import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import Header from './components/Header'
import Logo from './components/Logo'
import Footer from './components/Footer'
import ScrollTo from './components/ScrollTo'
import { initializeI18next } from './logic/language'

const { languageCode } = initializeI18next()

const App = () => {
  return (
    <BrowserRouter>
    <Logo width={150} height={150}/>
    <Header />
    <AppRoutes startLanguageCode={languageCode}/>
    <Footer />
    <ScrollTo/>
    </BrowserRouter>
  );
}

export default App;

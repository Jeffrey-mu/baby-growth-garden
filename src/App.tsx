import { useAppData } from './lib/useLocalStorage'
import Header from './components/Header'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import Letters from './components/Letters'
import Memory from './components/Memory'
import Settings from './components/Settings'
import Footer from './components/Footer'

export default function App() {
  const { data, patch, reset } = useAppData()
  return (
    <div data-accent={data.settings.accent}>
      <Header />
      <main>
        <Hero data={data} />
        <Timeline data={data} patch={patch} />
        <Letters data={data} patch={patch} />
        <Memory data={data} patch={patch} />
        <Settings data={data} patch={patch} reset={reset} />
      </main>
      <Footer data={data} />
    </div>
  )
}

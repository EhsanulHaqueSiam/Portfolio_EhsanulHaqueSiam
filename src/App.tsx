import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import type { OpenSourceRepo } from './data/opensource';
import { About, Contact } from './components/home/AboutContact';
import { Dock, Footer, Nav } from './components/home/chrome';
import { OpenSource } from './components/home/OpenSource';
import { Profile } from './components/home/Profile';
import { PublicationsList } from './components/home/Publications';
import { Education, Experience, Research } from './components/home/Rows';
import { Shipped } from './components/home/Shipped';
import { Activity, Outro, Stack } from './components/home/StackActivity';
import { Resume } from './components/Resume';

type Props = { page: 'home'; openSource: OpenSourceRepo[] } | { page: 'publications' };

/**
 * The whole site is one React island (server-rendered by Astro, then hydrated).
 * A single column between dashed rails; sections are separated by hatched bands.
 * The Resume overlay stays mounted on every page: `#resume` opens it and
 * `#resume-print` is what hq's CV printer loads.
 */
function App(props: Props) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="rails min-h-screen bg-background">
          <Nav current={props.page} />
          <main id="main-content">
            {props.page === 'home' ? (
              <>
                <Profile />
                <About />
                <Contact />
                <Shipped />
                <OpenSource repos={props.openSource} />
                <Experience />
                <Research />
                <Stack />
                <Activity />
                <Education />
                <Outro />
              </>
            ) : (
              <PublicationsList />
            )}
          </main>
          <Footer />
        </div>
        <Dock />
        <Resume />
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;

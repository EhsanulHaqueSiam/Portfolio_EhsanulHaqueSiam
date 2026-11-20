import type { CSSProperties } from 'react';
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { experience, workSlug } from './data/content';
import type { OpenSourceRepo } from './data/opensource';
import type { PaperDetail } from './data/papers';
import { About, Contact } from './components/home/AboutContact';
import { Dock, Footer, Nav } from './components/home/chrome';
import { PaperPage, WorkPage } from './components/home/Detail';
import { OpenSource } from './components/home/OpenSource';
import { Profile } from './components/home/Profile';
import { PublicationsList } from './components/home/Publications';
import { Education, Experience, Research } from './components/home/Rows';
import { Shipped } from './components/home/Shipped';
import { Activity, Outro, Quote, Stack } from './components/home/StackActivity';
import { Resume } from './components/Resume';

type Props =
  | { page: 'home'; openSource: OpenSourceRepo[] }
  | { page: 'publications' }
  | { page: 'work'; slug: string }
  | { page: 'paper'; paper: PaperDetail };

/**
 * The whole site is one React island (server-rendered by Astro, then hydrated).
 * A single column between dashed rails; sections are separated by hatched bands.
 * The Resume overlay stays mounted on every page: `#resume` opens it and
 * `#resume-print` is what hq's CV printer loads.
 */
// getStaticPaths only emits known slugs, so a miss is a build bug, not a 404.
function findWork(slug: string) {
  const work = experience.find((e) => workSlug(e) === slug);
  if (!work) throw new Error(`No experience entry for /work/${slug}`);
  return work;
}

function App(props: Props) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="rails min-h-screen bg-background">
          <Nav current={props.page} />
          <main id="main-content">
            {props.page === 'work' ? (
              <WorkPage e={findWork(props.slug)} />
            ) : props.page === 'paper' ? (
              <PaperPage paper={props.paper} />
            ) : props.page === 'home' ? (
              // Each block fades and rises in on load, 70ms apart (.enter in index.css).
              [
                <Profile key="profile" />,
                <About key="about" />,
                <Contact key="contact" />,
                <Shipped key="shipped" />,
                <OpenSource key="oss" repos={props.openSource} />,
                <Experience key="exp" />,
                <Research key="research" />,
                <Stack key="stack" />,
                <Activity key="activity" />,
                <Education key="edu" />,
                <Outro key="outro" />,
                <Quote key="quote" />,
              ].map((block, n) => (
                <div key={block.key} className="enter" style={{ '--n': Math.min(n, 6) } as CSSProperties}>
                  {block}
                </div>
              ))
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

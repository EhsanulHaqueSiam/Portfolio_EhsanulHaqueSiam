import { type CSSProperties, useRef } from 'react';
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { caseStudies, experience, projectSlug, workSlug } from './data/content';
import type { OpenSourceRepo } from './data/opensource';
import type { PaperDetail } from './data/papers';
import { About, Contact } from './components/home/AboutContact';
import { AIWork } from './components/home/AIWork';
import { Dock, Footer, Nav } from './components/home/chrome';
import { NotFound, PaperPage, ProjectPage, WorkPage } from './components/home/Detail';
import { OpenSource } from './components/home/OpenSource';
import { Profile } from './components/home/Profile';
import { PublicationsList } from './components/home/Publications';
import { Education, Research } from './components/home/Rows';
import { Journey } from './components/home/Journey';
import { Shipped } from './components/home/Shipped';
import { Activity, Outro, Quote, Stack } from './components/home/StackActivity';
import { CatToast, PeekingCat, useConsoleCat } from './components/home/PixelCat';
import { Resume } from './components/Resume';
import { useReveal } from './lib/reveal';

type Props =
  | { page: 'home'; openSource: OpenSourceRepo[] }
  | { page: 'publications' }
  | { page: 'work'; slug: string }
  | { page: 'paper'; paper: PaperDetail }
  | { page: 'project'; slug: string }
  | { page: 'notfound' };

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

function findProject(slug: string) {
  const p = caseStudies.find((x) => projectSlug(x) === slug);
  if (!p) throw new Error(`No case study for /projects/${slug}`);
  return p;
}

function App(props: Props) {
  const main = useRef<HTMLElement>(null);
  useReveal(main);
  useConsoleCat();
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="rails min-h-screen bg-background">
          <Nav current={props.page} />
          <main id="main-content" ref={main}>
            {props.page === 'work' ? (
              <WorkPage e={findWork(props.slug)} />
            ) : props.page === 'project' ? (
              <ProjectPage p={findProject(props.slug)} />
            ) : props.page === 'paper' ? (
              <PaperPage paper={props.paper} />
            ) : props.page === 'home' ? (
              // Each block fades and rises in on load, 70ms apart (.enter in index.css);
              // blocks below the fold wait and reveal as they scroll in (useReveal).
              [
                // Order read against an AI-engineering role (the hiring-bar review): shipped AI work
                // and roles come before the websites.
                <Profile key="profile" />,
                <About key="about" />,
                <AIWork key="ai" repos={props.openSource} />,
                <Contact key="contact" />,
                <Journey key="exp" repos={props.openSource} />,
                <Shipped key="shipped" />,
                <OpenSource key="oss" repos={props.openSource} />,
                <Research key="research" />,
                <Stack key="stack" />,
                <Activity key="activity" />,
                <Education key="edu" />,
                <Outro key="outro" />,
                <Quote key="quote" />,
              ].map((block, n) => (
                <div key={block.key} className="enter" data-reveal="" style={{ '--n': Math.min(n, 6) } as CSSProperties}>
                  {block}
                </div>
              ))
            ) : props.page === 'notfound' ? (
              <NotFound />
            ) : (
              <PublicationsList />
            )}
          </main>
          <Footer />
        </div>
        <Dock />
        <CatToast />
        {props.page === 'home' && <PeekingCat />}
        <Resume />
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;

import { MotionConfig } from 'framer-motion';

import { Scene } from '@/scene/Scene';
import { Navbar } from '@/overlay/Navbar';
import { Sections } from '@/overlay/Sections';
import { ZonePanel } from '@/overlay/ZonePanel';
import { Minimap } from '@/overlay/Minimap';
import { PhaseIndicator } from '@/overlay/PhaseIndicator';
import { LoadingCurtain } from '@/overlay/LoadingCurtain';
import { useScrollProgress } from '@/overlay/useScrollProgress';
import { ChatbotWidget } from '@/chatbot/ChatbotWidget';
import { useAppFlags } from '@/lib/useAppFlags';

/**
 * App shell.
 *  - Fixed R3F <Scene/> covers the viewport.
 *  - <Sections/> stack normally (4× viewport tall) for scroll height.
 *  - <Navbar/> floats on top with logo + nav + quote CTA.
 *  - <PhaseIndicator/> is a fixed dot-nav showing current phase.
 *  - <ChatbotWidget/> is the GardenGenie launcher → glass panel.
 *  - <LoadingCurtain/> hides the empty canvas until first paint is ready.
 *  - Skip-to-content link keeps keyboard / screen-reader users sane.
 */
export default function App() {
  useScrollProgress();
  useAppFlags();

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sun-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-dusk-900"
      >
        Skip to content
      </a>

      <main id="main" className="relative w-full">
        <div className="fixed inset-0 z-0" aria-hidden="true">
          <Scene />
        </div>

        <Navbar />

        <div className="relative z-10">
          <Sections />
        </div>

        <ZonePanel />
        <Minimap />
        <PhaseIndicator />
        <ChatbotWidget />
      </main>

      <LoadingCurtain />
    </MotionConfig>
  );
}

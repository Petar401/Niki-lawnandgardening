import { Scene } from '@/scene/Scene';
import { Navbar } from '@/overlay/Navbar';
import { Sections } from '@/overlay/Sections';
import { PhaseIndicator } from '@/overlay/PhaseIndicator';
import { useScrollProgress } from '@/overlay/useScrollProgress';
import { ChatbotWidget } from '@/chatbot/ChatbotWidget';

/**
 * App shell.
 *  - Fixed R3F <Scene/> covers the viewport.
 *  - <Sections/> stack normally (4× viewport tall) providing scroll height.
 *  - <Navbar/> floats on top with logo + nav + quote CTA.
 *  - <PhaseIndicator/> is a fixed dot-nav showing current phase.
 *  - useScrollProgress bridges scroll → store.
 */
export default function App() {
  useScrollProgress();

  return (
    <main className="relative w-full">
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      <Navbar />

      <div className="relative z-10">
        <Sections />
      </div>

      <PhaseIndicator />
      <ChatbotWidget />
    </main>
  );
}

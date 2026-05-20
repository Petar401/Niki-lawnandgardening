import { Mailbox } from './Mailbox';
import { Fireflies } from './Fireflies';

/**
 * Contact composition: 3D mailbox + orbiting/bursting fireflies. The
 * contact form is HTML (in <Sections/>), not 3D — it's the focal
 * interaction and we keep it crisp + accessible in the DOM.
 */
export function Contact() {
  return (
    <group>
      <Mailbox />
      <Fireflies />
    </group>
  );
}

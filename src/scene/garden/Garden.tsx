import { Hedges } from './Hedges';
import { FlowerBed } from './FlowerBed';
import { Trees } from './Trees';
import { Wildlife } from './Wildlife';
import { SeasonCycler } from './SeasonCycler';

/**
 * Parent that arranges all "real garden" props around the camera path.
 * Drop into <Scene/> after the procedural grass.
 */
export function Garden() {
  return (
    <group>
      <SeasonCycler />
      <Hedges />
      <FlowerBed />
      <Trees />
      <Wildlife />
    </group>
  );
}

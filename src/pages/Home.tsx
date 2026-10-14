import { Hero } from '../sections/Hero';
import { DayScrubber } from '../sections/DayScrubber';
import { Food } from '../sections/Food';
import { Bar } from '../sections/Bar';
import { Room } from '../sections/Room';
import { Press } from '../sections/Press';
import { FindUs } from '../sections/FindUs';

export function Home() {
  return (
    <>
      <Hero />
      <DayScrubber />
      <Food />
      <Bar />
      <Room />
      <Press />
      <FindUs />
    </>
  );
}

import { Hero, Intro } from '../sections/Hero';
import { Day } from '../sections/Day';
import { Food } from '../sections/Food';
import { Bar } from '../sections/Bar';
import { Room } from '../sections/Room';
import { Press } from '../sections/Press';
import { FindUs } from '../sections/FindUs';
import { useTitle } from '../lib/title';

export function Home() {
  useTitle(null);
  return (
    <>
      <Hero />
      <Intro />
      <Day />
      <Food />
      <Bar />
      <Room />
      <Press />
      <FindUs />
    </>
  );
}

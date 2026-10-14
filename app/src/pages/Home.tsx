import { Hero } from '../sections/Hero';
import { Manifesto } from '../sections/Manifesto';
import { DayStage } from '../sections/DayStage';
import { Food } from '../sections/Food';
import { Bar, Cellar } from '../sections/Bar';
import { People, Room } from '../sections/Room';
import { Press } from '../sections/Press';
import { Night } from '../sections/Night';
import { useTitle } from '../lib/title';

export function Home() {
  useTitle(null);
  return (
    <>
      <Hero />
      <Manifesto />
      <DayStage />
      <Food />
      <Bar />
      <Cellar />
      <Room />
      <People />
      <Press />
      <Night />
    </>
  );
}

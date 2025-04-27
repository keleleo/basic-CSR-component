import { exemple2_1, exemple2_2 } from './components/example-2';
import { exemple1 } from './components/exemple-1';
import { createComponent } from './core';

(() => {
  createComponent(exemple1);
  createComponent(exemple2_2);
  createComponent(exemple2_1);
})();

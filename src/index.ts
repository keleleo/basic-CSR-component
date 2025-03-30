import { testeCard, testeTitle } from './components/teste-attr';
import { testeMouse } from './components/teste-mouse';
import { createComp } from './core/index';

(() => {
  createComp(testeMouse.html, testeMouse.component, testeMouse.tag);
  createComp(testeTitle.html, testeTitle.component, testeTitle.tag);
  createComp(testeCard.html, testeCard.component, testeCard.tag);
})();

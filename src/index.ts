import { testeCard, testeInput, testeTitle } from './components/teste-attr';
import { testContainer, testContent } from './components/teste-attr2';
import { testeMouse } from './components/teste-mouse';
import { testeProp } from './components/teste-prop';
import { createComp } from './core/index';

(() => {
  createComp(testeMouse.html, testeMouse.component, testeMouse.tag);
  createComp(testeTitle.html, testeTitle.component, testeTitle.tag);
  createComp(testeInput.html, testeInput.component, testeInput.tag);
  createComp(testeCard.html, testeCard.component, testeCard.tag);
  createComp(testeProp.html, testeProp.component, testeProp.tag);

  createComp(testContent.html, testContent.component, testContent.tag);
  createComp(testContainer.html, testContainer.component, testContainer.tag);
})();

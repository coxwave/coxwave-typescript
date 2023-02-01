import { getGlobalScope } from '@coxwave/analytics-client-common';

import { runQueuedFunctions } from './utils/snippet-helper';

import * as coxwave from './index';

// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(function () {
  const GlobalScope = getGlobalScope();

  if (!GlobalScope) {
    console.error('[Coxwave] Error: GlobalScope is not defined');
    return;
  }

  GlobalScope.coxwave = Object.assign(GlobalScope.coxwave || {}, coxwave);

  if (GlobalScope.coxwave.invoked) {
    const queue = GlobalScope.coxwave._q;
    GlobalScope.coxwave._q = [];
    runQueuedFunctions(coxwave, queue);

    for (let i = 0; i < GlobalScope.coxwave._iq.length; i++) {
      const instance = Object.assign(GlobalScope.coxwave._iq[i], coxwave.createInstance());
      const queue = instance._q;
      instance._q = [];
      runQueuedFunctions(instance, queue);
    }
  }
})();

import { NodeOptions } from '../config';
import { CoxwaveReturn } from '../coxwave-promise';

import { BaseClient } from './base-client';

export interface NodeClient extends BaseClient {
  /**
   * Initializes the Coxwave SDK with your projectToken, optional configurations.
   * This method must be called before any other operations.
   *
   * ```typescript
   * await init(PROJECT_TOKEN, options).promise;
   * ```
   */
  init(projectToken: string, options?: NodeOptions): CoxwaveReturn<void>;
}

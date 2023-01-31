import { BaseTransport } from '@coxwave/analytics-core';
import { Payload, Response, Transport } from '@coxwave/analytics-types';

export class FetchTransport extends BaseTransport implements Transport {
  async send(serverUrl: string, payload: Payload, projectToken: string): Promise<Response | null> {
    /* istanbul ignore if */
    if (typeof fetch === 'undefined') {
      throw new Error('FetchTransport is not supported');
    }
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Coxwave-Project-Token': projectToken,
        Accept: '*/*',
      },
      body: JSON.stringify(payload),
      method: 'POST',
    };
    const response = await fetch(serverUrl, options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responsePayload: Record<string, any> = await response.json();
    return this.buildResponse(responsePayload);
  }
}

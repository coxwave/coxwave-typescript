import { Status } from '@coxwave/analytics-types';

import { FetchTransport } from '../../src/transports/fetch';
import { PROJECT_TOKEN } from '../helpers/constants';
import 'isomorphic-fetch';

describe('fetch', () => {
  describe('send', () => {
    test('should resolve with response', async () => {
      const transport = new FetchTransport();
      const url = 'http://localhost:3000';
      const payload = {
        activities: [],
      };
      const result = {
        statusCode: 200,
        status: Status.Success,
        body: {
          eventsIngested: 0,
          payloadSizeBytes: 0,
          serverUploadTime: 0,
        },
      };
      jest.spyOn(window, 'fetch').mockReturnValueOnce(Promise.resolve(new Response('{}')));
      jest.spyOn(transport, 'buildResponse').mockReturnValueOnce(result);
      const response = await transport.send(url, payload, PROJECT_TOKEN);
      expect(response).toEqual(result);
    });
  });
});

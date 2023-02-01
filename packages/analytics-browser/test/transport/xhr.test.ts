import { Status } from '@coxwave/analytics-types';

import { XHRTransport } from '../../src/transports/xhr';
import { PROJECT_TOKEN } from '../helpers/default';

describe('xhr', () => {
  describe('send', () => {
    test('should resolve with response', async () => {
      const transport = new XHRTransport();
      const url = 'http://localhost:3000';
      const payload = {
        projectToken: '',
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
      const xhr = new XMLHttpRequest();
      const open = jest.fn();
      const setRequestHeader = jest.fn();
      const send = jest.fn();
      const mock = {
        ...xhr,
        open,
        setRequestHeader,
        send,
        readyState: 4,
        responseText: '{}',
      };
      jest.spyOn(window, 'XMLHttpRequest').mockReturnValueOnce(mock);
      jest.spyOn(transport, 'buildResponse').mockReturnValueOnce(result);

      const unresolvedResponse = transport.send(url, payload, PROJECT_TOKEN);
      expect(mock.onreadystatechange).toBeDefined();
      mock.onreadystatechange && mock.onreadystatechange(new Event(''));
      const response = await unresolvedResponse;
      expect(response).toBe(result);
      expect(open).toHaveBeenCalledWith('POST', url, true);
      expect(setRequestHeader).toHaveBeenCalledTimes(3);
      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(JSON.stringify(payload));
    });

    test('should handle unexpected error', async () => {
      const transport = new XHRTransport();
      const url = 'http://localhost:3000';
      const payload = {
        projectToken: '',
        activities: [],
      };
      const xhr = new XMLHttpRequest();
      const open = jest.fn();
      const setRequestHeader = jest.fn();
      const send = jest.fn();
      const mock = {
        ...xhr,
        open,
        setRequestHeader,
        send,
        readyState: 4,
        responseText: '',
      };
      jest.spyOn(window, 'XMLHttpRequest').mockReturnValueOnce(mock);

      const unresolvedResponse = transport.send(url, payload, PROJECT_TOKEN);
      expect(mock.onreadystatechange).toBeDefined();
      mock.onreadystatechange && mock.onreadystatechange(new Event(''));
      await expect(unresolvedResponse).rejects.toThrow('Unexpected end of JSON input');
      expect(open).toHaveBeenCalledWith('POST', url, true);
      expect(setRequestHeader).toHaveBeenCalledTimes(3);
      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(JSON.stringify(payload));
    });
  });
});

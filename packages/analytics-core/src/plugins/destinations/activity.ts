import {
  DestinationContext as Context,
  ActivityPayload,
  ActivityEvent,
  PluginCoverage,
} from '@coxwave/analytics-types';

import { SERVER_ACTIVITIES_PATH } from '../../constants';

import { _BaseDestination } from './base-destination';

import { syncServerSpec } from '../../utils/payload';

export class ActivityDestination extends _BaseDestination {
  name = 'coxwave-activity-destination';
  coverage = PluginCoverage.ACTIVITY;

  _createPayload(contexts: Context[]): ActivityPayload {
    return {
      activities: contexts.map((context) => {
        return syncServerSpec(context.event) as ActivityEvent;
      }),
      options: {},
    };
  }

  _createEndpointUrl(serverUrl: string) {
    return serverUrl + SERVER_ACTIVITIES_PATH;
  }
}

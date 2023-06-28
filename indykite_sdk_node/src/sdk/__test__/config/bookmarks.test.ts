import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  CreateApplicationSpaceResponse,
  UpdateApplicationSpaceResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { ApplicationSpace } from '../../model/config/application_space';
import { Utils } from '../../utils/utils';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('when the bookmark list is empty', () => {
  let sdk: ConfigClient;

  beforeEach(async () => {
    sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
  });

  it('has no bookmarks', () => {
    expect(sdk.getLastBookmark()).toBe('');
    expect(sdk.stopBookmarkRecording()).toEqual([]);
  });

  describe('when an application space is created', () => {
    let appSpace: ApplicationSpace;

    beforeEach(async () => {
      jest
        .spyOn(sdk['client'], 'createApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'app-space-id',
                etag: '111',
                createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                bookmark: 'create-appspace-bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
              });
            }
            return {} as SurfaceCall;
          },
        );

      sdk.startBookmarkRecording();
      appSpace = await sdk.createApplicationSpace('customer-id', 'new-app-space');
    });

    it('returns the last bookmark token', () => {
      expect(sdk.getLastBookmark()).toBe('create-appspace-bookmark-token');
    });

    it('returns the list of bookmark tokens', () => {
      expect(sdk.stopBookmarkRecording()).toEqual(['create-appspace-bookmark-token']);
    });

    describe('when the created application space is updated', () => {
      beforeEach(async () => {
        jest
          .spyOn(sdk['client'], 'updateApplicationSpace')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: UpdateApplicationSpaceResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  etag: '777',
                  id: 'app-space-id',
                  updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
                  bookmark: 'update-appspace-bookmark-token',
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                });
              }
              return {} as SurfaceCall;
            },
          );

        await sdk.updateApplicationSpace(appSpace);
      });

      it('returns the last bookmark token', () => {
        expect(sdk.getLastBookmark()).toBe('update-appspace-bookmark-token');
      });

      it('returns the list of bookmark tokens', () => {
        expect(sdk.stopBookmarkRecording()).toEqual([
          'create-appspace-bookmark-token',
          'update-appspace-bookmark-token',
        ]);
      });
    });
  });
});

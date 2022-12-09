import { when } from 'jest-when';
import { Scope } from 'nock';
import getStories from '../apiClient';
import mapStories from '../mappers/storyMapper';
import Story from '../types/story';
import {generateGenericStory} from "./helpers/test.helpers";

const nock = require('nock');

jest.mock('../mappers/storyMapper');
const storySampleData = require('./sample-data/stories.json');

const context = describe;


describe('apiClient', () => {
  let scope: Scope;

  beforeEach(() => {
    scope = nock('https://www.pivotaltracker.com/services/v5/');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getStories', () => {
    context('missing tracker token', () => {
      beforeEach(() => {
        process.env.TRACKER_TOKEN = '';
      });

      it('throws an error', async () => {
        await expect(async () =>
          getStories(-1),
        ).rejects.toEqual('NO $TRACKER_TOKEN environment variable set');
      });
    });

    context('valid tracker token', () => {
      let actual: Story[];

      beforeEach(() => {
        process.env.TRACKER_TOKEN = 'tracker-token';
      });

      context('when the total response fits within the page limit', () => {
        beforeEach(async () => {
          scope
            .get('/projects/9987/stories')
            .query({
              limit: 100,
              offset: 0,
            })
            .reply(200, storySampleData, {
              'x-tracker-pagination-total': '99',
            });

          when(mapStories)
            .calledWith(storySampleData)
            .mockReturnValueOnce([generateGenericStory()]);

          actual = await getStories(9987);
        });

        it('returns mapped stories', () => {
          expect(actual).toEqual([
            {
              id: 123,
              name: 'story-name',
              type: 'feature',
              url: 'url',
              description: "details",
              points: 3,
              state: "unstarted",
            },
          ]);
        });
      });

      function generateResponseOfLength(length: number): Story[] {
        const stories: Story[] = [];
        for (let i = 0; i < length; i++) {
          stories.push(generateGenericStory());
        }
        return stories;
      }

      context('when the total response is larger than the page limit', () => {
        beforeEach(async () => {
          scope
            .get('/projects/9987/stories')
            .query({
              limit: 100,
              offset: 0,
            })
            .reply(200, storySampleData, {
              'x-tracker-pagination-total': '223',
            });

          scope
            .get('/projects/9987/stories')
            .query({
              limit: 100,
              offset: 100,
            })
            .reply(200, storySampleData, {
              'x-tracker-pagination-total': '223',
            });

          scope
            .get('/projects/9987/stories')
            .query({
              limit: 100,
              offset: 200,
            })
            .reply(200, storySampleData, {
              'x-tracker-pagination-total': '223',
            });

          when(mapStories)
            .calledWith(storySampleData)
            .mockReturnValueOnce(generateResponseOfLength(100));
          when(mapStories)
            .calledWith(storySampleData)
            .mockReturnValueOnce(generateResponseOfLength(100));
          when(mapStories)
            .calledWith(storySampleData)
            .mockReturnValueOnce(generateResponseOfLength(23));

          actual = await getStories(9987);
        });

        it('paginates', () => {
          expect(actual.length).toEqual(223);
        });
      });
    });

    context('HTTP error', () => {
      beforeEach(async () => {
        process.env.TRACKER_TOKEN = 'tracker-token';

        scope
          .get('/projects/765/stories')
          .query({
            limit: 100,
            offset: 0,
          })
          .reply(500);
      });

      it('re-throws the HTTP error', async () => {
        await expect(() =>
          getStories(765),
        ).rejects.toEqual('Request failed with status code 500');
      });
    });
  });
});

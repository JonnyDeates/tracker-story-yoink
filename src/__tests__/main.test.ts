import { when } from 'jest-when';
import main from '../main';
import getStories from '../apiClient';
import generateMarkdown from '../generateMarkdown';
import {generateGenericStory} from "./helpers/test.helpers";

jest.mock('../apiClient');
jest.mock('../generateMarkdown');

const context = describe;

describe('index', () => {
  context('with a present $TRACKER_PROJECT_ID', () => {
    beforeEach(async () => {
      process.env.TRACKER_PROJECT_ID = '4456';

      when(getStories)
        .calledWith(4456)
        .mockResolvedValueOnce([ generateGenericStory()]);
      await main();
    });

    it('generates markdown with the results from the API', () => {
      expect(generateMarkdown).toHaveBeenCalledWith(
        [
          {
            id: 123,
            type: 'feature',
            name: 'story-name',
            points: 3,
            state: "unstarted",
            url: 'url',
            description: "details"
          },
        ],
      );
    });
  });

  context('with a missing $TRACKER_PROJECT_ID', () => {
    beforeEach(() => {
      process.env.TRACKER_PROJECT_ID = '';
    });

    it('throws an error', async () => {
      await expect(async () =>
        main(),
      ).rejects.toThrowError(
        'missing environment variable: $TRACKER_PROJECT_ID',
      );
    });
  });
});

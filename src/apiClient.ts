import axios from 'axios';
import chalk from 'chalk';
import mapStories from './mappers/storyMapper';
import Story from './types/story';

const TRACKER_URL =
  process.env.TRACKER_URL || 'https://www.pivotaltracker.com/services/v5';

function getTrackerToken(): string {
  const trackerToken = process.env.TRACKER_TOKEN || '';
  if (trackerToken === '') {
    throw new Error('NO $TRACKER_TOKEN environment variable set');
  }
  return trackerToken;
}

function generateUrl(
  projectId: number,
  limit: number,
  offset: number,
): string {
  return `${TRACKER_URL}/projects/${projectId}/stories?limit=${limit}&offset=${offset}`;
}

export default async function getStories(
  projectId: number,
): Promise<Story[]> {
  try {
    let offset: number = 0;
    const limit = 100;

    const config = {
      headers: {
        'X-TrackerToken': getTrackerToken(),
      },
    };

    let response = await axios.get(
      generateUrl(projectId, limit, offset),
      config,
    );

    let stories = mapStories(response.data as any[]);
    const total = parseInt(response.headers['x-tracker-pagination-total'], 10);

    console.log(
      chalk.yellow(
        `fetching stories ${Math.min(limit, total)}/${total} stories`,
      ),
    );

    if (total > limit) {
      let multiplier = 1;

      while (stories.length < total) {
        multiplier++;
        console.log(
          chalk.yellow(
            `fetching ${Math.min(limit * multiplier, total)}/${total} stories`,
          ),
        );

        offset += limit;
        response = await axios.get(
          generateUrl(projectId, limit, offset),
          config,
        );
        stories = [...stories, ...mapStories(response.data as any[])];
      }
    }
    return stories.filter((story) => story.state !== 'accepted');
  } catch (e: any) {
    console.log(chalk.red(`error retrieving stories ${e.message}`));
    return Promise.reject(e.message);
  }
}

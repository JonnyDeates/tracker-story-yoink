import getStories from './apiClient';
import generateMarkdown from './generateMarkdown';

function getTrackerProjectId(): number {
  if (!process.env.TRACKER_PROJECT_ID || undefined) {
    throw new Error('missing environment variable: $TRACKER_PROJECT_ID');
  }

  return Number.parseInt(process.env.TRACKER_PROJECT_ID, 10);
}

export default async function main(isOnlyPointed: boolean) {
  const trackerProjectId = getTrackerProjectId();
  const stories = await getStories(trackerProjectId, isOnlyPointed);
  generateMarkdown(stories);
}

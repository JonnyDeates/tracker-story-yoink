import Story from '../../types/story';
import mapStories from '../../mappers/storyMapper';

describe('storyMapper', () => {
  describe('mapStories', () => {
    let stories: Story[];

    beforeEach(() => {
      stories = mapStories([
        {
          id: 545,
          name: "yeet/tomatojuice",
          estimate: "3",
          description: "documents for description",
          story_type: "feature",
          url: "story-url",
          current_state: "unaccepted",
        },
        {
          id: 546,
          name: 'bug-name',
          story_type: 'bug',
          current_state: "unaccepted",
          url: 'story-url',
        },
      ]);
    });

    it('maps each story', () => {
      expect(stories).toEqual([
        {
          id: 545,
          name: "yeet tomatojuice",
          points: "3",
          description: "documents for description",
          type: "feature",
          url: "story-url",
          state: "unaccepted",
        },
        {
          id: 546,
          name: 'bug-name',
          type: 'bug',
          url: 'story-url',
          state: "unaccepted",

        },
      ]);
    });
  });
});

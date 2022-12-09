import Story from "../../types/story";

export const generateGenericStory = (args: Partial<Story> = {}): Story=> ({
    id: 123,
    name: 'story-name',
    type: 'feature',
    points: 3,
    description: "details",
    state: "unstarted",
    url: 'url',
    ...args
});

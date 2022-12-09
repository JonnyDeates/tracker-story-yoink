import Story from '../types/story';
import generateMarkdown from '../generateMarkdown';
import {generateGenericStory} from "./helpers/test.helpers";
import writeOutputToFile from "../writeOutputToFile";

jest.mock("../writeOutputToFile");

describe('generateMarkdown', () => {
    let actual: string;
    const date = new Date(2022, 3, 26);

    beforeEach(() => {
        const stories: Story[] = [
            generateGenericStory({
                id: 31,
                name: 'first-story',
                url: 'first-feature-url',
                points: 3,
                description: "feature-description"
            }),
            generateGenericStory({
                id: 41,
                name: 'first-bug',
                url: 'first-bug-url',
                type: 'bug',
                points: undefined,
                description: "bug is broken"
            }),
            generateGenericStory({
                id: 32,
                name: 'second-feature',
                url: 'second-feature-url',
                points: 1,
                description: "yeet"
            }),
            generateGenericStory({
                id: 42,
                name: 'second-bug',
                type: 'bug',
                url: 'second-bug-url',
                description: undefined,
                points: undefined
            }),
        ];

        generateMarkdown(stories);
    });
    it('allocates the markdown to writeOutputToFile', () => {
        expect(writeOutputToFile).toBeCalledTimes(4);

        // Every Feature Should Have
        for(let x = 1; x< 4; x++){
            expect(writeOutputToFile).toHaveBeenNthCalledWith(x,
                expect.stringContaining("## Pivotal Tracker"), expect.any(String));
            expect(writeOutputToFile).toHaveBeenNthCalledWith(x,
                expect.stringContaining("tags"), expect.any(String));
            expect(writeOutputToFile).toHaveBeenNthCalledWith(x,
                expect.stringContaining("  - pivotal-tracker"), expect.any(String));
        }

        // Unique to Feature 1
        const firstStory = 'first-story';
        expect(writeOutputToFile).toHaveBeenNthCalledWith(1,
            expect.stringContaining("### first-story [#31](first-feature-url"),firstStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(1,
            expect.stringContaining("#### Points: 3"), firstStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(1,
            expect.stringContaining("### Description"), firstStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(1,
            expect.stringContaining("feature-description"), firstStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(1,
            expect.stringContaining("  - feature"), firstStory);

        // Unique to Bug 1
        const firstBug = 'first-bug';
        expect(writeOutputToFile).toHaveBeenNthCalledWith(2,
            expect.stringContaining("### first-bug [#41](first-bug-url)"),firstBug);
        expect(writeOutputToFile).not.toHaveBeenNthCalledWith(2,
            expect.stringContaining("#### Points:"), firstBug);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(2,
            expect.stringContaining("### Description"), firstBug);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(2,
            expect.stringContaining("bug is broken"), firstBug);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(2,
            expect.stringContaining("  - bug"), firstBug);

        // Unique to Feature 3
        const secondStory = 'second-feature';
        expect(writeOutputToFile).toHaveBeenNthCalledWith(3,
            expect.stringContaining("### second-feature [#32](second-feature-url)"),secondStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(3,
            expect.stringContaining("#### Points: 1"), secondStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(3,
            expect.stringContaining("### Description"), secondStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(3,
            expect.stringContaining("yeet"), secondStory);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(3,
            expect.stringContaining("  - feature"), secondStory);

        // Unique to Bug 2
        const secondBug = 'second-bug';
        expect(writeOutputToFile).toHaveBeenNthCalledWith(4,
            expect.stringContaining("### second-bug [#42](second-bug-url)"),secondBug);
        expect(writeOutputToFile).not.toHaveBeenNthCalledWith(4,
            expect.stringContaining("#### Points:"), secondBug);
        expect(writeOutputToFile).not.toHaveBeenNthCalledWith(4,
            expect.stringContaining("### Description"), secondBug);
        expect(writeOutputToFile).toHaveBeenNthCalledWith(4,
            expect.stringContaining("  - bug"), secondBug);
    });
});

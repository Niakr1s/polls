/** @returns {import('./poll').PollParams} */
export function createValidPollParams() {
    const pollParams = {
        name: 'MyPoll',
        options: {
            filter: 'none',
            multiple: 2,
            timeoutMinutes: 30,
        },
        choices: ['first', 'second', 'third'],
    }
    return pollParams;
}
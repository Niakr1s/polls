import { createPoll, validatePollParams, validatePoll } from "./poll.js"
import { createValidPollParams } from './test.helper.js';
import moment from 'moment'

test('createPoll', () => {
    const pollParams = createValidPollParams();
    const poll = createPoll(pollParams);
    expect(poll.name).toBe(pollParams.name);
    expect(poll.uuid).not.toBe('');
    expect(poll.choices).toHaveLength(pollParams.choices.length);
    poll.choices.map((choice, idx) => {
        /** @type {import('./poll').Choice} */
        const etalon = {
            name: pollParams.choices[idx],
            count: 0,
        }
        expect(choice).toStrictEqual(etalon);
    })
    expect(poll.options.multiple).toBe(pollParams.options.multiple);
    expect(poll.options.filter).toBe(pollParams.options.filter);
    expect(+poll.options.expires).toBeLessThanOrEqual(+moment().add(pollParams.options.timeoutMinutes, 'minutes').toDate());
})

describe('validatePollParams should work', () => {
    describe('valid', () => {
        test('valid #1', () => {
            const pollParams = createValidPollParams();
            const validationResult = validatePollParams(pollParams);
            expect(validationResult.error).toBeUndefined();
        })
        test('valid #2', () => {
            const pollParams = createValidPollParams();
            pollParams.options.filter = 'cookie'
            const validationResult = validatePollParams(pollParams);
            expect(validationResult.error).toBeUndefined();
        })
        test('valid #3', () => {
            const pollParams = createValidPollParams();
            pollParams.options.filter = 'ip'
            const validationResult = validatePollParams(pollParams);
            expect(validationResult.error).toBeUndefined();
        })
    })
    describe('invalid', () => {
        describe('name', () => {
            test('invalid name', () => {
                const pollParams = createValidPollParams();
                pollParams.name = '';
                const validationResult = validatePollParams(pollParams);
                expect(validationResult.error).not.toBeUndefined();
            })
        })
        describe('choices', () => {
            test('undefined', () => {
                const pollParams = createValidPollParams();
                pollParams.choices = undefined;
                const validationResult = validatePollParams(pollParams);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('empty', () => {
                const pollParams = createValidPollParams();
                pollParams.choices = [];
                const validationResult = validatePollParams(pollParams);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('only one', () => {
                const pollParams = createValidPollParams();
                pollParams.choices = ['valid choice'];
                const validationResult = validatePollParams(pollParams);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('identical', () => {
                const pollParams = createValidPollParams();
                pollParams.choices = ['choice', 'choice'];
                const validationResult = validatePollParams(pollParams);
                expect(validationResult.error).not.toBeUndefined();
            })
        })
        describe('options', () => {
            describe('multiple', () => {
                test('> choices.length', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.multiple = pollParams.choices.length + 1;
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('0', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.multiple = 0;
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('<0', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.multiple = -1;
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
            })
            describe('timeoutMinutes', () => {
                test('<0', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.timeoutMinutes = -1;
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('=0', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.timeoutMinutes = 0;
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('too big', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.timeoutMinutes = 1000;
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
            })
            describe('filter', () => {
                test('is empty', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.filter = ''
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('is random text', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.filter = 'random text'
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('is empty', () => {
                    const pollParams = createValidPollParams();
                    pollParams.options.filter = ''
                    const validationResult = validatePollParams(pollParams);
                    expect(validationResult.error).not.toBeUndefined();
                })
            })
        })
        describe('empty', () => {
            test('empty object', () => {
                const validationResult = validatePollParams({});
                expect(validationResult.error).not.toBeUndefined();
            })
            test('undefined', () => {
                const validationResult = validatePollParams();
                expect(validationResult.error).not.toBeUndefined();
            })
        })
    })
})

describe('validatePoll should work', () => {
    /** @returns {import("./poll.js").Poll} */
    function createValidPoll() {
        const pollParams = createValidPollParams();
        const poll = createPoll(pollParams);
        return poll;
    }

    describe('valid', () => {
        test('valid input', () => {
            const poll = createValidPoll();
            const validationResult = validatePoll(poll);
            expect(validationResult.error).toBeUndefined();
        })
    })
    describe('invalid', () => {
        describe('name', () => {
            test('empty', () => {
                const poll = createValidPoll();
                poll.name = '';
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('undefined', () => {
                const poll = createValidPoll();
                poll.name = undefined;
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('too big', () => {
                const poll = createValidPoll();
                poll.name = 'a'.repeat(30);
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
        })
        describe('uuid', () => {
            test('empty', () => {
                const poll = createValidPoll();
                poll.uuid = '';
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
        })
        describe('choices', () => {
            test('empty', () => {
                const poll = createValidPoll();
                poll.choices = [];
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('one choice', () => {
                const poll = createValidPoll();
                poll.choices = [{ name: 'one', count: 0 }];
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('two identical choices', () => {
                const poll = createValidPoll();
                poll.choices = [{ name: 'one', count: 0 }, { name: 'one', count: 1 }];
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
            test('count is negative', () => {
                const poll = createValidPoll();
                poll.choices[0].count = -1;
                const validationResult = validatePoll(poll);
                expect(validationResult.error).not.toBeUndefined();
            })
        })
        describe('options', () => {
            describe('multiple', () => {
                test('> choices.length', () => {
                    const poll = createValidPoll();
                    poll.options.multiple = poll.choices.length + 1;
                    const validationResult = validatePoll(poll);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('0', () => {
                    const poll = createValidPoll();
                    poll.options.multiple = 0;
                    const validationResult = validatePoll(poll);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('<0', () => {
                    const poll = createValidPoll();
                    poll.options.multiple = -1;
                    const validationResult = validatePollParams(poll);
                    expect(validationResult.error).not.toBeUndefined();
                })
            })
            describe('expires', () => {
                test('not date', () => {
                    const poll = createValidPoll();
                    poll.options.expires = 123;
                    const validationResult = validatePollParams(poll);
                    expect(validationResult.error).not.toBeUndefined();
                })
            })
            describe('filter', () => {
                test('is empty', () => {
                    const poll = createValidPoll();
                    poll.options.filter = ''
                    const validationResult = validatePoll(poll);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('is random text', () => {
                    const poll = createValidPoll();
                    poll.options.filter = 'random text'
                    const validationResult = validatePoll(poll);
                    expect(validationResult.error).not.toBeUndefined();
                })
                test('is empty', () => {
                    const poll = createValidPoll();
                    poll.options.filter = ''
                    const validationResult = validatePoll(poll);
                    expect(validationResult.error).not.toBeUndefined();
                })
            })
        })
    })
    describe('empty', () => {
        test('empty object', () => {
            const validationResult = validatePoll({});
            expect(validationResult.error).not.toBeUndefined();
        })
        test('undefined', () => {
            const validationResult = validatePoll();
            expect(validationResult.error).not.toBeUndefined();
        })
    })
})
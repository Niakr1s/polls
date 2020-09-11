import axios from 'axios';
import { createPoll } from '@polls/shared/poll/poll';
import { createValidPollParams } from '@polls/shared/poll/test.helper.js';
import { config } from '../config.js';

/** 
 * @returns {Promise<{uuid: string>}}
 */
export async function postPollParams(pollParams) {
    /** @type {{uuid: string}} */
    let result = {}
    if (config.MOCK_API) {
        const poll = createPoll(pollParams);
        return { uuid: poll.uuid }
    } else {
        const data = await axios.post('/api/poll', pollParams);
        const uuid = data.uuid;
        if (!uuid) {
            throw new Error('no uuid in response');
        }
        return { uuid }
    }
}

/**
 * @param {string} uuid 
 */
export async function getPoll(uuid) {
    if (config.MOCK_API) {
        return createPoll(createValidPollParams());
    } else {
        const data = await axios.get(`/api/poll/${uuid}`);
        if (data.error) {
            throw new Error(data.error)
        }
        return data.poll;
    }
}

/**
 * @param {import('../../../shared/poll/poll.js').Poll} poll 
 * @param {number[]} indexes
 * @returns {Promise<import('../../../shared/poll/poll.js').Poll>}
 */
export async function addChoices(poll, indexes) {
    if (indexes.some(idx => idx >= poll.choices.length || idx < 0)) {
        throw new Error(`invalid indexes`);
    }
    if (config.MOCK_API) {
        indexes.forEach(idx => {
            poll.choices[idx].count++;
        })
        return poll;
    } else {
        const { data } = await axios.put(`/api/poll/${poll.uuid}`, {
            names: indexes.map((idx) => poll.choices[idx].name),
        })
        if (data.error) {
            throw new Error(data.error);
        }
        return data.poll;
    }
}
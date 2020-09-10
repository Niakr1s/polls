import * as uuid from 'uuid';
import moment from 'moment';
import joi from 'joi';

// ---------------------------------------
/**
 * Parameters to create Poll with.
 * @typedef {object} PollParams
 * @property {string} PollParams.name
 * @property {string[]} PollParams.choices
 * @property {PollParamsOptions} PollParams.options
 */

/**
 * PollParams.options
 * @typedef {object} PollParamsOptions
 * @property {number} PollParamsOptions.multiple
 * @property {number} PollParamsOptions.timeoutMinutes
 * @property {'none' | 'ip' | 'choice'} PollParamsOptions.filter
 */
// ---------------------------------------
/**
 * Poll.
 * @typedef {object} Poll
 * @property {string} Poll.name
 * @property {string} Poll.uuid
 * @property {Choice[]} Poll.choices
 * @property {PollOptions} Poll.options
 */

/**
 * A single choice inside a Poll.
 * @typedef {object} Choice
 * @property {string} Choice.name
 * @property {number} Choice.count
 */

/**
 * Poll options.
 * @typedef {object} PollOptions
 * @property {number} PollOptions.multiple
 * @property {Date} PollOptions.expires
 * @property {'none' | 'ip' | 'cookie'} PollOptions.filter
 */
// ---------------------------------------

const commonSchemas = {
    name: joi.string().min(3).max(12).required(),
    choices: joi.array().min(2).max(20).unique().required(),
    options: {
        multiple: joi.number().min(1).required(),
        filter: joi.string().valid('none', 'ip', 'cookie').required(),
        timeoutMinutes: joi.number().min(1).max(120).required(),
        expires: joi.date().required(),
    },
    choiceName: joi.string().min(1).max(30).required(),

    /**
     * Custom validation, that forbid multiple to be more than choices.length.
     * @param {PollParams} pollParams 
     * @param {joi.CustomHelpers<any>} helper 
     */
    validateMultiple(pollParams, helper) {
        if (pollParams.options.multiple > pollParams.choices.length) {
            return helper.error('options.multiple must be less or equal of choices.length')
        }
    },

    /**
     * @param {Choice} a
     * @param {Choice} b
     */
    choicesComparator(a, b) {
        return a.name === b.name
    },
}

const pollParamsSchema = joi.object({
        name: commonSchemas.name,
        choices: commonSchemas.choices.items(commonSchemas.choiceName),
        options: joi.object({
            multiple: commonSchemas.options.multiple,
            timeoutMinutes: commonSchemas.options.timeoutMinutes,
            filter: commonSchemas.options.filter,
        }),
    })
    .required()
    .custom(commonSchemas.validateMultiple)

const pollSchema = joi.object({
        name: commonSchemas.name,
        uuid: joi.string().uuid({ version: "uuidv4" }),
        choices: commonSchemas.choices.items(joi.object({
            name: commonSchemas.choiceName,
            count: joi.number().min(0),
        })).unique(commonSchemas.choicesComparator),
        options: joi.object({
            multiple: commonSchemas.options.multiple,
            expires: commonSchemas.options.expires,
            filter: commonSchemas.options.filter,
        }),
    })
    .required()
    .custom(commonSchemas.validateMultiple)

/**
 * @param {PollParams} params
 * @returns {Poll}
 */
export function createPoll(params) {
    return {
        name: params.name,
        uuid: uuid.v4(),
        choices: params.choices.map(text => ({
            name: text,
            count: 0
        })),
        options: {
            expires: moment().add(params.options.timeoutMinutes, 'minutes').toDate(),
            filter: params.options.filter,
            multiple: params.options.multiple,
        }
    }
}

/**
 * Validates poll parameters.
 * @param {object} pollParams 
 * @returns {joi.ValidationResult} validation result
 */
export function validatePollParams(pollParams) {
    return pollParamsSchema.validate(pollParams);;
}

/**
 * Validates poll.
 * @param {object} poll 
 * @returns {joi.ValidationResult} validation result
 */
export function validatePoll(poll) {
    return pollSchema.validate(poll);;
}
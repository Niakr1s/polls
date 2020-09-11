import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validatePollParams } from '@polls/shared/poll/poll.js'
import styles from './CreatePoll.module.css'
import { postPollParams } from '../../api/api';
import { Redirect } from 'react-router';
import { eventHandler } from '../util/util';

/** @type {import('../../../../shared/poll/poll').PollParams} */
const initialValues = {
    name: '',
    choices: ['', ''],
    options: {
        multiple: 1,
        filter: 'none',
        timeoutMinutes: 30,
    }
}

export function CreatePoll() {
    /** @type {[import('@polls/shared/poll/poll').Poll]} */
    const [poll, setPoll] = useState();

    async function onSubmit(values) {
        const poll = await postPollParams(values)
        console.log(`got`, poll);
        setPoll(poll);
    }

    /** 
    * @param {import('../../../../shared/poll/poll').PollParams} pollParams
    */
    function validate(pollParams) {
        const result = validatePollParams(pollParams)
        if (result.error) {
            return { message: result.error.message }
        }
    }

    if (poll) {
        return (
            <Redirect to={{
                pathname: `/poll/${poll.uuid}`,
                state: { poll },
            }}
            ></Redirect>
        )
    }

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validate}
            >
                {({ values, errors: { message: errorMessage }, setValues }) => {
                    return (
                        <Form className={styles.form}>
                            <h2>Create poll</h2>
                            <h3>Name</h3>
                            <Field type="textarea" name="name" id="name"></Field>

                            <h3>Choices</h3>
                            {values.choices.map((_, idx) => {

                                return (
                                    <div key={idx}>
                                        <Field type="textarea" name={`choices.${idx}`}></Field>
                                        {values.choices.length > 2 && <button key={idx} onClick={eventHandler(() => {
                                            let choices = [...values.choices];
                                            choices.splice(idx, 1);
                                            setValues({ ...values, choices })
                                        })}>-</button>}
                                    </div>
                                )
                            })}
                            <button onClick={eventHandler(() => {
                                setValues({ ...values, choices: [...values.choices, ''] })
                            })}
                            >add row</button>

                            <h3>Options</h3>
                            <div className={styles.inputRow}>
                                <label htmlFor="multiple">Choices at once</label>
                                <Field as="select" name="options.multiple">
                                    {new Array(values.choices.length).fill(0).map((_, idx) => <option key={idx}>{idx + 1}</option>)}
                                </Field>
                            </div>

                            <div className={styles.inputRow}>
                                <label htmlFor="filter">Filter by</label>
                                <Field as="select" name="options.filter" id="filter">
                                    <option>none</option>
                                    <option>ip</option>
                                    <option>cookie</option>
                                </Field>
                            </div>

                            <div className={styles.inputRow}>
                                <label htmlFor="timeoutMinutes">Timeout in minutes</label>
                                <Field className={styles.inputNumberArea} type="number" name="options.timeoutMinutes" id="timeoutMinutes"></Field>
                            </div>

                            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                            <input className={styles.createButton} type="submit" value="Create" disabled={errorMessage != null}></input>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}
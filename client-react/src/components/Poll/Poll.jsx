import React, { useEffect, useState } from 'react';
import { withLoading } from '../../hooks/withLoading';
import compose from 'hoc-compose'
import { addChoices, getPoll } from '../../api/api';
import moment from 'moment'
import { RemainingSeconds } from './RemainingSeconds';
import styles from './Poll.module.css'
import { Choices } from './Choices';

class Poll extends React.Component {
    /**
     * @param {{data: import('../../../../shared/poll/poll').Poll}} props 
     */
    constructor(props) {
        super(props);
        /** @type {import('../../../../shared/poll/poll').Poll} */
        const poll = props.data;

        this.state = {
            poll,
        }
    }

    getRemainingSeconds() {
        return moment(this.state.poll.options.expires).diff(moment(), 'seconds')
    }

    addChoices = async (indexes) => {
        const poll = await addChoices(this.state.poll, indexes);
        this.setState({ poll });
    }

    render() {
        return (
            <div className={styles.form}>
                <h2>{this.state.poll.name}</h2>

                <Choices choices={this.state.poll.choices} addChoices={this.addChoices} multiple={this.state.poll.options.multiple}></Choices>
                <RemainingSeconds remainedSeconds={this.getRemainingSeconds()}></RemainingSeconds>
            </div>
        )
    }
}

export default compose(withLoading(function (props) {
    const uuid = props.match.params.uuid;
    return getPoll(uuid)
}))(Poll);
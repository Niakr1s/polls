import React from 'react';
import styles from './RemainingSeconds.module.css'

export class RemainingSeconds extends React.Component {
    /**
     * @param {{remainedSeconds: number}} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            remained: props.remainedSeconds,
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(prevState => ({
                remained: prevState.remained - 1,
            }));
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className={styles.remainingSeconds}>{this.state.remained > 0
                ? `Expires in ${this.state.remained} seconds.`
                : `Expired.`
            } </div>
        );
    }
}

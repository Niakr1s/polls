import React from 'react';
import styles from './Choice.module.css'
import { Formik } from 'formik';

export class Choice extends React.Component {
    /**
     * @param {{name: string, count: number, totalChoices: number, onAdd: (idx: number) => void}} props
     */
    constructor(props) {
        super(props);
    }

    getStylePercent() {
        let count = this.props.count;
        let total = this.props.totalChoices
        if (!total) return 1;
        return Math.floor(count / total * 100)
    }

    render() {
        const stylePercent = this.getStylePercent() + '%'
        return (
            <>
                <td className={styles.choiceNameTD}>
                    {this.props.name}
                </td>
                <td className={styles.choiceBarTD}>
                    <div
                        className={styles.choiceBar}
                        style={{
                            width: stylePercent,
                        }}
                    >
                        {this.props.count}
                    </div>
                </td>
            </>
        );
    }
}

import React from 'react';
import { Choice } from './Choice';
import styles from './Choices.module.css';
import { Formik, Form, Field } from 'formik';

export class Choices extends React.Component {
    /**
     * @param {{choices: import('../../../../shared/poll/poll').Choice[], addChoices: (idx: number) => void}, multiple: number} props
     */
    constructor(props) {
        super(props);
        this.state = {
            choicesRemained: props.multiple,
        };
    }

    setChoicesRemained = (choicesRemained) => {
        this.setState({ choicesRemained });
    };

    getTotalChoices() {
        return this.props.choices.reduce((total, choice) => total += choice.count, 0);
    }

    render() {
        const totalChoices = this.getTotalChoices();
        return (
            <Formik
                initialValues={{ checked: this.props.choices.map(() => false) }}
                validate={(values) => {
                    let checkedCount = values.checked.reduce((acc, isChecked) => {
                        if (isChecked)
                            acc++; return acc;
                    }, 0);
                    this.setChoicesRemained(this.props.multiple - checkedCount);
                    const res = {};
                    if (checkedCount > this.props.multiple) { res.checked = 'checked too much'; }
                    if (checkedCount === 0) { res.checked = 'No choice chosen'; }
                    return res;
                }}
                onSubmit={(values) => {
                    let indexes = [];
                    values.checked.forEach((checked, idx) => {
                        if (checked)
                            indexes.push(idx);
                    });
                    this.props.addChoices(indexes);
                }}
            >{({ errors }) => {
                return (
                    <Form>
                        <table className={styles.table}>
                            <tbody>
                                {this.props.choices.map((choice, idx) => (
                                    <tr key={choice.name}>
                                        <Choice {...choice} totalChoices={totalChoices} onAdd={this.props.onAdd}></Choice>
                                        <td>
                                            <Field type="checkbox" name={`checked.${idx}`}></Field>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {errors.checked
                            ? <div className={styles.choicesRemainedError}>
                                {errors.checked}
                            </div>
                            : <div>
                                Choices remained: {this.state.choicesRemained}
                            </div>}
                        <input type="submit" value="Submit"></input>
                    </Form>
                );
            }}
            </Formik>
        );
    }
}

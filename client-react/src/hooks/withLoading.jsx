import React from 'react';

export function withLoading(loadDataFunction) {
    return function (Component) {
        return class Inner extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    data: undefined,
                    isLoading: false,
                    error: '',
                    refreshCountdown: 0,
                }
            }

            tryLoad = async () => {
                try {
                    this.setState({ isLoading: true })
                    const data = await loadDataFunction(this.props);
                    this.setState({ data });
                } catch (error) {
                    this.setState({ error });

                    // countdown
                    const refreshSeconds = 5;
                    this.setState({ refreshCountdown: refreshSeconds })
                    const countdownInterval = setInterval(() => {
                        this.setState((prevState) => ({ refreshCountdown: prevState.refreshCountdown - 1 }))
                    }, 1000)

                    // next load
                    setTimeout(() => {
                        clearInterval(countdownInterval);
                        this.setState({ refreshCountdown: 0 }, this.tryLoad)
                    }, refreshSeconds * 1000);
                } finally {
                    this.setState({ isLoading: false })
                }
            }

            componentDidMount() {
                this.tryLoad();
            }

            render() {
                const { data, isLoading } = this.state;
                if (data) {
                    return (<Component data={data} {...this.props} > </Component>)
                } else if (isLoading) {
                    return (<div>Loading...</div>)
                } else {
                    let errorString = 'Error occured';
                    if (this.state.refreshCountdown > 0) {
                        errorString += `, refreshing page in ${this.state.refreshCountdown}`
                    }
                    return (<div>{errorString}</div>)
                }
            }
        }
    }
}
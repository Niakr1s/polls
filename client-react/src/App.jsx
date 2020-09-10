import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import { FourThousandFour } from './components/FourThousandFour/FourThousandFour';
import { CreatePoll } from './components/CreatePoll/CreatePoll';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/createPoll" exact={true} component={CreatePoll} />
                <Route path="/" exact={true} component={CreatePoll} />
                <Route component={FourThousandFour} />
            </Switch>
        </BrowserRouter>
    )
}

export default App;
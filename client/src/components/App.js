import React, { useState } from 'react';
import '../App.scss';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LandingPage from '../views/LandingPage';
import SourcePage from '../views/SourcePage';
import NoMatchPage from '../views/NoMatchPage'
import AppNavbar from './AppNavbar';

function App() {
	const [vtuberid, setVtuberId] = useState("");

	return (
		<Router>
			<div className="App">
				<AppNavbar vtuberid={vtuberid} setVtuberId={setVtuberId} />
				<Switch>
					<Route path="/" exact
						render={(props) => <LandingPage {...props} vtuberid={vtuberid} />} />
					<Route path="/source/:id" component={SourcePage} />
					<Route path="/404" component={NoMatchPage} />
					<Redirect to="/404" />
				</Switch>
			</div>
		</Router>

	);
}

export default App;

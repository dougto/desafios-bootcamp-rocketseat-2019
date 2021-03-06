import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Repository from './pages/Repository';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/repository/:repository" exact component={Repository} />
        <Route path="/" exact component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

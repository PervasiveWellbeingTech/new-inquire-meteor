import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../../api/Sessions/Sessions';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (sessionId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('sessions.remove', sessionId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Session deleted!', 'success');
        history.push('/sessions');
      }
    });
  }
};

const renderSession = (doc, match, history) => (doc ? (
  <div className="ViewSession">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.body }
  </div>
) : <NotFound />);

const ViewSession = ({ loading, doc, match, history }) => (
  !loading ? renderSession(doc, match, history) : <Loading />
);

ViewSession.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const sessionId = match.params._id;
  const subscription = Meteor.subscribe('sessions.view', sessionId);

  return {
    loading: !subscription.ready(),
    doc: Sessions.findOne(sessionId),
  };
}, ViewSession);

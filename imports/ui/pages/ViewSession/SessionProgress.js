import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Grid, Row, Col, FormGroup, InputGroup, FormControl, Panel, DropdownButton, MenuItem  } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../../api/Sessions/Sessions';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import validate from '../../../modules/validate';
import { Session } from 'meteor/session';


class SessionProgress extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { history, doc } = this.props;
    return (
      <div className="SessionProgress">

        <Grid>
          <h1 className="text-center">{ doc && doc.title } Analysis</h1>
          <br></br>
          {/* <Row>
            <Col md={3}>
              <Panel bsStyle="primary">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">Total Queries</Panel.Title>
                </Panel.Heading>
                <Panel.Body>Panel content</Panel.Body>
              </Panel>
            </Col>
            <Col md={2}>
              <Panel bsStyle="success">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">Saved Results</Panel.Title>
                </Panel.Heading>
                <Panel.Body>Panel content</Panel.Body>
              </Panel>
            </Col>
            <Col md={2}>
              <Panel bsStyle="info">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">Saved Profiles</Panel.Title>
                </Panel.Heading>
                <Panel.Body>Panel content</Panel.Body>
              </Panel>
            </Col>
            <Col md={2}>
              <Panel bsStyle="warning">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">Notes</Panel.Title>
                </Panel.Heading>
                <Panel.Body>Panel content</Panel.Body>
              </Panel>
            </Col>
            <Col md={3}>
              <Panel bsStyle="danger">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">Filters</Panel.Title>
                </Panel.Heading>
                <Panel.Body>Panel content</Panel.Body>
              </Panel>
            </Col>
          </Row> */}
          </Grid>

        </div>
      );
    }
  };

  SessionProgress.propTypes = {
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
  }, SessionProgress);

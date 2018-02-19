import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Grid, Row, Col, FormGroup, InputGroup, FormControl, Panel, DropdownButton, MenuItem  } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Sessions from '../../../api/Sessions/Sessions';
import Results from '../../../api/Results/Results';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import validate from '../../../modules/validate';
import { Session } from 'meteor/session';
import PrivateQueries from '../../../api/PrivateQueries/PrivateQueries';

const goToSession = (history,sessionId) => {
  event.preventDefault();
  history.push(`/sessions/${sessionId}/progress`);
};

const goToAbout = (history) => {
  event.preventDefault();
  history.push('/about');
};

const goToNewSession = (history) => {
  event.preventDefault();
  history.push('/sessions/new');
};

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


class ViewSession extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => { document.querySelector('[name="searchInput"]').focus(); }, 1200);

    const component = this;
    validate(component.form, {
      rules: {
        searchInput: {
          required: false,
        },
      },
      messages: {
        searchInput: {
          required: 'Need a text in here, Seuss.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history, match, sessionId } = this.props;
    console.log(history);
    console.log(document.querySelector('[name="searchInput"]').value);
    const searchInputText = document.querySelector('[name="searchInput"]').value;
    document.querySelector('[name="searchInput"]').classList.add('zoomOutUp');
    if(document.querySelector('#resLoading')){
      document.querySelector('#resLoading').style.display = 'block';
      // document.querySelector('#resDone').style.display = 'none';
    }
    Meteor.call('queryCommuter',searchInputText, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        result = response;
        console.log(result);
        console.log(history);
        Session.set("result", result);
        // history.push(`/search/${searchInputText}`);
        history.push(`${match.url}/search/${searchInputText}`);
        Meteor.call('results.insert', result, sessionId, (error, response) => {
          if (error){
            console.log(error);
          }else{
            console.log('results saved in history');
            console.log(sessionId);
            Meteor.call('privateQueries.insert', {query:searchInputText, sessionId: sessionId}, (error, publicQueryId) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                console.log("saved authenticated private query");
              }
            });
          }
        });
      }
    });
  }

  render() {
    const { history, doc, recentSearches, sessionId } = this.props;
    return (
      <div className="ViewSession">

        <Grid>
          <h1 className="text-center">{ doc && doc.title }</h1>
          <br></br>
          <Row>
            <Col md={3}>
              <Panel bsStyle="primary">
                <Panel.Heading>
                  <Panel.Title componentClass="h3" onClick={() => goToSession(this.props.history, sessionId)}>Total Queries</Panel.Title>
                </Panel.Heading>
                <Panel.Body>{recentSearches.length}</Panel.Body>
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
          </Row>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <div className="Index">

                {/* TODO : Draw this before you work on it!! snapshots of filters, total queries, saved queries, saved users, notes -->
                  These lead to a page of viewing session progress. Then further editing & analysis in this
                  progress page to lead to a generated report. OOOh brAINFART -- MAKE IT A TIMELINE!!!! FROM CREATION OF SESSION,
                  include who created and as people are added, update who is on the team */}
                  <p>&nbsp;</p>

                  <form ref={form => (this.form = form)} className="query animated pulse" onSubmit={event => event.preventDefault()}>
                    <FormGroup bsSize="large">
                      <InputGroup bsSize="large">
                        <DropdownButton
                          componentClass={InputGroup.Button}
                          id="input-dropdown-addon"
                          title="History"
                        >
                          {recentSearches.length ?
                            recentSearches.map(({_id,query})=>(<MenuItem key={_id}>{query}</MenuItem>))
                             : <MenuItem key="2">No history yet</MenuItem>}

                        </DropdownButton>
                        <FormControl
                          type="text"
                          ref={searchInput => (this.searchInput = searchInput)}
                          name="searchInput"
                          // defaultValue=""//{ this.props.query && this.props.query.query }
                          placeholder="e.g I hate homework "
                        />
                        <InputGroup.Button>
                          <Button type="submit" bsStyle="primary">Search</Button>
                        </InputGroup.Button>
                      </InputGroup>
                    </FormGroup>
                  </form>
                  <div id ="resLoading">
                    <Loading/>
                  </div>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <Button bsStyle="primary" onClick={() => goToNewSession(this.props.history)} >Start New Session</Button>
                  <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
                  <Button bsStyle="default" onClick={() => goToAbout(this.props.history)} >About Inquire</Button>
                </div>

              </Col>
              <Col md={2}></Col>
            </Row>
          </Grid>

        </div>
      );
    }
  };

  ViewSession.propTypes = {
    loading: PropTypes.bool.isRequired,
    doc: PropTypes.object,
    sessionId: PropTypes.string,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    recentSearches: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  export default createContainer(({ match }) => {
    const sessionId = match.params._id;
    const subscription = Meteor.subscribe('sessions.view', sessionId);
    Meteor.subscribe('privateQueries', sessionId);
    console.log(sessionId);

    console.log(PrivateQueries.find().fetch().length);
    return {
      loading: !subscription.ready(),
      doc: Sessions.findOne(sessionId),
      sessionId: sessionId,
      recentSearches: PrivateQueries.find().fetch(),
    };
  }, ViewSession);

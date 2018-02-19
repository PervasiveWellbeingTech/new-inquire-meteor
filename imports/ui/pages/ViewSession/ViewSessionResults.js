import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Navbar, FormGroup,InputGroup,FormControl, Button, Panel, DropdownButton, MenuItem } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import validate from '../../../modules/validate';
import Loading from '../../components/Loading/Loading';
import { Session } from 'meteor/session';
import Sessions from '../../../api/Sessions/Sessions';
import Results from '../../components/Results/Results';
var FontAwesome = require('react-fontawesome');
import PrivateQueries from '../../../api/PrivateQueries/PrivateQueries';



const goToSession = (history,sessionId) => {
  event.preventDefault();
  // history.push('/sessions/new');
  history.push(`/sessions/${sessionId}/progress`);
};


class ViewSessionResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  componentDidMount() {
    setTimeout(() => { if( document.querySelector('[name="searchInput"]') ) document.querySelector('[name="searchInput"]').focus(); },0);
    if( document.querySelector('[name="searchInput"]') ) document.querySelector('[name="searchInput"]').value = this.props.query;

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
    event.preventDefault();
    const { history, match, sessionId } = this.props;
    console.log(document.querySelector('[name="searchInput"]').value);
    const searchInputText = document.querySelector('[name="searchInput"]').value;
    document.querySelector('[name="searchInput"]').classList.add('zoomOutUp');
    if(document.querySelector('#resLoading')){
        document.querySelector('#resLoading').style.display = 'block';
        document.querySelector('#resDone').style.display = 'none';
      }
   Meteor.call('queryCommuter',searchInputText, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        result = response;
        console.log(result);
        Session.set("result", result);
        if(document.querySelector('#resLoading')){
            document.querySelector('#resLoading').style.display = 'none';
            document.querySelector('#resDone').style.display = 'block';
          }
        //TODO:  save all this info to the current session
        Meteor.call('results.insert', result, sessionId, (error, response) => {
          if (error){
            console.log(error);
          }else{
            console.log('results saved in history');
            Meteor.call('privateQueries.insert', {query:searchInputText, sessionId: sessionId}, (error, privateQueryId) => {
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

  render(){
    const { result, match, query, history, doc, recentSearches, sessionId } = this.props;
    return (
      <Grid>
        <div className="">
          <h1 className="text-center">{ doc && doc.title }</h1>
          <br></br>
          <Row>
            <Col md={3}>
              <Panel bsStyle="primary">
                <Panel.Heading>
                  <Panel.Title componentClass="h3" onClick={() => goToSession(history,sessionId)} >Total Queries</Panel.Title>
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
            <form ref={form => (this.form = form)} className="query animated pulse" onSubmit={event => event.preventDefault()}>
                <FormGroup bsSize="large">

                  <InputGroup bsSize="large">
                    <InputGroup.Button>
                    <Button bsStyle="warning" onClick={() => this.setState({ open: !this.state.open })}>
                      History
                    </Button>
                  </InputGroup.Button>
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
              <Panel id="collapsible-panel-example-1" expanded={this.state.open}>
          <Panel.Collapse>
            <Panel.Body>
              {recentSearches.length ?
                recentSearches.map(({_id,query})=>(<p key={_id}>{query}</p>))
                 : <p>No history yet</p>}
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              <span><strong>KEY:</strong></span> &nbsp; &nbsp;
              <FontAwesome name='search'/> <span> -use result as new query </span> &nbsp; &nbsp;
              <FontAwesome name='search-plus'/> <span> -append result to current query </span> &nbsp; &nbsp;
              <FontAwesome name='user-plus'/> <span> -save result user-profile as interesting</span> &nbsp;
              <FontAwesome name='window-restore'/> <span> -open original post in new tab</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <small>{result && result.result_count} results in 0.8sec</small>

              {/* <Button bsStyle="primary" onClick={() => goToSession(this.props.history)} >Start New Session</Button> */}

              {/* <br/> */}
              <br/>
            </Col>
            <Col xs={12} md={12}>
              <div id = "searchResults">
                <Results query= {result} history={history} sessionId = {sessionId} />
              </div>
            </Col>
          </Row>
        </div>
      </Grid>
    );
  }
}

ViewSessionResults.propTypes = {
  history: PropTypes.object.isRequired,
  query: PropTypes.string,
  sessionId: PropTypes.string,
  result: PropTypes.object,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  recentSearches: PropTypes.arrayOf(PropTypes.object).isRequired,

};

export default createContainer(({ match }) => {
  const query = match.params.searchInputText;
  const sessionId = match.params._id;
  const subscription = Meteor.subscribe('sessions.view', sessionId);
  Meteor.subscribe('privateQueries', sessionId);

  console.log(Session.get("result"));
  return {
    query:query,
    result: Session.get("result"),
    doc: Sessions.findOne(sessionId),
    sessionId: sessionId,
    recentSearches: PrivateQueries.find().fetch(),

  };
}, ViewSessionResults);

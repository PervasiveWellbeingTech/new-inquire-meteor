import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Navbar, FormGroup,InputGroup,FormControl, Button, Panel, DropdownButton, MenuItem, ControlLabel, Radio } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import validate from '../../../modules/validate';
import Loading from '../../components/Loading/Loading';
import { Session } from 'meteor/session';
import Sessions from '../../../api/Sessions/Sessions';
import SessionResults from '../../components/Results/SessionResults';
var FontAwesome = require('react-fontawesome');
import PrivateQueries from '../../../api/PrivateQueries/PrivateQueries';



const goToSession = (history,sessionId) => {
  event.preventDefault();
  history.push(`/sessions/${sessionId}/progress`);
};

const saveFilters = (sessionId) => {
  console.log("we here");
  const minWords = document.querySelector('[name="minWords"]').value;
  const maxWords = document.querySelector('[name="maxWords"]').value;
  const numResults = document.querySelector('[name="numResults"]').value;
  const percent = document.querySelector('[name="percent"]').value;
  // var filter = document.querySelector('[name="filter"]').value.split('\n');
  var filter = document.querySelector('[name="filter"]').value;

  const itsLJ = document.querySelector('[name="livejournal"]') ? document.querySelector('[name="livejournal"]').checked : false;
  const itsRed = document.querySelector('[name="reddit"]') ? document.querySelector('[name="reddit"]').checked : false;
  var dataset;
  if (itsLJ) dataset = 'livejournal';
  if (itsRed) dataset = 'reddit';


  var filtersObj = {
    minWords : minWords,
    maxWords : maxWords,
    numResults: numResults,
    percent: percent,
    filter:filter,
    dataset: Sessions.findOne(sessionId).queryParams.dataset //TODO: change this
  }

  if (itsLJ || itsRed){
    filtersObj = {
      minWords : minWords,
      maxWords : maxWords,
      percent: percent,
      dataset: dataset,
      numResults: numResults,
      filter: filter,
    }

    if (itsLJ) document.querySelector('[name="livejournal"]').checked = false;
    if (itsRed) document.querySelector('[name="reddit"]').checked = false;
  }
  console.log('changing filters');
  console.log(filtersObj);
  Meteor.call("updateQueryParams",sessionId,filtersObj);
  // component.filtersForm.reset();
  Bert.alert('Filter updated!', 'success');
  return filtersObj;

};


const queryHistory = (queryText,history,sessionId, match) => {
  document.querySelector('#resLoading').style.display = 'block';
  document.querySelector('#resDone').style.display = 'none';
  document.querySelector('[name="searchInput"]').value = queryText;
  var searchInputText = queryText;


  if(document.querySelector('#resLoading')){
    document.querySelector('#resLoading').style.display = 'block';
    document.querySelector('#resDone').style.display = 'none';
  }
  var queryParamsObj = saveFilters(sessionId);
  Meteor.call('queryCommuter',searchInputText,queryParamsObj, (error, response) => {
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
    var queryParamsObj = saveFilters(sessionId);
    Meteor.call('queryCommuter',searchInputText,queryParamsObj,(error, response) => {
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
    console.log(doc);
    return (
      <Grid>
        <div className="">
          <h1 className="text-center">{ doc && doc.title }</h1>
          <br></br>
          <Row onClick={() => goToSession(history,sessionId)}>
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
                  <Panel.Title componentClass="h3" onClick={() => goToSession(history,sessionId)}>Saved Results</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                  {doc && doc.savedResults && doc.savedResults.length}
                  {/* {doc.savedResults && doc.savedResults.length ?
                    doc.savedResults.map(({post_id,username})=>(<p key={post_id}> {username}</p>))
                    : <p>No saved results yet</p>} */}
                </Panel.Body>
              </Panel>
            </Col>
            <Col md={2}>
              <Panel bsStyle="info">
                <Panel.Heading>
                  <Panel.Title componentClass="h3" onClick={() => goToSession(history,sessionId)}>Saved Profiles</Panel.Title>
                </Panel.Heading>
                <Panel.Body>Panel content</Panel.Body>
              </Panel>
            </Col>
            <Col md={2}>
              <Panel bsStyle="warning">
                <Panel.Heading>
                  <Panel.Title componentClass="h3" onClick={() => goToSession(history,sessionId)}>Notes</Panel.Title>
                </Panel.Heading>
                <Panel.Body>Panel content</Panel.Body>
              </Panel>
            </Col>
            <Col md={3}>
              <Panel bsStyle="danger">
                <Panel.Heading>
                  <Panel.Title componentClass="h3" onClick={() => goToSession(history,sessionId)}>Filters</Panel.Title>
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
                      &#9660;
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
              <Panel id="collapsible-panel-example-1" expanded={this.state.open}>
                <Panel.Collapse>
                  <Panel.Body>
                    <Col md={6} onClick={() => this.setState({ open: !this.state.open })}>
                      {recentSearches.length ?
                        recentSearches.map(({_id,query})=>(<p key={_id}><a onClick={ () => queryHistory(query, history, sessionId, match) }>{query}</a></p>))
                        : <p>No history yet</p>}
                      </Col>

                      <Col md={6}>
                        <Row>
                          <Col xs={6} md={6}>
                            <FormGroup bsSize="small">
                              <ControlLabel>Word to filter</ControlLabel>

                              <InputGroup bsSize="small">
                                <FormControl
                                  type="text"
                                  ref="filter"
                                  name="filter"
                                  placeholder="word to filter"
                                  defaultValue = { doc && doc.queryParams.filter || ''}
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup bsSize="small">
                              <ControlLabel>Number of Results</ControlLabel>
                              <InputGroup bsSize="small">
                                <FormControl
                                  type="Number"
                                  ref="numResults"
                                  name="numResults"
                                  defaultValue={ doc && doc.queryParams.numResults || 50 }/>
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <FormGroup bsSize="small">
                                <ControlLabel>Minimum # words in result</ControlLabel>
                                <InputGroup bsSize="small">
                                  <FormControl
                                    type="Number"
                                    ref="minWords"
                                    name="minWords"
                                    defaultValue={doc && doc.queryParams.minWords || 4}
                                    // placeholder="e.g I hate homework "
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup bsSize="small">
                                <ControlLabel>Maximum # words in result</ControlLabel>
                                <InputGroup bsSize="small">
                                  <FormControl
                                    type="Number"
                                    ref="maxWords"
                                    name="maxWords"
                                    defaultValue={ doc && doc.queryParams.maxWords || 30 }
                                    // placeholder="e.g I hate homework "
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                            <FormGroup>
                              <ControlLabel>dataset </ControlLabel> <br />
                              { doc && doc.queryParams.dataset == 'livejournal'  ? <Radio name="reddit" inline> Reddit </Radio> : <Radio name="livejournal" inline> Livejournal </Radio> }
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                          <FormGroup bsSize="small">
                            <ControlLabel>Percentage % of data to search</ControlLabel>
                            <InputGroup bsSize="small">
                              <FormControl
                                type="Number"
                                ref="percent"
                                name="percent"
                                defaultValue={ doc && doc.queryParams.percent || 10 }
                                // placeholder="e.g I hate homework "
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                          </Row>

                          <Row>
                            <Button type="submit" bsStyle="success" onClick={() => this.setState({ open: !this.state.open })}>
                              Save and Apply Filters
                            </Button>
                          </Row>
                        </Col>
                      </Panel.Body>
                    </Panel.Collapse>
                  </Panel>
                </form>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <span><strong>KEY:</strong></span> &nbsp; &nbsp;
                  <FontAwesome name='search'/> <span> -use result as new query </span> &nbsp; &nbsp;
                  <FontAwesome name='search-plus'/> <span> -append result to current query </span> &nbsp; &nbsp;
                  <FontAwesome name='user-plus'/> <span> -save user-profile</span> &nbsp;
                  <FontAwesome name='floppy-o'/> <span> -save result</span> &nbsp;
                  <FontAwesome name='window-restore'/> <span> -open original post </span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  <small>{result && result.result_count} results in 0.8sec</small>

                  {/* <Button bsStyle="primary" onClick={() => goToSession(this.props.history)} >Start New Session</Button> */}

                  {/* <br/> */}
                  <br/>
                </Col>
                <Col xs={12} md={12}>
                  <div id = "searchResults">
                    { result ? <SessionResults query= {result} history={history} sessionId = {sessionId} queryParams = {doc && doc.queryParams}/> :  <p>Tip: Assign weights to the words in query<br/></p>}
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

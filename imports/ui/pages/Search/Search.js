import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Navbar, FormGroup,InputGroup,FormControl, Button, Panel, DropdownButton } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import validate from '../../../modules/validate';
import Loading from '../../components/Loading/Loading';
import { Session } from 'meteor/session';
import Results from '../../components/Results/Results';
var FontAwesome = require('react-fontawesome');
import PublicQueries from '../../../api/PublicQueries/PublicQueries';


import './Search.scss';

const goToSession = (history) => {
  event.preventDefault();
  history.push('/sessions/new');
};

const queryHistory = (queryText) => {
  document.querySelector('#resLoading').style.display = 'block';
  document.querySelector('#resDone').style.display = 'none';
  document.querySelector('[name="searchInput"]').value = queryText;
  var searchInputText = queryText;
  console.log(queryText);

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

      Meteor.call('publicQueries.insert', {query:searchInputText}, (error, publicQueryId) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          console.log("saved authenticated public query");
        }
      });

    }
  });
};

class Search extends React.Component {
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
    const { history, authenticated } = this.props;
    console.log(document.querySelector('[name="searchInput"]').value);
    const searchInputText = document.querySelector('[name="searchInput"]').value;
    document.querySelector('[name="searchInput"]').classList.add('zoomOutUp');
    if(document.querySelector('#resLoading')){
        document.querySelector('#resLoading').style.display = 'block';
        document.querySelector('#resDone').style.display = 'none';
      }
      //if authenticated, save search query
    if(authenticated){
      Meteor.call('publicQueries.insert', {query:searchInputText}, (error, publicQueryId) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          console.log("saved authenticated public query");
        }
      });
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
        // history.push(`/search/${searchInputText}`);
      }
    });
  }


  render(){
    const { result, match, query, history, recentSearches } = this.props;
    return (
      <Grid>
        <div className="">
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
                  <Panel.Body onClick={() => this.setState({ open: !this.state.open })}>
                    {recentSearches.length ?
                      recentSearches.map(({_id,query})=>(<p key={_id} ><a onClick={ () => queryHistory(query) } >{query} </a></p>))
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
              {/* <Button bsStyle="primary" onClick={() => goToSession(this.props.history)} >Start New Session</Button> */}
              <small>{result && result.result_count} results in 0.8sec</small><br/>

              {/* <br/> */}
              <br/>
            </Col>
            <Col xs={12} md={12}>
              <div id = "searchResults">
                <Results query= {result} history={history} sessionId="public" />
              </div>
            </Col>
          </Row>
        </div>
      </Grid>
    );
  }
}

Search.propTypes = {
  history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  query: PropTypes.string,
  result: PropTypes.object,
  match: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const query = match.params.searchInputText;
  console.log(Session.get("result"));
  Meteor.subscribe('publicQueries');
  return {
    authenticated: !loggingIn && !!userId,
    query:query,
    recentSearches: PublicQueries.find().fetch(),
    result: Session.get("result"),
  };
}, Search);

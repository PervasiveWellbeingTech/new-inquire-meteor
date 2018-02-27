import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, FormGroup, InputGroup, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import validate from '../../../modules/validate';
import { Session } from 'meteor/session';
import Loading from '../../components/Loading/Loading';
import { Meteor } from 'meteor/meteor';
import PublicQueries from '../../../api/PublicQueries/PublicQueries';


import './Index.scss';

const goToSession = (history) => {
  event.preventDefault();
  history.push('/sessions/new');
};

const goToAbout = (history) => {
  event.preventDefault();
  history.push('/about');
};

const queryHistory = (queryText, history) => {
  document.querySelector('#resLoading').style.display = 'block';
  // document.querySelector('#resDone').style.display = 'none';
  document.querySelector('[name="searchInput"]').value = queryText;
  var searchInputText = queryText;
  console.log(queryText);

  if(document.querySelector('#resLoading')){
      document.querySelector('#resLoading').style.display = 'block';
      // document.querySelector('#resDone').style.display = 'none';
    }
 Meteor.call('queryCommuter',searchInputText,{}, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      result = response;
      console.log(result);
      Session.set("result", result);
      history.push(`/search/${searchInputText}`);

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


class Index extends React.Component {

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
    const { history, authenticated } = this.props;
    console.log(document.querySelector('[name="searchInput"]').value);
    const searchInputText = document.querySelector('[name="searchInput"]').value;
    document.querySelector('[name="searchInput"]').classList.add('zoomOutUp');
    if(document.querySelector('#resLoading')){
        document.querySelector('#resLoading').style.display = 'block';
        // document.querySelector('#resDone').style.display = 'none';
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
   Meteor.call('queryCommuter',searchInputText,{}, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        result = response;
        console.log(result);
        Session.set("result", result);
        history.push(`/search/${searchInputText}`);
      }
    });
  }

  render() {
    const { history,recentSearches } = this.props;
    return (
        <Grid>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <div className="Index">
                <h1>Inquire</h1>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
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
                            recentSearches.map(({_id,query})=>(<MenuItem key={_id} onClick={ () => queryHistory(query, history) }>{query}</MenuItem>))
                             : <MenuItem key="2">No history yet</MenuItem>}

                             {/* <a onClick={ () => queryHistory(query) } >{query} </a> */}

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
                  <Button bsStyle="primary" onClick={() => goToSession(this.props.history)} >Start New Session</Button>
                  <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
                  <Button bsStyle="default" onClick={() => goToAbout(this.props.history)} >About Inquire</Button>
              </div>

          </Col>
          <Col md={2}></Col>
        </Row>

      </Grid>);
      }
};

Index.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  recentSearches: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ match }) => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  Meteor.subscribe('publicQueries');
  return {
    authenticated: !loggingIn && !!userId,
    recentSearches: PublicQueries.find().fetch(),
  };

  return {
  };
}, Index);

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
var shortid = require('shortid');
import Sessions from './Sessions';


const callService = (type, url, options) => new Promise((resolve, reject) => {
  HTTP.call(type, url, options, (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});

Meteor.methods({
  queryCommuter(query,queryParamsObj){
    check(query,String);
    check(queryParamsObj,Object);
    console.log("in method");
    return callService(
      'GET',
      'http://commuter.stanford.edu:9001/query',
      {params:{
        data:query,
        dataset:queryParamsObj.dataset || 'livejournal',
        maxWords: queryParamsObj.maxWords || 30,
        minWords: queryParamsObj.minWords || 4,
        top: queryParamsObj.numResults || 50,
        percent: queryParamsObj.percent || 20
      }}
    ).then((result) => result.data).catch((error) => {
        throw new Meteor.Error('500', `${error.message}`);
      });
    },
    queryContext(post_id,sent_num){
      check(post_id,Number);
      check(sent_num,Number);
      console.log("in method");
      return callService(
        'POST',
        'http://commuter.stanford.edu:9001/contexts',
        {data:{
            window: 5, // number of +/- sents, or null if you want full posts
	          sents: [[post_id, sent_num]]// tuples of post_id, sent_num (resulting from a query, like above)
        }}
      ).then((result) => result.data).catch((error) => {
          throw new Meteor.Error('500', `${error.message}`);
        });
      },
      updateQueryParams(sessionId,paramsObj){
        check(sessionId, String);
        check(paramsObj, Object);
        console.log(paramsObj);
        Sessions.update(sessionId,{
          $set:{
            'queryParams.dataset': paramsObj.dataset,
            'queryParams.minWords': paramsObj.minWords,
            'queryParams.maxWords': paramsObj.maxWords,
            'queryParams.numResults': paramsObj.numResults,
            'queryParams.percent': paramsObj.percent,
            'queryParams.filter': paramsObj.filter,
          }
        });
      },
});

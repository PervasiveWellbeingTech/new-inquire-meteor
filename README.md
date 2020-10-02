### INQUIRE.AI
A search engine for qualitative research. The backend is there https://github.com/PervasiveWellbeingTech/inquire-web-backend

This is the most recent front-end to the Inquire Project. It's built using MeteorJS, ReactJS and MongoDB. The queries are directed at the backend server for search results, and can be cached as users dictate.

For users, the initial search page doesn't cache any results, if a user needs to keep a record of any progress, they need to create a session which will store a record of their search queries, the results and edits, notes and insights gained, interesting users and any other information they need. Our goal is to be able to generate a report for the research sessions created whenever required.

## Deployment

This might be a long journey. Meteor isn't that popular anymore, and this code was done in 2017, most packages are now outdated. 

This code was last run on meteor version 1.5.4.2. It will certainly output many errors while trying to run it. You must not do meteor --update in the repo. Any new updates make the deployment impossible.

To install meteor you must install the above version only. It probably won't run if you install the newest version and make meteor automatically install the oldest. 

> curl "https://install.meteor.com/?release=1.5.4" | sh

After installation you can try running the APP:

> sudo meteor --settings ./settings-development.json --allow-superuser --port 3001 --production

# Adapt the code to your own backend instance 
By default for backend queries it will query commuter.stanford.edu:9001 for the backend. You must edit this by changing it in imports/api/Sessions/mymethods.js if you deploy the backend on your own machine. 




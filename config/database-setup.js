const  mongoose = require('mongoose');
const dbname = 'angular-auth';

mongoose.connect(`mongodb://localhost/${dbname}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${dbname} database`);
});

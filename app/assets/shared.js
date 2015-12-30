Parse.initialize('XnG27Mf7YQqvPruZ4E9Teb9A3aZjKF27M9A4N1NG', '6dp7f8DsEerSTdQnWzK83JuAbrXA7mRx3tuJN44C');
// Parse.initialize('XnG27Mf7YQqvPruZ4E9Teb9A3aZjKF27M9A4N1NG', '6dp');
Submission = Parse.Object.extend('Submission');
Connection = Parse.Object.extend('Connection');

function log (message, object) {
  console.log(new Date().getTime(), message, object);
}

function fetchSubmissions (callback) {
  var query = new Parse.Query(Submission);
  query.descending("createdAt").find({
    success: function (results) {
      log('fetched ' + results.length + ' results:' , results);
      sessionStorage.setItem('submissions', JSON.stringify(results));
      if (callback !== undefined) callback(results);
    },
    error: function(error) {
      log('error: ', error);
    }
  });
}

Parse.initialize('XnG27Mf7YQqvPruZ4E9Teb9A3aZjKF27M9A4N1NG', '6dp7f8DsEerSTdQnWzK83JuAbrXA7mRx3tuJN44C');
Submission = Parse.Object.extend('Submission');
Connection = Parse.Object.extend('Connection');

function log (message, object) {
  console.log(new Date().getTime(), message, object);
}

function cardClick (event, callback) {
  function findParent (element, attribute) {
    while ((element = element.parentElement) && !element.hasAttribute(attribute));
    return element; }

  var parentCard = findParent(event.target, 'data-card-index'),
      cardIndex = parseInt(parentCard.getAttribute('data-card-index')),
      nextCard = document.querySelector('[data-card-index="' + (cardIndex + 1) + '"]'),
      currentInput = parentCard.querySelector('textarea');

  if (currentInput.value !== '') {
    event.target.disabled = true;
    currentInput.disabled = true;
    var topOffset = parentCard.getBoundingClientRect().height * (cardIndex + 1)
                    + (nextCard.getBoundingClientRect().height / 2);
    var transformValue = 'translate(0, calc(50vh - ' + topOffset + 'px))';
    document.querySelector('[data-cards-container]').style.transform = transformValue;
    nextCard.querySelector('textarea, input').select();
    nextCard.classList.add('visible');
    if (callback !== undefined) callback();
  }
}

document.querySelector('[data-card-index="0"] [data-next-action]').addEventListener('click', cardClick);
document.querySelector('[data-card-index="1"] [data-next-action]').addEventListener('click', function (event) {
  cardClick(event, function () {
    fetchSubmissions(function (results) {
      log('fetched ' + results.length + ' results:' , results);
      localStorage.setItem('Submissions', JSON.stringify(results));
    });
  });
});

function fetchSubmissions (callback) {
  var query = new Parse.Query(Submission);
  query.descending("createdAt").find({
    success: callback,
    error: function(error) {
      log('error: ', error);
    }
  });
}

function storeSubmission (submission, callback) {
  log('(1/2) saving submission to Parse: ', submission.attributes);

  submission.save(null, {
    success: function() {
      log('(2/2) successfully saved latest submission.');
    },
    error: function(error) {
      log('(2/2) error while trying to save latest submission.', error);
    }
  });

  localStorage.setItem('LatestSubmission', JSON.stringify(submission.attributes));
  callback(submission, JSON.parse(localStorage.getItem('Submissions')));
}

document.querySelector('[data-card-submit] [data-submit-action]').addEventListener('click', function (event) {
  event.preventDefault();
  event.target.value = "Posting..."
  event.target.disabled = true;
  var name = document.getElementById('name'),
      feels = document.querySelector('input[name="feels"]:checked');
  name.disabled = true;

  var submission = new Submission();
  submission.set('name', name.value);
  submission.set('ideal', document.getElementById('idealDay').value);
  submission.set('today', document.getElementById('dayToday').value);
  submission.set('feel', feels !== null ? feels.value : '');
  storeSubmission(submission, renderSubmissions);
});

function renderSubmissions (latestSubmission, submissions) {
  document.querySelector('[data-cards-container]').classList.add('questions--hidden');

  var submissionsContainer = document.querySelector('[data-submissions-container]');
  submissionsContainer.style.display = 'block';

  var template = document.getElementById('submissionTemplate').innerHTML;

  submissionsContainer.querySelector('[data-latest-submission]')
    .innerHTML = Mustache.render(template, latestSubmission.attributes);

  if (localStorage.getItem('Submissions') !== null) {
    submissionsContainer.querySelector('[data-other-submissions]')
      .innerHTML = Mustache.render(template, submissions);

    var data = [latestSubmission].concat(submissions);
    log('storing latest submissions: ', data);
    localStorage.setItem('Submissions', JSON.stringify(data));
  }
}

document.querySelector('[data-connection-close]').addEventListener('click', function (event) {
  document.querySelector('[data-connection]').classList.add('connection--hidden');
});

document.querySelector('[data-connection-action]').addEventListener('click', function (event) {
  event.preventDefault();

  var email = document.getElementById('email');
  if (email.value !== '' ) {
    event.target.value = 'Submitting...';
    event.target.disabled = true;
    email.disabled = true;

    var connection = new Connection();
    var submission = JSON.parse(localStorage.getItem('LatestSubmission'));
    var data = {
      name: submission.name,
      email: email.value,
      ideal: submission.ideal,
      today: submission.today,
      feel: submission.feel
    };

    log('(1/2) saving connection to Parse: ', data);

    connection.save(data, {
      success: function() {
        log('(2/2) successfully saved connection.');
        event.target.value = 'Submitted!';
        setTimeout(function () {
          document.querySelector('[data-connection]').classList.add('connection--hidden');
        }, 1000);
      },
      error: function(error) {
        log('(2/2) error while trying to save connection.', error);
      }
    });
  }
});

setTimeout(
  function () {
    console.log("do stuff");
    var latest = {attributes: {ideal: 'ideal day', today: 'today', name: 'latest', feel: 'angry'}};
    var data = {ideal: 'ideal day', today: 'today', name: 'name', feel: 'joyful'};
    renderSubmissions(latest, [data, data])
  }
, 1200);

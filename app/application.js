Parse.initialize("XnG27Mf7YQqvPruZ4E9Teb9A3aZjKF27M9A4N1NG", "6dp7f8DsEerSTdQnWzK83JuAbrXA7mRx3tuJN44C");
Submission = Parse.Object.extend("Submission");

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

function storeSubmission (data, callback) {
  log('(1/2) saving submission to Parse: ', data);

  new Submission().save(data, {
    success: function() {
      log('(2/2) successfully saved latest submission.');
    },
    error: function(error) {
      log('(2/2) error while trying to save latest submission.', error);
    }
  });

  callback(data, JSON.parse(localStorage.getItem('Submissions')));
}

document.querySelector('[data-card-submit] [data-submit-action]').addEventListener('click', function (event) {
  event.preventDefault();
  event.target.value = "Posting..."
  event.target.disabled = true;
  var name = document.getElementById('name'),
      feels = document.querySelector('input[name="feels"]:checked');
  name.disabled = true;
  storeSubmission({
    ideal: document.getElementById('idealDay').value,
    today: document.getElementById('dayToday').value,
    feel: feels !== null ? feels.value : '',
    name: name.value
  }, renderSubmissions);
});

function renderSubmissions (latestSubmission, submissions) {
  var cardsContainer = document.querySelector('[data-cards-container]');
  cardsContainer.style.transform = 'translate(0, -200vh)';
  cardsContainer.style.opacity = '0';
  cardsContainer.style.height = '0';

  var submissionsContainer = document.querySelector('[data-submissions-container]');
  submissionsContainer.style.display = 'block';

  var template = document.getElementById('submissionTemplate').innerHTML;

  submissionsContainer.querySelector('[data-latest-submission]')
    .innerHTML = Mustache.render(template, latestSubmission);

  if (localStorage.getItem('Submissions') !== null) {
    submissionsContainer.querySelector('[data-other-submissions]')
      .innerHTML = Mustache.render(template, submissions);

    var data = [latestSubmission].concat(submissions);
    log('storing latest submissions: ', data);
    localStorage.setItem('Submissions', JSON.stringify(data));
  }
}

// setTimeout(
//   function () {
//     console.log("do stuff");
//     var latest = {ideal: 'ideal day', today: 'today', name: 'latest', feel: 'angry'};
//     var data = {ideal: 'ideal day', today: 'today', name: 'name', feel: 'joyful'};
//     renderSubmissions(latest, [data, data])
//   }
// , 1200);


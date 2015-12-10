Parse.initialize("rrO5aXvISmgK4bTu6gpeHuBiDyyFN8GgIxdCN9n0", "99k6qUikX2iAS36k1MmT9aTeuDtUKJkvgF42HZvQ");
Submission = Parse.Object.extend("Submission");

function log (message, object) {
  console.log(new Date().getTime(), message, object);
}

function cardClick (event) {
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
    nextCard.classList.add('visible');
    nextCard.querySelector('textarea, input').focus();
  }
}

document.querySelector('[data-card-index="0"] button').addEventListener('click', cardClick);
document.querySelector('[data-card-index="1"] button').addEventListener('click', function (event) {
  cardClick(event);
  fetchSubmissions(function (results) {
    log('fetched ' + results.length + ' results:' , results);
    localStorage['Submissions'] = JSON.stringify(results);
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

  callback(data, JSON.parse(localStorage['Submissions']));
}

document.querySelector('[data-card-submit] button').addEventListener('click', function (event) {
  event.target.value = "Posting..."
  event.target.disabled = true;
  var name = document.getElementById('name');
  name.disabled = true;
  storeSubmission({
    idealDay: document.getElementById('idealDay').value,
    today: document.getElementById('dayToday').value,
    name: name.value
  }, renderSubmissions);
});

function renderSubmissions (latestSubmission, submissions) {

}

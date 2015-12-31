analytics.track('Visited site');

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

    analytics.track('Clicked: ' + parentCard.querySelector('label').textContent.trim());

    if (callback !== undefined) callback();
  }
}

document.querySelector('[data-card-index="0"] [data-next-action]').addEventListener('click', cardClick);

document.querySelector('[data-card-index="1"] [data-next-action]').addEventListener('click', function (event) {
  cardClick(event, fetchSubmissions());
});

document.querySelector('[data-card-submit] [data-submit-action]').addEventListener('click', function (event) {
  event.preventDefault();
  event.target.value = "Sharing..."
  event.target.disabled = true;
  var name = document.getElementById('name'),
      feels = document.querySelector('input[name="feels"]:checked');
  name.disabled = true;

  var submission = new Submission();
  submission.set('name', name.value);
  submission.set('ideal', document.getElementById('idealDay').value);
  submission.set('today', document.getElementById('dayToday').value);
  submission.set('lifegap', document.getElementById('lifeGap').value);
  submission.set('feel', feels !== null ? feels.value : '');

  log('(1/2) saving submission to Parse: ', submission.attributes);

  submission.save(null, {
    success: function() {
      log('(2/2) successfully saved latest submission.');
    },
    error: function(error) {
      log('(2/2) error while trying to save latest submission.', error);
    }
  });

  analytics.track('Clicked: Lets finish');
  sessionStorage.setItem('LatestSubmission', JSON.stringify(submission));
  document.querySelector('[data-cards-container]').classList.add('questions--hidden');
  window.location = 'feed';
});

$('.intro__title p').typed({
  strings: ['^700Hello :)'],
  typeSpeed: 200,
  callback: function () {

    $('.intro__title .typed-cursor').css('visibility', 'hidden');
    $('.intro__subtitle p').typed({

      strings: ['We invite you to take a few minutes to reflect on where you\'re at.^1000'],
      typeSpeed: 50,
      callback: function () {
        $('.intro__subtitle').html('<p></p>');
        $('.intro__subtitle p').typed({

          strings: ['Where would you like to be?^1000'],
          typeSpeed: 50,
          callback: function () {
            $('.intro__subtitle .typed-cursor').css('visibility', 'hidden');
            $('.intro__hint').addClass('intro__hint--visible').delay(250);
            setTimeout(function () {
              $("#idealDay").focus();
            }, 500);
          }
        });
      }
    });
  }
});

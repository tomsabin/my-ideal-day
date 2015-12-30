analytics.track('Visited feed');

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
    var submission = JSON.parse(sessionStorage.getItem('LatestSubmission'));
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
        }, 750);
      },
      error: function(error) {
        log('(2/2) error while trying to save connection.', error);
      }
    });

    analytics.track('Submitted email address');
  }
});

function renderSubmissions (latestSubmission, submissions) {
  var submissionsContainer = document.querySelector('[data-submissions-container]');
  var template = document.getElementById('submissionTemplate').innerHTML;

  if (latestSubmission !== null) {
    submissionsContainer.querySelector('[data-latest-submission]')
      .innerHTML = Mustache.render(template, {
        submissions: latestSubmission,
        latest: true
      });

    var link = 'https://www.facebook.com/dialog/share?app_id=1042614292427958&href=http://my-ideal-day.co/&redirect_uri=http://www.facebook.com';
    link += '&picture=http://my-ideal-day.co/assets/images/share/' + latestSubmission.feel + '.jpg';
    link += '&title=I explored my life gap and I am ' + latestSubmission.feel.toUpperCase();

    var element = document.getElementById('facebookShare')
    element.href = link;
    element.addEventListener('click', function (event) {
      window.open(this.href, '_blank', 'left=0,top=0,width=600,height=660,toolbar=1,resizable=0');
      return false;
    });
  }

  if (submissions !== null) {
    submissionsContainer.querySelector('[data-other-submissions]')
      .innerHTML = Mustache.render(template, { submissions: submissions });
  }

  submissionsContainer.classList.add('submissions--loaded');
}

var latestSubmission = JSON.parse(sessionStorage.getItem('LatestSubmission'));

if (latestSubmission !== null && sessionStorage.getItem('submissions') !== null) {
  setTimeout(function () {
    renderSubmissions(latestSubmission, JSON.parse(sessionStorage.getItem('submissions')));
  }, 500);
} else {
  fetchSubmissions(function (results) {
    renderSubmissions(null, JSON.parse(JSON.stringify(results)));
  });
}

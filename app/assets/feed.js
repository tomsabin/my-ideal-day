Parse.initialize('XnG27Mf7YQqvPruZ4E9Teb9A3aZjKF27M9A4N1NG', '6dp7f8DsEerSTdQnWzK83JuAbrXA7mRx3tuJN44C');
Connection = Parse.Object.extend('Connection');
analytics.track('Visited feed');

function log (message, object) {
  console.log(new Date().getTime(), message, object);
}

function renderSubmissions (latestSubmission, submissions) {
  var submissionsContainer = document.querySelector('[data-submissions-container]');

  var template = document.getElementById('submissionTemplate').innerHTML;

  submissionsContainer.querySelector('[data-latest-submission]')
    .innerHTML = Mustache.render(template, {
      submissions: latestSubmission,
      latest: true
    });

  submissionsContainer.classList.add('submissions--loaded');

  if (localStorage.getItem('Submissions') !== null) {
    submissionsContainer.querySelector('[data-other-submissions]')
      .innerHTML = Mustache.render(template, { submissions: submissions });
  }
}

function createShareIcon (submission) {
  var link = 'https://www.facebook.com/dialog/share?app_id=1042614292427958&href=http://my-ideal-day.co/&redirect_uri=http://my-ideal-day.co/feed';
  link += '&picture=http://my-ideal-day.co/assets/images/share/' + submission.feel + '.jpg';
  link += '&title=I explored my life gap and I am ' + submission.feel.toUpperCase();
  document.getElementById('facebookShare').href = link;
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
        }, 750);
      },
      error: function(error) {
        log('(2/2) error while trying to save connection.', error);
      }
    });

    analytics.track('Submitted email address');
  }
});

setTimeout(
  function () {
    var submissions = JSON.parse(localStorage.getItem('Submissions'));
    var latestSubmission = JSON.parse(localStorage.getItem('LatestSubmission'));

    // var submissions = [
    //   { ideal: 'Lorem ipsum dolor sit amet, consectetur.', today: 'Lorem ipsum dolor sit amet, consectetur.', name: 'Issac Bartelt', feel: 'bored' },
    //   { ideal: 'Lorem ipsum dolor sit amet, consectetur.', today: 'Lorem ipsum dolor sit amet, consectetur.', name: 'Lavinia Freitag', lifegap: '6' },
    //   { ideal: 'Lorem ipsum dolor sit.', today: 'Lorem ipsum dolor sit.', name: 'Elisha Smyth' },
    //   { ideal: 'Lorem ipsum dolor sit amet, consectetur.', today: 'Lorem ipsum dolor sit amet, consectetur.', name: 'Bev Mullis', lifegap: '6', feel: 'joyful' },
    //   { ideal: 'Lorem ipsum dolor sit amet.', today: 'Lorem ipsum dolor sit amet.', name: 'Lynell Belisle', lifegap: '5', feel: 'fearful' },
    //   { ideal: 'Lorem.', today: 'Lorem.', name: 'Salena Wind', lifegap: '1', feel: 'angry' },
    //   { ideal: 'Lorem ipsum dolor sit amet, consectetur.', today: 'Lorem ipsum dolor sit amet, consectetur.', name: 'Kathie Bradburn', lifegap: '6', feel: 'serene' },
    //   { ideal: 'Lorem ipsum dolor sit amet.', today: 'Lorem ipsum dolor sit amet.', name: 'Jenine Fergus', lifegap: '5', feel: 'annoyed' },
    //   { ideal: 'Lorem ipsum dolor sit amet, consectetur.', today: 'Lorem ipsum dolor sit amet, consectetur.', name: 'Marisol Kothari', lifegap: '6', feel: 'sad' },
    //   { ideal: 'Lorem ipsum dolor sit amet.', today: 'Lorem ipsum dolor sit amet.', name: 'Berta Plata', lifegap: '5', feel: 'pensive' },
    //   { ideal: 'Lorem.', today: 'Lorem.', name: 'Particia Abbe', lifegap: '1', feel: 'accepting' }
    // ];
    // var latestSubmission = {
    //   name: 'Johna Rhyne',
    //   feel: 'angry',
    //   lifegap: '0',
    //   ideal: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque mollitia, quidem! Quibusdam blanditiis reiciendis ex animi neque facilis porro perferendis facere similique explicabo, ipsum provident eaque saepe dolores, quas nesciunt.',
    //   today: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis necessitatibus quas tempora cupiditate incidunt ipsam tenetur nulla fugiat, sint suscipit maxime, enim commodi neque provident, architecto harum optio, voluptatibus nobis?'
    // };

    renderSubmissions(latestSubmission, submissions);
    createShareIcon(latestSubmission);
  }
, 500);

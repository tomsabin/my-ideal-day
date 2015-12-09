function findParent (element, attribute) {
  while ((element = element.parentElement) && !element.hasAttribute(attribute));
  return element;
}

function cardClick () {
  var parentCard = findParent(this, 'data-card-index'),
      cardIndex = parseInt(parentCard.getAttribute('data-card-index')),
      nextCard = document.querySelector('[data-card-index="' + (cardIndex + 1) + '"]'),
      currentInput = parentCard.querySelector('textarea');

  if (currentInput.value !== '') {
    this.disabled = true;
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
document.querySelector('[data-card-index="1"] button').addEventListener('click', cardClick);

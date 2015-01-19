$(function() {
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function animateNext(index, elements) {
    var len = elements.length;
    var $next = $(elements[index]);

    if (index + 1 > len) {
      $next = $(elements[0]);
    }

    if ($next.find('ul').length) {
      $next.textillate('start');
    }
    else {
      $next.textillate({
        in:  {
          effect: 'fadeInUp',
          sync: true,
          callback: function() {
            setTimeout(function() {
              $next.textillate('out');
            }, 4000);
          }
        },
        out: {
          effect: 'fadeOutUp',
          sync: true,
          callback: function() {
            var nextIndex = index + 1;
            animateNext(nextIndex, elements);
          }
        }
      });
    }
  }

  var $iams = $('.iams');

  $iams = shuffle($iams);
  animateNext(0, $iams);
});

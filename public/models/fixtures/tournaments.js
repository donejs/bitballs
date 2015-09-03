import fixture from 'can/util/fixture/';

fixture('GET /services/tournaments', function() {
  return {
    'data': [{
      'id': 1,
      'date': '2015-08-31T05:00:00.000Z'
    }, {
      'id': 2,
      'date': '2014-08-31T05:00:00.000Z'
    }]
  };
});
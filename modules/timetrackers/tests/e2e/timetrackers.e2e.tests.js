'use strict';

describe('Timetrackers E2E Tests:', function () {
  describe('Test Timetrackers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/timetrackers');
      expect(element.all(by.repeater('timetracker in timetrackers')).count()).toEqual(0);
    });
  });
});

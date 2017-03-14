'use strict';

describe('Lists E2E Tests:', function () {
  describe('Test Lists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/lists');
      expect(element.all(by.repeater('list in lists')).count()).toEqual(0);
    });
  });
});

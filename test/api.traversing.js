var expect = require('expect.js'),
    $ = require('../'),
    food = require('./fixtures').food,
    fruits = require('./fixtures').fruits;

describe('$(...)', function() {

  describe('.find', function() {

    it('() : should find nothing', function() {
      expect($('ul', fruits).find()).to.have.length(0);
    });

    it('(single) : should find one descendant', function() {
      expect($('#fruits', fruits).find('.apple')[0].attribs['class']).to.equal('apple');
    });

    it('(many) : should find all matching descendant', function() {
      expect($('#fruits', fruits).find('li')).to.have.length(3);
    });

    it('(many) : should merge all selected elems with matching descendants');

    it('(invalid single) : should return empty if cant find', function() {
      expect($('ul', fruits).find('blah')).to.have.length(0);
    });

    it('(invalid single) : should query descendants only', function() {
      expect($('#fruits', fruits).find('ul')).to.have.length(0);
    });

    it('should return empty if search already empty result', function() {
      expect($('#fruits').find('li')).to.have.length(0);
    });

    it('should throw a SyntaxError if given an invalid selector', function() {
      expect(function() {
        $('#fruits').find(':bah');
      }).to.throwException(function(err) {
        expect(err).to.be.a(SyntaxError);
      });
    });

  });

  describe('.children', function() {

    it('() : should get all children', function() {
      expect($('ul', fruits).children()).to.have.length(3);
    });

    it('() : should return children of all matched elements', function() {
      expect($('ul ul', food).children()).to.have.length(5);
    });

    it('(selector) : should return children matching selector', function() {
      var cls = $('ul', fruits).children('.orange')[0].attribs['class'];
      expect(cls).to.equal('orange');
    });

    it('(invalid selector) : should return empty', function() {
      expect($('ul', fruits).children('.lulz')).to.have.length(0);
    });

    it('should only match immediate children, not ancestors');

  });

  describe('.next', function() {

    it('() : should return next element', function() {
      var cls = $('.orange', fruits).next()[0].attribs['class'];
      expect(cls).to.equal('pear');
    });

    it('(no next) : should return empty for last child', function() {
      expect($('.pear', fruits).next()).to.have.length(0);
    });

  });

  describe('.nextAll', function() {

    it('() : should return all next elements after apple', function() {
      var nextElems = $('.apple', fruits).nextAll();
      expect(nextElems).to.have.length(2);
      expect(nextElems[0].attribs['class']).to.equal('orange');
      expect(nextElems[1].attribs['class']).to.equal('pear');
    });

    it('(no next) : should return empty for last child', function() {
      expect($('.pear', fruits).nextAll()).to.have.length(0);
    });

  });

  describe('.prev', function() {

    it('() : should return previous element', function() {
      var cls = $('.orange', fruits).prev()[0].attribs['class'];
      expect(cls).to.equal('apple');
    });

    it('(no prev) : should return empty for first child', function() {
      expect($('.apple', fruits).prev()).to.have.length(0);
    });

  });

  describe('.prevAll', function() {

    it('() : should return all next elements after apple', function() {
      var nextElems = $('.pear', fruits).prevAll();
      expect(nextElems).to.have.length(2);
      expect(nextElems[0].attribs['class']).to.equal('orange');
      expect(nextElems[1].attribs['class']).to.equal('apple');
    });

    it('(no next) : should return empty for first child', function() {
      expect($('.apple', fruits).prevAll()).to.have.length(0);
    });

  });

  describe('.siblings', function() {

    it('() : should get all the siblings', function() {
      expect($('.orange', fruits).siblings()).to.have.length(2);
      expect($('#fruits', fruits).siblings()).to.have.length(0);
    });

    it('(selector) : should get all siblings that match the selector', function() {
      expect($('.orange', fruits).siblings('.apple')).to.have.length(1);
      expect($('.orange', fruits).siblings('.peach')).to.have.length(0);
    });

    it('(selector) : should throw a SyntaxError if given an invalid selector', function() {
      expect(function() {
        $('.orange', fruits).siblings(':bah');
      }).to.throwException(function(err) {
        expect(err).to.be.a(SyntaxError);
      });
    });

  });

  describe('.parents', function() {
    it('() : should get all of the parents in logical order', function(){
      var result = $('.orange', food).parents();
      expect(result).to.have.length(2);
      expect(result[0].attribs.id).to.be('fruits');
      expect(result[1].attribs.id).to.be('food');
      result = $('#food', food).parents()
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('food');
    })
    it('(selector) : should get all of the parents that match the selector in logical order', function() {
      var result = $('.orange', food).parents('#fruits');
      expect(result).to.have.length(1);
      expect(result[0].attribs.id).to.be('fruits');
      result = $('.orange', food).parents('ul');
      expect(result).to.have.length(2);
      expect(result[0].attribs.id).to.be('fruits');
      expect(result[1].attribs.id).to.be('food');
    })
    it('() : should not break if the selector does not have any results', function() {
      var result = $('.saladbar', food).parents();
      expect(result).to.have.length(0);
    })
  });

  describe('.closest', function() {

    it('() : should return an empty array', function() {
      var result = $('.orange', fruits).closest();
      expect(result).to.have.length(0);
    })

    it('(selector) : should find the closest element that matches the selector, searching through its ancestors and itself', function() {
      expect($('.orange', fruits).closest('.apple')).to.have.length(0);
      var result = $('.orange', food).closest('#food');
      expect(result[0].attribs['id']).to.be('food');
      result = $('.orange', food).closest('ul');
      expect(result[0].attribs['id']).to.be('fruits');
      result = $('.orange', food).closest('li');
      expect(result[0].attribs['class']).to.be('orange');
    })

    it('() : should not break if the selector does not have any results', function() {
      var result = $('.saladbar', food).closest('ul');
      expect(result).to.have.length(0);
    })

  });

  describe('.each', function() {

    it('( (i, elem) -> ) : should loop selected returning fn with (i, elem)', function() {
      var items = [],
          classes = ['apple', 'orange', 'pear'];
      $('li', fruits).each(function(idx, elem) {
        items[idx] = elem;
        expect(this[0].attribs['class']).to.equal(classes[idx]);
      });
      expect(items[0].attribs['class']).to.equal('apple');
      expect(items[1].attribs['class']).to.equal('orange');
      expect(items[2].attribs['class']).to.equal('pear');
    });

    it('( (i, elem) -> ) : should break iteration when the iterator function returns false', function() {

        var iterationCount = 0;
        $('li', fruits).each(function(idx, elem) {
          iterationCount++;
          return idx < 1;
        });

        expect(iterationCount).to.equal(2);
    });

  });

  describe('.map', function() {
    it('(fn) : should return an array of mapped items', function() {
      var classes = $('li', fruits).map(function(i, el) {
        expect(this[0]).to.be(el);
        expect(el.name).to.be('li');
        expect(i).to.be.a('number');
        return el.attribs['class'];
      }).join(', ');

      expect(classes).to.be('apple, orange, pear');
    });
  });

  describe('.filter', function() {
    it('(selector) : should reduce the set of matched elements to those that match the selector', function() {
      var pear = $('li', fruits).filter('.pear').text();
      expect(pear).to.be('Pear');
    });

    it('(selector) : should not consider nested elements', function() {
      var lis = $(fruits).filter('li');
      expect(lis).to.have.length(0);
    });

    it('(fn) : should reduce the set of matched elements to those that pass the function\'s test', function() {
      var orange = $('li', fruits).filter(function(i, el) {
        expect(this[0]).to.be(el);
        expect(el.name).to.be('li');
        expect(i).to.be.a('number');
        return this.attr('class') === 'orange';
      }).text();

      expect(orange).to.be('Orange');
    });
  });

  describe('.first', function() {

    it('() : should return the first item', function() {
      var $src = $('<span>foo</span><span>bar</span><span>baz</span>');
      var $elem = $src.first();
      expect($elem.length).to.equal(1);
      expect($elem[0].children[0].data).to.equal('foo');
    });

    it('() : should return an empty object for an empty object', function() {
      var $src = $();
      var $first = $src.first();
      expect($first.length).to.equal(0);
      expect($first[0]).to.be(undefined);
    });

  });

  describe('.last', function() {

    it('() : should return the last element', function() {
      var $src = $('<span>foo</span><span>bar</span><span>baz</span>');
      var $elem = $src.last();
      expect($elem.length).to.equal(1);
      expect($elem[0].children[0].data).to.equal('baz');
    });

    it('() : should return an empty object for an empty object', function() {
      var $src = $();
      var $last = $src.last();
      expect($last.length).to.equal(0);
      expect($last[0]).to.be(undefined);
    });

  });

  describe('.first & .last', function() {

    it('() : should return equivalent collections if only one element', function() {
      var $src = $('<span>bar</span>');
      var $first = $src.first();
      var $last = $src.last();
      expect($first.length).to.equal(1);
      expect($first[0].children[0].data).to.equal('bar');
      expect($last.length).to.equal(1);
      expect($last[0].children[0].data).to.equal('bar');
      expect($first[0]).to.equal($last[0]);
    });

  });

  describe('.eq', function() {

    function getText(el) {
      if(!el.length) return '';
      return el[0].children[0].data;
    }

    it('(i) : should return the element at the specified index', function() {
      expect(getText($('li', fruits).eq(0))).to.equal('Apple');
      expect(getText($('li', fruits).eq(1))).to.equal('Orange');
      expect(getText($('li', fruits).eq(2))).to.equal('Pear');
      expect(getText($('li', fruits).eq(3))).to.equal('');
      expect(getText($('li', fruits).eq(-1))).to.equal('Pear');
    });

  });

  describe('.slice', function() {

    function getText(el) {
      if(!el.length) return '';
      return el[0].children[0].data;
    }

    it('(start) : should return all elements after the given index', function() {
      var sliced = $('li', fruits).slice(1);
      expect(sliced).to.have.length(2);
      expect(getText(sliced.eq(0))).to.equal('Orange');
      expect(getText(sliced.eq(1))).to.equal('Pear');
    });

    it('(start, end) : should return all elements matching the given range', function() {
      var sliced = $('li', fruits).slice(1, 2);
      expect(sliced).to.have.length(1);
      expect(getText(sliced.eq(0))).to.equal('Orange');
    });

    it('(-start) : should return element matching the offset from the end', function() {
      var sliced = $('li', fruits).slice(-1);
      expect(sliced).to.have.length(1);
      expect(getText(sliced.eq(0))).to.equal('Pear');
    });

  });

});

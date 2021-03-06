define(
  [ 'backbone',
    'collections/slides',
    'views/slide',
    'views/dots' ],
  function( Backbone, SlidesCollection, SlideView, DotsView ) {
    'use strict';

    var slides = [
      {
        brands: [ 'Beats', 'Graff' ],
        description: 'A luxury icon, a disruptive brand, and a partnership to create a product launched on the world\'s biggest stage.',
        img: 'beats.jpg'
      },
      {
        brands: [ 'Tequila Avión', 'Delta Air Lines' ],
        description: 'The world\'s finest tequila, the world\'s largest airline, and a partnership to elevate the Delta Sky Club and overall flying experience.',
        img: 'avion.jpg'
      },
      {
        brands: [ 'The Venetian', 'IHG' ],
        description: 'The world\'s largest luxury resort, the world\'s largest hotel company, and a partnership to disrupt the world\'s largest industry.',
        img: 'venetian.jpg'
      }
    ];

    return Backbone.View.extend({
      initialize: function() {
        this.collection = new SlidesCollection( slides );
        this.subviews = {};
        this.slides = [];

        this._eachSlide()
          ._createSubviews()
          ._subscribe()
          ._next();
      },

      _eachSlide: function() {
        var that = this;

        this.collection.each( function( slide, i ) {
          var slideView = new SlideView( { model: slide } );
          that.$el.append( slideView.el );
          that.slides.push( slideView );
        });

        return that;
      },

      _createSubviews: function() {
        this.subviews.dots = new DotsView( { collection: this.collection } );
        this.$el.append( this.subviews.dots.el );
        return this;
      },

      _subscribe: function() {
        this.listenTo( this.collection, 'remove', this._onShift );
        return this;
      },

      _onShift: function() {
        this.current.setPosition( 'off' );
      },

      _next: function() {
        var that = this;

        ( that.current = that.slides[ 0 ] ).setPosition( 'current' );
        if( !that.next ) that.current.transition();
        ( that.next = that.slides[ 1 ] ).setPosition( 'next' );

        setTimeout( function() {
          that.current.transition();
          that.next.transition();
          that._onShift( that.slides.push( that.slides.shift() ) );
          that._next()
        }, 10000 );
      }
    });
  }
);

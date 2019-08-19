$(function() {
  console.log("ready");
  Barba.Pjax.start();

  var navAnimation = Barba.BaseTransition.extend({
    start: function() {
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */

      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise.all([this.newContainerLoading, this.fadeOut()]).then(
        this.fadeIn.bind(this)
      );
    },

    fadeOut: function() {
      /**
       * this.oldContainer is the HTMLElement of the old Container
       */
      var transitionPromise = new Promise(resolve => {
        var outTransition = new TimelineMax();
        outTransition
          .to(".about-title", 1, { y: -50, autoAlpha: 0 })
          .set(".color-wipe", { display: "block", y: "100%" }, "-=0.7")
          .staggerFromTo(
            ".color-wipe",
            1,
            {
              y: "100%"
            },
            { y: "-100%", ease: Expo.easeInOut },
            0.2,
            "-=0.7"
          )
          .to(".loader", 1, {
            autoAlpha: 0.99,
            onComplete: function() {
              resolve();
            }
          })
          .staggerFromTo(
            ".color-wipe",
            1,
            {
              y: "-100%"
            },
            {
              y: "-200%",
              ease: Expo.easeOut
            },

            0.2
          )
          .set(".color-wipe", { display: "none" });
      });
      return transitionPromise;
    },

    fadeIn: function() {
      /**
       * this.newContainer is the HTMLElement of the new Container
       * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
       * Please note, newContainer is available just after newContainerLoading is resolved!
       */

      var _this = this;
      var $el = $(this.newContainer);

      TweenMax.set($(this.oldContainer), { display: "none" });
      TweenMax.set($el, { visibility: "visible", opacity: 0 });
      TweenMax.fromTo(
        ".loader",
        1,
        { autoAlpha: 1, y: -50 },
        { y: 0, autoAlpha: 0 }
      );
      TweenMax.fromTo(
        ".about-title",
        1.5,
        { autoAlpha: 0, y: 30 },
        { y: 0, autoAlpha: 0.99 }
      );
      TweenMax.to($el, 0.1, {
        opacity: 1,
        onComplete: function() {
          _this.done();
          console.log("done");
        }
      });
    }
  });

  /**
   * Next step, you have to tell Barba to use the new Transition
   */

  Barba.Pjax.getTransition = function() {
    /**
     * Here you can use your own logic!
     * For example you can use different Transition based on the current page or link...
     */

    return navAnimation;
  };
});

$(function() {
  console.log("here");
  Barba.Pjax.start();

  var TranAnimation = Barba.BaseTransition.extend({
    start: function() {
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */

      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise.all([this.newContainerLoading, this.startTransition()]).then(
        this.fadeIn.bind(this)
      );
    },

    startTransition: function() {
      /**
       * this.oldContainer is the HTMLElement of the old Container
       */
      var transitionPromise = new Promise(function(resolve) {
        var outTransition = new TimelineMax();

        outTransition
          .to(".hero-title", 1, {
            y: -50,
            autoAlpha: 0,
            ease: Power2.easeOut
          })
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
      $(window).scrollTop(0);
      var _this = this;
      var $el = $(this.newContainer);

      TweenMax.set($(this.oldContainer), { display: "none" });

      TweenMax.set($el, { visibility: "visible", opacity: 0 });
      TweenMax.fromTo(
        ".loader",
        1,
        { autoAlpha: 1, y: -50 },
        { y: -50, autoAlpha: 0, ease: Expo.easeOut }
      );
      TweenMax.fromTo(
        ".hero-title",
        1.5,
        { autoAlpha: 0, y: 30 },
        { delay: 0.8, y: 0, autoAlpha: 1, ease: Expo.easeOut }
      );
      TweenMax.to($el, 0.1, {
        opacity: 1,
        onComplete: function() {
          _this.done();
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

    return TranAnimation;
  };
});

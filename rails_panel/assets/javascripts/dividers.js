var dividers = {

  init: function() {
    that = this;
    this.initHorizontalDivider();
    this.initVerticalDivider();
    window.onresize = function(e) {
      if (window.innerWidth > 1050) {
        if ($('.split-view').data('layout') == 'horizontal') { 
          $('.split-view-contents-requests').css({'width': '481px', 'height': '100%'});
          $('.split-view-contents-details').css({'left': '480px', 'top':'0'});
        }
        $('.split-view').data('layout', 'vertical');

        // if details panel is too small, resize requests panel instead
        if ($('.split-view-contents-details').width() < 600) {
          newWidth = window.innerWidth - 600;
          $('.split-view-contents-requests').width(newWidth);
          $('.split-view-contents-details').css({'left': newWidth - 1 + 'px'});
        }


      } else {
        if ($('.split-view').data('layout') == 'vertical') { 
          $('.split-view-contents-requests').css({'width': '100%', 'bottom': '50%', 'height': '50%'});
          $('.split-view-contents-details').css({'left': '0', 'top':'50%'});
        }
        $('.split-view').data('layout', 'horizontal');
      }
    }
  },

  initVerticalDivider: function() {
    that = this;
    $(document).on('mousedown', '#vdivider', function(e) {
      e.originalEvent.preventDefault(); // http://stackoverflow.com/a/9743380
      $(this).data('p0', { x: e.pageX, y: e.pageY });
    });
    $(document).on('mousemove', function(e) {
      var p0 = $('#vdivider').data('p0');
      if (p0 !== undefined) {
        that.resizeVerticalLayout(e);
      }
    });
    $(document).on('mouseup', function(e) {
      $('#vdivider').removeData();
    });
  },

  initHorizontalDivider: function() {
    that = this;
    $(document).on('mousedown', '#hdivider', function(e) {
      $(this).data('p0', { x: e.pageX, y: e.pageY });
    });
    $(document).on('mousemove', function(e) {
      var p0 = $('#hdivider').data('p0');
      if (p0 !== undefined) {
        that.resizeHorizonalLayout(e);        
      }
    });
    $(document).on('mouseup', function(e) {
      $('#hdivider').removeData();
    });
  },

  resizeVerticalLayout: function(e) {
    var p0 = $('#vdivider').data('p0');
    var p1 = { x: e.pageX};
    var dx = p1.x - p0.x;

    var currentWidth = $('.split-view-contents-requests').width();
    var newWidth = currentWidth + dx;
    var currentLeft = $('.split-view-contents-details').position().left;
    if (newWidth < 462) {
      newWidth = 462;
    }
    if (newWidth + 600 > window.innerWidth) {
      newWidth = window.innerWidth - 600;
    }
    $('.split-view-contents-requests').width(newWidth);
    $('.split-view-contents-details').css({'left': newWidth - 1 + 'px'});
    $('#vdivider').data('p0', { x: newWidth });   
  },

  resizeHorizonalLayout: function(e) {
    var p0 = $('#hdivider').data('p0');
    var p1 = { y: e.pageY};
    var dy = p1.y - p0.y;
    var top = $('.split-view-contents-details').position().top + dy;
    if (top < 88) {
      top = 88;
    }
    if (window.innerHeight - top < 100) {
      top = window.innerHeight - 100;
    }
    $('.split-view-contents-requests').css({'height':top + 'px'});
    $('.split-view-contents-details').css({'top':top + 'px'});
    $('#hdivider').data('p0', { y: top });   
  }
  
}

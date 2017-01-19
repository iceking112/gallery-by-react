var GalleryDispatcher = require('../dispatcher/GalleryDispatcher');

var PhotoActions = {

  ChoicePhoto: function (text) {
    GalleryDispatcher.dispatch({
      actionType: 'ChoicePhoto',
      text: text
    });
  },

};

module.exports = GalleryActions;

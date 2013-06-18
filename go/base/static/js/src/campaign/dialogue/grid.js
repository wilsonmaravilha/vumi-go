// go.campaign.dialogue.grid
// =========================
// Structures and logic for the dialogue diagram's grid (the thing upon which
// the dialogue states are placed)

(function(exports) {
  // View for the thing upon which the dialogue diagram's states are placed.
  var DialogueGridView = Backbone.View.extend({
    // Returns the position of the next grid point available for a new state
    nextPosition: function() {
      // TODO
      return {top: 0, left: 0};
    }
  });

  _(exports).extend({
    DialogueGridView: DialogueGridView
  });
})(go.campaign.dialogue.grid = {});

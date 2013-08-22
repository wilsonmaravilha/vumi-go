describe("go.apps.dialogue.views", function() {
  var setUp = go.apps.dialogue.testHelpers.setUp,
      tearDown = go.apps.dialogue.testHelpers.tearDown,
      modelData = go.apps.dialogue.testHelpers.modelData;

  var testHelpers = go.testHelpers,
      oneElExists = testHelpers.oneElExists,
      noElExists = testHelpers.noElExists,
      response = testHelpers.rpc.response,
      errorResponse = testHelpers.rpc.errorResponse,
      assertRequest = testHelpers.rpc.assertRequest;

  describe(".DialogueView", function() {
    var DialogueView = go.apps.dialogue.views.DialogueView,
        DialogueModel = go.apps.dialogue.models.DialogueModel;

    var view,
        server;

    beforeEach(function() {
      setUp();

      server = sinon.fakeServer.create();

      view = new DialogueView({
        el: $('.dialogue'),
        model: new DialogueModel(modelData),
        sessionId: '123'
      });

      view.render();
      bootbox.animate(false);
    });

    afterEach(function() {
      tearDown();
      view.remove();
      server.restore();

      $('.bootbox')
        .modal('hide')
        .remove();
    });

    describe("when the '#save' is clicked", function() {
      it("should issue a save api call with the dialogue changes",
      function(done) {
        server.respondWith(function(req) {
          assertRequest(
            req,
            '/api/v1/go/api',
            'conversation.dialogue.save_poll',
            ['campaign-1', 'conversation-1', {poll: view.model.toJSON()}]);

          done();
        });

        // modify the diagram
        view.diagram.connections.remove('endpoint1-endpoint3');
        assert.notDeepEqual(view.model.toJSON(), modelData);

        view.$('#save').click();
        server.respond();
      });

      describe("when the save action was not successful", function() {
        it("should notify the user", function() {
          server.respondWith(errorResponse('Aaah!'));

          assert(noElExists('.modal'));

          view.$('#save').click();
          server.respond();

          assert(oneElExists('.modal'));
          assert.include(
            $('.modal').text(),
            "Something bad happened, changes couldn't be save");
        });
      });

      describe("if the save action was successful", function() {
        var location;

        beforeEach(function() {
          sinon.stub(go.utils, 'redirect', function(url) { location = url; });
        });

        afterEach(function() {
          go.utils.redirect.restore();
        });

        it("should send the user to the conversation show page", function() {
          server.respondWith(response());

          view.$('#save').click();
          server.respond();

          assert.equal(location, '/conversations/conversation-1/');
        });
      });
    });

    describe("when '#new-state' is clicked", function() {
      var i;

      beforeEach(function() {
        i = 0;
        sinon.stub(uuid, 'v4', function() { return i++ || 'new-state'; });
      });

      it("should add a new state to the diagram", function() {
        assert(noElExists('[data-uuid=new-state]'));
        view.$('#new-state').click();
        assert(oneElExists('[data-uuid=new-state]'));
      });
    });
  });
});

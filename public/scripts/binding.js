app.authenticate()
  .then(response => {
    return app.passport.verifyJWT(response.accessToken);
  })
  .then(payload => {
    return app.service('users').get(payload.userId);
  })
  .then(() => {
    app.service('projects').get(getQueryVariable("id"))
      .then(respone => {

        let viewModel = ko.mapping.fromJS(respone.CharterData);

        // Operations
        viewModel.addSH = function() {
          viewModel.SH.push(new Stakeholders("",""));
        };
        viewModel.removeSH = function(a) {
          viewModel.SH.remove(a)
        };

        viewModel.addMBR = function() {
          viewModel.MBR.push(new Members("",""));
        };
        viewModel.removeMBR = function(a) {
          viewModel.MBR.remove(a)
        };

        viewModel.addDLV = function() {
          viewModel.DLV.push(new Deliverable("",0));
        };
        viewModel.removeDLV = function(a) {
          viewModel.DLV.remove(a)
        };

        viewModel.addOBJ = function() {
          viewModel.OBJ.push(new Objects(""));
        };
        viewModel.removeOBJ = function(a) {
          viewModel.OBJ.remove(a)
        };

        viewModel.addREQ = function() {
          viewModel.REQ.push(new Requirments(""));
        };
        viewModel.removeREQ = function(a) {
          viewModel.REQ.remove(a)
        };

        viewModel.addRSK = function() {
          viewModel.RSK.push(new Risks(""));
        };
        viewModel.removeRSK = function(a) {
          viewModel.RSK.remove(a)
        };

        viewModel.addSGN = function() {
          viewModel.SGN.push(new Signatures("", ""));
        };
        viewModel.removeSGN = function(a) {
          viewModel.SGN.remove(a)
        };

        viewModel.save = function() {
          app.service('projects').patch(getQueryVariable('id'),{
            CharterData: ko.mapping.toJS(viewModel),
          })
            .catch(error => console.log(error));
        };

        // Activates knockout.js
        ko.applyBindings(viewModel);

      })
  });

function Stakeholders(name, role) {

    var self = this;

    self.SHname = ko.observable(name);
    self.SHrole = ko.observable(role);
}

function Members(name, role) {

    var self = this;

    self.MBRname = ko.observable(name);
    self.MBRrole = ko.observable(role);
}

function Deliverable(name, duedate) {

    var self = this;

    self.DLVname = ko.observable(name);
    self.DLVdue = ko.observable(new Date(duedate));
}

function Objects(name) {

    var self = this;

    self.OBJvalue = ko.observable(name);
}

function Requirments(name) {

    var self = this;

    self.REQvalue = ko.observable(name);
}

function Risks(name) {

    var self = this;

    self.RSKvalue = ko.observable(name);
}

function Signatures(name, role) {

    var self = this;

    self.SGNname = ko.observable(name);
    self.SGNrole = ko.observable(role);
}

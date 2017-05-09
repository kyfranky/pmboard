let findQuery;
let projectId;


$("#search-find").keyup(function () {

  if ($("#search-find").val().length > 1) {
    findQuery = "%" + $("#search-find").val() + "%";
    findFriend(findQuery)
  }
  else {
    findFriends(projectId)
  }

});

function findInvitation() {

  $("#invited-result").empty();

  app.service('projects').find({

    query:{
      id:getQueryVariable('id'),
      include:2
    }

  })
    .then(respone => {

      const team  = respone.data[0].users;

      team.forEach(function (data) {

        $("#invited-result").append(
          `
            <div class="pop-client-bar">

              <div class="bar-image">
                <img src="images/ui-sherman.jpg">
              </div>

              <div class="bar-data">
                <ul>
                  <li>${data.firstName} ${data.lastName} </li>
                  <li style="font-size: 9pt">
                  <p><span class="fa fa-briefcase" aria-hidden="true"></span>programer asdasd asd as da</p>
                  <p><span class="fa fa-building" aria-hidden="true"></span>tokopediaasdasdasdasdasdasd</p>
                </ul>
              </div>

              <div class="bar-button">
                <button value=${data.id} class="fa fa-times-circle bar-btn-dec"></button>
              </div>

            </div>`
        )

      })

    })
    .catch(function (error) {
      console.log(error)
    });


}

function findFriends(pid) {

  projectId = pid;

  if (projectId == null || projectId == undefined) return;

  $("#search-result").empty();

  app.service('users').find({

    query: {
      includefriendsforteam: 1,
      projectId: pid
    }

  })
    .then(page => {
      const friend = processResult(page);
      friend.forEach(function (data) {
        if (data.projects.length !== 0) {
          appendSearch(data)
        }
        else {
          appendSearchNon(data)
        }
      });
    })
    .catch(function (error) {
      console.log(error)
    });
}

function findFriend(Query) {

  console.log(Query)

  $("#search-result").empty();

  app.service('users').find({

    query: {
      includefriendsforteam: 1,
      uName: Query,
      projectId: projectId
    }

  })
    .then(page => {
      const friend = processResult(page);
      friend.forEach(function (data) {
        if (data.projects.length !== 0) {
          appendSearch(data)
        }
        else {
          appendSearchNon(data)
        }
      });
    })
    .catch(function (error) {
      console.log(error)
    });
}

function processResult(result) {

  const data = result.data[0];

  const inviter = data.Inviter;
  const invited = data.Invited;
  const friend = [];

  inviter.forEach(function (data) {
    friend.push(data)
  });
  invited.forEach(function (data) {
    friend.push(data)
  });

  friend.sort(byName);

  return friend;

}

function byName(a, b) {
  const fullname1 = a.firstName.toLowerCase() + " " + a.lastName.toLowerCase();
  const fullname2 = b.firstName.toLowerCase() + " " + b.lastName.toLowerCase();

  if (fullname1 < fullname2)
    return -1;
  if (fullname1 > fullname2)
    return 1;
  return 0;
}

function appendSearchNon(data) {

  $('#search-result').append(
    `<div class="pop-client-bar">

              <div class="bar-image">
                <img src="images/ui-sherman.jpg">
              </div>

              <div class="bar-data">
                <ul>
                  <li>${data.firstName} ${data.lastName} </li>
                  <li style="font-size: 9pt">
                  <p><span class="fa fa-briefcase" aria-hidden="true"></span>programer asdasd asd as da</p>
                  <p><span class="fa fa-building" aria-hidden="true"></span>tokopediaasdasdasdasdasdasd</p>
                </ul>
              </div>

              <div class="bar-button">
                <button value= ${data.id} class="fa fa-plus-circle addbutton"></button>
              </div>

            </div>`
  )

}

function appendSearch(data) {

  $('#search-result').append(
    `<div class="pop-client-bar">

              <div class="bar-image">
                <img src="images/ui-sherman.jpg">
              </div>

              <div class="bar-data">
                <ul>
                  <li>${data.firstName} ${data.lastName} </li>
                  <li style="font-size: 9pt">
                  <p><span class="fa fa-briefcase" aria-hidden="true"></span>programer asdasd asd as da</p>
                  <p><span class="fa fa-building" aria-hidden="true"></span>tokopediaasdasdasdasdasdasd</p>
                </ul>
              </div>

              <div class="bar-button">

              </div>

            </div>`
  )

}

$(document).on("click", function () {


});

$(document).on("dblclick", function () {

});

$(document).on('click', '.bar-button .addbutton', function (e) {

  let idtoAdd = e.target.value;

  app.service('teams').create({
    invited: idtoAdd,
    Status: 0
  })
    .then(respone => {
      findUsers(findQuery);
    })
    .catch(function (error) {
      console.log(error)
    });

});

$(document).on('click', '.bar-button .bar-btn-acc', function (e) {

  let idtoPatch = e.target.value;

  app.service('teams').patch(idtoPatch, {
    Status: 1
  })
    .then(respone => {
      findInvitation();
      findteams();
    })
    .catch(function (error) {
      console.log(error)
    });

});

$(document).on('click', '.bar-button .bar-btn-dec', function (e) {

  let idtoRemove = e.target.value;

  app.service('teams').remove(idtoRemove)
    .then(() => findInvitation())
    .catch(function (error) {
      console.log(error)
    });

});


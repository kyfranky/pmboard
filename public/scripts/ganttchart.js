anychart.onDocumentReady(function () {

  app.authenticate()
    .then(response => {
      return app.passport.verifyJWT(response.accessToken);
    })
    .then(() => {
      app.service('projects').get(getQueryVariable("id"))
        .then(respone => {

          var selectedItem;

          // create data tree on our data
          var treeData = anychart.data.tree(respone.GanttChartData, anychart.enums.TreeFillingMethod.AS_TABLE);

          // create project gantt chart
          chart = anychart.ganttProject();

          let as = treeData.search("id","0").get("actualStart");
          let ae = treeData.search("id","0").get("actualEnd");
          chart.xScale().minimum(moment(as).subtract(1, 'days'));
          chart.xScale().maximum(moment(ae).add(1, 'days'));

          // set data for the chart
          chart.data(treeData);

          // set start splitter position settings
          chart.splitterPosition(300);

          // get chart data grid link to set column settings
          var dataGrid = chart.dataGrid();

          // set first column settings
          var firstColumn = dataGrid.column(0);
          firstColumn.title("#");
          firstColumn.width(30);
          firstColumn.cellTextSettings().hAlign("center");

          // set second column settings
          var secondColumn = dataGrid.column(1);
          secondColumn.cellTextSettings().hAlign("left");
          secondColumn.width(250);

          dataGrid.column(2)
            .title('Start Date')
            .setColumnFormat('actualStart', 'dateIso8601')
            .cellTextSettings().hAlign("center");

          dataGrid.column(3)
            .title('End Date')
            .setColumnFormat('actualEnd', 'dateIso8601')
            .cellTextSettings().hAlign("center");

          dataGrid.column(4)
            .title('Durations')
            .setColumnFormat('periods', 'integer')
            .cellTextSettings().hAlign("center");

          // enable Gantt toolbar
          var toolbar = anychart.ui.ganttToolbar();
          toolbar.container("container");
          toolbar.target(chart); // sets target
          toolbar.draw();

          var timeLine = chart.getTimeline();
          // disable Gantt editing
          timeLine.editing(false);

          // set container id for the chart
          chart.container("container");

          // initiate chart drawing
          chart.draw();

          // zoom chart to specified date
          //chart.fitAll();

          chart.zoomOut(3.5);

          // Manage Chart Toolbar

          // get current toolbar
          var domToolbar = document.getElementsByClassName("anychart-toolbar")[0];

          // dispose all buttons in toolbar
          domToolbar.innerHTML = "";
          // change buttons alignment
          domToolbar.style.textAlign = "right";


          var separator = document.createElement("div");
          separator.className = "anychart-toolbar-separator anychart-toolbar-separator-disabled anychart-inline-block";
          separator.innerHTML = "&nbsp;";
          separator.setAttribute("role", "separator");
          separator.setAttribute("arial-disabled", "true");

          var separator2 = document.createElement("div");
          separator2.className = "anychart-toolbar-separator anychart-toolbar-separator-disabled anychart-inline-block";
          separator2.innerHTML = "&nbsp;";
          separator2.setAttribute("role", "separator");
          separator2.setAttribute("arial-disabled", "true");

          // create button for live editing
          var editButton = document.createElement("div");

          var outerBox = document.createElement("div");
          outerBox.className = "anychart-inline-block anychart-toolbar-button-outer-box";

          var innerBox = document.createElement("div");
          innerBox.innerHTML = "Enable Live Edit";
          innerBox.className = "anychart-inline-block anychart-toolbar-button-inner-box";

          outerBox.appendChild(innerBox);
          editButton.appendChild(outerBox);
          domToolbar.appendChild(editButton);

          var editButton2 = document.createElement("div");

          var outerBox2 = document.createElement("div");
          outerBox2.className = "anychart-inline-block anychart-toolbar-button-outer-box";

          var innerBox2 = document.createElement("div");
          innerBox2.innerHTML = "Add Data";
          innerBox2.className = "anychart-inline-block anychart-toolbar-button-inner-box";

          domToolbar.appendChild(separator);
          outerBox2.appendChild(innerBox2);
          editButton2.appendChild(outerBox2);
          domToolbar.appendChild(editButton2);

          var editButton3 = document.createElement("div");

          var outerBox3 = document.createElement("div");
          outerBox3.className = "anychart-inline-block anychart-toolbar-button-outer-box";

          var innerBox3 = document.createElement("div");
          innerBox3.innerHTML = "Remove Data";
          innerBox3.className = "anychart-inline-block anychart-toolbar-button-inner-box";

          domToolbar.appendChild(separator2);
          outerBox3.appendChild(innerBox3);
          editButton3.appendChild(outerBox3);
          domToolbar.appendChild(editButton3);

          // create class lists for different states of edit button
          var buttonClasses = ["anychart-inline-block", "anychart-toolbar-button"];
          var hoverClasses = ["anychart-inline-block", "anychart-toolbar-button", "anychart-toolbar-button-hover"];
          var clickClasses = ["anychart-inline-block", "anychart-toolbar-button", "anychart-toolbar-button-hover", "anychart-toolbar-button-active"];

          var rightyClasses = ["anychart-inline-block", "anychart-toolbar-button", "righty"];

          // set default class names for tooltip button
          editButton.className = buttonClasses.join(" ");
          editButton.setAttribute("role", "button");

          // manage button visual appearance
          editButton.addEventListener("mouseover", function () {
            editButton.className = hoverClasses.join(" ");
          });
          editButton.addEventListener("mouseout", function () {
            editButton.className = buttonClasses.join(" ");
          });
          editButton.addEventListener("mousedown", function () {
            editButton.className = clickClasses.join(" ");
          });
          editButton.addEventListener("mouseup", function () {
            editButton.className = hoverClasses.join(" ");
          });

          // set default class names for tooltip button
          editButton2.className = buttonClasses.join(" ");
          editButton2.setAttribute("role", "button");

          editButton2.addEventListener("mouseover", function () {
            editButton2.className = hoverClasses.join(" ");
          });
          editButton2.addEventListener("mouseout", function () {
            editButton2.className = buttonClasses.join(" ");
          });
          editButton2.addEventListener("mousedown", function () {
            editButton2.className = clickClasses.join(" ");
          });
          editButton2.addEventListener("mouseup", function () {
            editButton2.className = hoverClasses.join(" ");
          });

          // set default class names for tooltip button
          editButton3.className = buttonClasses.join(" ");
          editButton3.setAttribute("role", "button");

          editButton3.addEventListener("mouseover", function () {
            editButton3.className = hoverClasses.join(" ");
          });
          editButton3.addEventListener("mouseout", function () {
            editButton3.className = buttonClasses.join(" ");
          });
          editButton3.addEventListener("mousedown", function () {
            editButton3.className = clickClasses.join(" ");
          });
          editButton3.addEventListener("mouseup", function () {
            editButton3.className = hoverClasses.join(" ");
          });

          // add action on button click
          editButton.addEventListener("click", function () {
            if (chart.editing()) innerBox.innerHTML = "Enable Live Edit";
            else innerBox.innerHTML = "Disable Live Edit";
            timeLine.editing(!timeLine.editing());
          });

          editButton2.addEventListener("click", function () {

            $(".masker").toggleClass("showing");

          });

          editButton3.addEventListener("click", function () {
            removeData()
          });

          chart.listen('rowSelect', function (e) {
            selectedItem = e['item'];
          });

          chart.listen(anychart.enums.EventType.ROW_CLICK, function (e) { //set event type
            console.log("click")
          });

          treeData.listen(anychart.enums.EventType.TREE_ITEM_MOVE, function (e) {
            console.log("moved")
          });

          treeData.listen(anychart.enums.EventType.TREE_ITEM_UPDATE, function (e) {

            let updateItem = e["item"];
            let updateField = e["field"];
            let updateValue = e["value"];
            let updatePath = e["path"];

            if (typeof updateValue === 'object') {

              let sourceConnector = updateItem.La.connector;
              socket.emit('sendConnectorUpdate', {
                itemid: updateItem.La.id,
                field: updateField,
                values: sourceConnector
              });
              //updateConnector(updateItem, updatePath, updateValue);

            }
            else{
              if (updateField == "actualStart" || updateField == "actualEnd") {

                if (updateValue !== moment(updateValue).format('YYYY-MM-DD')) {

                  console.log(updateValue)
                  console.log(moment(updateValue).format('YYYY-MM-DD'))

                  let a = moment(updateValue).format('YYYY-MM-DD');
                  updateItem.set(updateField, a)

                  socket.emit('sendDataUpdate', {itemid: updateItem.La.id, field: updateField, values: a});
                  return;

                }

                if (updateItem.get("id") == 0) {

                  let as = updateItem.get("actualStart");
                  let ae = updateItem.get("actualEnd");
                  chart.xScale().minimum(moment(as).subtract(1, 'days'));
                  chart.xScale().maximum(moment(ae).add(1, 'days'));

                  updateItem.set("periods", moment(ae, 'YYYY-MM-DD').diff(moment(as, 'days')))
                }
                else {
                  socket.emit('sendDataUpdate', {itemid: updateItem.La.id, field: updateField, values: updateValue});
                }

                //console.log(updateItem.getParent().get("id"))



                if(updateItem.getParent() == null){
                  return
                }
                else{
                  updateDuration(updateItem.getParent().get("id"));
                }


              }
              else {

                if (updateField == "periods") return;

                //updateData(updateItem, updateField, updateValue);

                socket.emit('sendDataUpdate', {itemid: updateItem.La.id, field: updateField, values: updateValue});
              }
            }


          });

          function updateDuration(ID) {

            var dataItem = treeData.search("id", ID);
            var childrenList = dataItem.getChildren(); // get children of data item
            var item = {};

            let lowestStart = null;
            let highestEnd = null;

            for (var i = 0; i < childrenList.length; i++) {

              item = childrenList[i];

              let SD = item.get("actualStart")
              let Start = moment(SD).format('YYYY-MM-DD');

              if (lowestStart != null) {
                if (moment(lowestStart).isAfter(Start)) {
                  lowestStart = Start;
                }
              }
              else {
                lowestStart = Start;
              }

              let ED = item.get("actualEnd");
              let End = moment(ED).format('YYYY-MM-DD');

              if (highestEnd != null) {
                if (moment(highestEnd).isBefore(End)) {
                  highestEnd = End;
                }
              }
              else {
                highestEnd = End;
              }

              let days = moment(End, 'YYYY-MM-DD').diff(moment(Start, 'YYYY-MM-DD'), 'days');
              if (item.get("periods") != days) {
                item.set("periods", days)
              }

            }

            //console.log(lowestStart, highestEnd)

            if (lowestStart != null && highestEnd != null) {

              let SD = moment(lowestStart).format('YYYY-MM-DD');
              let ED = moment(highestEnd).format('YYYY-MM-DD');
              ;

              dataItem.set("actualStart", SD);
              dataItem.set("actualEnd", ED);

            }

          }

          chart.listen(anychart.enums.EventType.BEFORE_CREATE_CONNECTOR, function (e) {

            let source = e["source"];
            let sourceConnector = source.get("connector");

            let compareData = {connectTo: e["target"].La.id, connectorType: e["connectorType"]};

            for (var i = 0; i < sourceConnector.length; i++) {

              if (compareData.connectorType.toLocaleLowerCase() === sourceConnector[i].connectorType.toLocaleLowerCase() &&
                compareData.connectTo === sourceConnector[i].connectTo) {
                console.log("sama");
                e.preventDefault();
                return;
              }

            }

          });

          treeData.listen(anychart.enums.EventType.TREE_ITEM_CREATE, function (e) {
            console.log("created");
            let updateItem = e["item"];

            if(updateItem.getParent() == null){
              return
            }
            else{
              updateDuration(updateItem.getParent().get("id"));
            }

          });

          treeData.listen(anychart.enums.EventType.TREE_ITEM_REMOVE, function (e) {
            console.log("deleted");
          });

          function updateData(updateItemID, updateField, updateValue) {
            var updateItem = treeData.search("id", updateItemID);
            let sourceConnector = updateItem.get("connector");
            if (JSON.stringify(sourceConnector) === JSON.stringify(updateValue)) return;
            updateItem.set(updateField, updateValue);
          }

          socket.on('setConnector', function (data) {
            updateData(data.itemid, data.field, data.values);
          });

          socket.on('setData', function (data) {
            updateData(data.itemid, data.field, data.values)
          });

          function addData() {

            var root = treeData.search("id", "0");
            var destination = selectedItem ? selectedItem : root;

            if ($("#taskName").val() == "" || $("#startDate").val() == "" || $("#startDate").val() == "") return;

            var id = Math.random() * 100 << 16;
            var name = $("#taskName").val();
            var start = $("#startDate").val();
            var end = $("#endDate").val();

            var itemToBeAdded = {
              "id": id,
              "name": name,
              "actualStart": start,
              "actualEnd": end,
              "parent": destination.get("id"),
              "connector": {}
            };

            destination.addChild(itemToBeAdded);

            $("input[type=text]").val("");
            $("input[type=date]").val("");

            socket.emit('sendCreatedGantt', {dataAdd:itemToBeAdded,destinationID: destination.get("id")});

          }

          function removeData() {
            if (selectedItem) {

              if(selectedItem.get("id")==0) return

              let parent = selectedItem.getParent().get("id");

              selectedItem.remove();

              updateDuration(parent);

              socket.emit('sendDeletedGantt', selectedItem.La.id);
              selectedItem = null;
            }
          }

          socket.on('getCreatedGantt', function (data) {

            let destination = treeData.search("id", data.destinationID);

            destination.addChild(data.dataAdd);

          });

          socket.on('getDeletedGantt', function (data) {
            var item = treeData.search("id", data);
            item.remove();
          });

          let pure = [];

          function getDats(data) {
            if (data.numChildren() <= 0) return pure;
            let temp = data.getChildren();
            for (let i = 0; i < data.numChildren(); i++) {
              var parent = temp[i].getParent();
              var rowData = temp[i].La;
              if (parent != null) rowData["parent"] = parent.La.id;
              pure.push(rowData);
              getDats(temp[i]);
            }
            return pure;
          }

          function saveGantt() {
            pure = [];
            let saveData = getDats(treeData);
            console.log(saveData);
          }

          $("#addDat").click(function () {
            addData();
          });


          //saveGantt();


        })
    })

});

function hideMenu() {
  $(".masker").toggleClass("showing");
}

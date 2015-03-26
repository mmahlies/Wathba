window.APP = {
    model:{},
    view:{},
    collection:{},
    variables:{}
};

$(function () {
    APP.variables.buildings_cost = {
        "ClassR":{"add":{"knowledge":150, "balance":200, "satisfication":0 },
            "remove":{"knowledge":120, "balance":150, "satisfication":0 }
        },
        "TrafficlightR":{"add":{"knowledge":150, "balance":200, "satisfication":40 },
            "remove":{"knowledge":120, "balance":150, "satisfication":0 }
        },
        "PlaygroundR":{"add":{"knowledge":150, "balance":200, "satisfication":0 },
            "remove":{"knowledge":120, "balance":150, "satisfication":0 }
        },
        "CoffeeR":{"add":{"knowledge":150, "balance":200, "satisfication":0 },
            "remove":{"knowledge":120, "balance":150, "satisfication":0 }
        },
        "ResturantR":{"add":{"knowledge":150, "balance":200, "satisfication":0 },
            "remove":{"knowledge":120, "balance":150, "satisfication":0 }
        },
        "ManagementR":{"add":{"knowledge":150, "balance":200, "satisfication":0 },
            "remove":{"knowledge":120, "balance":150, "satisfication":0 }
        }
    };

    $.ui.draggable.prototype._mouseStop = function (event) {
        //If we are using droppables, inform the manager about the drop
        var dropped = false;
        if ($.ui.ddmanager && !this.options.dropBehaviour)
            dropped = $.ui.ddmanager.drop(this, event);
        //if a drop comes from outside (a sortable)
        if (this.dropped) {
            dropped = this.dropped;
            this.dropped = false;
        }

        if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
            var self = this;
            self._trigger("reverting", event);
            $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                event.reverted = true;
                self._trigger("stop", event);
                self._clear();
            });
        } else {
            this._trigger("stop", event);
            this._clear();
        }

        return false;
    }

    imgHeight = parseInt($('.buildSource').css('height')) / 2;
    imgWidth = parseInt($('.buildSource').css('width')) / 2;
    $('.buildSource').draggable({ helper:function () {
        thisCashedVar = $(this);
        //console.log(thisCashedVar[0].src);
        var dom = [];
        dom.push("<img src =  " + thisCashedVar[0].src + " width = 150px height = 150px />");
        return $(dom.join(''));
    },
        opacity:'.35',
        cursorAt:{top:imgHeight, left:imgWidth},
        revert:"valid",
        reverting:function () {
            //console.log('reverted');
        },
        start:function (ev, ui) {
            //balanceCheck = dragStart(thisCashedVar[0].src);
            //alert(balanceCheck);
            if (!dragStart(thisCashedVar[0].src))
                ev.preventDefault();
            //return false;
        },
        stop:function (ev, ui) {
            if (!ev.reverted) {
                //	console.log('reverted');
                $('<img>', {id:picName + buildingCounter, src:ev.target.src,
                    width:'150px', // ev.target.width +
                    height:'150px'        // ev.target.height +
                })
                    .css('position', 'absolute')
                    .css('left', ev.clientX - imgWidth)
                    .css('top', ev.clientY - imgHeight)
                    .addClass('droppedImg')
                    .appendTo('body')
                    .on('click', buildClicked)
                    .on('mouseover', buildHover)
                    .on('mouseout', buildUnHover)
                    .droppable({hoverClass:'makeItRed', tolerance:'touch'})
                var name = ev.target.src;
                console.log("!");
                extractPicName(name);
                dragDrop(ev);
            }
        },
        drag:function (ev, ui) {
            //console.log(ui);
        }
    });

    $('.droppedImg').droppable({hoverClass:'border', tolerance:'touch',
        over:function (ev, obj) {
            //	console.log(ev.target);
            //					alert("");
        }
    });


    //$('#bird').spState(4);
    //$('#bird').sprite({fps:6, no_of_frames: 4, rows:5, lastRowCount:2})
    //		  .spRandom({top: 50, bottom: 200, left: 300, right: 320})
    //		  .activeOnClick().active();
    //$('body').flyToTap();
    /*
     $('.boy').each(function(ind, obj){
     $(obj)
     .sprite({fps:6, no_of_frames: 3, rows:5, lastRowCount:2})
     .spRandom({top: 0, bottom: 300, left: 0, right: 400});

     });
     */


    setInterval(function () {
        for (var j = 0; j < buildings.length; j++) {
            //	console.log(buildings);
            buildings[j].maintenanceTimeDiff += 1;
            if (buildings[j].name == $("#buildName").html()) {
                $("#maintenanceTimeDiff").html(buildings[j].maintenanceTimeDiff);
            }

            //	console.log(buildings[j].name + " - " + buildings[j].maintenanceTimeDiff + " - " + buildings[j].isWork);
            if (buildings[j].isWork && buildings[j].maintenanceTimeDiff > 60) {
                $("#" + buildings[j].name).addClass("maintenanceNeeded");
                buildings[j].isWork = false;
                $.ajax({
                    url:"http://localhost/CI/index.php/elnazer/buildMaintenanceOut",
                    success:function (result) {
                        $("#Satisfication").html(Number($("#Satisfication").html()) - 100);
                        $("#brainl").html(Number($("#brainl").html()) - 100);
                    }
                });
            }
        }
    }, 2000);
});


buildingCounter = 0;
buildings = new Array();  // to put bulidings

function dragStart(buildPath) {

    //check if his money enough or not
    var picName = extractPicName(buildPath);
    this.checkResult = true;
    if ($("#labelBalance").html() < (APP.variables.buildings_cost[picName]["add"]["balance"])) {
        alert("your balance must be more than " + APP.variables.buildings_cost[picName]["add"]["balance"]);
        this.checkResult = false;
    }
    return     this.checkResult;
}

function dragEnter(ev) {
// to prevent browser from execute the link ,
    event.preventDefault();
    return true;
}
counter = 0;
function dragOver(ev) {
//alert(ev.dataTransfer.getData("URL"));                
//event.preventDefault();

}


function extractPicName(name) {
    var names = new Array();
    names = name.split("/");
    picNameWithExtention = names[names.length - 1];
    picName = picNameWithExtention.split(".")[0];
    return picName;
}

function dragDrop(ev) {
//1-put image in specific location
//2-toggle the building panel
//3-edite player data health , satisification , brain
//4-add build data to buildings Array 
//5-send building info to the DB -
//document.getElementById("sound_element").innerHTML= 
//"<embed src='http://localhost/CI/sound/buildBuildes.wav' hidden=true autostart=true loop=false>";
///*************************************************** edite player data health , satisification , brain

    APP.variables.mainValueModel.set('balance', Number(APP.variables.mainValueModel.get('balance')) - Number(APP.variables.buildings_cost[picName]["add"]["balance"]));
    APP.variables.mainValueModel.set('knowledge', Number(APP.variables.mainValueModel.get('knowledge')) + Number(APP.variables.buildings_cost[picName]["add"]["knowledge"]));
    APP.variables.mainValueModel.set('satisfication', Number(APP.variables.mainValueModel.get('satisfication')) + Number(APP.variables.buildings_cost[picName]["add"]["satisfication"]));
    APP.variables.mainValueModel.set('health', Number(APP.variables.mainValueModel.get('health')) - Number(APP.variables.buildings_cost[picName]["add"]["health"]));

// *********************** send building info to the DB ********************************************
    var build = {"building_name":picName,
        "xLocation":($("#" + picName + buildingCounter).position().left),
        "yLocation":($("#" + picName + buildingCounter).position().top),
        "build_path":ev.target.src,
        "balance":(APP.variables.mainValueModel.get('balance')),
        "knowledge":(APP.variables.mainValueModel.get('knowledge')),
        "satisfication":(APP.variables.mainValueModel.get('satisfication')),
        "health":(APP.variables.mainValueModel.get('health')),
        "level":'1'
    };
    /*
     $.ajax({
     url 	: "http://localhost/CI/index.php/elnazer/addBuild",
     success : function(data){
     console.log("done");
     },
     error: function(e){
     console.log(e.responseText);
     },
     data	: build,
     type    : "post",
     dataType: "json"
     });
     */

    var buildData = JSON.stringify(build);
    //console.log(buildData);
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //alert(xmlhttp.responseText);
        }
    }
    xmlhttp.open("POST", "http://localhost/CI/index.php/elnazer/addBuild", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("buildData=" + buildData);

    //*****************************************add build data to buildings Array
    var buildInstance = new Object();
    buildInstance.name = picName + buildingCounter;


    buildInstance.xLocation = ($("#" + picName + buildingCounter).position().left); //ev.clientX-Number(document.getElementById(picName+i).width/2);
    buildInstance.yLocation = ($("#" + picName + buildingCounter).position().top); //ev.clientY-Number(document.getElementById(picName+i).height/3);
    buildInstance.maintenanceTimeDiff = 0;
    buildInstance.isWork = true;
    buildings[buildingCounter] = buildInstance;
    buildingCounter++;

    return false;

}

function buildHover(ev) {

    $("#" + ev.target.id).animate({
        height:'200px',
        width:'200px'
    })
}

function buildUnHover(ev) {
    $("#" + ev.target.id).animate({
        height:'150px',
        width:'150px'
    })

}

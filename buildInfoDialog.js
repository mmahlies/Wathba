function buildClicked(ev) {
    document.getElementById("buildInfo").style.visibility = 'visible';
    $("#buildInfo").fadeIn(2000);
    document.getElementById("buildName").innerHTML = ev.target.id;
    document.getElementById("buildInfo").style.left = ev.clientX;
    document.getElementById("buildInfo").style.top = ev.clientY;
    document.getElementById("realBuildName").innerHTML = extractPicName(ev.target.src);
    //alert(document.getElementById("realBuildName").identifier);
    buildName = $("#buildName").html();
    for (var j = 0; j < buildings.length; j++) {
        if (buildings[j].name == buildName) {
            console.log(buildings[j].maintenanceTimeDiff);
            $("#maintenanceTimeDiff").html(buildings[j].maintenanceTimeDiff);
            $("#buildInfoP").html(buildings[j].description);

        }
    }
}
function closeBuildInfo() {
// alert($("#"+buildings[0].name).width());// $("#"+buildName).remove();
    //alert($("#"+buildings[0].name).width);
    $("#buildInfo").fadeOut(1000);

}

function editBuildInfo() {
    var buildName = $("#buildName").html();
    var currentText = prompt("enter new Text", $("#buildInfoP").html());
    $("#buildInfoP").html(currentText);
    for (var j = 0; j < buildings.length; j++) {
        if (buildings[j].name == $("#buildName").html()) {

            var updatedBuild = {
                "xLocation":buildings[j].xLocation,
                "yLocation":buildings[j].yLocation,
                "description":currentText
            };
            updatedBuild = JSON.stringify(updatedBuild);
            $.ajax({
                url:"http://localhost/CI/index.php/elnazer/editBuildInfo",
                type:"get",
                dataType:"json",
                data:{"updatedBuild":updatedBuild}
            });

        }
    }
}

function deleteBuildInfo() {
    var buildName = $("#buildName").html();
    $("#" + buildName).fadeOut(1000, function () {
        $("#" + buildName).remove();
    });
    $("#buildInfo").fadeOut(1000);
    APP.variables.mainValueModel.set('balance', Number(APP.variables.mainValueModel.get('balance')) + Number(APP.variables.buildings_cost[picName]["remove"]["balance"]));
    APP.variables.mainValueModel.set('knowledge', Number(APP.variables.mainValueModel.get('knowledge')) + Number(APP.variables.buildings_cost[picName]["remove"]["knowledge"]));
    APP.variables.mainValueModel.set('satisfication', Number(APP.variables.mainValueModel.get('satisfication')) + Number(APP.variables.buildings_cost[picName]["remove"]["satisfication"]));
    APP.variables.mainValueModel.set('health', Number(APP.variables.mainValueModel.get('health')) - Number(APP.variables.buildings_cost[picName]["remove"]["health"]));

    for (var j = 0; j < buildings.length; j++) {
        {
            if (buildings[j].name == buildName) {
                var deletedBuild = {"building_name":$("#realBuildName").html(),
                    "xLocation":buildings[j].xLocation,
                    "yLocation":buildings[j].yLocation,
                    "balance":(APP.variables.mainValueModel.get('balance')),
                    "knowledge":(APP.variables.mainValueModel.get('knowledge')),
                    "satisfication":(APP.variables.mainValueModel.get('satisfication')),
                    "health":(APP.variables.mainValueModel.get('health'))
                }
                console.log(deletedBuild);
//xhr to delete

                var deletedBuildData = JSON.stringify(deletedBuild);
//   alert(deletedBuildData);
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
                xmlhttp.open("POST", "http://localhost/CI/index.php/elnazer/deleteBuild", true);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send("build=" + deletedBuildData);

                buildings.splice(j, 1); // delete element from array
                break;
            }
        }
    }
    ;
}

function mirrorBuildInfo() {
    realBuildName = ($("#realBuildName").html());
    flag = (realBuildName[realBuildName.length - 1]);

    console.log("realBuildName " + realBuildName);
    console.log("$('#buildName').html() " + $("#buildName").html());
    switch (flag) {
        case "R":
            imgPath = document.getElementById($("#buildName").html()).src;
            imgPath2 = imgPath.slice(0, imgPath.length - 5);
            imgPath2 += "L.txt";//get the rotating pic
            document.getElementById($("#buildName").html()).src = imgPath2;
            // update the DB
            break;
        case "L":
            imgPath = document.getElementById($("#buildName").html()).src;
            imgPath2 = imgPath.slice(0, imgPath.length - 5);
            imgPath2 += "R.txt";
            document.getElementById($("#buildName").html()).src = imgPath2;
            break;
    }
//update DB  and change buildingArray data  and change build ID and Id
    for (var j = 0; j < buildings.length; j++) {
        //alert(buildings[j].name   +" **buildings[j].name  ");
        // alert($("#buildName").html()+" ***$(#buildName).html()");
        if (buildings[j].name == $("#buildName").html()) {

            xNewWithoutPx = $("#" + $("#buildName").html()).position().left;// document.getElementById($("#buildName").html()).style.left.slice(0,document.getElementById($("#buildName").html()).style.left.length-2);
            yNewWithoutPx = $("#" + $("#buildName").html()).position().top; //document.getElementById($("#buildName").html()).style.top.slice(0,document.getElementById($("#buildName").html()).style.top.length-2);

            var updatedBuild = {
                "buildingName":extractPicName(imgPath2),
                "buildingPath":imgPath2,
                "xLocation":buildings[j].xLocation,
                "yLocation":buildings[j].yLocation,
                "xNew_location":xNewWithoutPx,
                "yNew_location":yNewWithoutPx,
            };
            //updatedBuild=JSON.stringify(updatedBuildJ);
            //ajax("http://localhost/CI/index.php/elnazer/mirror?build="+updatedBuild);

            console.log(updatedBuild);
            $.ajax({
                url:"http://localhost/CI/index.php/elnazer/mirror",
                data:updatedBuild,
                type:"POST",
                success:function (result) {
                    $("#Satisfication").html(Number($("#Satisfication").html()) + 100);
                    $("#brainl").html(Number($("#brainl").html()) + 100);
                    //console.log(result);
                }
            });

            //alert(document.getElementById($("#buildName").html()).id);
            //document.getElementById($("#buildName").html()).setAttribute("id", extractPicName(imgPath2)+i);
            //alert(document.getElementById($("#buildName").html()).id);
            //buildings.splice(j,1);
            //var buildInstance=new Object();
            //buildInstance.name=extractPicName(imgPath2)+i;
            //buildInstance.xLocation=xNewWithoutPx;
            //buildInstance.yLocation=yNewWithoutPx;
            //buildings[i]=buildInstance;
            //i++;
            buildings[j].xLocation = xNewWithoutPx;
            buildings[j].yLocation = yNewWithoutPx;
            $("#buildInfo").fadeOut(1000);
        }
    }

}

function maintenanceBuildInfo() {
    this.checkBalance = true;
    switch (picName) {
        case "ResturantR":
            if ($("#labelBalance").html() < 2000) {
                alert("your balance must be more than 2000");
                this.checkBalance = false;
            }
            break;
        case "Mosque":
            if ($("#labelBalance").html() < 500) {
                alert("your balance must be more than 500");
                this.checkBalance = false;
            }
            break;
        case "PlaygroundR":
            if ($("#labelBalance").html() < 500) {
                alert("your balance must be more than 500");
                this.checkBalance = false;
            }
            break;
        case "ClassR":
            if ($("#labelBalance").html() < 1000) {
                alert("your balance must be more than 1000");
                this.checkBalance = false;
            }
            break;
        case "CoffeeR":
            if ($("#labelBalance").html() < 1000) {
                alert("your balance must be more than 1000");
                this.checkBalance = false;
            }
            break;
    }
    if (this.checkBalance == true) {
        buildName = $("#buildName").html();
        for (var j = 0; j < buildings.length; j++) {
            if (buildings[j].name == buildName) {
                var maintenanceBuild = {building_name:$("#realBuildName").html(),
                    xLocation:buildings[j].xLocation,
                    yLocation:buildings[j].yLocation

                }
                buildings[j].maintenanceTimeDiff = 0;
                buildings[j].isWork = true;
                $("#" + buildings[j].name).removeClass("maintenanceNeeded");

                $.ajax({
                    url:"http://localhost/CI/index.php/elnazer/maintenanceBuild",
                    data:maintenanceBuild,
                    type:"POST",
                    success:function (result) {
                        $("#Satisfication").html(Number($("#Satisfication").html()) + 100);
                        $("#brainl").html(Number($("#brainl").html()) + 100);
                        console.log(result);
                    }
                });

            }
        }
    }
    $("#buildInfo").fadeOut(1000);
}

function mousemove() {

}

function zoomChange() { //not use now{
    //alert(flag);
    //if (flag =='up') {
    alert(document.getElementById("body").style.zoom);
//document.getElementById("body").style.zoom =100;
    document.getElementById['background'].style.zoom = screen.width / 512;
//}
}


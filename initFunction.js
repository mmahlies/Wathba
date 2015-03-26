$(function(){
	APP.model.MainValues = Backbone.Model.extend({
		defaults: {
			 knowledge 		: 0,
			 satisfication  : 0,
			 health 		: 0,
			 balance		: 0
		 }
	});
	APP.view.MainValuesView = Backbone.View.extend({
		el: "#right",
		initialize : function(){
			this.model.on('change' , this.render, this)
			this.render();
		},
		template : _.template($('#menu_values').html()),
		render	 :	function(){
						this.$el.html(this.template(this.model.toJSON()));
						return this;
		},
		events 	:{
			'click .home' : 'showBuilding',
			'click .map' : 'showFriends'
		},
		showBuilding : function(){
			 $("#bottomB").slideToggle(2000);
		},
		showFriends : function(){
			$("#bottomF").slideToggle(2000);
		}
	});

	APP.model.Build = Backbone.Model.extend({
		defaults: {
				 name 						: "",
				 xLocation  				: "",
				 yLocation 					: "",
				 maintenanceTimeDiff		: 0 ,
				 buildPath		 			: "",
				 isWork 					: false
		},
        urlRoot: "init_update"
	});
// add comment
	APP.view.BuildView = Backbone.View.extend({
		tagNAme: 'img',
		initialize : function(){
			this.model.on('change' , this.render, this)
			this.render();
		},
		events 	:{
			'click' : 'buildClicked'
		},
		buildClicked : function(){
			alert("build Cliced");
		}
	});

	APP.collection.Buildings = Backbone.Collection.extend({
		model: APP.model.Build,
        url : "init_update"
	});

	APP.variables.buildings = new APP.collection.Buildings({model : APP.model.Build });

	$.ajax({
		url 	: "http://localhost/CI/index.php/elnazer/init_update",
		success : function(data){
				receiveDataFromServer(data);
		},
		dataType: "json"
	});

	$.ajax({
		url 	: "http://localhost/CI/index.php/elnazer/userFriendsWebService",
		success : function(friendsData){
				receiveFriendsDataFromServer(friendsData);
		},
		dataType: "json"
	});
		function receiveDataFromServer(userData){
            APP.variables.mainValueModel.set('knowledge', userData.Account[0].knowledge)
			APP.variables.mainValueModel.set('satisfication', userData.Account[0].satisfication)
			APP.variables.mainValueModel.set('health', userData.Account[0].health)
			APP.variables.mainValueModel.set('balance', userData.Account[0].balance)
		   for (var j=0; j < userData.Buildings.length; j++) {		//	problem of multiple building with the same name
				if(userData.Buildings[j].building_name == "" ){
					console.log("validation of the one null row in db" + j);
					continue;
				}
				console.log(j);
				extractPicName(userData.Buildings[j].build_path);
				   $('<img>', {id: userData.Buildings[j].building_name + buildingCounter, src:  userData.Buildings[j].build_path,
														width:  '150px'  , // ev.target.width +
														height: '150px'		// ev.target.height +
														})
														.css('position', 'absolute')
														.css('left', userData.Buildings[j].xLocation)
														.css('top', userData.Buildings[j].yLocation)
														.css('draggable', 'false')
														.addClass('droppedImg')
														.appendTo('body')
														.on('click', buildClicked)
														.on('mouseover', buildHover)
														.on('mouseout', buildUnHover)
														 .droppable({hoverClass: 'makeItRed', tolerance: 'touch'}) ;
				   //******************************************** put build data in the buildings Array
				   var buildInstance=new Object();
				   buildInstance.name =  userData.Buildings[j].building_name + buildingCounter;
				   buildInstance.xLocation =  userData.Buildings[j].xLocation;
				   buildInstance.yLocation =  userData.Buildings[j].yLocation;
				   buildInstance.maintenanceTimeDiff = userData.timeNow - userData.Buildings[j].maintenance_time;
                   buildInstance.description = (userData.Buildings[j].description) ? userData.Buildings[j].description : "";
                   newBuild = new APP.model.Build();
				   if(userData.timeNow - userData.Buildings[j].maintenance_time > 60)  { // num of seconds
								$("#"+userData.Buildings[j].building_name + buildingCounter).addClass('maintenanceNeeded');
								buildInstance.isWork = false;
								newBuild.isWork = false;
					}else{
								buildInstance.isWork = true;
								newBuild.isWork = false;
					}
					buildings[buildingCounter] = buildInstance;
					buildingCounter++;
			// build backbone model

					newBuild.set('name', userData.Buildings[j].building_name + buildingCounter);
					newBuild.set('buildPath', userData.Buildings[j].build_path);
					newBuild.set('xLocation',  userData.Buildings[j].xLocation);
				    newBuild.set('yLocation',  userData.Buildings[j].yLocation);
				    newBuild.set('maintenanceTimeDiff', userData.timeNow - userData.Buildings[j].maintenance_time);
                    newBuild.set("description", (userData.Buildings[j].description) ? userData.Buildings[j].description : "");
						APP.variables.buildings.add(newBuild);
					//var x = APP.variables.buildings.pluck({'name'});

			}


	}

		function receiveFriendsDataFromServer(friends){

				$.each(friends, function(index, obj){
				    var div = $('<div></div>',{
							class : 'img friendObj'
					}).click(friendClick);
					var img= $('<img/>',{
						src:  obj.profile_pic,//"http://localhost/CI/profile_pictures/"+ index + ".jpg",
						width: "110",
						height: "90",
						id: index,
						draggable: "false",
						class: "friendImg"
					}).appendTo(div);
					var imgBrain= $('<img/>',{
						src: "../../img/brain/26.txt",
						width: "40",
						height: "30",
						draggable: "false"	,
						class: "imgBrain"
					}).appendTo(div);
					var labelBrain= $('<label></label>',{
						width: "40",
						height: "30",
						draggable: "false",
						class: "label1"
					})
					.html(obj.knowledge)
					.appendTo(div);

					var imgHappy= $('<img/>',{
						src: "../../img/smile/1.txt",
						width: "40",
						height: "30",
						draggable: "false"	,
						class: "imgHappy"
					}).appendTo(div);

					var labelHappy= $('<label></label>',{
						width: "40",
						height: "30",
						draggable: "false",
						class: "label2"
					})
					.html(obj.satisfication)
					.appendTo(div);

					$("#bottomF").append(div);
				});

		}


function friendClick(ev){
	window.location = "profile/" + ev.target.id;
}
});


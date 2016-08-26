/**
 * Load controllers, directives, filters, services before bootstrapping the
 * application. NOTE: These are named references that are defined inside of the
 * config.js RequireJS configuration file.
 */
define(
		[ 'jquery', 'angular', 'main', 'routes', 'interceptors',
				'px-datasource', 'ng-bind-polymer' ],
		function($, angular) {
			'use strict';

			/**
			 * Application definition This is where the AngularJS application is
			 * defined and all application dependencies declared.
			 * 
			 * @type {module}
			 */
			var predixApp = angular.module('predixApp', [ 'app.routes',
					'app.interceptors', 'sample.module', 'predix.datasource',
					'px.ngBindPolymer' ]);

			/**
			 * Main Controller This controller is the top most level controller
			 * that allows for all child controllers to access properties
			 * defined on the $rootScope.
			 */
			predixApp
					.controller(
							'MainCtrl',
							[
									'$http',
									'$scope',
									'$rootScope',
									'PredixUserService',
									function($http, $scope, $rootScope,
											predixUserService) {

										// Global application object
										document.getElementsByTagName("html")[0].className = "loading";
										$scope.expression = true;
										$scope.selectedDB = 'timeseries';
										window.App = $rootScope.App = {
											version : '1.0',
											name : 'Predix Seed',
											session : {},
											tabs : [ {
												icon : 'fa-tachometer',
												state : 'dashboards',
												label : 'Dashboards'
											}, {
												icon : 'fa-file-o',
												state : 'ViewChart',
												label : 'Adgas Sensor Data'
											},

											]
										};

										var timeStamp;
										var sensorValue;
										$scope.names = [];
										var errorEncountered = false;
										$http({
											url : "WinDataController",
											method : "GET",
											headers : {
												'Content-Type' : 'text/html'
											}
										})
												.success(
														function(data) {
															document
																	.getElementsByTagName("html")[0].className = "";
															var datas = String(data.results);
															var array = datas
																	.split(",");
															for (var i = 0; i < array.length; i++) {
																$scope.names
																		.push(array[i]);
															}
														})
												.error(
														function(error) {

															document
																	.getElementsByTagName("html")[0].className = "";
															alert("Service is unavailable,please try after some time");
														});

										$scope.$watch('selectedName.length',
												function(length) {
													var valid = length <= 8;
													$scope.myForm.selectedName
															.$setValidity(
																	"maxLimit",
																	valid);
												});
										$scope.setDB = function(db)
										{
											console.log(db);
											if(db == 'timeseries')
												{
												$scope.selectedDB = 'timeseries';
												
												}
											else
												{
												console.log(db);
												$scope.selectedDB = 'postgres';
												
												}
											
										}
										$scope.GetData = function(x, y, z) {
											var selectedTagNames = [];
											// debugger;
											document.getElementsByTagName("html")[0].className = "loading";
											$scope.chartTitle = "";
											var select = $scope.selectedName;
											var result = [];
											for (var i = 0; i < select.length; i++) {
												selectedTagNames
														.push(select[i]);
											}
											var countTagName = 0;
											timeStamp = [];
											var seriesOptions = [];
											var jsontext;
											var db =  $scope.selectedDB;
											//console.log(db);
											var keepGoing = true;
											angular
													.forEach(															
															selectedTagNames,
															function(item) {
																if(keepGoing)
																	{
																var param = "";
																param = item
																		+ "?starttime="
																		+ y
																		+ "&taglimit="
																		+ z;
																var finalData = [];
																var sensorValue = [];

																$http(
																		{
																			url : "SelectedWinDataController",
																			method : "GET",
																			params : {
																				winParam : param,
																				dbName : db
																			},
																			headers : {
																				'Content-Type' : 'text/html'
																			}
																		})
																		.success(
																				function(
																						data) {

																					var i = 0;
																					if ($scope.chartTitle == "") {
																						$scope.chartTitle = item;// data.tags[0].name;
																					} else {
																						$scope.chartTitle = $scope.chartTitle
																								+ ","
																								+ item;// data.tags[0].name;
																					}
																					for (i = 0; i < data.tags[0].results[0].values.length; i++) {
																						finalData
																								.push(data.tags[0].results[0].values[i]);
																					}

																					setTimeout(
																							function() {
																								document.getElementsByTagName("html")[0].className = "";
																							},
																							5000);

																					angular
																							.forEach(
																									finalData,
																									function(
																											item) {

																										var d = new Date(
																												item[0]), dformat = [
																												d
																														.getMonth() + 1,
																												d
																														.getDate(),
																												d
																														.getFullYear() ]
																												.join('/')
																												+ ' '
																												+ [
																														d
																																.getHours(),
																														d
																																.getMinutes(),
																														d
																																.getSeconds(),
																														d
																																.getMilliseconds() ]
																														.join(':');

																										if (timeStamp
																												.indexOf(dformat) == -1) {
																											timeStamp
																													.push(dformat);
																										}
																										sensorValue
																												.push(item[1]);

																									});
																					switch (countTagName) {
																					case 0:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',
																							/*fillColor : {
																								linearGradient : [
																										0,
																										0,
																										0,
																										300 ],
																								stops : [
																										[
																												0,
																												'rgb(129, 184, 237)' ],
																										[
																												1,
																												'rgba(255,255,255,.25)' ] ]
																							},*/
																							color : "#81b8ed",

																						}
																						break;
																					case 1:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',
																							/*fillColor : {
																								linearGradient : [
																										0,
																										0,
																										0,
																										300 ],
																								stops : [
																										[
																												0,
																												'rgb(255, 128, 255)' ],
																										[
																												1,
																												'rgba(0,0,0,.25)' ] ]
																							},*/
																							color : "#ff80ff",

																						}
																						break;
																					case 2:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',
																							/*fillColor : {
																								linearGradient : [
																										0,
																										0,
																										0,
																										300 ],
																								stops : [
																										[
																												0,
																												'rgb(255, 128, 0)' ],
																										[
																												1,
																												'rgba(255,255,255,.25)' ] ],

																							},*/
																							color : "orange",
																						}
																						break;
																					case 3:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',																							
																							color : "maroon",
																						}
																						break;
																					case 4:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',																							
																							color : "red",
																						}
																						break;
																					case 5:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',																							
																							color : "black",
																						}
																						break;
																					case 6:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',																							
																							color : "yellow",
																						}
																						break;
																					case 7:
																						seriesOptions[countTagName] = {
																							name : item,
																							data : sensorValue,
																							type : 'line',
																							
																							color : "green",
																						}
																						break;
																					}
																					// console.log(data);
																					countTagName++;
																					var chart = new Highcharts.Chart(
																							// $('#container').highcharts(
																							{
																								chart : {

																									renderTo : 'container'
																								},
																								title : {
																									text : $scope.chartTitle,
																									x : -20
																								// center
																								},

																								xAxis : {
																									title : {
																										text : 'Time stamp'
																									},
																									categories : timeStamp
																								},
																								yAxis : {
																									title : {
																										text : 'Sensor Values'
																									},
																									plotLines : [ {
																										value : 0,
																										width : 1,
																										color : '#808080'
																									} ]
																								},
																								

																								legend : {
																									layout : 'vertical',
																									align : 'right',
																									verticalAlign : 'middle',
																									borderWidth : 0
																								},
																								series : seriesOptions

																							});

																				})
																		.error(
																				function(error) {
																					document.getElementsByTagName("html")[0].className = "";
																					keepGoing=false;
																					alert("Please try after some time");
																				});

															}}
															);

										}

									} ]);

			//Set on window for debugging
			window.predixApp = predixApp;

			//Return the application  object
			return predixApp;
		});

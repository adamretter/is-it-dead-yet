(function () {

  /**
   * Extracts the link and rel components from a HTTP Link Header
   * returns an array of {link: x, rel: y}
   */
  function extractLinkHeaderRefs(linkHeader) {
    var regexp = /^<(.+)>;\srel="(.+)"$/;
    var parts = linkHeader.split(", ");
    return parts.map(function(part) { return regexp.exec(part); }).map(function(linkRel) {
    	return {
          "link": linkRel[1],
          "rel": linkRel[2]
        }; 
    });
  }

  function extractLink(linkRels, rel) {
    return _.propertyOf(_.chain(linkRels)
      .filter(function(linkRel) { return linkRel.rel == rel; })
      .first()
      .value()
    )('link');
  }

  function extractPageNum(s) {
    var regexp = /page=([0-9]+)/;
    return regexp.exec(s)[1];
  }

  var app = angular.module('iidyApp', ['chart.js', 'ui.bootstrap', 'angular-underscore']);

  app.controller("LineCtrl", function ($scope, $http) {

    //$http.get('https://api.github.com/repos/exist-db/exist/issues?state=all&sort=created&direction=asc').success(function(data) {
    //  alert(data[0].created_at);
    //});

    $http({
      method: 'GET',
      url: 'https://api.github.com/repos/exist-db/exist/issues?state=all&sort=created&direction=asc'
    }).then(
      function successCallback(response) {
        var linkHeader = response.headers("Link");
        //TODO(AR) what if there is no Link header?
        var linkRels = extractLinkHeaderRefs(linkHeader);
        var nextLink = extractLink(linkRels, "next");
        var lastLink = extractLink(linkRels, "last");
	//TODO(AR) what if nextLink lastLink are null?
        var nextPage = extractPageNum(nextLink);
        var lastPage = extractPageNum(lastLink);
        console.log(nextPage + "/" + lastPage);
      },
      function errorCallback(response) {
        alert(response);
      }
    );

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Open', 'Replied', 'Closed'];
    $scope.data = [
      [65, 70, 80, 81, 91, 101, 150],
      [60, 60, 75, 79, 91, 91, 97],
      [28, 40, 40, 62, 70, 81, 82]
    ];
    $scope.colours = [
      '#F7464A',  // red
      '#FDB45C',  // yellow 
      '#46BFBD'   // green
    ],
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
  });
})();

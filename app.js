var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
        templateUrl: "signup.html",
        controller: "SignupController"
      }).when("/login", {
      templateUrl: "login.html",
      controller: "LoginController"
    }).when("/dashboard", {
      templateUrl: "dashboard.html",
      controller:"DashboardController"
    }).when("/Question", {
      templateUrl: "QuestionPage.html",
      controller: "QuestionController"
    }).when('/previousScores',{
      templateUrl:"previousScores.html",
      controller:"QuestionController"
    })
    .otherwise({
      templateUrl: "signup.html",
      controller: "SignupController"
    });
});

//Controllers
app.controller("LoginController", function($scope, $location, $http) {
    $scope.login = function() {
      // Fetch user data from JSON file or server-side endpoint
      $http.get("users.json").then(function(response) {
        var users = response.data.users;
        console.log($scope.user.emailLogin);

        var flag=true;
        for(let obj of users){
          // console.log(obj.email+">>>>"+$scope.user.emailLogin);
          if(obj.email==$scope.user.emailLogin && obj.password===$scope.user.passwordlogin){
            alert("Sucess");
            flag=false;
            $location.path("/dashboard");
            }
        }
        if(flag){
            alert("Failed");
        }
    })};
  });
  
  app.controller("SignupController", function($scope, $location, $http) {
    $scope.signup = function() {
      $http.get("users.json").then(function(response) {
        var users = response.data;
            $http({
            method:'POST',
            url:("http://localhost:3000/users"),
            data:$scope.user
        }).then(function (response) {
          alert("Signup successful");
            console.log(response);
             $location.path("/login");
        },function(error) {
            console.log(error)
        })

            
            // Redirect to login page
            
          });
        }   });



        //QuestionCOntroller
        app.controller("QuestionController", function($scope,$rootScope,$location,$route, $http) {
          

          let StartQuiz=function(){
            console.log('clicked');
            $location.path("/Question");
          }

            $scope.questions=[];
            $scope.choice1="choice1";
            $scope.choice2="choice1";
            $scope.choice3="choice1";
            $scope.choice4="choice1";
            $scope.score=0;
            $scope.current=5;
            $scope.total=5;
            $scope.showScore=false;
            $rootScope.scoresArray=[1,2,3];

            var vm=this;
            vm.triviaData = [];

            // Make the API request
            $http({
              method: 'GET',
              url: 'https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple', // Adjust the URL and parameters as needed
            }).then(function(response) {
              // Success callback
              vm.triviaData = response.data.results;
              $scope.questions = vm.triviaData.map(function(result) {
              var options = result.incorrect_answers;
              options.push(result.correct_answer);
              return {
                question: result.question,
                options: options,
                correctAnswer: result.correct_answer,
                selectedOption: '',
                isAnswerCorrect: false
              };
            });
            }, function(error) {
              // Error callback
              console.log(error);
            });
            
            //changed
            $scope.checkAnswer = function(question) {
              question.isAnswerCorrect = (question.selectedOption === question.correctAnswer);
            };

            $scope.choiceclicked=function(choice){
              if(choice==vm.triviaData[0].correct_answer){
                console.log("Your answer was correct:"+choice+$scope.$index);
                $scope.isClicked=true;
                $scope.score++;
              }
              else console.log("Incorrect answer:"+choice);
            }

            $scope.SubmitQuiz=function(){
              $scope.score=0;
              console.log('clicked');
              for(let i=0;i<5;i++){
                var question=$scope.questions[i];
                console.log(question.selectedOption+"....."+question.correctAnswer);
                if(question.selectedOption===question.correctAnswer){
                  $scope.score++;
                }
              }
              alert("Your Score is:"+$scope.score);
              $scope.scoresArray.push($scope.score);
              $location.path("/previousScores");
            }
            
          });


          app.controller("DashboardController", function($scope,$location, $http) {

            $scope.StartQuiz=function(){
              // console.log('clicked');
            $location.path("/Question");
            }
          })
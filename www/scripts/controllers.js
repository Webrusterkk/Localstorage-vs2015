(function () {
    angular.module('starter').controller('OverviewController', 'NFController', ['$scope', '$ionicModal', '$ionicPlatform', 'BirthdayService', '$cordovaSQLite', OverviewController, NFController]);

    function OverviewController($scope, $ionicModal, $ionicPlatform, birthdayService) {
        var vm = this;

        // Initialize the database.
        $ionicPlatform.ready(function () {
            birthdayService.initDB();

            // Get all birthday records from the database.
            birthdayService.getAllBirthdays().then(function (birthdays) {
                vm.birthdays = birthdays;
            });
        });

        // Initialize the modal view.
        $ionicModal.fromTemplateUrl('add-or-edit-birthday.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        vm.showAddBirthdayModal = function () {
            $scope.birthday = {};
            $scope.action = 'Add';
            $scope.isAdd = true;
            $scope.modal.show();
        };

        vm.showEditBirthdayModal = function (birthday) {
            $scope.birthday = birthday;
            $scope.action = 'Edit';
            $scope.isAdd = false;
            $scope.modal.show();
        };

        $scope.saveBirthday = function () {
            if ($scope.isAdd) {
                birthdayService.addBirthday($scope.birthday);
            } else {
                birthdayService.updateBirthday($scope.birthday);
            }
            $scope.modal.hide();
        };

        $scope.deleteBirthday = function () {
            birthdayService.deleteBirthday($scope.birthday);
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        return vm;
    }

    function NFController($scope, $cordovaSQLite) {

        $scope.save = function(newMessage) {

            // execute INSERT statement with parameter
            $cordovaSQLite.execute(db, 'INSERT INTO Messages (message) VALUES (?)', [newMessage])
                .then(function(result) {
                    $scope.statusMessage = "Message saved successful, cheers!";
                }, function(error) {
                    $scope.statusMessage = "Error on saving: " + error.message;
                })

        }

        $scope.load = function() {

            // Execute SELECT statement to load message from database.
            $cordovaSQLite.execute(db, 'SELECT * FROM Messages ORDER BY id DESC')
                .then(
                    function(res) {

                        if (res.rows.length > 0) {

                            $scope.newMessage = res.rows.item(0).message;
                            $scope.statusMessage = "Message loaded successful, cheers!";
                        }
                    },
                    function(error) {
                        $scope.statusMessage = "Error on loading: " + error.message;
                    }
                );
        }

    }
})();

//angular.module('starter.controllers', [])
//.controller('OverviewController', function ($scope, $ionicModal, $ionicPlatform, birthdayService) {
//    var vm = this;
//    // Initialize the database.
//    $ionicPlatform.ready(function () {
//        birthdayService.initDB();
//        // Get all birthday records from the database.
//        birthdayService.getAllBirthdays().then(function (birthdays) {
//            vm.birthdays = birthdays;
//        });
//    });

//    // Initialize the modal view.
//    $ionicModal.fromTemplateUrl('add-or-edit-birthday.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//    }).then(function (modal) {
//        $scope.modal = modal;
//    });

//    vm.showAddBirthdayModal = function () {
//        $scope.birthday = {};
//        $scope.action = 'Add';
//        $scope.isAdd = true;
//        $scope.modal.show();
//    };

//    vm.showEditBirthdayModal = function (birthday) {
//        $scope.birthday = birthday;
//        $scope.action = 'Edit';
//        $scope.isAdd = false;
//        $scope.modal.show();
//    };

//    $scope.saveBirthday = function () {
//        if ($scope.isAdd) {
//            birthdayService.addBirthday($scope.birthday);
//        } else {
//            birthdayService.updateBirthday($scope.birthday);
//        }
//        $scope.modal.hide();
//    };

//    $scope.deleteBirthday = function () {
//        birthdayService.deleteBirthday($scope.birthday);
//        $scope.modal.hide();
//    };

//    $scope.$on('$destroy', function () {
//        $scope.modal.remove();
//    });

//    return vm;

//});
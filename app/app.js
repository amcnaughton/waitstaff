angular.module('waitstaff', ['ngMessages', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/templates/home.html',
                controller: 'waitstaffController as vm'
            })
            .when('/new-meal', {
                templateUrl: 'app/templates/new-meal.html',
                controller: 'waitstaffController as vm'
            })
            .when('/my-earnings', {
                templateUrl: 'app/templates/my-earnings.html',
                controller: 'waitstaffController as vm'
            })
    }])
    .controller('waitstaffController', ['$scope', '$rootScope', function($scope, $rootScope) {

        var vm = this;

        // calculate customer invoice
        function calculateCustomerInvoice(data) {

            var invoice = {};
            var mealTax = data.mealPrice * (data.mealTaxRate / 100);

            invoice.customerSubtotal = data.mealPrice + mealTax;
            invoice.customerTip = invoice.customerSubtotal * (data.mealTipPercentage / 100);
            invoice.customerTotal = invoice.customerSubtotal + invoice.customerTip;

            return invoice;
        }

        // update user stats
        function calculateEarnings(data) {

            data.earnings.myMealCount++;
            data.earnings.myTipTotal += data.customerTip;
            data.earnings.myAverageTip = data.earnings.myTipTotal / data.earnings.myMealCount;

            return data.earnings;
        }

        // initialize earnings
        function initEarnings() {

            var earnings = {};
            earnings.myTipTotal = earnings.myMealCount = earnings.myAverageTip = 0;

            return earnings;
        }

        // initialize customer invoice
        function initCustomerInvoice() {

            var invoice = {};
            invoice.customerSubtotal = invoice.customerTip = invoice.customerTotal = 0;

            return invoice;
        }

        // process meal details
        vm.calculate = function() {

            // calculate customer invoice
            $rootScope.invoice = calculateCustomerInvoice({
                'mealPrice': vm.mealPrice,
                'mealTaxRate': vm.mealTaxRate,
                'mealTipPercentage': vm.mealTipPercentage
            });

            // update user stats
            $rootScope.earnings = calculateEarnings({
                'customerTip': $rootScope.invoice.customerTip,
                'earnings': $rootScope.earnings
            });
        }

        // clear meal details
        vm.clearMealDetails = function() {
            vm.mealPrice = vm.mealTaxRate = vm.mealTipPercentage = '';

            // reset the Angular form
            if ($scope.mealDetails) {
                $scope.mealDetails.$setPristine();
            }
        }

        //  reset the app
        vm.reset = function() {

            $rootScope.invoice = initCustomerInvoice();
            $rootScope.earnings = initEarnings();

            vm.clearMealDetails();

            $rootScope.initialized = true;
        }

        if (!$rootScope.initialized)
            vm.reset(true);
    }]);

angular.module('waitstaff', ['ngMessages'])
    .controller('waitstaffController', ['$scope', function($scope) {

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
            vm.invoice = calculateCustomerInvoice({
                'mealPrice': vm.mealPrice,
                'mealTaxRate': vm.mealTaxRate,
                'mealTipPercentage': vm.mealTipPercentage
            });

            // update user stats
            vm.earnings = calculateEarnings({
                'customerTip': vm.invoice.customerTip,
                'earnings': vm.earnings
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

            vm.invoice = initCustomerInvoice();
            vm.earnings = initEarnings();

            vm.clearMealDetails();
        }

        vm.reset();
    }]);

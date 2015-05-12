function loadAmounts() {
  var point = '.';
  var comma = ',';
  var amounts_values = [];
  //var _amounts_map = new Map();

  return {
    _bookings: [],
    _categories: [],
    _amounts_map: {},
    _total_amount: 0,

    $get: function (lodash) {
      return {
        _amounts: {},

        initAmountMap: function () {
          this._amounts_map = new Map();
        },
        setBookings: function (bookings) {
          this._bookings = bookings;
        },
        setCategories: function (categories) {
          this._categories = categories;
        },
        getAllAmounts: function () {
          //var bookings = $scope.bookings;
          //var categories = $scope.categories;
          amounts_values = [];
          this._amounts_map.clear();

          if (this._bookings.length == 0) {
            this._categories.forEach(function (element, index, array) {
              this._amounts_map.set(element['name'], 0);
              this._total_amount = 0;
            });
          } else {
            this._categories.forEach(function (celement, cindex, carray) {
              this._bookings.forEach(function (belement, bindex, barray) {
                if (celement['name'] === belement['category_name']) {
                  var amount = this._amounts_map.get(celement['name']) === undefined ? 0 : this._amounts_map.get(celement['name']);
                  this._amounts_map.set(celement['name'], amount + belement.amount);
                } else {
                  this._amounts_map.set(celement['name'], 0);
                }
              }.bind(this));
            }.bind(this));

            for (var value of this._amounts_map.values()) {
              console.log(value);
              amounts_values.push(value);
            }

            this._total_amount = lodash.reduce(lodash.values(amounts_values), function (sum, n) {
              return sum + n;
            });
          }

          for (var entry of this._amounts_map.entries()) {
            console.log(entry[0] + " = " + entry[1]);
            this._amounts[entry[0]] = entry[1];
          }

          return this._amounts;
          //$scope.total_amount = total_amount.toString().replace(point, comma);
        },

        getTotalAmount: function () {
          return this._total_amount;
        }
      }
    }
  }
}


/**
 * @ngdoc provider
 * @name hausverwaltungAngularApp.amountsProvider
 * @description
 * # amountsService
 * Service in the hausverwaltungAngularApp.
 */
angular.module('hausverwaltungAngularApp')
  .provider('amountsService', loadAmounts);

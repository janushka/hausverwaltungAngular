'use strict';

function dbManager() {
  var db;
  var dbName;
  var dummyData = false;

  return {
    setDbName: function (name) {
      dbName = name;
    },

    shouldSetDummyData: function (flag) {
      dummyData = flag;
    },

    $get: function ($rootScope, pouchDB, lodash) {
      return {
        _bookings: [],
        _categories: [],
        _total_amount: 0,
        _amounts_map: {},
        _amounts_values: [],
        _amounts: {},

        initDb: function () {
          // AngularJS will instantiate a singleton by calling "new" on this function
          db = pouchDB('hvDB');
          db.info()
            .then(function (info) {
              console.log('DB ' + info.db_name + ' created!');
            })
            .catch(function (error) {
              console.log('DB creation failed: ' + error);
            });

          if (dummyData) {
            db.post({
              name: 'Essen',
              description: 'Alles was das Essen außerhalb des Hauses angeht.',
              type: 'category'
            }).then(function (categ) {
              return db.get(categ.id)
            }).then(function (categ) {
              return db.post({
                amount: parseFloat(12.5),
                date: moment('01.04.2015', "DD-MM-YYYY").toISOString(),
                category_id: categ._id,
                category_name: categ.name,
                remark: 'Sadri Reis (Persien)',
                type: 'booking'
              })
            }).then(function () {
              return db.post({name: 'Kleidungen', description: 'Hemden und Hosen.', type: 'category'});
            }).then(function (categ) {
              return db.get(categ.id)
            }).then(function (categ) {
              return db.bulkDocs([
                {
                  amount: parseFloat(65),
                  date: moment('01.04.2015', "DD-MM-YYYY").toISOString(),
                  category_id: categ._id,
                  category_name: categ.name,
                  remark: 'Ralph Lauren Hemd.',
                  type: 'booking'
                },
                {
                  amount: parseFloat(90),
                  date: moment('01.04.2015', "DD-MM-YYYY").toISOString(),
                  category_id: categ._id,
                  category_name: categ.name,
                  remark: 'Lacoste Polo.',
                  type: 'booking'
                }
              ]);
            }).catch(function (error) {

            });
          }
        },

        createDesignDocs: function () {
          // design doc for booking documents
          var design_doc = {
            _id: '_design/index',
            views: {
              booking_index: {
                map: function mapFun(doc) {
                  // sort by date, category_name, amount and type
                  if (doc.type === 'booking') {
                    emit([doc.date, doc.category_name, doc.amount, doc.type]);
                  }
                }.toString()
              },
              booking_by_date_index: {
                map: function mapFun(doc) {
                  // sort by date, category_name, amount and type
                  if (doc.type === 'booking' && doc.date) {
                    emit(Date.parse(doc.date), doc.category_name, doc.amount, doc.type);
                  }
                }.toString()
              },
              some_booking_complex_index: {
                map: function mapFun(doc) {
                  // sort by date, category_name, amount and type
                  if (doc.type === 'booking') {
                    emit([Date.parse(doc.date), doc.fixed_expense, doc.type]);
                  }
                }.toString()
              },
              some_booking_index: {
                map: function mapFun(doc) {
                  // sort by date, category_name, amount and type
                  if (doc.type === 'booking' && doc.category_id) {
                    emit(doc.category_id);
                  }
                }.toString()
              },
              category_index: {
                map: function mapFun(doc) {
                  // sort by name and type
                  if (doc.type === 'category') {
                    emit([doc.name, doc.type]);
                  }
                }.toString()
              },
              amounts_index: {
                map: function mapFun(doc) {
                  // sort by name and type
                  if (doc.type === 'category') {
                    emit([doc.name, doc.type]);
                  }
                }.toString()
              }
            }
          };

          // save the design doc
          db.put(design_doc).catch(function (err) {
            if (err.status !== 409) {
              throw err;
            }
            // ignore if doc already exists
          });
        },

        // INIT //

        listenToDb: function () {
          var changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true
          }).on('change', function (change) {
            console.log(JSON.stringify(change));
            this.getAllCategories().then(function (categories) {
              this.setAllCategories(categories);
              $rootScope.categories = categories;
              $rootScope.amounts = this.getAmounts();
              $rootScope.total_amount = this.getTotalAmount();
            }.bind(this));
            this.getAllBookings().then(function (bookings) {
              this.setAllBookings(bookings);
              $rootScope.bookings = bookings;
              $rootScope.amounts = this.getAmounts();
              $rootScope.total_amount = this.getTotalAmount();
            }.bind(this));
          }.bind(this)).on('complete', function (info) {
            console.log(JSON.stringify(info));
          }).on('error', function (err) {
            console.log(err);
          });
        },

        // BOOKINGS //

        getBookings: function () {
          return this._bookings;
        },

        getAllBookings: function () {
          return db.query('index/booking_index', {
            include_docs: true
          }).then(function (bookings) {
            for (var i = 0; i < bookings.rows.length; i++) {
              //console.log(Date.parse(bookings.rows[i]['doc']['date']));
              bookings.rows[i]['doc']['date'] = moment(Date.parse(bookings.rows[i]['doc']['date'])).format('DD.MM.YYYY');
            }
            var tempBookings = lodash.pluck(bookings.rows, 'doc');
            //console.log('Getting bookings...\n' + JSON.stringify(tempBookings));
            return tempBookings;
          }).catch(function (err) {
            console.log('The getAllBookings-ERROR: ' + err);
            return err;
          });
        },

        getBookingsByDate: function (beginn, end) {
          console.log('Begin = ' + beginn + ' / End = ' + end);
          return db.query('index/booking_by_date_index', {
            startkey: beginn,
            endkey: end,
            include_docs: true
          }).then(function (bookings) {
            for (var i = 0; i < bookings.rows.length; i++) {
              bookings.rows[i]['doc']['date'] = moment(Date.parse(bookings.rows[i]['doc']['date'])).format('DD.MM.YYYY');
            }
            var tempBookings = lodash.pluck(bookings.rows, 'doc');
            return tempBookings;
          }).catch(function (err) {
            console.log('The getBookingsByDate-ERROR: ' + err);
            return err;
          });
        },

        monthFixedExpensesExist: function () {
          //console.log('Begin = ' + beginn + ' / End = ' + end);
          var b_date = moment(new Date()).startOf('month').toDate().getTime();
          var e_date = moment(new Date()).startOf('month').toDate().getTime();

          return db.query('index/some_booking_complex_index', {
            startkey: [b_date, true, 'booking'],
            endkey: [e_date, true, 'booking'],
            include_docs: true
          }).then(function (bookings) {
            // Todo: make the difference between rows and without rows attribute!
            if (bookings.rows.length == 0) {
              return false;
            } else {
              return true;
            }
          }).catch(function (err) {
            console.log('The currentMonthFixedExpenses-ERROR: ' + err);
            return err;
          });
        },

        setAllBookings: function (bookings) {
          this._bookings = bookings;
        },

        createMonthFixedExpenses: function () {
          db.put({
            '_id': 'cat_fixkosten',
            'name': 'Fixkosten',
            'beschreibung': 'Monatliche Fixkosten.',
            type: 'category'
          })
            .then(function (result) {
              console.log('Result: ' + result);
            }).catch(function (err) {
              console.log('Error: ' + err);
            });

          db.get('cat_fixkosten')
            .then(function (category) {
              return category;
            }).then(function (category) {
              return db.bulkDocs([
                {
                  amount: 575,
                  date: moment(new Date()).startOf('month').toDate(),
                  category_id: category._id,
                  category_name: category.name,
                  remark: 'Miete',
                  fixed_expense: true,
                  type: 'booking'
                },
                {
                  amount: 91,
                  date: moment(new Date()).startOf('month').toDate(),
                  category_id: category._id,
                  category_name: category.name,
                  remark: 'DEW - Strom und Wasser',
                  fixed_expense: true,
                  type: 'booking'
                },
                {
                  amount: 250,
                  date: moment(new Date()).startOf('month').toDate(),
                  category_id: category._id,
                  category_name: category.name,
                  remark: 'Riester Rente',
                  fixed_expense: true,
                  type: 'booking'
                }
              ]);
            }
          );

          /*db.post({
           name: 'Essen',
           description: 'Alles was das Essen außerhalb des Hauses angeht.',
           type: 'category'
           }).then(function (categ) {
           return db.get(categ.id)
           }).then(function (categ) {
           return db.post({
           amount: parseFloat(12.5),
           date: moment('01.04.2015', "DD-MM-YYYY").toISOString(),
           category_id: categ._id,
           category_name: categ.name,
           remark: 'Sadri Reis (Persien)',
           type: 'booking'
           })
           }).then(function () {
           return db.post({name: 'Kleidungen', description: 'Hemden und Hosen.', type: 'category'});
           }).then(function (categ) {
           return db.get(categ.id)
           }).then(function (categ) {
           return db.bulkDocs([
           {
           amount: parseFloat(65),
           date: moment('01.04.2015', "DD-MM-YYYY").toISOString(),
           category_id: categ._id,
           category_name: categ.name,
           remark: 'Ralph Lauren Hemd.',
           type: 'booking'
           },
           {
           amount: parseFloat(90),
           date: moment('01.04.2015', "DD-MM-YYYY").toISOString(),
           category_id: categ._id,
           category_name: categ.name,
           remark: 'Lacoste Polo.',
           type: 'booking'
           }
           ]);
           }).catch(function (error) {

           });*/
        },

        createBooking: function (booking) {
          var point = '.';
          var comma = ',';

          booking.amount = parseFloat(booking.amount.toString().replace(comma, point));
          return db.post(booking).then(function (booking) {
            return booking.id;
          }).catch(function (error) {
            return 'Booking creation failed!';
          });
        },

        updateBooking: function (booking) {
          return db.get(booking.id).then(function (r_booking) {
            var point = '.';
            var comma = ',';

            r_booking.amount = parseFloat(booking.amount.toString().replace(comma, point));
            r_booking.category_id = booking.category_id;
            r_booking.category_name = booking.category_name;
            //r_booking.date = moment(booking.date, "DD-MM-YYYY").toISOString();
            r_booking.date = booking.date;
            r_booking.remark = booking.remark;
            return db.put(r_booking);
          }).then(function (response) {
            return response.id;
          }).catch(function (err) {
            console.log('ERROR (Update-Booking): ' + err);
          });
        },

        deleteBooking: function (booking) {
          return db.get(booking.id)
            .then(function (r_booking) {
              return db.remove(r_booking);
            })
            .then(function (result) {
              return result.ok;
            }).catch(function (err) {
              console.log('ERROR (Delete-Booking): ' + err);
            });
        },

        // CATEGORIES //

        getCategories: function () {
          return this._categories;
        },


        getAllCategories: function () {
          return db.query('index/category_index', {
            include_docs: true
          }).then(function (categories) {
            var tempCategories = lodash.pluck(categories.rows, 'doc');
            return tempCategories;
          }).catch(function (err) {
            console.log('The getAllCategories-ERROR: ' + err);
            return err;
          });
        },

        setAllCategories: function (categories) {
          this._categories = categories;
        },

        createCategory: function (category) {
          category._id = 'cat_' + category.name.toLowerCase();
          return db.put(category).then(function (category) {
            return category.id;
          }).catch(function (error) {
            return error;
          });
        },

        updateCategory: function (category) {
          return db.get(category.id).then(function (r_category) {
            r_category.name = category.name;
            r_category.description = category.description;
            return db.put(r_category);
          }).then(function (response) {
            return db.query('index/some_booking_index', {
              key: category.id,
              include_docs: true
            })
          }).catch(function (err) {
            console.log('FINDING-ERROR: ' + err);
            return;
          }).then(function (bookings) {
            //console.log('The uptodate bookings: ' + JSON.stringify(bookings.rows));
            var bookings_to_update = lodash.pluck(bookings.rows, 'doc');
            for (var i = 0; i < bookings_to_update.length; i++) {
              bookings_to_update[i]._id = bookings_to_update[i]._id;
              bookings_to_update[i].category_id = category.id;
              bookings_to_update[i].category_name = category.name;
            }
            return db.bulkDocs(bookings_to_update);
          }).catch(function (err) {
            console.log('Update-Category-ERROR: ' + err);
            return;
          }).then(function (response) {
            //console.log('Update-Booking-RESULT: ' + JSON.stringify(response));
            return 'ok';
          });
        },

        deleteCategory: function (category) {
          return db.get(category.id)
            .then(function (r_category) {
              return db.remove(r_category);
            })
            .then(function (result) {
              return result.ok;
            }).catch(function (err) {
              console.log('ERROR (Delete-Category): ' + err);
            });
        },

        // AMOUNTS //

        initObjects: function () {
          this._amounts_map = new Map();
          this._amounts_values = new Array();
          this._amounts = new Object();
        },

        getAmounts: function () {
          this._amounts_map.clear();
          this._amounts_values.length = 0;
          this._total_amount = 0;

          if (this._bookings.length == 0) {
            this._categories.forEach(function (element, index, array) {
              this._amounts_map.set(element['name'], 0);
              this._total_amount = 0;
            }.bind(this));
          } else {
            this._categories.forEach(function (celement, cindex, carray) {
              this._amounts_map.set(celement['name'], 0);
            }.bind(this));
            /*else {
             this._amounts_map.set(celement['name'], 0);
             }*/
            this._bookings.forEach(function (belement, bindex, barray) {
              this._categories.forEach(function (celement, cindex, carray) {
                if (celement['name'] === belement['category_name']) {
                  var amount = this._amounts_map.get(celement['name']) === undefined ? 0 : this._amounts_map.get(celement['name']);
                  this._amounts_map.set(celement['name'], amount + belement.amount);
                }
              }.bind(this));
            }.bind(this));

            for (var value of this._amounts_map.values()) {
              console.log(value);
              this._amounts_values.push(value);
            }

            this._total_amount = lodash.reduce(lodash.values(this._amounts_values), function (sum, n) {
              return sum + n;
            });
          }

          for (var entry of this._amounts_map.entries()) {
            console.log(entry[0] + " = " + entry[1]);
            this._amounts[entry[0]] = entry[1];
          }

          return this._amounts;
        },

        getTotalAmount: function () {
          return this._total_amount;
        },

        // MIX-INS
        isCategoryAssignedToBooking: function (category) {
          var type_name = lodash.result(lodash.find(this._bookings, {'category_id': category.id}), 'type');
          if (type_name === undefined) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }
}

/**
 * @ngdoc provider
 * @name hausverwaltungAngularApp.dbProvider
 * @description
 * # dbService
 * Service in the hausverwaltungAngularApp.
 */
angular.module('hausverwaltungAngularApp')
  .provider('dbService', dbManager);

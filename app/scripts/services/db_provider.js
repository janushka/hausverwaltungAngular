'use strict';

function dbManager() {
  var db;
  var dbName;
  var dummyData = false;

  return {
    _bookings: [],
    _categories: [],

    setDbName: function (name) {
      dbName = name;
    },

    shouldSetDummyData: function (flag) {
      dummyData = flag;
    },

    $get: function (pouchDB, lodash) {
      return {
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

        // BOOKINGS //

        getBookings: function () {
          return this._bookings;
        },

        getAllBookings: function () {
          return db.query('index/booking_index', {
            include_docs: true
          }).then(function (bookings) {
            for (var i = 0; i < bookings.rows.length; i++) {
              bookings.rows[i]['doc']['date'] = moment(Date.parse(bookings.rows[i]['doc']['date'])).format('DD.MM.YYYY');
            }
            let tempBookings = lodash.pluck(bookings.rows, 'doc');
            //console.log('Getting bookings...\n' + JSON.stringify(tempBookings));
            return tempBookings;
          }).catch(function (err) {
            console.log('The getAllBookings-ERROR: ' + err);
            return err;
          });
        },

        setAllBookings: function (bookings) {
          this._bookings = bookings;
        },

        createBooking: function (booking) {
          let point = '.';
          let comma = ',';

          booking.amount = parseFloat(booking.amount.toString().replace(comma, point));
          //booking.date = moment(booking.date, "DD-MM-YYYY").toISOString();
          return db.post(booking).then(function (booking) {
            return booking.id;
          }).catch(function (error) {
            return 'Booking creation failed!';
          });
        },

        updateBooking: function (booking) {
          return db.get(booking.id).then(function (r_booking) {
            let point = '.';
            let comma = ',';

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
            let tempCategories = lodash.pluck(categories.rows, 'doc');
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
          return db.post(category).then(function (category) {
            return category.id;
          }).catch(function (error) {
            return 'Category creation failed!';
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

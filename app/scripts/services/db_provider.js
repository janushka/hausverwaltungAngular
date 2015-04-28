'use strict';

function dbManager () {
    var db;
    var dbName;
    var dummyData = false;

    var test = function() {
      return null;
    };

    return {
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

                getAllBookings: function () {
                    return db.query('index/booking_index', {
                        include_docs: true
                    }).then(function (bookings) {
                        for (var i = 0; i < bookings.rows.length; i++) {
                            bookings.rows[i]['doc']['date'] = moment(Date.parse(bookings.rows[i]['doc']['date'])).format('DD.MM.YYYY');
                        }
                        let tempBookings = lodash.pluck(bookings.rows, 'doc');
                        return tempBookings;
                    }).catch(function (err) {
                        console.log('The getAllBookings-ERROR: ' + err);
                        return err;
                    });
                },

                // CATEGORIES //

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

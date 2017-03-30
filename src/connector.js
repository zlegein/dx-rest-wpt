'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

var _brakes = require('brakes');
var webPageTest = require('webpagetest');
var lodash = require('lodash');
var retry = require('retry');

const wpt = new webPageTest('https://www.webpagetest.org', 'A.8eb836f531f7040290d2bd6e5f70fae4');

exports.default = class {
    constructor() {
        console.log("Hello");
    }

    runTest(appId, location) {
        return {
            options: {
                name: 'WebPageTestRunTest',
                waitThreshold: 0,
                timeout: 60000
            },
            promise: (appId, location) => new Promise(function(resolve, reject) {
                console.log(`Running test for app ${appId}`);
                wpt.runTest(`https://twitter.com/marcelduran`, {location: 'Dulles:Firefox', pingback: 'http://54.68.115.228:9000/finish', }, (err, result) => {
                    if(err) reject(err);
                    console.log(result);
                    resolve(result)
                });
            })
        }
    }

    getTestResults(testId) {
        return {
            options: {
                name: 'WebPageTestGetTestResults',
                waitThreshold: 0
            },
            promise: (testId) => new Promise(function(resolve, reject) {
                console.log(`get page speed data for test ${testId}`);
                wpt.getTestResults(testId, (err, result) => {
                    if(err) reject(err);
                    resolve(result)
                });
            })
        }
    }

    getLocations(filter) {
        return {
            options: {
                name: 'WebPageTestGetLocations',
                waitThreshold: 0
            },
            promise: (appId) => new Promise(function(resolve, reject) {
                console.log(`Here we are ${appId}`);
                wpt.getLocations((err, result) => {
                    if(err) reject(err);
                    let locations = lodash.filter(result.response.data.location, function(location) {
                        return lodash.includes(location.id, filter)
                    });
                    resolve(locations)
                });
            })
        }
    }

    getTestStatusRetry(testId) {
        return {
            options: {
                name: 'WebPageTestGetTestStatus',
                waitThreshold: 0,
                timeout: 60000
            },
            promise: (testId) => new Promise(function (resolve, reject) {
                console.log(`get test status ${testId}`);
                let operation = retry.operation();
                operation.attempt(function (currentAttempt) {
                    console.log(currentAttempt);
                    let promise = new Promise(function (res, rej) {
                        wpt.getTestStatus(testId, (err, result) => {
                            if (err) {
                                rej(err)
                            }
                            if (result.statusCode != 200) {
                                rej(result.statusText);
                            }
                            res(result)
                        });
                    });
                    promise.then((result) => {
                        console.log("resolve");
                        resolve(result);
                    })
                    .catch(err => {
                        if (operation.retry(err)) {
                            console.log(err);
                        }
                    });
                })
            })
        }
    }

    getTestStatus(testId) {
        return {
            options: {
                name: 'WebPageTestGetTestStatus',
                waitThreshold: 0
            },
            promise: (testId) => new Promise(function (resolve, reject) {
                wpt.getTestStatus(testId, (err, result) => {
                    if(err) reject(err);
                    resolve(result)
                });
            })
        }
    }

    async run(appId) {
        let runTestFn = this.runTest(appId);
        return await new _brakes(runTestFn.promise, runTestFn.options).exec(appId);
    }

    async locations(filter) {
        let locationFn = this.getLocations(filter);
        return await new _brakes(locationFn.promise, locationFn.options).exec(filter);
    }

    async status(testId) {
        let getTestStatusFn = this.getTestStatus(testId);
        return await new _brakes(getTestStatusFn.promise, getTestStatusFn.options).exec(testId);
    }

    async results(testId) {
        let getPageSpeedDataFn = this.getTestResults(testId);
        return await new _brakes(getPageSpeedDataFn.promise, getPageSpeedDataFn.options).exec(testId);
    }
}

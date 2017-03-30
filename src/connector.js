'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

var _brakes = require('brakes');
var webPageTest = require('webpagetest');
var lodash = require('lodash');
var retry = require('retry');
var requestPromise = require('request-promise');

const wpt = new webPageTest('https://www.webpagetest.org', 'A.8eb836f531f7040290d2bd6e5f70fae4');

exports.default = class {
    constructor() {
        console.log("Hello");
    }

    runTest(appId, commit) {
        return {
            options: {
                name: 'WebPageTestRunTest',
                waitThreshold: 0,
                timeout: 60000
            },
            promise: (appId, commit) => new Promise(function(resolve, reject) {
                console.log(`Running test for ${appId} for commit ${commit}`);
                wpt.runTest(appId, {location: 'Dulles:Firefox', pingback: `http://54.68.115.228:9000/results/${commit}`, }, (err, result) => {
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
                console.log(`Get results for test ${testId}`);
                wpt.getTestResults(testId, (err, result) => {
                    if(err) reject(err);
                    resolve(result)
                });
            })
        }
    }

    // getLocations(filter) {
    //     return {
    //         options: {
    //             name: 'WebPageTestGetLocations',
    //             waitThreshold: 0
    //         },
    //         promise: (appId) => new Promise(function(resolve, reject) {
    //             console.log(`Here we are ${appId}`);
    //             wpt.getLocations((err, result) => {
    //                 if(err) reject(err);
    //                 let locations = lodash.filter(result.response.data.location, function(location) {
    //                     return lodash.includes(location.id, filter)
    //                 });
    //                 resolve(locations)
    //             });
    //         })
    //     }
    // }

    getTestStatus(testId) {
        return {
            options: {
                name: 'WebPageTestGetTestStatus',
                waitThreshold: 0
            },
            promise: (testId) => new Promise(function (resolve, reject) {
                console.log(`Get status for test ${testId}`);
                wpt.getTestStatus(testId, (err, result) => {
                    if(err) reject(err);
                    resolve(result)
                });
            })
        }
    }

    tagTestResults(testId, commit) {
        console.log(`Tagging ${commit} with test ${testId}`);
        let rp = requestPromise;
        return {
            options: {
                name: 'WebPageTestGetTestStatus',
                waitThreshold: 0
            },
            promise: (testId) => rp({
                method: "POST",
                uri: `https://api.bitbucket.org/2.0/repositories/zlegein/dx-rest-wpt/refs/tags`,
                headers: {
                    'Authorization': 'Basic emxlZ2VpbjpQYWthbDBsMA=='
                },
                body: {
                    "name" : `${testId}`,
                    "target" : {
                        "hash" : `${commit}`
                    }
                },
                json: true
            })
        }
    }

    async run(appId, commit) {
        let call = this.runTest(appId, commit);
        return await new _brakes(call.promise, call.options).exec(appId, commit);
    }

    async locations(filter) {
        let call = this.getLocations(filter);
        return await new _brakes(call.promise, call.options).exec(filter);
    }

    async status(testId) {
        let call = this.getTestStatus(testId);
        return await new _brakes(call.promise, call.options).exec(testId);
    }

    async results(testId, commit) {
        let call = this.getTestResults(testId);
        let results = await new _brakes(call.promise, call.options).exec(testId);
        console.log(results);
        return await this.tag(testId, commit)
    }

    async tag(testId, commit) {
        let call = this.tagTestResults(testId, commit);
        let results = await new _brakes(call.promise, call.options).exec(testId, commit);
        console.log(results);
        return results;
    }
}

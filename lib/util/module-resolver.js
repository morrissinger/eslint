/**
 * @fileoverview Implements the Node.js require.resolve algorithm
 * @author Nicholas C. Zakas
 * @copyright 2016 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var lodash = require("lodash"),
    Module = require("module");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

var DEFAULT_OPTIONS = {
    lookupPaths: module.paths.concat()
};


function ModuleResolver(options) {
    options = options || {};

    this.options = lodash.assign({}, DEFAULT_OPTIONS, options);
}

ModuleResolver.prototype = {

    resolve: function(name, extraLookupPath) {

        /*
         * First, clone the lookup paths so we're not messing things up for
         * subsequent calls to this function. Then, move the extraLookupPath to the
         * top of the lookup paths list so it will be searched first.
         */
        var lookupPaths = this.options.lookupPaths.concat();
        lookupPaths.unshift(extraLookupPath);

        /**
         * Module._findPath is an internal method to Node.js, then one they use to
         * lookup file paths when require() is called. So, we are hooking into the
         * exact same logic that Node.js uses.
         */
        var result = Module._findPath(name, lookupPaths);
        if (!result) {
            throw new Error("Could not find '" + name +"' relative to '" + extraLookupPath + "'.");
        }

        return result;

    }

};



//------------------------------------------------------------------------------
// Public API
//------------------------------------------------------------------------------

module.exports = ModuleResolver;

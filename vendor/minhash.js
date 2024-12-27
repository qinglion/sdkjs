/**
 * The MIT License
 *
 * Copyright (c) 2010-2018 Douglas Duhaime http://douglasduhaime.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Minhash = function(config) {

    this.mapWords = {};
		this.count = 0;
    this.update = function(aCodes) {
        ++this.count;
        const text = String.fromCharCode.apply(String, aCodes);
				if (!this.mapWords[text]) {
					this.mapWords[text] = 0;
				}
	    this.mapWords[text] += 1;
    };

    this.diff = function(other) {
			let shared = 0;
			for (let i in this.mapWords) {
				if (other.mapWords[i]) {
					shared += Math.min(other.mapWords[i], this.mapWords[i]);
				}
			}
			return other.count + this.count - 2 * shared;
    };
};

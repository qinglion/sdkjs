(function (window) {

	function InitClassWithStatics(fClass, fBase, nType) {
		AscFormat.InitClass(fClass, fBase, nType);

		Object.getOwnPropertyNames(fBase).forEach(function (prop) {
			if (['prototype', 'name', 'length'].includes(prop) || Function.prototype.hasOwnProperty(prop)) { return; }
			Object.defineProperty(fClass, prop, Object.getOwnPropertyDescriptor(fBase, prop));
		});
		fClass.base = fBase;
		fClass.prototype.initialize = fClass;
	}

	var CollisionDetection = {
		findItemBoundsCollisions: function (items1, items2, tolerance) {
			function getBounds(items) {
				var bounds = new Array(items.length);
				for (var i = 0; i < items.length; i++) {
					var rect = items[i].getBounds();
					bounds[i] = [rect.getLeft(), rect.getTop(), rect.getRight(), rect.getBottom()];
				}
				return bounds;
			}

			var bounds1 = getBounds(items1),
				bounds2 = !items2 || items2 === items1
					? bounds1
					: getBounds(items2);
			return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
		},

		findCurveBoundsCollisions: function (curves1, curves2, tolerance, bothAxis) {
			function getBounds(curves) {
				var min = Math.min,
					max = Math.max,
					bounds = new Array(curves.length);
				for (var i = 0; i < curves.length; i++) {
					var v = curves[i];
					bounds[i] = [
						min(v[0], v[2], v[4], v[6]),
						min(v[1], v[3], v[5], v[7]),
						max(v[0], v[2], v[4], v[6]),
						max(v[1], v[3], v[5], v[7])
					];
				}
				return bounds;
			}

			var bounds1 = getBounds(curves1),
				bounds2 = !curves2 || curves2 === curves1
					? bounds1
					: getBounds(curves2);
			if (bothAxis) {
				var hor = this.findBoundsCollisions(
					bounds1, bounds2, tolerance || 0, false, true),
					ver = this.findBoundsCollisions(
						bounds1, bounds2, tolerance || 0, true, true),
					list = [];
				for (var i = 0, l = hor.length; i < l; i++) {
					list[i] = { hor: hor[i], ver: ver[i] };
				}
				return list;
			}
			return this.findBoundsCollisions(bounds1, bounds2, tolerance || 0);
		},

		findBoundsCollisions: function (boundsA, boundsB, tolerance,
			sweepVertical, onlySweepAxisCollisions) {
			var self = !boundsB || boundsA === boundsB,
				allBounds = self ? boundsA : boundsA.concat(boundsB),
				lengthA = boundsA.length,
				lengthAll = allBounds.length;

			function binarySearch(indices, coord, value) {
				var lo = 0,
					hi = indices.length;
				while (lo < hi) {
					var mid = (hi + lo) >>> 1;
					if (allBounds[indices[mid]][coord] < value) {
						lo = mid + 1;
					} else {
						hi = mid;
					}
				}
				return lo - 1;
			}

			var pri0 = sweepVertical ? 1 : 0,
				pri1 = pri0 + 2,
				sec0 = sweepVertical ? 0 : 1,
				sec1 = sec0 + 2;
			var allIndicesByPri0 = new Array(lengthAll);
			for (var i = 0; i < lengthAll; i++) {
				allIndicesByPri0[i] = i;
			}
			allIndicesByPri0.sort(function (i1, i2) {
				return allBounds[i1][pri0] - allBounds[i2][pri0];
			});
			var activeIndicesByPri1 = [],
				allCollisions = new Array(lengthA);
			for (var i = 0; i < lengthAll; i++) {
				var curIndex = allIndicesByPri0[i],
					curBounds = allBounds[curIndex],
					origIndex = self ? curIndex : curIndex - lengthA,
					isCurrentA = curIndex < lengthA,
					isCurrentB = self || !isCurrentA,
					curCollisions = isCurrentA ? [] : null;
				if (activeIndicesByPri1.length) {
					var pruneCount = binarySearch(activeIndicesByPri1, pri1,
						curBounds[pri0] - tolerance) + 1;
					activeIndicesByPri1.splice(0, pruneCount);
					if (self && onlySweepAxisCollisions) {
						curCollisions = curCollisions.concat(activeIndicesByPri1);
						for (var j = 0; j < activeIndicesByPri1.length; j++) {
							var activeIndex = activeIndicesByPri1[j];
							allCollisions[activeIndex].push(origIndex);
						}
					} else {
						var curSec1 = curBounds[sec1],
							curSec0 = curBounds[sec0];
						for (var j = 0; j < activeIndicesByPri1.length; j++) {
							var activeIndex = activeIndicesByPri1[j],
								activeBounds = allBounds[activeIndex],
								isActiveA = activeIndex < lengthA,
								isActiveB = self || activeIndex >= lengthA;

							if (
								onlySweepAxisCollisions ||
								(
									isCurrentA && isActiveB ||
									isCurrentB && isActiveA
								) && (
									curSec1 >= activeBounds[sec0] - tolerance &&
									curSec0 <= activeBounds[sec1] + tolerance
								)
							) {
								if (isCurrentA && isActiveB) {
									curCollisions.push(
										self ? activeIndex : activeIndex - lengthA);
								}
								if (isCurrentB && isActiveA) {
									allCollisions[activeIndex].push(origIndex);
								}
							}
						}
					}
				}
				if (isCurrentA) {
					if (boundsA === boundsB) {
						curCollisions.push(curIndex);
					}
					allCollisions[curIndex] = curCollisions;
				}
				if (activeIndicesByPri1.length) {
					var curPri1 = curBounds[pri1],
						index = binarySearch(activeIndicesByPri1, pri1, curPri1);
					activeIndicesByPri1.splice(index + 1, 0, curIndex);
				} else {
					activeIndicesByPri1.push(curIndex);
				}
			}
			for (var i = 0; i < allCollisions.length; i++) {
				var collisions = allCollisions[i];
				if (collisions) {
					collisions.sort(function (i1, i2) { return i1 - i2; });
				}
			}
			return allCollisions;
		}
	};

	var Numerical = new function () {

		var abscissas = [
			[0.5773502691896257645091488],
			[0, 0.7745966692414833770358531],
			[0.3399810435848562648026658, 0.8611363115940525752239465],
			[0, 0.5384693101056830910363144, 0.9061798459386639927976269],
			[0.2386191860831969086305017, 0.6612093864662645136613996, 0.9324695142031520278123016],
			[0, 0.4058451513773971669066064, 0.7415311855993944398638648, 0.9491079123427585245261897],
			[0.1834346424956498049394761, 0.5255324099163289858177390, 0.7966664774136267395915539, 0.9602898564975362316835609],
			[0, 0.3242534234038089290385380, 0.6133714327005903973087020, 0.8360311073266357942994298, 0.9681602395076260898355762],
			[0.1488743389816312108848260, 0.4333953941292471907992659, 0.6794095682990244062343274, 0.8650633666889845107320967, 0.9739065285171717200779640],
			[0, 0.2695431559523449723315320, 0.5190961292068118159257257, 0.7301520055740493240934163, 0.8870625997680952990751578, 0.9782286581460569928039380],
			[0.1252334085114689154724414, 0.3678314989981801937526915, 0.5873179542866174472967024, 0.7699026741943046870368938, 0.9041172563704748566784659, 0.9815606342467192506905491],
			[0, 0.2304583159551347940655281, 0.4484927510364468528779129, 0.6423493394403402206439846, 0.8015780907333099127942065, 0.9175983992229779652065478, 0.9841830547185881494728294],
			[0.1080549487073436620662447, 0.3191123689278897604356718, 0.5152486363581540919652907, 0.6872929048116854701480198, 0.8272013150697649931897947, 0.9284348836635735173363911, 0.9862838086968123388415973],
			[0, 0.2011940939974345223006283, 0.3941513470775633698972074, 0.5709721726085388475372267, 0.7244177313601700474161861, 0.8482065834104272162006483, 0.9372733924007059043077589, 0.9879925180204854284895657],
			[0.0950125098376374401853193, 0.2816035507792589132304605, 0.4580167776572273863424194, 0.6178762444026437484466718, 0.7554044083550030338951012, 0.8656312023878317438804679, 0.9445750230732325760779884, 0.9894009349916499325961542]
		];

		var weights = [
			[1],
			[0.8888888888888888888888889, 0.5555555555555555555555556],
			[0.6521451548625461426269361, 0.3478548451374538573730639],
			[0.5688888888888888888888889, 0.4786286704993664680412915, 0.2369268850561890875142640],
			[0.4679139345726910473898703, 0.3607615730481386075698335, 0.1713244923791703450402961],
			[0.4179591836734693877551020, 0.3818300505051189449503698, 0.2797053914892766679014678, 0.1294849661688696932706114],
			[0.3626837833783619829651504, 0.3137066458778872873379622, 0.2223810344533744705443560, 0.1012285362903762591525314],
			[0.3302393550012597631645251, 0.3123470770400028400686304, 0.2606106964029354623187429, 0.1806481606948574040584720, 0.0812743883615744119718922],
			[0.2955242247147528701738930, 0.2692667193099963550912269, 0.2190863625159820439955349, 0.1494513491505805931457763, 0.0666713443086881375935688],
			[0.2729250867779006307144835, 0.2628045445102466621806889, 0.2331937645919904799185237, 0.1862902109277342514260976, 0.1255803694649046246346943, 0.0556685671161736664827537],
			[0.2491470458134027850005624, 0.2334925365383548087608499, 0.2031674267230659217490645, 0.1600783285433462263346525, 0.1069393259953184309602547, 0.0471753363865118271946160],
			[0.2325515532308739101945895, 0.2262831802628972384120902, 0.2078160475368885023125232, 0.1781459807619457382800467, 0.1388735102197872384636018, 0.0921214998377284479144218, 0.0404840047653158795200216],
			[0.2152638534631577901958764, 0.2051984637212956039659241, 0.1855383974779378137417166, 0.1572031671581935345696019, 0.1215185706879031846894148, 0.0801580871597602098056333, 0.0351194603317518630318329],
			[0.2025782419255612728806202, 0.1984314853271115764561183, 0.1861610000155622110268006, 0.1662692058169939335532009, 0.1395706779261543144478048, 0.1071592204671719350118695, 0.0703660474881081247092674, 0.0307532419961172683546284],
			[0.1894506104550684962853967, 0.1826034150449235888667637, 0.1691565193950025381893121, 0.1495959888165767320815017, 0.1246289712555338720524763, 0.0951585116824927848099251, 0.0622535239386478928628438, 0.0271524594117540948517806]
		];

		var abs = Math.abs,
			sqrt = Math.sqrt,
			pow = Math.pow,
			log2 = Math.log2 || function (x) {
				return Math.log(x) * Math.LOG2E;
			},
			EPSILON = 1e-12,
			MACHINE_EPSILON = 1.12e-16;

		function clamp(value, min, max) {
			return value < min ? min : value > max ? max : value;
		}

		function getDiscriminant(a, b, c) {
			function split(v) {
				var x = v * 134217729,
					y = v - x,
					hi = y + x,
					lo = v - hi;
				return [hi, lo];
			}

			var D = b * b - a * c,
				E = b * b + a * c;
			if (abs(D) * 3 < E) {
				var ad = split(a),
					bd = split(b),
					cd = split(c),
					p = b * b,
					dp = (bd[0] * bd[0] - p + 2 * bd[0] * bd[1]) + bd[1] * bd[1],
					q = a * c,
					dq = (ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0])
						+ ad[1] * cd[1];
				D = (p - q) + (dp - dq);
			}
			return D;
		}

		function getNormalizationFactor() {
			var norm = Math.max.apply(Math, arguments);
			return norm && (norm < 1e-8 || norm > 1e8)
				? pow(2, -Math.round(log2(norm)))
				: 0;
		}

		return {
			EPSILON: EPSILON,
			MACHINE_EPSILON: MACHINE_EPSILON,
			CURVETIME_EPSILON: 1e-8,
			GEOMETRIC_EPSILON: 1e-7,
			TRIGONOMETRIC_EPSILON: 1e-8,
			ANGULAR_EPSILON: 1e-5,
			KAPPA: 4 * (sqrt(2) - 1) / 3,

			isZero: function (val) {
				return val >= -EPSILON && val <= EPSILON;
			},

			isMachineZero: function (val) {
				return val >= -MACHINE_EPSILON && val <= MACHINE_EPSILON;
			},

			clamp: clamp,

			integrate: function (f, a, b, n) {
				var x = abscissas[n - 2],
					w = weights[n - 2],
					A = (b - a) * 0.5,
					B = A + a,
					i = 0,
					m = (n + 1) >> 1,
					sum = n & 1 ? w[i++] * f(B) : 0;
				while (i < m) {
					var Ax = A * x[i];
					sum += w[i++] * (f(B + Ax) + f(B - Ax));
				}
				return A * sum;
			},

			findRoot: function (f, df, x, a, b, n, tolerance) {
				for (var i = 0; i < n; i++) {
					var fx = f(x),
						dx = fx / df(x),
						nx = x - dx;
					if (abs(dx) < tolerance) {
						x = nx;
						break;
					}
					if (fx > 0) {
						b = x;
						x = nx <= a ? (a + b) * 0.5 : nx;
					} else {
						a = x;
						x = nx >= b ? (a + b) * 0.5 : nx;
					}
				}
				return clamp(x, a, b);
			},

			solveQuadratic: function (a, b, c, roots, min, max) {
				var x1, x2 = Infinity;
				if (abs(a) < EPSILON) {
					if (abs(b) < EPSILON)
						return abs(c) < EPSILON ? -1 : 0;
					x1 = -c / b;
				} else {
					b *= -0.5;
					var D = getDiscriminant(a, b, c);
					if (D && abs(D) < MACHINE_EPSILON) {
						var f = getNormalizationFactor(abs(a), abs(b), abs(c));
						if (f) {
							a *= f;
							b *= f;
							c *= f;
							D = getDiscriminant(a, b, c);
						}
					}
					if (D >= -MACHINE_EPSILON) {
						var Q = D < 0 ? 0 : sqrt(D),
							R = b + (b < 0 ? -Q : Q);
						if (R === 0) {
							x1 = c / a;
							x2 = -x1;
						} else {
							x1 = R / a;
							x2 = c / R;
						}
					}
				}
				var count = 0,
					boundless = min == null,
					minB = min - EPSILON,
					maxB = max + EPSILON;
				if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB))
					roots[count++] = boundless ? x1 : clamp(x1, min, max);
				if (x2 !== x1
					&& isFinite(x2) && (boundless || x2 > minB && x2 < maxB))
					roots[count++] = boundless ? x2 : clamp(x2, min, max);
				return count;
			},

			solveCubic: function (a, b, c, d, roots, min, max) {
				var f = getNormalizationFactor(abs(a), abs(b), abs(c), abs(d)),
					x, b1, c2, qd, q;
				if (f) {
					a *= f;
					b *= f;
					c *= f;
					d *= f;
				}

				function evaluate(x0) {
					x = x0;
					var tmp = a * x;
					b1 = tmp + b;
					c2 = b1 * x + c;
					qd = (tmp + b1) * x + c2;
					q = c2 * x + d;
				}

				if (abs(a) < EPSILON) {
					a = b;
					b1 = c;
					c2 = d;
					x = Infinity;
				} else if (abs(d) < EPSILON) {
					b1 = b;
					c2 = c;
					x = 0;
				} else {
					evaluate(-(b / a) / 3);
					var t = q / a,
						r = pow(abs(t), 1 / 3),
						s = t < 0 ? -1 : 1,
						td = -qd / a,
						rd = td > 0 ? 1.324717957244746 * Math.max(r, sqrt(td)) : r,
						x0 = x - s * rd;
					if (x0 !== x) {
						do {
							evaluate(x0);
							x0 = qd === 0 ? x : x - q / qd / (1 + MACHINE_EPSILON);
						} while (s * x0 > s * x);
						if (abs(a) * x * x > abs(d / x)) {
							c2 = -d / x;
							b1 = (c2 - c) / x;
						}
					}
				}
				var count = Numerical.solveQuadratic(a, b1, c2, roots, min, max),
					boundless = min == null;
				if (isFinite(x) && (count === 0
					|| count > 0 && x !== roots[0] && x !== roots[1])
					&& (boundless || x > min - EPSILON && x < max + EPSILON))
					roots[count++] = boundless ? x : clamp(x, min, max);
				return count;
			}
		};
	};

	var UID = {
		_id: 1,
		_pools: {},

		get: function (name) {
			if (name) {
				var pool = this._pools[name];
				if (!pool)
					pool = this._pools[name] = { _id: 1 };
				return pool._id++;
			} else {
				return this._id++;
			}
		}
	};

	var Base = function Base() {
	};

	Base.prototype.clone = function () {
		return new this.constructor(this);
	};

	Base.each = function (obj, iter, bind) {
		if (obj) {
			const descriptor = Object.getOwnPropertyDescriptor(obj, 'length');
			const forIn = function (iter, bind) {
				for (let i in this) {
					if (this.hasOwnProperty(i))
						iter.call(bind, this[i], i, this);
				}
			};
			const iterFunction = descriptor && typeof descriptor.value === 'number' ? Array.prototype.forEach : forIn;
			iterFunction.call(obj, iter, bind = bind || obj);
		}
		return bind;
	};
	Base.isPlainObject = function (obj) {
		var ctor = obj != null && obj.constructor;
		return ctor && (ctor === Object || ctor === Base
			|| ctor.name === 'Object');
	};
	Base.pick = function (a, b) {
		return a !== undefined ? a : b;
	};
	Base.slice = function (list, begin, end) {
		return Array.prototype.slice.call(list, begin, end);
	};
	Base.equals = function (obj1, obj2) {
		if (obj1 === obj2)
			return true;
		if (obj1 && obj1.equals)
			return obj1.equals(obj2);
		if (obj2 && obj2.equals)
			return obj2.equals(obj1);
		if (obj1 && obj2
			&& typeof obj1 === 'object' && typeof obj2 === 'object') {
			if (Array.isArray(obj1) && Array.isArray(obj2)) {
				var length = obj1.length;
				if (length !== obj2.length)
					return false;
				while (length--) {
					if (!Base.equals(obj1[length], obj2[length]))
						return false;
				}
			} else {
				var keys = Object.keys(obj1),
					length = keys.length;
				if (length !== Object.keys(obj2).length)
					return false;
				while (length--) {
					var key = keys[length];
					if (!(obj2.hasOwnProperty(key)
						&& Base.equals(obj1[key], obj2[key])))
						return false;
				}
			}
			return true;
		}
		return false;
	};
	Base.read = function (list, start, options, amount) {
		if (this === Base) {
			var value = list[list.__index = start || list.__index || 0];
			list.__index++;
			return value;
		}
		var proto = this.prototype,
			readIndex = proto._readIndex,
			begin = start || readIndex && list.__index || 0,
			length = list.length,
			obj = list[begin];
		amount = amount || length - begin;
		if (obj instanceof this
			|| options && options.readNull && obj == null && amount <= 1) {
			if (readIndex)
				list.__index = begin + 1;
			return obj && options && options.clone ? obj.clone() : obj;
		}
		obj = Object.create(proto);
		if (readIndex)
			obj.__read = true;
		obj = obj.initialize.apply(obj, begin > 0 || begin + amount < length
			? Base.slice(list, begin, begin + amount)
			: list) || obj;
		if (readIndex) {
			list.__index = begin + obj.__read;
			var filtered = obj.__filtered;
			if (filtered) {
				list.__filtered = filtered;
				obj.__filtered = undefined;
			}
			obj.__read = undefined;
		}
		return obj;
	};
	Base.readList = function (list, start, options, amount) {
		var res = [],
			entry,
			begin = start || 0,
			end = amount ? begin + amount : list.length;
		for (var i = begin; i < end; i++) {
			res.push(Array.isArray(entry = list[i])
				? this.read(entry, 0, options)
				: this.read(list, i, options, 1));
		}
		return res;
	};
	Base.readNamed = function (list, name, start, options, amount) {
		var value = this.getNamed(list, name),
			hasValue = value !== undefined;
		if (hasValue) {
			var filtered = list.__filtered;
			if (!filtered) {
				var source = this.getSource(list);
				filtered = list.__filtered = Object.create(source);
				filtered.__unfiltered = source;
			}
			filtered[name] = undefined;
		}
		return this.read(hasValue ? [value] : list, start, options, amount);
	};
	Base.readSupported = function (list, dest) {
		var source = this.getSource(list),
			that = this,
			read = false;
		if (source) {
			Object.keys(source).forEach(function (key) {
				if (key in dest) {
					var value = that.readNamed(list, key);
					if (value !== undefined) {
						dest[key] = value;
					}
					read = true;
				}
			});
		}
		return read;
	};
	Base.getNamed = function (list, name) {
		var source = this.getSource(list);
		if (source) {
			return name ? source[name] : list.__filtered || source;
		}
	};
	Base.hasNamed = function (list, name) {
		return !!this.getNamed(list, name);
	};
	Base.filter = function (dest, source, exclude, prioritize) {
		var processed;

		function handleKey(key) {
			if (!(exclude && key in exclude) &&
				!(processed && key in processed)) {
				var value = source[key];
				if (value !== undefined)
					dest[key] = value;
			}
		}

		if (prioritize) {
			var keys = {};
			for (var i = 0, key, l = prioritize.length; i < l; i++) {
				if ((key = prioritize[i]) in source) {
					handleKey(key);
					keys[key] = true;
				}
			}
			processed = keys;
		}

		Object.keys(source.__unfiltered || source).forEach(handleKey);
		return dest;
	};
	Base.isPlainValue = function (obj, asString) {
		return Base.isPlainObject(obj) || Array.isArray(obj) || asString && typeof obj === 'string';
	};
	Base.splice = function (list, items, index, remove) {
		var amount = items && items.length,
			append = index === undefined;
		index = append ? list.length : index;
		if (index > list.length)
			index = list.length;
		for (var i = 0; i < amount; i++)
			items[i]._index = index + i;
		if (append) {
			list.push.apply(list, items);
			return [];
		} else {
			var args = [index, remove];
			if (items)
				args.push.apply(args, items);
			var removed = list.splice.apply(list, args);
			for (var i = 0, l = removed.length; i < l; i++)
				removed[i]._index = undefined;
			for (var i = index + amount, l = list.length; i < l; i++)
				list[i]._index = i;
			return removed;
		}
	};

	var Point = function (arg0, arg1) {
		var type = typeof arg0,
			reading = this.__read,
			read = 0;
		if (type === 'number') {
			var hasY = typeof arg1 === 'number';
			this._set(arg0, hasY ? arg1 : arg0);
			if (reading)
				read = hasY ? 2 : 1;
		} else if (type === 'undefined' || arg0 === null) {
			this._set(0, 0);
			if (reading)
				read = arg0 === null ? 1 : 0;
		} else {
			var obj = type === 'string' ? arg0.split(/[\s,]+/) || [] : arg0;
			read = 1;
			if (Array.isArray(obj)) {
				this._set(+obj[0], +(obj.length > 1 ? obj[1] : obj[0]));
			} else if ('x' in obj) {
				this._set(obj.x || 0, obj.y || 0);
			} else if ('width' in obj) {
				this._set(obj.width || 0, obj.height || 0);
			} else if ('angle' in obj) {
				this._set(obj.length || 0, 0);
				this.setAngle(obj.angle || 0);
			} else {
				this._set(0, 0);
				read = 0;
			}
		}
		if (reading)
			this.__read = read;
		return this;
	};
	InitClassWithStatics(Point, Base);

	Point.prototype._readIndex = true;
	Point.prototype.set = Point;
	Point.prototype._set = function (x, y) {
		this.x = x;
		this.y = y;
		return this;
	};
	Point.prototype.equals = function (point) {
		return this === point || point
			&& (this.x === point.x && this.y === point.y
				|| Array.isArray(point)
				&& this.x === point[0] && this.y === point[1])
			|| false;
	};
	Point.prototype.clone = function () {
		return new Point(this.x, this.y);
	};
	Point.prototype.getLength = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	Point.prototype.getAngle = function () {
		return this.getAngleInRadians.apply(this, arguments) * 180 / Math.PI;
	};
	Point.prototype.setAngle = function (angle) {
		this.setAngleInRadians.call(this, angle * Math.PI / 180);
	};
	Point.prototype.getAngleInRadians = function () {
		if (!arguments.length) {
			return this.isZero()
				? this._angle || 0
				: this._angle = Math.atan2(this.y, this.x);
		} else {
			var point = Point.read(arguments),
				div = this.getLength() * point.getLength();
			if (Numerical.isZero(div)) {
				return NaN;
			} else {
				var a = this.dot(point) / div;
				return Math.acos(a < -1 ? -1 : a > 1 ? 1 : a);
			}
		}
	};
	Point.prototype.setAngleInRadians = function (angle) {
		this._angle = angle;
		if (!this.isZero()) {
			var length = this.getLength();
			this._set(
				Math.cos(angle) * length,
				Math.sin(angle) * length
			);
		}
	};
	Point.prototype.getDirectedAngle = function () {
		var point = Point.read(arguments);
		return Math.atan2(this.cross(point), this.dot(point)) * 180 / Math.PI;
	};
	Point.prototype.getDistance = function () {
		var args = arguments,
			point = Point.read(args),
			x = point.x - this.x,
			y = point.y - this.y,
			d = x * x + y * y,
			squared = Base.read(args);
		return squared ? d : Math.sqrt(d);
	};
	Point.prototype.normalize = function (length) {
		if (length === undefined)
			length = 1;
		var current = this.getLength(),
			scale = current !== 0 ? length / current : 0,
			point = new Point(this.x * scale, this.y * scale);
		if (scale >= 0)
			point._angle = this._angle;
		return point;
	};
	Point.prototype.rotate = function (angle, center) {
		if (angle === 0)
			return this.clone();
		angle = angle * Math.PI / 180;
		var point = center ? this.subtract(center) : this,
			sin = Math.sin(angle),
			cos = Math.cos(angle);
		point = new Point(
			point.x * cos - point.y * sin,
			point.x * sin + point.y * cos
		);
		return center ? point.add(center) : point;
	};
	Point.prototype.transform = function (matrix) {
		return matrix ? matrix._transformPoint(this) : this;
	};
	Point.prototype.add = function () {
		var point = Point.read(arguments);
		return new Point(this.x + point.x, this.y + point.y);
	};
	Point.prototype.subtract = function () {
		var point = Point.read(arguments);
		return new Point(this.x - point.x, this.y - point.y);
	};
	Point.prototype.multiply = function () {
		var point = Point.read(arguments);
		return new Point(this.x * point.x, this.y * point.y);
	};
	Point.prototype.divide = function () {
		var point = Point.read(arguments);
		return new Point(this.x / point.x, this.y / point.y);
	};
	Point.prototype.negate = function () {
		return new Point(-this.x, -this.y);
	};
	Point.prototype.isInside = function () {
		return Rectangle.read(arguments).contains(this);
	};
	Point.prototype.isClose = function () {
		var args = arguments,
			point = Point.read(args),
			tolerance = Base.read(args);
		return this.getDistance(point) <= tolerance;
	};
	Point.prototype.isCollinear = function () {
		var point = Point.read(arguments);
		return Point.isCollinear(this.x, this.y, point.x, point.y);
	};
	Point.prototype.isOrthogonal = function () {
		var point = Point.read(arguments);
		return Point.isOrthogonal(this.x, this.y, point.x, point.y);
	};
	Point.prototype.isZero = function () {
		var isZero = Numerical.isZero;
		return isZero(this.x) && isZero(this.y);
	};
	Point.prototype.isNaN = function () {
		return isNaN(this.x) || isNaN(this.y);
	};
	Point.prototype.dot = function () {
		var point = Point.read(arguments);
		return this.x * point.x + this.y * point.y;
	};
	Point.prototype.cross = function () {
		var point = Point.read(arguments);
		return this.x * point.y - this.y * point.x;
	};

	Point.isCollinear = function (x1, y1, x2, y2) {
		return Math.abs(x1 * y2 - y1 * x2)
			<= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
			* 1e-8;
	};
	Point.isOrthogonal = function (x1, y1, x2, y2) {
		return Math.abs(x1 * x2 + y1 * y2)
			<= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
			* 1e-8;
	};

	var LinkedPoint = function (x, y, owner, setter) {
		this._x = this.x = x;
		this._y = this.y = y;
		this._owner = owner;
		this._setter = setter;
	};
	InitClassWithStatics(LinkedPoint, Point);

	LinkedPoint.prototype._set = function (x, y, _dontNotify) {
		this._x = this.x = x;
		this._y = this.y = y;
		if (!_dontNotify)
			this._owner[this._setter](this);
		return this;
	};
	LinkedPoint.prototype.getX = function () {
		return this._x;
	};
	LinkedPoint.prototype.getY = function () {
		return this._y;
	};

	var Rectangle = function (arg0, arg1, arg2, arg3) {
		var args = arguments,
			type = typeof arg0,
			read;
		if (type === 'number') {
			this._set(arg0, arg1, arg2, arg3);
			read = 4;
		} else if (type === 'undefined' || arg0 === null) {
			this._set(0, 0, 0, 0);
			read = arg0 === null ? 1 : 0;
		} else if (args.length === 1) {
			if (Array.isArray(arg0)) {
				this._set.apply(this, arg0);
				read = 1;
			} else if (arg0.x !== undefined || arg0.width !== undefined) {
				this._set(arg0.x || 0, arg0.y || 0,
					arg0.width || 0, arg0.height || 0);
				read = 1;
			} else if (arg0.from === undefined && arg0.to === undefined) {
				this._set(0, 0, 0, 0);
				if (Base.readSupported(args, this)) {
					read = 1;
				}
			}
		}
		if (read === undefined) {
			var frm = Point.readNamed(args, 'from'),
				next = args[0],
				x = frm.x,
				y = frm.y,
				width,
				height;
			if (next && next.x !== undefined || Base.hasNamed(args, 'to')) {
				var to = Point.readNamed(args, 'to');
				width = to.x - x;
				height = to.y - y;
				if (width < 0) {
					x = to.x;
					width = -width;
				}
				if (height < 0) {
					y = to.y;
					height = -height;
				}
			} else {
				var size = Size.read(args);
				width = size.width;
				height = size.height;
			}
			this._set(x, y, width, height);
			read = args.__index;
		}
		var filtered = args.__filtered;
		if (filtered)
			this.__filtered = filtered;
		if (this.__read)
			this.__read = read;
		return this;
	};
	InitClassWithStatics(Rectangle, Base);

	Rectangle.prototype._readIndex = true;
	Rectangle.prototype._set = function (x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		return this;
	};
	Rectangle.prototype.clone = function () {
		return new Rectangle(this.x, this.y, this.width, this.height);
	};
	Rectangle.prototype.equals = function (rect) {
		var rt = Base.isPlainValue(rect)
			? Rectangle.read(arguments)
			: rect;
		return rt === this
			|| rt && this.x === rt.x && this.y === rt.y
			&& this.width === rt.width && this.height === rt.height
			|| false;
	};
	Rectangle.prototype.getPoint = function (_dontLink) {
		var ctor = _dontLink ? Point : LinkedPoint;
		return new ctor(this.x, this.y, this, 'setPoint');
	};
	Rectangle.prototype._fw = 1;
	Rectangle.prototype._fh = 1;
	Rectangle.prototype.getLeft = Rectangle.prototype.getX = function () {
		return this.x;
	};
	Rectangle.prototype.getTop = Rectangle.prototype.getY = function () {
		return this.y;
	};
	Rectangle.prototype.getRight = function () {
		return this.x + this.width;
	};
	Rectangle.prototype.getBottom = function () {
		return this.y + this.height;
	};
	Rectangle.prototype.getWidth = function () {
		return this.width;
	};
	Rectangle.prototype.getHeight = function () {
		return this.height;
	};
	Rectangle.prototype.getCenterX = function () {
		return this.getLeft() + this.getWidth() / 2;
	};
	Rectangle.prototype.setCenterX = function (x) {
		if (this._fw || this._sx === 0.5) {
			this.x = x - this.width / 2;
		} else {
			if (this._sx) {
				this.x += (x - this.x) * 2 * this._sx;
			}
			this.width = (x - this.x) * 2;
		}
		this._sx = 0.5;
		this._fw = 0;
	};
	Rectangle.prototype.getCenterY = function () {
		return this.getTop() + this.getHeight() / 2;
	};
	Rectangle.prototype.setCenterY = function (y) {
		if (this._fh || this._sy === 0.5) {
			this.y = y - this.height / 2;
		} else {
			if (this._sy) {
				this.y += (y - this.y) * 2 * this._sy;
			}
			this.height = (y - this.y) * 2;
		}
		this._sy = 0.5;
		this._fh = 0;
	};
	Rectangle.prototype.getCenter = function (_dontLink) {
		var ctor = _dontLink ? Point : LinkedPoint;
		return new ctor(this.getCenterX(), this.getCenterY(), this, 'setCenter');
	};
	Rectangle.prototype.setCenter = function () {
		var point = Point.read(arguments);
		this.setCenterX(point.x);
		this.setCenterY(point.y);
		return this;
	};
	Rectangle.prototype.getTopLeft = function (_dontLink) {
		var ctor = _dontLink ? Point : LinkedPoint;
		return new ctor(this['getLeft'](), this['getTop'](), this, 'setTopLeft');
	};
	Rectangle.prototype.getArea = function () {
		return this.width * this.height;
	};
	Rectangle.prototype.isEmpty = function () {
		return this.width === 0 || this.height === 0;
	};
	Rectangle.prototype.contains = function (arg) {
		return arg && arg.width !== undefined
			|| (Array.isArray(arg) ? arg : arguments).length === 4
			? this._containsRectangle(Rectangle.read(arguments))
			: this._containsPoint(Point.read(arguments));
	};
	Rectangle.prototype._containsPoint = function (point) {
		var x = point.x,
			y = point.y;
		return x >= this.x && y >= this.y
			&& x <= this.x + this.width
			&& y <= this.y + this.height;
	};
	Rectangle.prototype._containsRectangle = function (rect) {
		var x = rect.x,
			y = rect.y;
		return x >= this.x && y >= this.y
			&& x + rect.width <= this.x + this.width
			&& y + rect.height <= this.y + this.height;
	};
	Rectangle.prototype.intersects = function () {
		var rect = Rectangle.read(arguments),
			epsilon = Base.read(arguments) || 0;
		return rect.x + rect.width > this.x - epsilon
			&& rect.y + rect.height > this.y - epsilon
			&& rect.x < this.x + this.width + epsilon
			&& rect.y < this.y + this.height + epsilon;
	};
	Rectangle.prototype.intersect = function () {
		var rect = Rectangle.read(arguments),
			x1 = Math.max(this.x, rect.x),
			y1 = Math.max(this.y, rect.y),
			x2 = Math.min(this.x + this.width, rect.x + rect.width),
			y2 = Math.min(this.y + this.height, rect.y + rect.height);
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	};
	Rectangle.prototype.unite = function () {
		var rect = Rectangle.read(arguments),
			x1 = Math.min(this.x, rect.x),
			y1 = Math.min(this.y, rect.y),
			x2 = Math.max(this.x + this.width, rect.x + rect.width),
			y2 = Math.max(this.y + this.height, rect.y + rect.height);
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	};
	Rectangle.prototype.include = function () {
		var point = Point.read(arguments);
		var x1 = Math.min(this.x, point.x),
			y1 = Math.min(this.y, point.y),
			x2 = Math.max(this.x + this.width, point.x),
			y2 = Math.max(this.y + this.height, point.y);
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	};

	var LinkedRectangle = function Rectangle(x, y, width, height, owner, setter) {
		this._set(x, y, width, height, true);
		this._owner = owner;
		this._setter = setter;
	};
	InitClassWithStatics(LinkedRectangle, Rectangle);

	LinkedRectangle.prototype._set = function (x, y, width, height, _dontNotify) {
		this._x = this.x = x;
		this._y = this.y = y;
		this._width = this.width = width;
		this._height = this.height = height;
		if (!_dontNotify)
			this._owner[this._setter](this);
		return this;
	};
	LinkedRectangle.prototype.getX = function () {
		return this._x;
	};
	LinkedRectangle.prototype.getY = function () {
		return this._y;
	};
	LinkedRectangle.prototype.getWidth = function () {
		return this._width;
	};
	LinkedRectangle.prototype.getHeight = function () {
		return this._height;
	};
	LinkedRectangle.prototype.getLeft = LinkedRectangle.prototype.getX;
	LinkedRectangle.prototype.getTop = LinkedRectangle.prototype.getY;
	LinkedRectangle.prototype.getRight = function () { return this.getLeft() + this.getWidth(); };
	LinkedRectangle.prototype.getBottom = function () { return this.getTop() + this.getHeight(); };

	var Matrix = function Matrix(arg, _dontNotify) {
		var args = arguments,
			count = args.length,
			ok = true;
		if (count >= 6) {
			this._set.apply(this, args);
		} else if (count === 1 || count === 2) {
			if (arg instanceof Matrix) {
				this._set(arg._a, arg._b, arg._c, arg._d, arg._tx, arg._ty,
					_dontNotify);
			} else if (Array.isArray(arg)) {
				this._set.apply(this,
					_dontNotify ? arg.concat([_dontNotify]) : arg);
			} else {
				ok = false;
			}
		} else if (!count) {
			this.reset();
		} else {
			ok = false;
		}
		if (!ok) {
			throw new Error('Unsupported matrix parameters');
		}
		return this;
	};
	InitClassWithStatics(Matrix, Base);

	Matrix.prototype.set = Matrix;
	Matrix.prototype._set = function (a, b, c, d, tx, ty, _dontNotify) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
		this._tx = tx;
		this._ty = ty;
		if (!_dontNotify)
			this._changed();
		return this;
	};
	Matrix.prototype._changed = function () {
		var owner = this._owner;
		if (owner) {
			if (owner._applyMatrix) {
				owner.transform(null, true);
			} else {
				owner._changed(25);
			}
		}
	};
	Matrix.prototype.clone = function () {
		return new Matrix(this._a, this._b, this._c, this._d,
			this._tx, this._ty);
	};
	Matrix.prototype.equals = function (mx) {
		return mx === this || mx && this._a === mx._a && this._b === mx._b
			&& this._c === mx._c && this._d === mx._d
			&& this._tx === mx._tx && this._ty === mx._ty;
	};
	Matrix.prototype.reset = function (_dontNotify) {
		this._a = this._d = 1;
		this._b = this._c = this._tx = this._ty = 0;
		if (!_dontNotify)
			this._changed();
		return this;
	};
	Matrix.prototype.apply = function (recursively, _setApplyMatrix) {
		var owner = this._owner;
		if (owner) {
			owner.transform(null, Base.pick(recursively, true), _setApplyMatrix);
			return this.isIdentity();
		}
		return false;
	};
	Matrix.prototype.translate = function () {
		var point = Point.read(arguments),
			x = point.x,
			y = point.y;
		this._tx += x * this._a + y * this._c;
		this._ty += x * this._b + y * this._d;
		this._changed();
		return this;
	};
	Matrix.prototype.scale = function () {
		var args = arguments,
			scale = Point.read(args),
			center = Point.read(args, 0, { readNull: true });
		if (center)
			this.translate(center);
		this._a *= scale.x;
		this._b *= scale.x;
		this._c *= scale.y;
		this._d *= scale.y;
		if (center)
			this.translate(center.negate());
		this._changed();
		return this;
	};
	Matrix.prototype.rotate = function (angle) {
		angle *= Math.PI / 180;
		var center = Point.read(arguments, 1),
			x = center.x,
			y = center.y,
			cos = Math.cos(angle),
			sin = Math.sin(angle),
			tx = x - x * cos + y * sin,
			ty = y - x * sin - y * cos,
			a = this._a,
			b = this._b,
			c = this._c,
			d = this._d;
		this._a = cos * a + sin * c;
		this._b = cos * b + sin * d;
		this._c = -sin * a + cos * c;
		this._d = -sin * b + cos * d;
		this._tx += tx * a + ty * c;
		this._ty += tx * b + ty * d;
		this._changed();
		return this;
	};
	Matrix.prototype.shear = function () {
		var args = arguments,
			shear = Point.read(args),
			center = Point.read(args, 0, { readNull: true });
		if (center)
			this.translate(center);
		var a = this._a,
			b = this._b;
		this._a += shear.y * this._c;
		this._b += shear.y * this._d;
		this._c += shear.x * a;
		this._d += shear.x * b;
		if (center)
			this.translate(center.negate());
		this._changed();
		return this;
	};
	Matrix.prototype.skew = function () {
		var args = arguments,
			skew = Point.read(args),
			center = Point.read(args, 0, { readNull: true }),
			toRadians = Math.PI / 180,
			shear = new Point(Math.tan(skew.x * toRadians),
				Math.tan(skew.y * toRadians));
		return this.shear(shear, center);
	};
	Matrix.prototype.append = function (mx, _dontNotify) {
		if (mx) {
			var a1 = this._a,
				b1 = this._b,
				c1 = this._c,
				d1 = this._d,
				a2 = mx._a,
				b2 = mx._c,
				c2 = mx._b,
				d2 = mx._d,
				tx2 = mx._tx,
				ty2 = mx._ty;
			this._a = a2 * a1 + c2 * c1;
			this._c = b2 * a1 + d2 * c1;
			this._b = a2 * b1 + c2 * d1;
			this._d = b2 * b1 + d2 * d1;
			this._tx += tx2 * a1 + ty2 * c1;
			this._ty += tx2 * b1 + ty2 * d1;
			if (!_dontNotify)
				this._changed();
		}
		return this;
	};
	Matrix.prototype.prepend = function (mx, _dontNotify) {
		if (mx) {
			var a1 = this._a,
				b1 = this._b,
				c1 = this._c,
				d1 = this._d,
				tx1 = this._tx,
				ty1 = this._ty,
				a2 = mx._a,
				b2 = mx._c,
				c2 = mx._b,
				d2 = mx._d,
				tx2 = mx._tx,
				ty2 = mx._ty;
			this._a = a2 * a1 + b2 * b1;
			this._c = a2 * c1 + b2 * d1;
			this._b = c2 * a1 + d2 * b1;
			this._d = c2 * c1 + d2 * d1;
			this._tx = a2 * tx1 + b2 * ty1 + tx2;
			this._ty = c2 * tx1 + d2 * ty1 + ty2;
			if (!_dontNotify)
				this._changed();
		}
		return this;
	};
	Matrix.prototype.appended = function (mx) {
		return this.clone().append(mx);
	};
	Matrix.prototype.prepended = function (mx) {
		return this.clone().prepend(mx);
	};
	Matrix.prototype._shiftless = function () {
		return new Matrix(this._a, this._b, this._c, this._d, 0, 0);
	};
	Matrix.prototype._orNullIfIdentity = function () {
		return this.isIdentity() ? null : this;
	};
	Matrix.prototype.isIdentity = function () {
		return this._a === 1 && this._b === 0 && this._c === 0 && this._d === 1
			&& this._tx === 0 && this._ty === 0;
	};
	Matrix.prototype.isInvertible = function () {
		var det = this._a * this._d - this._c * this._b;
		return det && !isNaN(det) && isFinite(this._tx) && isFinite(this._ty);
	};
	Matrix.prototype.transform = function (src, dst, count) {
		return arguments.length < 3
			? this._transformPoint(Point.read(arguments))
			: this._transformCoordinates(src, dst, count);
	};
	Matrix.prototype._transformPoint = function (point, dest, _dontNotify) {
		var x = point.x,
			y = point.y;
		if (!dest)
			dest = new Point();
		return dest._set(
			x * this._a + y * this._c + this._tx,
			x * this._b + y * this._d + this._ty,
			_dontNotify);
	};
	Matrix.prototype._transformCoordinates = function (src, dst, count) {
		for (var i = 0, max = 2 * count; i < max; i += 2) {
			var x = src[i],
				y = src[i + 1];
			dst[i] = x * this._a + y * this._c + this._tx;
			dst[i + 1] = x * this._b + y * this._d + this._ty;
		}
		return dst;
	};
	Matrix.prototype._transformCorners = function (rect) {
		var x1 = rect.x,
			y1 = rect.y,
			x2 = x1 + rect.width,
			y2 = y1 + rect.height,
			coords = [x1, y1, x2, y1, x2, y2, x1, y2];
		return this._transformCoordinates(coords, coords, 4);
	};
	Matrix.prototype._transformBounds = function (bounds, dest, _dontNotify) {
		var coords = this._transformCorners(bounds),
			min = coords.slice(0, 2),
			max = min.slice();
		for (var i = 2; i < 8; i++) {
			var val = coords[i],
				j = i & 1;
			if (val < min[j]) {
				min[j] = val;
			} else if (val > max[j]) {
				max[j] = val;
			}
		}
		if (!dest)
			dest = new Rectangle();
		return dest._set(min[0], min[1], max[0] - min[0], max[1] - min[1],
			_dontNotify);
	};
	Matrix.prototype._inverseTransform = function (point, dest, _dontNotify) {
		var a = this._a,
			b = this._b,
			c = this._c,
			d = this._d,
			tx = this._tx,
			ty = this._ty,
			det = a * d - b * c,
			res = null;
		if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
			var x = point.x - this._tx,
				y = point.y - this._ty;
			if (!dest)
				dest = new Point();
			res = dest._set(
				(x * d - y * c) / det,
				(y * a - x * b) / det,
				_dontNotify);
		}
		return res;
	};
	Matrix.prototype.decompose = function () {
		var a = this._a,
			b = this._b,
			c = this._c,
			d = this._d,
			det = a * d - b * c,
			sqrt = Math.sqrt,
			atan2 = Math.atan2,
			degrees = 180 / Math.PI,
			rotate,
			scale,
			skew;
		if (a !== 0 || b !== 0) {
			var r = sqrt(a * a + b * b);
			rotate = Math.acos(a / r) * (b > 0 ? 1 : -1);
			scale = [r, det / r];
			skew = [atan2(a * c + b * d, r * r), 0];
		} else if (c !== 0 || d !== 0) {
			var s = sqrt(c * c + d * d);
			rotate = Math.asin(c / s) * (d > 0 ? 1 : -1);
			scale = [det / s, s];
			skew = [0, atan2(a * c + b * d, s * s)];
		} else {
			rotate = 0;
			skew = scale = [0, 0];
		}
		return {
			translation: this.getTranslation(),
			rotation: rotate * degrees,
			scaling: new Point(scale),
			skewing: new Point(skew[0] * degrees, skew[1] * degrees)
		};
	};
	Matrix.prototype.getValues = function () {
		return [this._a, this._b, this._c, this._d, this._tx, this._ty];
	};
	Matrix.prototype.getTranslation = function () {
		return new Point(this._tx, this._ty);
	};
	Matrix.prototype.getRotation = function () {
		return this.decompose().rotation;
	};

	var Line = function Line(arg0, arg1, arg2, arg3, arg4) {
		var asVector = false;
		if (arguments.length >= 4) {
			this._px = arg0;
			this._py = arg1;
			this._vx = arg2;
			this._vy = arg3;
			asVector = arg4;
		} else {
			this._px = arg0.x;
			this._py = arg0.y;
			this._vx = arg1.x;
			this._vy = arg1.y;
			asVector = arg2;
		}
		if (!asVector) {
			this._vx -= this._px;
			this._vy -= this._py;
		}
	};
	InitClassWithStatics(Line, Base);

	Line.prototype.getPoint = function () {
		return new Point(this._px, this._py);
	};
	Line.prototype.getVector = function () {
		return new Point(this._vx, this._vy);
	};
	Line.prototype.getLength = function () {
		return this.getVector().getLength();
	};
	Line.prototype.intersect = function (line, isInfinite) {
		return Line.intersect(
			this._px, this._py, this._vx, this._vy,
			line._px, line._py, line._vx, line._vy,
			true, isInfinite);
	};
	Line.prototype.getSide = function (point, isInfinite) {
		return Line.getSide(
			this._px, this._py, this._vx, this._vy,
			point.x, point.y, true, isInfinite);
	};
	Line.prototype.getDistance = function (point) {
		return Math.abs(this.getSignedDistance(point));
	};
	Line.prototype.getSignedDistance = function (point) {
		return Line.getSignedDistance(this._px, this._py, this._vx, this._vy,
			point.x, point.y, true);
	};
	Line.prototype.isCollinear = function (line) {
		return Point.isCollinear(this._vx, this._vy, line._vx, line._vy);
	};
	Line.prototype.isOrthogonal = function (line) {
		return Point.isOrthogonal(this._vx, this._vy, line._vx, line._vy);
	};

	Line.intersect = function (p1x, p1y, v1x, v1y, p2x, p2y, v2x, v2y, asVector,
		isInfinite) {
		if (!asVector) {
			v1x -= p1x;
			v1y -= p1y;
			v2x -= p2x;
			v2y -= p2y;
		}
		var cross = v1x * v2y - v1y * v2x;
		if (!Numerical.isMachineZero(cross)) {
			var dx = p1x - p2x,
				dy = p1y - p2y,
				u1 = (v2x * dy - v2y * dx) / cross,
				u2 = (v1x * dy - v1y * dx) / cross,
				epsilon = 1e-12,
				uMin = -epsilon,
				uMax = 1 + epsilon;
			if (isInfinite
				|| uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
				if (!isInfinite) {
					u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
				}
				return new Point(
					p1x + u1 * v1x,
					p1y + u1 * v1y);
			}
		}
	};
	Line.getSide = function (px, py, vx, vy, x, y, asVector, isInfinite) {
		if (!asVector) {
			vx -= px;
			vy -= py;
		}
		var v2x = x - px,
			v2y = y - py,
			ccw = v2x * vy - v2y * vx;
		if (!isInfinite && Numerical.isMachineZero(ccw)) {
			ccw = (v2x * vx + v2x * vx) / (vx * vx + vy * vy);
			if (ccw >= 0 && ccw <= 1)
				ccw = 0;
		}
		return ccw < 0 ? -1 : ccw > 0 ? 1 : 0;
	};
	Line.getSignedDistance = function (px, py, vx, vy, x, y, asVector) {
		if (!asVector) {
			vx -= px;
			vy -= py;
		}
		return vx === 0 ? (vy > 0 ? x - px : px - x)
			: vy === 0 ? (vx < 0 ? y - py : py - y)
				: ((x - px) * vy - (y - py) * vx) / (
					vy > vx
						? vy * Math.sqrt(1 + (vx * vx) / (vy * vy))
						: vx * Math.sqrt(1 + (vy * vy) / (vx * vx))
				);
	};
	Line.getDistance = function (px, py, vx, vy, x, y, asVector) {
		return Math.abs(Line.getSignedDistance(px, py, vx, vy, x, y, asVector));
	};

	var Item = function () {
	}
	InitClassWithStatics(Item, Base);

	Item.prototype._name = null;
	Item.prototype._applyMatrix = true;
	Item.prototype._canApplyMatrix = true;
	Item.prototype._pivot = null;
	Item.prototype._initialize = function (props, point) {
		var hasProps = props && Base.isPlainObject(props),
			internal = hasProps && props.internal === true,
			matrix = this._matrix = new Matrix(),
			settings = {
				applyMatrix: true,
			};
		this._id = internal ? null : UID.get();
		this._parent = this._index = null;
		this._applyMatrix = this._canApplyMatrix && settings.applyMatrix;
		if (point)
			matrix.translate(point);
		matrix._owner = this;
		return hasProps;
	};
	Item.prototype._changed = function (flags) {
		var symbol = this._symbol,
			cacheParent = this._parent || symbol;
		if (flags & 8) {
			this._bounds = this._position = this._decomposed = undefined;
		}
		if (flags & 16) {
			this._globalMatrix = undefined;
		}
		if (cacheParent
			&& (flags & 72)) {
			Item._clearBoundsCache(cacheParent);
		}
		if (flags & 2) {
			Item._clearBoundsCache(this);
		}
		if (symbol)
			symbol._changed(flags);
	};
	Item.prototype.setName = function (name) {

		if (this._name)
			this._removeNamed();
		if (name === (+name) + '')
			throw new Error(
				'Names consisting only of numbers are not supported.');
		var owner = this._getOwner();
		if (name && owner) {
			var children = owner._children,
				namedChildren = owner._namedChildren;
			(namedChildren[name] = namedChildren[name] || []).push(this);
			if (!(name in children))
				children[name] = this;
		}
		this._name = name || undefined;
		this._changed(256);
	};
	Item.prototype.getPosition = function (_dontLink) {
		var ctor = _dontLink ? Point : LinkedPoint;
		var position = this._position ||
			(this._position = this._getPositionFromBounds());
		return new ctor(position.x, position.y, this, 'setPosition');
	};
	Item.prototype.setPosition = function () {
		this.translate(Point.read(arguments).subtract(this.getPosition(true)));
	};
	Item.prototype._getPositionFromBounds = function (bounds) {
		return this._pivot
			? this._matrix._transformPoint(this._pivot)
			: (bounds || this.getBounds()).getCenter(true);
	};
	Item.prototype.setPivot = function () {
		this._pivot = Point.read(arguments, 0, { clone: true, readNull: true });
		this._position = undefined;
	};
	Item.prototype.getBounds = function (matrix, options) {
		var hasMatrix = options || matrix instanceof Matrix,
			opts = Object.assign({}, hasMatrix ? options : matrix,
				this._boundsOptions);
		if (!opts.stroke || this.getStrokeScaling())
			opts.cacheItem = this;
		var rect = this._getCachedBounds(hasMatrix && matrix, opts).rect;
		return !arguments.length
			? new LinkedRectangle(rect.x, rect.y, rect.width, rect.height,
				this, 'setBounds')
			: rect;
	};
	Item.prototype.setBounds = function () {
		var rect = Rectangle.read(arguments),
			bounds = this.getBounds(),
			_matrix = this._matrix,
			matrix = new Matrix(),
			center = rect.getCenter();
		matrix.translate(center);
		if (rect.width != bounds.width || rect.height != bounds.height) {
			if (!_matrix.isInvertible()) {
				_matrix.set(_matrix._backup || new Matrix().translate(_matrix.getTranslation()));
				bounds = this.getBounds();
			}
			matrix.scale(
				bounds.width !== 0 ? rect.width / bounds.width : 0,
				bounds.height !== 0 ? rect.height / bounds.height : 0);
		}
		center = bounds.getCenter();
		matrix.translate(-center.x, -center.y);
		this.transform(matrix);
	};
	Item.prototype._getBounds = function (matrix, options) {
		var children = this._children;
		if (!children || !children.length)
			return new Rectangle();
		Item._updateBoundsCache(this, options.cacheItem);
		return Item._getBounds(children, matrix, options);
	};
	Item.prototype._getBoundsCacheKey = function (options, internal) {
		return [
			options.stroke ? 1 : 0,
			options.handle ? 1 : 0,
			internal ? 1 : 0
		].join('');
	};
	Item.prototype._getCachedBounds = function (matrix, options, noInternal) {
		matrix = matrix && matrix._orNullIfIdentity();
		var internal = options.internal && !noInternal,
			cacheItem = options.cacheItem,
			_matrix = internal ? null : this._matrix._orNullIfIdentity(),
			cacheKey = cacheItem && (!matrix || matrix.equals(_matrix))
				&& this._getBoundsCacheKey(options, internal),
			bounds = this._bounds;
		Item._updateBoundsCache(this._parent || this._symbol, cacheItem);
		if (cacheKey && bounds && cacheKey in bounds) {
			var cached = bounds[cacheKey];
			return {
				rect: cached.rect.clone(),
				nonscaling: cached.nonscaling
			};
		}
		var res = this._getBounds(matrix || _matrix, options),
			rect = res.rect || res,
			nonscaling = res.nonscaling;
		if (cacheKey) {
			if (!bounds) {
				this._bounds = bounds = {};
			}
			var cached = bounds[cacheKey] = {
				rect: rect.clone(),
				nonscaling: nonscaling,
				internal: internal
			};
		}
		return {
			rect: rect,
			nonscaling: nonscaling
		};
	};
	Item.prototype._getStrokeMatrix = function (matrix, options) {
		var parent = this.getStrokeScaling() ? null
			: options && options.internal ? this
				: this._parent || this._symbol && this._symbol._item,
			mx = matrix;
		return mx && mx._shiftless();
	};
	Item.prototype._decompose = function () {
		return this._applyMatrix
			? null
			: this._decomposed || (this._decomposed = this._matrix.decompose());
	};
	Item.prototype.getRotation = function () {
		var decomposed = this._decompose();
		return decomposed ? decomposed.rotation : 0;
	};
	Item.prototype.setApplyMatrix = function (apply) {
		if (this._applyMatrix = this._canApplyMatrix && !!apply)
			this.transform(null, true);
	};
	Item.prototype._installEvents = function (install) {
		var types = this._eventTypes,
			handlers = this._callbacks,
			key = install ? 'install' : 'uninstall';
		if (types) {
			for (var type in handlers) {
				if (handlers[type].length > 0) {
					var entry = types[type],
						func = entry && entry[key];
					if (func)
						func.call(this, type);
				}
			}
		}
		var children = this._children;
		for (var i = 0, l = children && children.length; i < l; i++)
			children[i]._installEvents(install);
	};
	Item.prototype._getOwner = Item.prototype.getParent = function () {
		return this._parent;
	};
	Item.prototype.getChildren = function () {
		return this._children;
	};
	Item.prototype.setChildren = function (items) {
		this.removeChildren();
		this.addChildren(items);
	};
	Item.prototype.getFirstChild = function () {
		return this._children && this._children[0] || null;
	};
	Item.prototype.getLastChild = function () {
		return this._children && this._children[this._children.length - 1]
			|| null;
	};
	Item.prototype.getNextSibling = function () {
		var owner = this._getOwner();
		return owner && owner._children[this._index + 1] || null;
	};
	Item.prototype.getPreviousSibling = function () {
		var owner = this._getOwner();
		return owner && owner._children[this._index - 1] || null;
	};
	Item.prototype.getIndex = function () {
		return this._index;
	};
	Item.prototype.equals = function (item) {
		return item === this || item
			&& this._matrix.equals(item._matrix)
			&& this._equals(item);
	};
	Item.prototype._equals = function (item) {
		return Base.equals(this._children, item._children);
	};
	Item.prototype.clone = function (options) {
		var copy = new this.constructor({ insert: false }),
			children = this._children,
			insert = Base.pick(options ? options.insert : undefined,
				options === undefined || options === true),
			deep = Base.pick(options ? options.deep : undefined, true);
		if (children)
			copy.copyAttributes(this);
		if (!children || deep)
			copy.copyContent(this);
		if (!children)
			copy.copyAttributes(this);
		if (insert)
			copy.insertAbove(this);
		var name = this._name,
			parent = this._parent;
		if (name && parent) {
			var children = parent._children,
				orig = name,
				i = 1;
			while (children[name])
				name = orig + ' ' + (i++);
			if (name !== orig)
				copy.setName(name);
		}
		return copy;
	};
	Item.prototype.copyContent = function (source) {
		var children = source._children;
		for (var i = 0, l = children && children.length; i < l; i++) {
			this.addChild(children[i].clone(false), true);
		}
	};
	Item.prototype.copyAttributes = function (source, excludeMatrix) {
		if (!excludeMatrix)
			this._matrix.set(source._matrix, true);
		this.setApplyMatrix(source._applyMatrix);
		this.setPivot(source._pivot);
		var data = source._data,
			name = source._name;
		this._data = data ? Object.assign(new data.constructor(), data) : null;
		if (name)
			this.setName(name);
	};
	Item.prototype.contains = function () {
		var matrix = this._matrix;
		return (
			matrix.isInvertible() &&
			!!this._contains(matrix._inverseTransform(Point.read(arguments)))
		);
	};
	Item.prototype._contains = function (point) {
		var children = this._children;
		if (children) {
			for (var i = children.length - 1; i >= 0; i--) {
				if (children[i].contains(point))
					return true;
			}
			return false;
		}
		return point.isInside(this.getInternalBounds());
	};
	Item.prototype.isInside = function () {
		return Rectangle.read(arguments).contains(this.getBounds());
	};
	Item.prototype._asPathItem = function () {
		return new Path.Rectangle({
			rectangle: this.getInternalBounds(),
			matrix: this._matrix,
			insert: false,
		});
	};
	Item.prototype.intersects = function (item, _matrix) {
		if (!(item instanceof Item))
			return false;
		return this._asPathItem().getIntersections(item._asPathItem(), null,
			_matrix, true).length > 0;
	};
	Item.prototype.addChild = function (item) {
		return this.insertChild(undefined, item);
	};
	Item.prototype.insertChild = function (index, item) {
		var res = item ? this.insertChildren(index, [item]) : null;
		return res && res[0];
	};
	Item.prototype.addChildren = function (items) {
		return this.insertChildren(this._children.length, items);
	};
	Item.prototype.insertChildren = function (index, items) {
		var children = this._children;
		if (children && items && items.length > 0) {
			items = Base.slice(items);
			var inserted = {};
			for (var i = items.length - 1; i >= 0; i--) {
				var item = items[i],
					id = item && item._id;
				if (!item || inserted[id]) {
					items.splice(i, 1);
				} else {
					item._remove(false, true);
					inserted[id] = true;
				}
			}
			Base.splice(children, items, index, 0);
			for (var i = 0, l = items.length; i < l; i++) {
				var item = items[i],
					name = item._name;
				item._parent = this;
				if (name)
					item.setName(name);

			}
			this._changed(11);
		} else {
			items = null;
		}
		return items;
	};
	Item.prototype._insertItem = Item.prototype.insertChild;
	Item.prototype._insertAt = function (item, offset) {
		var owner = item && item._getOwner(),
			res = item !== this && owner ? this : null;
		if (res) {
			res._remove(false, true);
			owner._insertItem(item._index + offset, res);
		}
		return res;
	};
	Item.prototype.insertAbove = function (item) {
		return this._insertAt(item, 1);
	};
	Item.prototype.insertBelow = function (item) {
		return this._insertAt(item, 0);
	};
	Item.prototype.reduce = function (options) {
		var children = this._children;
		if (children && children.length === 1) {
			var child = children[0].reduce(options);
			if (this._parent) {
				child.insertAbove(this);
				this.remove();
			} else {
				child.remove();
			}
			return child;
		}
		return this;
	};
	Item.prototype._removeNamed = function () {
		var owner = this._getOwner();
		if (owner) {
			var children = owner._children,
				namedChildren = owner._namedChildren,
				name = this._name,
				namedArray = namedChildren[name],
				index = namedArray ? namedArray.indexOf(this) : -1;
			if (index !== -1) {
				if (children[name] == this)
					delete children[name];
				namedArray.splice(index, 1);
				if (namedArray.length) {
					children[name] = namedArray[0];
				} else {
					delete namedChildren[name];
				}
			}
		}
	};
	Item.prototype._remove = function (notifySelf, notifyParent) {
		var owner = this._getOwner(),
			index = this._index;
		if (owner) {
			if (this._name)
				this._removeNamed();
			if (index != null) {
				Base.splice(owner._children, null, index, 1);
			}
			this._installEvents(false);
			if (notifyParent)
				owner._changed(11, this);
			this._parent = null;
			return true;
		}
		return false;
	};
	Item.prototype.remove = function () {
		return this._remove(true, true);
	};
	Item.prototype.replaceWith = function (item) {
		var ok = item && item.insertBelow(this);
		if (ok)
			this.remove();
		return ok;
	};
	Item.prototype.clear = Item.prototype.removeChildren = function (start, end) {
		if (!this._children)
			return null;
		start = start || 0;
		end = Base.pick(end, this._children.length);
		var removed = Base.splice(this._children, null, start, end - start);
		for (var i = removed.length - 1; i >= 0; i--) {
			removed[i]._remove(true, false);
		}
		if (removed.length > 0)
			this._changed(11);
		return removed;
	};
	Item.prototype.isEmpty = function (recursively) {
		var children = this._children;
		var numChildren = children ? children.length : 0;
		if (recursively) {
			for (var i = 0; i < numChildren; i++) {
				if (!children[i].isEmpty(recursively)) {
					return false;
				}
			}
			return true;
		}
		return !numChildren;
	};
	Item.prototype._getOrder = function (item) {
		function getList(item) {
			var list = [];
			do {
				list.unshift(item);
			} while (item = item._parent);
			return list;
		}
		var list1 = getList(this),
			list2 = getList(item);
		for (var i = 0, l = Math.min(list1.length, list2.length); i < l; i++) {
			if (list1[i] != list2[i]) {
				return list1[i]._index < list2[i]._index ? 1 : -1;
			}
		}
		return 0;
	};
	Item.prototype.isSibling = function (item) {
		return this._parent === item._parent;
	};
	Item.prototype.translate = function () {
		var mx = new Matrix();
		return this.transform(mx.translate.apply(mx, arguments));
	};
	Item.prototype.transform = function (matrix, _applyRecursively, _setApplyMatrix) {
		var _matrix = this._matrix,
			transformMatrix = matrix && !matrix.isIdentity(),
			applyMatrix = (
				_setApplyMatrix && this._canApplyMatrix ||
				this._applyMatrix && (
					transformMatrix || !_matrix.isIdentity() ||
					_applyRecursively && this._children
				)
			);
		if (!transformMatrix && !applyMatrix)
			return this;
		if (transformMatrix) {
			if (!matrix.isInvertible() && _matrix.isInvertible())
				_matrix._backup = _matrix.getValues();
			_matrix.prepend(matrix, true);
		}

		if (applyMatrix && (applyMatrix = this._transformContent(
			_matrix, _applyRecursively, _setApplyMatrix))) {
			var pivot = this._pivot;
			if (pivot)
				_matrix._transformPoint(pivot, pivot, true);
			_matrix.reset(true);
			if (_setApplyMatrix && this._canApplyMatrix)
				this._applyMatrix = true;
		}
		var bounds = this._bounds,
			position = this._position;
		if (transformMatrix || applyMatrix) {
			this._changed(25);
		}
		var decomp = transformMatrix && bounds && matrix.decompose();
		if (decomp && decomp.skewing.isZero() && decomp.rotation % 90 === 0) {
			for (var key in bounds) {
				var cache = bounds[key];
				if (cache.nonscaling) {
					delete bounds[key];
				} else if (applyMatrix || !cache.internal) {
					var rect = cache.rect;
					matrix._transformBounds(rect, rect);
				}
			}
			this._bounds = bounds;
			var cached = bounds[this._getBoundsCacheKey(
				this._boundsOptions || {})];
			if (cached) {
				this._position = this._getPositionFromBounds(cached.rect);
			}
		} else if (transformMatrix && position && this._pivot) {
			this._position = matrix._transformPoint(position, position);
		}
		return this;
	};
	Item.prototype._transformContent = function (matrix, applyRecursively, setApplyMatrix) {
		var children = this._children;
		if (children) {
			for (var i = 0, l = children.length; i < l; i++) {
				children[i].transform(matrix, applyRecursively, setApplyMatrix);
			}
			return true;
		}
	};

	Item._updateBoundsCache = function (parent, item) {
		if (parent && item) {
			var id = item._id,
				ref = parent._boundsCache = parent._boundsCache || {
					ids: {},
					list: []
				};
			if (!ref.ids[id]) {
				ref.list.push(item);
				ref.ids[id] = item;
			}
		}
	};
	Item._clearBoundsCache = function (item) {
		var cache = item._boundsCache;
		if (cache) {
			item._bounds = item._position = item._boundsCache = undefined;
			for (var i = 0, list = cache.list, l = list.length; i < l; i++) {
				var other = list[i];
				if (other !== item) {
					other._bounds = other._position = undefined;
					if (other._boundsCache)
						Item._clearBoundsCache(other);
				}
			}
		}
	};
	Item._getBounds = function (items, matrix, options) {
		var x1 = Infinity,
			x2 = -x1,
			y1 = x1,
			y2 = x2,
			nonscaling = false;
		options = options || {};
		for (var i = 0, l = items.length; i < l; i++) {
			var item = items[i];
			if (!item.isEmpty(true)) {
				var bounds = item._getCachedBounds(
					matrix && matrix.appended(item._matrix), options, true),
					rect = bounds.rect;
				x1 = Math.min(rect.x, x1);
				y1 = Math.min(rect.y, y1);
				x2 = Math.max(rect.x + rect.width, x2);
				y2 = Math.max(rect.y + rect.height, y2);
				if (bounds.nonscaling)
					nonscaling = true;
			}
		}
		return {
			rect: isFinite(x1)
				? new Rectangle(x1, y1, x2 - x1, y2 - y1)
				: new Rectangle(),
			nonscaling: nonscaling
		};
	};

	var Segment = function (arg0, arg1, arg2, arg3, arg4, arg5) {
		for (var i = 0, l = arguments.length; i < l; i++) {
			var src = arguments[i];
			if (src)
				Object.assign(this, src);
		}
		var count = arguments.length,
			point, handleIn, handleOut;
		if (count > 0) {
			if (arg0 == null || typeof arg0 === 'object') {
				if (count === 1 && arg0 && 'point' in arg0) {
					point = arg0.point;
					handleIn = arg0.handleIn;
					handleOut = arg0.handleOut;
				} else {
					point = arg0;
					handleIn = arg1;
					handleOut = arg2;
				}
			} else {
				point = [arg0, arg1];
				handleIn = arg2 !== undefined ? [arg2, arg3] : null;
				handleOut = arg4 !== undefined ? [arg4, arg5] : null;
			}
		}
		new SegmentPoint(point, this, '_point');
		new SegmentPoint(handleIn, this, '_handleIn');
		new SegmentPoint(handleOut, this, '_handleOut');
	};
	InitClassWithStatics(Segment, Base);

	Segment.prototype._changed = function (point) {
		var path = this._path;
		if (!path)
			return;
		var curves = path._curves,
			index = this._index,
			curve;
		if (curves) {
			if ((!point || point === this._point || point === this._handleIn)
				&& (curve = index > 0 ? curves[index - 1] : path._closed
					? curves[curves.length - 1] : null))
				curve._changed();
			if ((!point || point === this._point || point === this._handleOut)
				&& (curve = curves[index]))
				curve._changed();
		}
		path._changed(41);
	};
	Segment.prototype.getPoint = function () {
		return this._point;
	};
	Segment.prototype.getHandleIn = function () {
		return this._handleIn;
	};
	Segment.prototype.setHandleIn = function () {
		this._handleIn.set(Point.read(arguments));
	};
	Segment.prototype.getHandleOut = function () {
		return this._handleOut;
	};
	Segment.prototype.setHandleOut = function () {
		const newPoint = Point.read(arguments)
		this._handleOut.set(newPoint);
	};
	Segment.prototype.hasHandles = function () {
		return !this._handleIn.isZero() || !this._handleOut.isZero();
	};
	Segment.prototype.isSmooth = function () {
		var handleIn = this._handleIn,
			handleOut = this._handleOut;
		return !handleIn.isZero() && !handleOut.isZero()
			&& handleIn.isCollinear(handleOut);
	};
	Segment.prototype.clearHandles = function () {
		this._handleIn._set(0, 0);
		this._handleOut._set(0, 0);
	};
	Segment.prototype.getIndex = function () {
		return this._index !== undefined ? this._index : null;
	};
	Segment.prototype.getPath = function () {
		return this._path || null;
	};
	Segment.prototype.getCurve = function () {
		var path = this._path,
			index = this._index;
		if (path) {
			if (index > 0 && !path._closed
				&& index === path._segments.length - 1)
				index--;
			return path.getCurves()[index] || null;
		}
		return null;
	};
	Segment.prototype.getLocation = function () {
		var curve = this.getCurve();
		return curve
			? new CurveLocation(curve, this === curve._segment1 ? 0 : 1)
			: null;
	};
	Segment.prototype.getNext = function () {
		var segments = this._path && this._path._segments;
		return segments && (segments[this._index + 1]
			|| this._path._closed && segments[0]) || null;
	};
	Segment.prototype.getPrevious = function () {
		var segments = this._path && this._path._segments;
		return segments && (segments[this._index - 1]
			|| this._path._closed && segments[segments.length - 1]) || null;
	};
	Segment.prototype.isFirst = function () {
		return !this._index;
	};
	Segment.prototype.isLast = function () {
		var path = this._path;
		return path && this._index === path._segments.length - 1 || false;
	};
	Segment.prototype.reverse = function () {
		var handleIn = this._handleIn,
			handleOut = this._handleOut,
			tmp = handleIn.clone();
		handleIn.set(handleOut);
		handleOut.set(tmp);
	};
	Segment.prototype.reversed = function () {
		return new Segment(this._point, this._handleOut, this._handleIn);
	};
	Segment.prototype.remove = function () {
		return this._path ? !!this._path.removeSegment(this._index) : false;
	};
	Segment.prototype.clone = function () {
		return new Segment(this._point, this._handleIn, this._handleOut);
	};
	Segment.prototype.equals = function (segment) {
		return segment === this || segment
			&& this._point.equals(segment._point)
			&& this._handleIn.equals(segment._handleIn)
			&& this._handleOut.equals(segment._handleOut)
			|| false;
	};
	Segment.prototype.transform = function (matrix) {
		this._transformCoordinates(matrix, new Array(6), true);
		this._changed();
	};
	Segment.prototype.interpolate = function (from, to, factor) {
		var u = 1 - factor,
			v = factor,
			point1 = from._point,
			point2 = to._point,
			handleIn1 = from._handleIn,
			handleIn2 = to._handleIn,
			handleOut2 = to._handleOut,
			handleOut1 = from._handleOut;
		this._point._set(
			u * point1._x + v * point2._x,
			u * point1._y + v * point2._y, true);
		this._handleIn._set(
			u * handleIn1._x + v * handleIn2._x,
			u * handleIn1._y + v * handleIn2._y, true);
		this._handleOut._set(
			u * handleOut1._x + v * handleOut2._x,
			u * handleOut1._y + v * handleOut2._y, true);
		this._changed();
	};
	Segment.prototype._transformCoordinates = function (matrix, coords, change) {
		var point = this._point,
			handleIn = !change || !this._handleIn.isZero()
				? this._handleIn : null,
			handleOut = !change || !this._handleOut.isZero()
				? this._handleOut : null,
			x = point._x,
			y = point._y,
			i = 2;
		coords[0] = x;
		coords[1] = y;
		if (handleIn) {
			coords[i++] = handleIn._x + x;
			coords[i++] = handleIn._y + y;
		}
		if (handleOut) {
			coords[i++] = handleOut._x + x;
			coords[i++] = handleOut._y + y;
		}
		if (matrix) {
			matrix._transformCoordinates(coords, coords, i / 2);
			x = coords[0];
			y = coords[1];
			if (change) {
				point._x = x;
				point._y = y;
				i = 2;
				if (handleIn) {
					handleIn._x = coords[i++] - x;
					handleIn._y = coords[i++] - y;
				}
				if (handleOut) {
					handleOut._x = coords[i++] - x;
					handleOut._y = coords[i++] - y;
				}
			} else {
				if (!handleIn) {
					coords[i++] = x;
					coords[i++] = y;
				}
				if (!handleOut) {
					coords[i++] = x;
					coords[i++] = y;
				}
			}
		}
		return coords;
	};

	var SegmentPoint = function (point, owner, key) {
		var x, y;
		if (!point) {
			x = y = 0;
		} else if ((x = point[0]) !== undefined) {
			y = point[1];
		} else {
			var pt = point;
			if ((x = pt.x) === undefined) {
				pt = Point.read(arguments);
				x = pt.x;
			}
			y = pt.y;
		}
		this._x = this.x = x;
		this._y = this.y = y;
		this._owner = owner;
		owner[key] = this;

	};
	InitClassWithStatics(SegmentPoint, Point);

	SegmentPoint.prototype._set = function (x, y) {
		this._x = this.x = x;
		this._y = this.y = y;
		this._owner._changed(this);
		return this;
	};
	SegmentPoint.prototype.isZero = function () {
		var isZero = Numerical.isZero;
		return isZero(this._x) && isZero(this._y);
	};
	SegmentPoint.prototype.getX = function () {
		return this._x;
	};
	SegmentPoint.prototype.getY = function () {
		return this._y;
	};

	var Curve = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
		var count = arguments.length,
			seg1, seg2,
			point1, point2,
			handle1, handle2;
		if (count === 3) {
			this._path = arg0;
			seg1 = arg1;
			seg2 = arg2;
		} else if (!count) {
			seg1 = new Segment();
			seg2 = new Segment();
		} else if (count === 1) {
			if ('segment1' in arg0) {
				seg1 = new Segment(arg0.segment1);
				seg2 = new Segment(arg0.segment2);
			} else if ('point1' in arg0) {
				point1 = arg0.point1;
				handle1 = arg0.handle1;
				handle2 = arg0.handle2;
				point2 = arg0.point2;
			} else if (Array.isArray(arg0)) {
				point1 = [arg0[0], arg0[1]];
				point2 = [arg0[6], arg0[7]];
				handle1 = [arg0[2] - arg0[0], arg0[3] - arg0[1]];
				handle2 = [arg0[4] - arg0[6], arg0[5] - arg0[7]];
			}
		} else if (count === 2) {
			seg1 = new Segment(arg0);
			seg2 = new Segment(arg1);
		} else if (count === 4) {
			point1 = arg0;
			handle1 = arg1;
			handle2 = arg2;
			point2 = arg3;
		} else if (count === 8) {
			point1 = [arg0, arg1];
			point2 = [arg6, arg7];
			handle1 = [arg2 - arg0, arg3 - arg1];
			handle2 = [arg4 - arg6, arg5 - arg7];
		}
		this._segment1 = seg1 || new Segment(point1, null, handle1);
		this._segment2 = seg2 || new Segment(point2, handle2, null);
	};
	InitClassWithStatics(Curve, Base);

	Curve.prototype._changed = function () {
		this._length = this._bounds = undefined;
	};
	Curve.prototype.clone = function () {
		return new Curve(this._segment1, this._segment2);
	};
	Curve.prototype.classify = function () {
		return Curve.classify(this.getValues());
	};
	Curve.prototype.remove = function () {
		var removed = false;
		if (this._path) {
			var segment2 = this._segment2,
				handleOut = segment2._handleOut;
			removed = segment2.remove();
			if (removed)
				this._segment1._handleOut.set(handleOut);
		}
		return removed;
	};
	Curve.prototype.getPoint1 = function () {
		return this._segment1._point;
	};
	Curve.prototype.getPoint2 = function () {
		return this._segment2._point;
	};
	Curve.prototype.getSegment1 = function () {
		return this._segment1;
	};
	Curve.prototype.getSegment2 = function () {
		return this._segment2;
	};
	Curve.prototype.getPath = function () {
		return this._path;
	};
	Curve.prototype.getIndex = function () {
		return this._segment1._index;
	};
	Curve.prototype.getNext = function () {
		var curves = this._path && this._path._curves;
		return curves && (curves[this._segment1._index + 1]
			|| this._path._closed && curves[0]) || null;
	};
	Curve.prototype.getPrevious = function () {
		var curves = this._path && this._path._curves;
		return curves && (curves[this._segment1._index - 1]
			|| this._path._closed && curves[curves.length - 1]) || null;
	};
	Curve.prototype.isFirst = function () {
		return !this._segment1._index;
	};
	Curve.prototype.isLast = function () {
		var path = this._path;
		return path && this._segment1._index === path._curves.length - 1
			|| false;
	};
	Curve.prototype.getValues = function (matrix) {
		return Curve.getValues(this._segment1, this._segment2, matrix);
	};
	Curve.prototype.getLength = function () {
		if (this._length == null)
			this._length = Curve.getLength(this.getValues(), 0, 1);
		return this._length;
	};
	Curve.prototype.getArea = function () {
		return Curve.getArea(this.getValues());
	};
	Curve.prototype.getLine = function () {
		return new Line(this._segment1._point, this._segment2._point);
	};
	Curve.prototype.getPart = function (from, to) {
		return new Curve(Curve.getPart(this.getValues(), from, to));
	};
	Curve.prototype.getPartLength = function (from, to) {
		return Curve.getLength(this.getValues(), from, to);
	};
	Curve.prototype.divideAt = function (location) {
		return this.divideAtTime(location && location.curve === this
			? location.time : this.getTimeAt(location));
	};
	Curve.prototype.divideAtTime = function (time, _setHandles) {
		var tMin = 1e-8,
			tMax = 1 - tMin,
			res = null;
		if (time >= tMin && time <= tMax) {
			var parts = Curve.subdivide(this.getValues(), time),
				left = parts[0],
				right = parts[1],
				setHandles = _setHandles || this.hasHandles(),
				seg1 = this._segment1,
				seg2 = this._segment2,
				path = this._path;
			if (setHandles) {
				seg1._handleOut._set(left[2] - left[0], left[3] - left[1]);
				seg2._handleIn._set(right[4] - right[6], right[5] - right[7]);
			}
			var x = left[6], y = left[7],
				segment = new Segment(new Point(x, y),
					setHandles && new Point(left[4] - x, left[5] - y),
					setHandles && new Point(right[2] - x, right[3] - y));
			if (path) {
				path.insert(seg1._index + 1, segment);
				res = this.getNext();
			} else {
				this._segment2 = segment;
				this._changed();
				res = new Curve(segment, seg2);
			}
		}
		return res;
	};
	Curve.prototype.splitAt = function (location) {
		var path = this._path;
		return path ? path.splitAt(location) : null;
	};
	Curve.prototype.splitAtTime = function (time) {
		return this.splitAt(this.getLocationAtTime(time));
	};
	Curve.prototype.divide = function (offset, isTime) {
		return this.divideAtTime(offset === undefined ? 0.5 : isTime ? offset
			: this.getTimeAt(offset));
	};
	Curve.prototype.split = function (offset, isTime) {
		return this.splitAtTime(offset === undefined ? 0.5 : isTime ? offset
			: this.getTimeAt(offset));
	};
	Curve.prototype.reversed = function () {
		return new Curve(this._segment2.reversed(), this._segment1.reversed());
	};
	Curve.prototype.clearHandles = function () {
		this._segment1._handleOut._set(0, 0);
		this._segment2._handleIn._set(0, 0);
	};
	Curve.prototype.hasHandles = function () {
		return !this._segment1._handleOut.isZero()
			|| !this._segment2._handleIn.isZero();
	};
	Curve.prototype.hasLength = function (epsilon) {
		return (!this.getPoint1().equals(this.getPoint2()) || this.hasHandles())
			&& this.getLength() > (epsilon || 0);
	};
	Curve.prototype.isCollinear = function (curve) {
		return curve && this.isStraight() && curve.isStraight()
			&& this.getLine().isCollinear(curve.getLine());
	};
	Curve.prototype.isStraight = function (epsilon) {
		var seg1 = this._segment1,
			seg2 = this._segment2;
		const test = function (p1, h1, h2, p2) {
			if (h1.isZero() && h2.isZero()) {
				return true;
			} else {
				var v = p2.subtract(p1);
				if (v.isZero()) {
					return false;
				} else if (v.isCollinear(h1) && v.isCollinear(h2)) {
					var l = new Line(p1, p2),
						epsilon = 1e-7;
					if (l.getDistance(p1.add(h1)) < epsilon &&
						l.getDistance(p2.add(h2)) < epsilon) {
						var div = v.dot(v),
							s1 = v.dot(h1) / div,
							s2 = v.dot(h2) / div;
						return s1 >= 0 && s1 <= 1 && s2 <= 0 && s2 >= -1;
					}
				}
			}
			return false;
		}
		return test(seg1._point, seg1._handleOut, seg2._handleIn, seg2._point, epsilon);
	};
	Curve.prototype.getLocationAt = function (offset, _isTime) {
		return this.getLocationAtTime(
			_isTime ? offset : this.getTimeAt(offset));
	};
	Curve.prototype.getLocationAtTime = function (t) {
		return t != null && t >= 0 && t <= 1
			? new CurveLocation(this, t)
			: null;
	};
	Curve.prototype.getTimeAt = function (offset, start) {
		return Curve.getTimeAt(this.getValues(), offset, start);
	};
	Curve.prototype.getTimesWithTangent = function () {
		var tangent = Point.read(arguments);
		return tangent.isZero()
			? []
			: Curve.getTimesWithTangent(this.getValues(), tangent);
	};
	Curve.prototype.getTimeOf = function () {
		return Curve.getTimeOf(this.getValues(), Point.read(arguments));
	};
	Curve.prototype.getNearestLocation = function () {
		var point = Point.read(arguments),
			values = this.getValues(),
			t = Curve.getNearestTime(values, point),
			pt = Curve.getPoint(values, t);
		return new CurveLocation(this, t, pt, null, point.getDistance(pt));
	};
	Curve.prototype.getNearestPoint = function () {
		var loc = this.getNearestLocation.apply(this, arguments);
		return loc ? loc.getPoint() : loc;
	};
	Curve.prototype.getPointAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getPoint'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getPointAtTime = function (time) {
		return Curve['getPoint'](this.getValues(), time);
	};
	Curve.prototype.getTangentAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getTangent'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getTangentAtTime = function (time) {
		return Curve['getTangent'](this.getValues(), time);
	};
	Curve.prototype.getNormalAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getNormal'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getNormalAtTime = function (time) {
		return Curve['getNormal'](this.getValues(), time);
	};
	Curve.prototype.getWeightedTangentAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getWeightedTangent'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getWeightedNormalAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getWeightedNormal'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getCurvatureAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getCurvature'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getIntersections = function (curve) {
		var v1 = this.getValues(),
			v2 = curve && curve !== this && curve.getValues();
		return v2 ? Curve.getCurveIntersections(v1, v2, this, curve, [])
			: Curve.getSelfIntersection(v1, this, []);
	};

	Curve.getValues = function (segment1, segment2, matrix, straight) {
		var p1 = segment1._point,
			h1 = segment1._handleOut,
			h2 = segment2._handleIn,
			p2 = segment2._point,
			x1 = p1.x, y1 = p1.y,
			x2 = p2.x, y2 = p2.y,
			values = straight
				? [x1, y1, x1, y1, x2, y2, x2, y2]
				: [
					x1, y1,
					x1 + h1._x, y1 + h1._y,
					x2 + h2._x, y2 + h2._y,
					x2, y2
				];
		if (matrix)
			matrix._transformCoordinates(values, values, 4);
		return values;
	};
	Curve.subdivide = function (v, t) {
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7];
		if (t === undefined)
			t = 0.5;
		var u = 1 - t,
			x4 = u * x0 + t * x1, y4 = u * y0 + t * y1,
			x5 = u * x1 + t * x2, y5 = u * y1 + t * y2,
			x6 = u * x2 + t * x3, y6 = u * y2 + t * y3,
			x7 = u * x4 + t * x5, y7 = u * y4 + t * y5,
			x8 = u * x5 + t * x6, y8 = u * y5 + t * y6,
			x9 = u * x7 + t * x8, y9 = u * y7 + t * y8;
		return [
			[x0, y0, x4, y4, x7, y7, x9, y9],
			[x9, y9, x8, y8, x6, y6, x3, y3]
		];
	};
	Curve.getMonoCurves = function (v, dir) {
		var curves = [],
			io = dir ? 0 : 1,
			o0 = v[io + 0],
			o1 = v[io + 2],
			o2 = v[io + 4],
			o3 = v[io + 6];
		if ((o0 >= o1) === (o1 >= o2) && (o1 >= o2) === (o2 >= o3)
			|| Curve.isStraight(v)) {
			curves.push(v);
		} else {
			var a = 3 * (o1 - o2) - o0 + o3,
				b = 2 * (o0 + o2) - 4 * o1,
				c = o1 - o0,
				tMin = 1e-8,
				tMax = 1 - tMin,
				roots = [],
				n = Numerical.solveQuadratic(a, b, c, roots, tMin, tMax);
			if (!n) {
				curves.push(v);
			} else {
				roots.sort();
				var t = roots[0],
					parts = Curve.subdivide(v, t);
				curves.push(parts[0]);
				if (n > 1) {
					t = (roots[1] - t) / (1 - t);
					parts = Curve.subdivide(parts[1], t);
					curves.push(parts[0]);
				}
				curves.push(parts[1]);
			}
		}
		return curves;
	};
	Curve.solveCubic = function (v, coord, val, roots, min, max) {
		var v0 = v[coord],
			v1 = v[coord + 2],
			v2 = v[coord + 4],
			v3 = v[coord + 6],
			res = 0;
		if (!(v0 < val && v3 < val && v1 < val && v2 < val ||
			v0 > val && v3 > val && v1 > val && v2 > val)) {
			var c = 3 * (v1 - v0),
				b = 3 * (v2 - v1) - c,
				a = v3 - v0 - c - b;
			res = Numerical.solveCubic(a, b, c, v0 - val, roots, min, max);
		}
		return res;
	};
	Curve.getTimeOf = function (v, point) {
		var p0 = new Point(v[0], v[1]),
			p3 = new Point(v[6], v[7]),
			epsilon = 1e-12,
			geomEpsilon = 1e-7,
			t = point.isClose(p0, epsilon) ? 0
				: point.isClose(p3, epsilon) ? 1
					: null;
		if (t === null) {
			var coords = [point.x, point.y],
				roots = [];
			for (var c = 0; c < 2; c++) {
				var count = Curve.solveCubic(v, c, coords[c], roots, 0, 1);
				for (var i = 0; i < count; i++) {
					var u = roots[i];
					if (point.isClose(Curve.getPoint(v, u), geomEpsilon))
						return u;
				}
			}
		}
		return point.isClose(p0, geomEpsilon) ? 0
			: point.isClose(p3, geomEpsilon) ? 1
				: null;
	};
	Curve.getNearestTime = function (v, point) {
		if (Curve.isStraight(v)) {
			var x0 = v[0], y0 = v[1],
				x3 = v[6], y3 = v[7],
				vx = x3 - x0, vy = y3 - y0,
				det = vx * vx + vy * vy;
			if (det === 0)
				return 0;
			var u = ((point.x - x0) * vx + (point.y - y0) * vy) / det;
			return u < 1e-12 ? 0
				: u > 0.999999999999 ? 1
					: Curve.getTimeOf(v,
						new Point(x0 + u * vx, y0 + u * vy));
		}

		var count = 100,
			minDist = Infinity,
			minT = 0;

		function refine(t) {
			if (t >= 0 && t <= 1) {
				var dist = point.getDistance(Curve.getPoint(v, t), true);
				if (dist < minDist) {
					minDist = dist;
					minT = t;
					return true;
				}
			}
		}

		for (var i = 0; i <= count; i++)
			refine(i / count);

		var step = 1 / (count * 2);
		while (step > 1e-8) {
			if (!refine(minT - step) && !refine(minT + step))
				step /= 2;
		}
		return minT;
	};
	Curve.getPart = function (v, from, to) {
		var flip = from > to;
		if (flip) {
			var tmp = from;
			from = to;
			to = tmp;
		}
		if (from > 0)
			v = Curve.subdivide(v, from)[1];
		if (to < 1)
			v = Curve.subdivide(v, (to - from) / (1 - from))[0];
		return flip
			? [v[6], v[7], v[4], v[5], v[2], v[3], v[0], v[1]]
			: v;
	};
	Curve.getArea = function (v) {
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7];
		return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
			+ y1 * (x0 - x2) - x1 * (y0 - y2)
			+ y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
	};
	Curve.getBounds = function (v) {
		var min = v.slice(0, 2),
			max = min.slice(),
			roots = [0, 0];
		for (var i = 0; i < 2; i++)
			Curve._addBounds(v[i], v[i + 2], v[i + 4], v[i + 6],
				i, 0, min, max, roots);
		return new Rectangle(min[0], min[1], max[0] - min[0], max[1] - min[1]);
	};
	Curve._addBounds = function (v0, v1, v2, v3, coord, padding, min, max, roots) {
		function add(value, padding) {
			var left = value - padding,
				right = value + padding;
			if (left < min[coord])
				min[coord] = left;
			if (right > max[coord])
				max[coord] = right;
		}

		padding /= 2;
		var minPad = min[coord] + padding,
			maxPad = max[coord] - padding;
		if (v0 < minPad || v1 < minPad || v2 < minPad || v3 < minPad ||
			v0 > maxPad || v1 > maxPad || v2 > maxPad || v3 > maxPad) {
			if (v1 < v0 != v1 < v3 && v2 < v0 != v2 < v3) {
				add(v0, 0);
				add(v3, 0);
			} else {
				var a = 3 * (v1 - v2) - v0 + v3,
					b = 2 * (v0 + v2) - 4 * v1,
					c = v1 - v0,
					count = Numerical.solveQuadratic(a, b, c, roots),
					tMin = 1e-8,
					tMax = 1 - tMin;
				add(v3, 0);
				for (var i = 0; i < count; i++) {
					var t = roots[i],
						u = 1 - t;
					if (tMin <= t && t <= tMax)
						add(u * u * u * v0
							+ 3 * u * u * t * v1
							+ 3 * u * t * t * v2
							+ t * t * t * v3,
							padding);
				}
			}
		}
	};
	Curve.isStraight = function (v, epsilon) {
		var x0 = v[0], y0 = v[1],
			x3 = v[6], y3 = v[7];
		var test = function (p1, h1, h2, p2) {
			if (h1.isZero() && h2.isZero()) {
				return true;
			} else {
				var v = p2.subtract(p1);
				if (v.isZero()) {
					return false;
				} else if (v.isCollinear(h1) && v.isCollinear(h2)) {
					var l = new Line(p1, p2),
						epsilon = 1e-7;
					if (l.getDistance(p1.add(h1)) < epsilon &&
						l.getDistance(p2.add(h2)) < epsilon) {
						var div = v.dot(v),
							s1 = v.dot(h1) / div,
							s2 = v.dot(h2) / div;
						return s1 >= 0 && s1 <= 1 && s2 <= 0 && s2 >= -1;
					}
				}
			}
			return false;
		};
		return test(
			new Point(x0, y0),
			new Point(v[2] - x0, v[3] - y0),
			new Point(v[4] - x3, v[5] - y3),
			new Point(x3, y3), epsilon);
	};
	Curve.getLengthIntegrand = function (v) {
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7],

			ax = 9 * (x1 - x2) + 3 * (x3 - x0),
			bx = 6 * (x0 + x2) - 12 * x1,
			cx = 3 * (x1 - x0),

			ay = 9 * (y1 - y2) + 3 * (y3 - y0),
			by = 6 * (y0 + y2) - 12 * y1,
			cy = 3 * (y1 - y0);

		return function (t) {
			var dx = (ax * t + bx) * t + cx,
				dy = (ay * t + by) * t + cy;
			return Math.sqrt(dx * dx + dy * dy);
		};
	};
	Curve.getIterations = function (a, b) {
		return Math.max(2, Math.min(16, Math.ceil(Math.abs(b - a) * 32)));
	};
	Curve.evaluate = function (v, t, type, normalized) {
		if (t == null || t < 0 || t > 1)
			return null;
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7],
			isZero = Numerical.isZero;
		if (isZero(x1 - x0) && isZero(y1 - y0)) {
			x1 = x0;
			y1 = y0;
		}
		if (isZero(x2 - x3) && isZero(y2 - y3)) {
			x2 = x3;
			y2 = y3;
		}
		var cx = 3 * (x1 - x0),
			bx = 3 * (x2 - x1) - cx,
			ax = x3 - x0 - cx - bx,
			cy = 3 * (y1 - y0),
			by = 3 * (y2 - y1) - cy,
			ay = y3 - y0 - cy - by,
			x, y;
		if (type === 0) {
			x = t === 0 ? x0 : t === 1 ? x3
				: ((ax * t + bx) * t + cx) * t + x0;
			y = t === 0 ? y0 : t === 1 ? y3
				: ((ay * t + by) * t + cy) * t + y0;
		} else {
			var tMin = 1e-8,
				tMax = 1 - tMin;
			if (t < tMin) {
				x = cx;
				y = cy;
			} else if (t > tMax) {
				x = 3 * (x3 - x2);
				y = 3 * (y3 - y2);
			} else {
				x = (3 * ax * t + 2 * bx) * t + cx;
				y = (3 * ay * t + 2 * by) * t + cy;
			}
			if (normalized) {
				if (x === 0 && y === 0 && (t < tMin || t > tMax)) {
					x = x2 - x1;
					y = y2 - y1;
				}
				var len = Math.sqrt(x * x + y * y);
				if (len) {
					x /= len;
					y /= len;
				}
			}
			if (type === 3) {
				var x2 = 6 * ax * t + 2 * bx,
					y2 = 6 * ay * t + 2 * by,
					d = Math.pow(x * x + y * y, 3 / 2);
				x = d !== 0 ? (x * y2 - y * x2) / d : 0;
				y = 0;
			}
		}
		return type === 2 ? new Point(y, -x) : new Point(x, y);
	};
	Curve.classify = function (v) {
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7],
			a1 = x0 * (y3 - y2) + y0 * (x2 - x3) + x3 * y2 - y3 * x2,
			a2 = x1 * (y0 - y3) + y1 * (x3 - x0) + x0 * y3 - y0 * x3,
			a3 = x2 * (y1 - y0) + y2 * (x0 - x1) + x1 * y0 - y1 * x0,
			d3 = 3 * a3,
			d2 = d3 - a2,
			d1 = d2 - a2 + a1,
			l = Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3),
			s = l !== 0 ? 1 / l : 0,
			isZero = Numerical.isZero,
			serpentine = 'serpentine';
		d1 *= s;
		d2 *= s;
		d3 *= s;

		function type(type, t1, t2) {
			var hasRoots = t1 !== undefined,
				t1Ok = hasRoots && t1 > 0 && t1 < 1,
				t2Ok = hasRoots && t2 > 0 && t2 < 1;
			if (hasRoots && (!(t1Ok || t2Ok)
				|| type === 'loop' && !(t1Ok && t2Ok))) {
				type = 'arch';
				t1Ok = t2Ok = false;
			}
			return {
				type: type,
				roots: t1Ok || t2Ok
					? t1Ok && t2Ok
						? t1 < t2 ? [t1, t2] : [t2, t1]
						: [t1Ok ? t1 : t2]
					: null
			};
		}

		if (isZero(d1)) {
			return isZero(d2)
				? type(isZero(d3) ? 'line' : 'quadratic')
				: type(serpentine, d3 / (3 * d2));
		}
		var d = 3 * d2 * d2 - 4 * d1 * d3;
		if (isZero(d)) {
			return type('cusp', d2 / (2 * d1));
		}
		var f1 = d > 0 ? Math.sqrt(d / 3) : Math.sqrt(-d),
			f2 = 2 * d1;
		return type(d > 0 ? serpentine : 'loop',
			(d2 + f1) / f2,
			(d2 - f1) / f2);
	};
	Curve.getLength = function (v, a, b, ds) {
		if (a === undefined)
			a = 0;
		if (b === undefined)
			b = 1;
		if (Curve.isStraight(v)) {
			var c = v;
			if (b < 1) {
				c = Curve.subdivide(c, b)[0];
				a /= b;
			}
			if (a > 0) {
				c = Curve.subdivide(c, a)[1];
			}
			var dx = c[6] - c[0],
				dy = c[7] - c[1];
			return Math.sqrt(dx * dx + dy * dy);
		}
		return Numerical.integrate(ds || Curve.getLengthIntegrand(v), a, b,
			Curve.getIterations(a, b));
	};
	Curve.getTimeAt = function (v, offset, start) {
		if (start === undefined)
			start = offset < 0 ? 1 : 0;
		if (offset === 0)
			return start;
		var abs = Math.abs,
			epsilon = 1e-12,
			forward = offset > 0,
			a = forward ? start : 0,
			b = forward ? 1 : start,
			ds = Curve.getLengthIntegrand(v),
			rangeLength = Curve.getLength(v, a, b, ds),
			diff = abs(offset) - rangeLength;
		if (abs(diff) < epsilon) {
			return forward ? b : a;
		} else if (diff > epsilon) {
			return null;
		}
		var guess = offset / rangeLength,
			length = 0;
		function f(t) {
			length += Numerical.integrate(ds, start, t,
				Curve.getIterations(start, t));
			start = t;
			return length - offset;
		}
		return Numerical.findRoot(f, ds, start + guess, a, b, 32,
			1e-12);
	};
	Curve.getPoint = function (v, t) {
		return Curve.evaluate(v, t, 0, false);
	};
	Curve.getTangent = function (v, t) {
		return Curve.evaluate(v, t, 1, true);
	};
	Curve.getNormal = function (v, t) {
		return Curve.evaluate(v, t, 2, true);
	};
	Curve.getWeightedNormal = function (v, t) {
		return Curve.evaluate(v, t, 2, false);
	};
	Curve.getCurvature = function (v, t) {
		return Curve.evaluate(v, t, 3, false).x;
	};
	Curve.getPeaks = function (v) {
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7],
			ax = -x0 + 3 * x1 - 3 * x2 + x3,
			bx = 3 * x0 - 6 * x1 + 3 * x2,
			cx = -3 * x0 + 3 * x1,
			ay = -y0 + 3 * y1 - 3 * y2 + y3,
			by = 3 * y0 - 6 * y1 + 3 * y2,
			cy = -3 * y0 + 3 * y1,
			tMin = 1e-8,
			tMax = 1 - tMin,
			roots = [];
		Numerical.solveCubic(
			9 * (ax * ax + ay * ay),
			9 * (ax * bx + by * ay),
			2 * (bx * bx + by * by) + 3 * (cx * ax + cy * ay),
			(cx * bx + by * cy),
			roots, tMin, tMax);
		return roots.sort();
	};
	Curve.addLocation = function (locations, include, c1, t1, c2, t2, overlap) {
		var excludeStart = !overlap && c1.getPrevious() === c2,
			excludeEnd = !overlap && c1 !== c2 && c1.getNext() === c2,
			tMin = 1e-8,
			tMax = 1 - tMin;
		if (t1 !== null && t1 >= (excludeStart ? tMin : 0) &&
			t1 <= (excludeEnd ? tMax : 1)) {
			if (t2 !== null && t2 >= (excludeEnd ? tMin : 0) &&
				t2 <= (excludeStart ? tMax : 1)) {
				var loc1 = new CurveLocation(c1, t1, null, overlap),
					loc2 = new CurveLocation(c2, t2, null, overlap);
				loc1._intersection = loc2;
				loc2._intersection = loc1;
				if (!include || include(loc1)) {
					CurveLocation.insert(locations, loc1, true);
				}
			}
		}
	};
	Curve.addCurveIntersections = function (v1, v2, c1, c2, locations, include, flip,
		recursion, calls, tMin, tMax, uMin, uMax) {
		if (++calls >= 4096 || ++recursion >= 40)
			return calls;
		var fatLineEpsilon = 1e-9,
			q0x = v2[0], q0y = v2[1], q3x = v2[6], q3y = v2[7],
			getSignedDistance = Line.getSignedDistance,
			d1 = getSignedDistance(q0x, q0y, q3x, q3y, v2[2], v2[3]),
			d2 = getSignedDistance(q0x, q0y, q3x, q3y, v2[4], v2[5]),
			factor = d1 * d2 > 0 ? 3 / 4 : 4 / 9,
			dMin = factor * Math.min(0, d1, d2),
			dMax = factor * Math.max(0, d1, d2),
			dp0 = getSignedDistance(q0x, q0y, q3x, q3y, v1[0], v1[1]),
			dp1 = getSignedDistance(q0x, q0y, q3x, q3y, v1[2], v1[3]),
			dp2 = getSignedDistance(q0x, q0y, q3x, q3y, v1[4], v1[5]),
			dp3 = getSignedDistance(q0x, q0y, q3x, q3y, v1[6], v1[7]),
			hull = Curve.getConvexHull(dp0, dp1, dp2, dp3),
			top = hull[0],
			bottom = hull[1],
			tMinClip,
			tMaxClip;
		if (d1 === 0 && d2 === 0
			&& dp0 === 0 && dp1 === 0 && dp2 === 0 && dp3 === 0
			|| (tMinClip = Curve.clipConvexHull(top, bottom, dMin, dMax)) == null
			|| (tMaxClip = Curve.clipConvexHull(top.reverse(), bottom.reverse(),
				dMin, dMax)) == null)
			return calls;
		var tMinNew = tMin + (tMax - tMin) * tMinClip,
			tMaxNew = tMin + (tMax - tMin) * tMaxClip;
		if (Math.max(uMax - uMin, tMaxNew - tMinNew) < fatLineEpsilon) {
			var t = (tMinNew + tMaxNew) / 2,
				u = (uMin + uMax) / 2;
			Curve.addLocation(locations, include,
				flip ? c2 : c1, flip ? u : t,
				flip ? c1 : c2, flip ? t : u);
		} else {
			v1 = Curve.getPart(v1, tMinClip, tMaxClip);
			var uDiff = uMax - uMin;
			if (tMaxClip - tMinClip > 0.8) {
				if (tMaxNew - tMinNew > uDiff) {
					var parts = Curve.subdivide(v1, 0.5),
						t = (tMinNew + tMaxNew) / 2;
					calls = Curve.addCurveIntersections(
						v2, parts[0], c2, c1, locations, include, !flip,
						recursion, calls, uMin, uMax, tMinNew, t);
					calls = Curve.addCurveIntersections(
						v2, parts[1], c2, c1, locations, include, !flip,
						recursion, calls, uMin, uMax, t, tMaxNew);
				} else {
					var parts = Curve.subdivide(v2, 0.5),
						u = (uMin + uMax) / 2;
					calls = Curve.addCurveIntersections(
						parts[0], v1, c2, c1, locations, include, !flip,
						recursion, calls, uMin, u, tMinNew, tMaxNew);
					calls = Curve.addCurveIntersections(
						parts[1], v1, c2, c1, locations, include, !flip,
						recursion, calls, u, uMax, tMinNew, tMaxNew);
				}
			} else {
				if (uDiff === 0 || uDiff >= fatLineEpsilon) {
					calls = Curve.addCurveIntersections(
						v2, v1, c2, c1, locations, include, !flip,
						recursion, calls, uMin, uMax, tMinNew, tMaxNew);
				} else {
					calls = Curve.addCurveIntersections(
						v1, v2, c1, c2, locations, include, flip,
						recursion, calls, tMinNew, tMaxNew, uMin, uMax);
				}
			}
		}
		return calls;
	};
	Curve.getConvexHull = function (dq0, dq1, dq2, dq3) {
		var p0 = [0, dq0],
			p1 = [1 / 3, dq1],
			p2 = [2 / 3, dq2],
			p3 = [1, dq3],
			dist1 = dq1 - (2 * dq0 + dq3) / 3,
			dist2 = dq2 - (dq0 + 2 * dq3) / 3,
			hull;
		if (dist1 * dist2 < 0) {
			hull = [[p0, p1, p3], [p0, p2, p3]];
		} else {
			var distRatio = dist1 / dist2;
			hull = [
				distRatio >= 2 ? [p0, p1, p3]
					: distRatio <= 0.5 ? [p0, p2, p3]
						: [p0, p1, p2, p3],
				[p0, p3]
			];
		}
		return (dist1 || dist2) < 0 ? hull.reverse() : hull;
	};
	Curve.clipConvexHull = function (hullTop, hullBottom, dMin, dMax) {
		if (hullTop[0][1] < dMin) {
			return Curve.clipConvexHullPart(hullTop, true, dMin);
		} else if (hullBottom[0][1] > dMax) {
			return Curve.clipConvexHullPart(hullBottom, false, dMax);
		} else {
			return hullTop[0][0];
		}
	};
	Curve.clipConvexHullPart = function (part, top, threshold) {
		var px = part[0][0],
			py = part[0][1];
		for (var i = 1, l = part.length; i < l; i++) {
			var qx = part[i][0],
				qy = part[i][1];
			if (top ? qy >= threshold : qy <= threshold) {
				return qy === threshold ? qx
					: px + (threshold - py) * (qx - px) / (qy - py);
			}
			px = qx;
			py = qy;
		}
		return null;
	};
	Curve.getCurveLineIntersections = function (v, px, py, vx, vy) {
		var isZero = Numerical.isZero;
		if (isZero(vx) && isZero(vy)) {
			var t = Curve.getTimeOf(v, new Point(px, py));
			return t === null ? [] : [t];
		}
		var angle = Math.atan2(-vy, vx),
			sin = Math.sin(angle),
			cos = Math.cos(angle),
			rv = [],
			roots = [];
		for (var i = 0; i < 8; i += 2) {
			var x = v[i] - px,
				y = v[i + 1] - py;
			rv.push(
				x * cos - y * sin,
				x * sin + y * cos);
		}
		Curve.solveCubic(rv, 1, 0, roots, 0, 1);
		return roots;
	};
	Curve.addCurveLineIntersections = function (v1, v2, c1, c2, locations, include,
		flip) {
		var x1 = v2[0], y1 = v2[1],
			x2 = v2[6], y2 = v2[7];
		var roots = Curve.getCurveLineIntersections(v1, x1, y1, x2 - x1, y2 - y1);
		for (var i = 0, l = roots.length; i < l; i++) {
			var t1 = roots[i],
				p1 = Curve.getPoint(v1, t1),
				t2 = Curve.getTimeOf(v2, p1);
			if (t2 !== null) {
				Curve.addLocation(locations, include,
					flip ? c2 : c1, flip ? t2 : t1,
					flip ? c1 : c2, flip ? t1 : t2);
			}
		}
	};
	Curve.addLineIntersection = function (v1, v2, c1, c2, locations, include) {
		var pt = Line.intersect(
			v1[0], v1[1], v1[6], v1[7],
			v2[0], v2[1], v2[6], v2[7]);
		if (pt) {
			Curve.addLocation(locations, include,
				c1, Curve.getTimeOf(v1, pt),
				c2, Curve.getTimeOf(v2, pt));
		}
	};
	Curve.getCurveIntersections = function (v1, v2, c1, c2, locations, include) {
		var epsilon = 1e-12,
			min = Math.min,
			max = Math.max;

		if (max(v1[0], v1[2], v1[4], v1[6]) + epsilon >
			min(v2[0], v2[2], v2[4], v2[6]) &&
			min(v1[0], v1[2], v1[4], v1[6]) - epsilon <
			max(v2[0], v2[2], v2[4], v2[6]) &&
			max(v1[1], v1[3], v1[5], v1[7]) + epsilon >
			min(v2[1], v2[3], v2[5], v2[7]) &&
			min(v1[1], v1[3], v1[5], v1[7]) - epsilon <
			max(v2[1], v2[3], v2[5], v2[7])) {
			var overlaps = Curve.getOverlaps(v1, v2);
			if (overlaps) {
				for (var i = 0; i < 2; i++) {
					var overlap = overlaps[i];
					Curve.addLocation(locations, include,
						c1, overlap[0],
						c2, overlap[1], true);
				}
			} else {
				var straight1 = Curve.isStraight(v1),
					straight2 = Curve.isStraight(v2),
					straight = straight1 && straight2,
					flip = straight1 && !straight2,
					before = locations.length;
				(straight
					? Curve.addLineIntersection
					: straight1 || straight2
						? Curve.addCurveLineIntersections
						: Curve.addCurveIntersections)(
							flip ? v2 : v1, flip ? v1 : v2,
							flip ? c2 : c1, flip ? c1 : c2,
							locations, include, flip,
							0, 0, 0, 1, 0, 1);
				if (!straight || locations.length === before) {
					for (var i = 0; i < 4; i++) {
						var t1 = i >> 1,
							t2 = i & 1,
							i1 = t1 * 6,
							i2 = t2 * 6,
							p1 = new Point(v1[i1], v1[i1 + 1]),
							p2 = new Point(v2[i2], v2[i2 + 1]);
						if (p1.isClose(p2, epsilon)) {
							Curve.addLocation(locations, include,
								c1, t1,
								c2, t2);
						}
					}
				}
			}
		}
		return locations;
	};
	Curve.getSelfIntersection = function (v1, c1, locations, include) {
		var info = Curve.classify(v1);
		if (info.type === 'loop') {
			var roots = info.roots;
			Curve.addLocation(locations, include,
				c1, roots[0],
				c1, roots[1]);
		}
		return locations;
	};
	Curve.getIntersections = function (curves1, curves2, include, matrix1, matrix2,
		_returnFirst) {
		var epsilon = 1e-7,
			self = !curves2;
		if (self)
			curves2 = curves1;
		var length1 = curves1.length,
			length2 = curves2.length,
			values1 = new Array(length1),
			values2 = self ? values1 : new Array(length2),
			locations = [];

		for (var i = 0; i < length1; i++) {
			values1[i] = curves1[i].getValues(matrix1);
		}
		if (!self) {
			for (var i = 0; i < length2; i++) {
				values2[i] = curves2[i].getValues(matrix2);
			}
		}
		var boundsCollisions = CollisionDetection.findCurveBoundsCollisions(
			values1, values2, epsilon);
		for (var index1 = 0; index1 < length1; index1++) {
			var curve1 = curves1[index1],
				v1 = values1[index1];
			if (self) {
				Curve.getSelfIntersection(v1, curve1, locations, include);
			}
			var collisions1 = boundsCollisions[index1];
			if (collisions1) {
				for (var j = 0; j < collisions1.length; j++) {
					if (_returnFirst && locations.length)
						return locations;
					var index2 = collisions1[j];
					if (!self || index2 > index1) {
						var curve2 = curves2[index2],
							v2 = values2[index2];
						Curve.getCurveIntersections(
							v1, v2, curve1, curve2, locations, include);
					}
				}
			}
		}
		return locations;
	};
	Curve.getOverlaps = function (v1, v2) {

		function getSquaredLineLength(v) {
			var x = v[6] - v[0],
				y = v[7] - v[1];
			return x * x + y * y;
		}

		var abs = Math.abs,
			getDistance = Line.getDistance,
			timeEpsilon = 1e-8,
			geomEpsilon = 1e-7,
			straight1 = Curve.isStraight(v1),
			straight2 = Curve.isStraight(v2),
			straightBoth = straight1 && straight2,
			flip = getSquaredLineLength(v1) < getSquaredLineLength(v2),
			l1 = flip ? v2 : v1,
			l2 = flip ? v1 : v2,
			px = l1[0], py = l1[1],
			vx = l1[6] - px, vy = l1[7] - py;
		if (getDistance(px, py, vx, vy, l2[0], l2[1], true) < geomEpsilon &&
			getDistance(px, py, vx, vy, l2[6], l2[7], true) < geomEpsilon) {
			if (!straightBoth &&
				getDistance(px, py, vx, vy, l1[2], l1[3], true) < geomEpsilon &&
				getDistance(px, py, vx, vy, l1[4], l1[5], true) < geomEpsilon &&
				getDistance(px, py, vx, vy, l2[2], l2[3], true) < geomEpsilon &&
				getDistance(px, py, vx, vy, l2[4], l2[5], true) < geomEpsilon) {
				straight1 = straight2 = straightBoth = true;
			}
		} else if (straightBoth) {
			return null;
		}
		if (straight1 ^ straight2) {
			return null;
		}

		var v = [v1, v2],
			pairs = [];
		for (var i = 0; i < 4 && pairs.length < 2; i++) {
			var i1 = i & 1,
				i2 = i1 ^ 1,
				t1 = i >> 1,
				t2 = Curve.getTimeOf(v[i1], new Point(
					v[i2][t1 ? 6 : 0],
					v[i2][t1 ? 7 : 1]));
			if (t2 != null) {
				var pair = i1 ? [t1, t2] : [t2, t1];
				if (!pairs.length ||
					abs(pair[0] - pairs[0][0]) > timeEpsilon &&
					abs(pair[1] - pairs[0][1]) > timeEpsilon) {
					pairs.push(pair);
				}
			}
			if (i > 2 && !pairs.length)
				break;
		}
		if (pairs.length !== 2) {
			pairs = null;
		} else if (!straightBoth) {
			var o1 = Curve.getPart(v1, pairs[0][0], pairs[1][0]),
				o2 = Curve.getPart(v2, pairs[0][1], pairs[1][1]);
			if (abs(o2[2] - o1[2]) > geomEpsilon ||
				abs(o2[3] - o1[3]) > geomEpsilon ||
				abs(o2[4] - o1[4]) > geomEpsilon ||
				abs(o2[5] - o1[5]) > geomEpsilon)
				pairs = null;
		}
		return pairs;
	};
	Curve.getTimesWithTangent = function (v, tangent) {
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7],
			normalized = tangent.normalize(),
			tx = normalized.x,
			ty = normalized.y,
			ax = 3 * x3 - 9 * x2 + 9 * x1 - 3 * x0,
			ay = 3 * y3 - 9 * y2 + 9 * y1 - 3 * y0,
			bx = 6 * x2 - 12 * x1 + 6 * x0,
			by = 6 * y2 - 12 * y1 + 6 * y0,
			cx = 3 * x1 - 3 * x0,
			cy = 3 * y1 - 3 * y0,
			den = 2 * ax * ty - 2 * ay * tx,
			times = [];
		if (Math.abs(den) < Numerical.CURVETIME_EPSILON) {
			var num = ax * cy - ay * cx,
				den = ax * by - ay * bx;
			if (den != 0) {
				var t = -num / den;
				if (t >= 0 && t <= 1) times.push(t);
			}
		} else {
			var delta = (bx * bx - 4 * ax * cx) * ty * ty +
				(-2 * bx * by + 4 * ay * cx + 4 * ax * cy) * tx * ty +
				(by * by - 4 * ay * cy) * tx * tx,
				k = bx * ty - by * tx;
			if (delta >= 0 && den != 0) {
				var d = Math.sqrt(delta),
					t0 = -(k + d) / den,
					t1 = (-k + d) / den;
				if (t0 >= 0 && t0 <= 1) times.push(t0);
				if (t1 >= 0 && t1 <= 1) times.push(t1);
			}
		}
		return times;
	};

	var CurveLocation = function (curve, time, point, _overlap, _distance) {
		if (time >= 0.99999999) {
			var next = curve.getNext();
			if (next) {
				time = 0;
				curve = next;
			}
		}
		this._setCurve(curve);
		this._time = time;
		this._point = point || curve.getPointAtTime(time);
		this._overlap = _overlap;
		this._distance = _distance;
		this._intersection = this._next = this._previous = null;
	};
	InitClassWithStatics(CurveLocation, Base);

	CurveLocation.prototype._setPath = function (path) {
		this._path = path;
		this._version = path ? path._version : 0;
	};
	CurveLocation.prototype._setCurve = function (curve) {
		this._setPath(curve._path);
		this._curve = curve;
		this._segment = null;
		this._segment1 = curve._segment1;
		this._segment2 = curve._segment2;
	};
	CurveLocation.prototype._setSegment = function (segment) {
		var curve = segment.getCurve();
		if (curve) {
			this._setCurve(curve);
		} else {
			this._setPath(segment._path);
			this._segment1 = segment;
			this._segment2 = null;
		}
		this._segment = segment;
		this._time = segment === this._segment1 ? 0 : 1;
		this._point = segment._point.clone();
	};
	CurveLocation.prototype.getSegment = function () {
		var segment = this._segment;
		if (!segment) {
			var curve = this.getCurve(),
				time = this.getTime();
			if (time === 0) {
				segment = curve._segment1;
			} else if (time === 1) {
				segment = curve._segment2;
			} else if (time != null) {
				segment = curve.getPartLength(0, time)
					< curve.getPartLength(time, 1)
					? curve._segment1
					: curve._segment2;
			}
			this._segment = segment;
		}
		return segment;
	};
	CurveLocation.prototype.getCurve = function () {
		var path = this._path,
			that = this;
		if (path && path._version !== this._version) {
			this._time = this._offset = this._curveOffset = this._curve = null;
		}

		function trySegment(segment) {
			var curve = segment && segment.getCurve();
			if (curve && (that._time = curve.getTimeOf(that._point)) != null) {
				that._setCurve(curve);
				return curve;
			}
		}

		return this._curve
			|| trySegment(this._segment)
			|| trySegment(this._segment1)
			|| trySegment(this._segment2.getPrevious());
	};
	CurveLocation.prototype.getPath = function () {
		var curve = this.getCurve();
		return curve && curve._path;
	};
	CurveLocation.prototype.getIndex = function () {
		var curve = this.getCurve();
		return curve && curve.getIndex();
	};
	CurveLocation.prototype.getTime = function () {
		var curve = this.getCurve(),
			time = this._time;
		return curve && time == null
			? this._time = curve.getTimeOf(this._point)
			: time;
	};
	CurveLocation.prototype.getPoint = function () {
		return this._point;
	};
	CurveLocation.prototype.getOffset = function () {
		var offset = this._offset;
		if (offset == null) {
			offset = 0;
			var path = this.getPath(),
				index = this.getIndex();
			if (path && index != null) {
				var curves = path.getCurves();
				for (var i = 0; i < index; i++)
					offset += curves[i].getLength();
			}
			this._offset = offset += this.getCurveOffset();
		}
		return offset;
	};
	CurveLocation.prototype.getCurveOffset = function () {
		var offset = this._curveOffset;
		if (offset == null) {
			var curve = this.getCurve(),
				time = this.getTime();
			this._curveOffset = offset = time != null && curve
				&& curve.getPartLength(0, time);
		}
		return offset;
	};
	CurveLocation.prototype.getIntersection = function () {
		return this._intersection;
	};
	CurveLocation.prototype.getDistance = function () {
		return this._distance;
	};
	CurveLocation.prototype.divide = function () {
		var curve = this.getCurve(),
			res = curve && curve.divideAtTime(this.getTime());
		if (res) {
			this._setSegment(res._segment1);
		}
		return res;
	};
	CurveLocation.prototype.split = function () {
		var curve = this.getCurve(),
			path = curve._path,
			res = curve && curve.splitAtTime(this.getTime());
		if (res) {
			this._setSegment(path.getLastSegment());
		}
		return res;
	};
	CurveLocation.prototype.equals = function (loc, _ignoreOther) {
		var res = this === loc;
		if (!res && loc instanceof CurveLocation) {
			var c1 = this.getCurve(),
				c2 = loc.getCurve(),
				p1 = c1._path,
				p2 = c2._path;
			if (p1 === p2) {
				var abs = Math.abs,
					epsilon = 1e-7,
					diff = abs(this.getOffset() - loc.getOffset()),
					i1 = !_ignoreOther && this._intersection,
					i2 = !_ignoreOther && loc._intersection;
				res = (diff < epsilon
					|| p1 && abs(p1.getLength() - diff) < epsilon)
					&& (!i1 && !i2 || i1 && i2 && i1.equals(i2, true));
			}
		}
		return res;
	};
	CurveLocation.prototype.isTouching = function () {
		var inter = this._intersection;
		if (inter && this.getTangent().isCollinear(inter.getTangent())) {
			var curve1 = this.getCurve(),
				curve2 = inter.getCurve();
			return !(curve1.isStraight() && curve2.isStraight()
				&& curve1.getLine().intersect(curve2.getLine()));
		}
		return false;
	};
	CurveLocation.prototype.isCrossing = function () {
		var inter = this._intersection;
		if (!inter)
			return false;
		var t1 = this.getTime(),
			t2 = inter.getTime(),
			tMin = 1e-8,
			tMax = 1 - tMin,
			t1Inside = t1 >= tMin && t1 <= tMax,
			t2Inside = t2 >= tMin && t2 <= tMax;
		if (t1Inside && t2Inside)
			return !this.isTouching();
		var c2 = this.getCurve(),
			c1 = c2 && t1 < tMin ? c2.getPrevious() : c2,
			c4 = inter.getCurve(),
			c3 = c4 && t2 < tMin ? c4.getPrevious() : c4;
		if (t1 > tMax)
			c2 = c2.getNext();
		if (t2 > tMax)
			c4 = c4.getNext();
		if (!c1 || !c2 || !c3 || !c4)
			return false;

		var offsets = [];

		function addOffsets(curve, end) {
			var v = curve.getValues(),
				roots = Curve.classify(v).roots || Curve.getPeaks(v),
				count = roots.length,
				offset = Curve.getLength(v,
					end && count ? roots[count - 1] : 0,
					!end && count ? roots[0] : 1);
			offsets.push(count ? offset : offset / 32);
		}

		function isInRange(angle, min, max) {
			return min < max
				? angle > min && angle < max
				: angle > min || angle < max;
		}

		if (!t1Inside) {
			addOffsets(c1, true);
			addOffsets(c2, false);
		}
		if (!t2Inside) {
			addOffsets(c3, true);
			addOffsets(c4, false);
		}
		var pt = this.getPoint(),
			offset = Math.min.apply(Math, offsets),
			v2 = t1Inside ? c2.getTangentAtTime(t1)
				: c2.getPointAt(offset).subtract(pt),
			v1 = t1Inside ? v2.negate()
				: c1.getPointAt(-offset).subtract(pt),
			v4 = t2Inside ? c4.getTangentAtTime(t2)
				: c4.getPointAt(offset).subtract(pt),
			v3 = t2Inside ? v4.negate()
				: c3.getPointAt(-offset).subtract(pt),
			a1 = v1.getAngle(),
			a2 = v2.getAngle(),
			a3 = v3.getAngle(),
			a4 = v4.getAngle();
		return !!(t1Inside
			? (isInRange(a1, a3, a4) ^ isInRange(a2, a3, a4)) &&
			(isInRange(a1, a4, a3) ^ isInRange(a2, a4, a3))
			: (isInRange(a3, a1, a2) ^ isInRange(a4, a1, a2)) &&
			(isInRange(a3, a2, a1) ^ isInRange(a4, a2, a1)));
	};
	CurveLocation.prototype.hasOverlap = function () {
		return !!this._overlap;
	};
	CurveLocation.prototype.getTangent = function () {
		var curve = this.getCurve(),
			time = this.getTime();
		return time != null && curve && curve['getTangentAt'](time, true);
	};
	CurveLocation.prototype.getNormal = function () {
		var curve = this.getCurve(),
			time = this.getTime();
		return time != null && curve && curve['getNormalAt'](time, true);
	};
	CurveLocation.prototype.getWeightedTangent = function () {
		var curve = this.getCurve(),
			time = this.getTime();
		return time != null && curve && curve['getWeightedTangentAt'](time, true);
	};
	CurveLocation.prototype.getWeightedNormal = function () {
		var curve = this.getCurve(),
			time = this.getTime();
		return time != null && curve && curve['getWeightedNormalAt'](time, true);
	};
	CurveLocation.prototype.getCurvature = function () {
		var curve = this.getCurve(),
			time = this.getTime();
		return time != null && curve && curve['getCurvatureAt'](time, true);
	};

	CurveLocation.insert = function (locations, loc, merge) {
		var length = locations.length,
			l = 0,
			r = length - 1;

		function search(index, dir) {
			for (var i = index + dir; i >= -1 && i <= length; i += dir) {
				var loc2 = locations[((i % length) + length) % length];
				if (!loc.getPoint().isClose(loc2.getPoint(),
					1e-7))
					break;
				if (loc.equals(loc2))
					return loc2;
			}
			return null;
		}

		while (l <= r) {
			var m = (l + r) >>> 1,
				loc2 = locations[m],
				found;
			if (merge && (found = loc.equals(loc2) ? loc2
				: (search(m, -1) || search(m, 1)))) {
				if (loc._overlap) {
					found._overlap = found._intersection._overlap = true;
				}
				return found;
			}
			var path1 = loc.getPath(),
				path2 = loc2.getPath(),
				diff = path1 !== path2
					? path1._id - path2._id
					: (loc.getIndex() + loc.getTime())
					- (loc2.getIndex() + loc2.getTime());
			if (diff < 0) {
				r = m - 1;
			} else {
				l = m + 1;
			}
		}
		locations.splice(l, 0, loc);
		return loc;
	};
	CurveLocation.expand = function (locations) {
		var expanded = locations.slice();
		for (var i = locations.length - 1; i >= 0; i--) {
			CurveLocation.insert(expanded, locations[i]._intersection, false);
		}
		return expanded;
	};

	var PathItem = function PathItem() {
	};
	InitClassWithStatics(PathItem, Item);

	PathItem.prototype._asPathItem = function () {
		return this;
	};
	PathItem.prototype.isClockwise = function () {
		return this.getArea() >= 0;
	};
	PathItem.prototype.setClockwise = function (clockwise) {
		if (this.isClockwise() != (clockwise = !!clockwise))
			this.reverse();
	};
	PathItem.prototype.setPathData = function (data) {

		var parts = data && data.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
			coords,
			relative = false,
			previous,
			control,
			current = new Point(),
			start = new Point();

		function getCoord(index, coord) {
			var val = +coords[index];
			if (relative)
				val += current[coord];
			return val;
		}

		function getPoint(index) {
			return new Point(
				getCoord(index, 'x'),
				getCoord(index + 1, 'y')
			);
		}

		this.clear();

		for (var i = 0, l = parts && parts.length; i < l; i++) {
			var part = parts[i],
				command = part[0],
				lower = command.toLowerCase();
			coords = part.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
			var length = coords && coords.length;
			relative = command === lower;
			if (previous === 'z' && !/[mz]/.test(lower))
				this.moveTo(current);
			switch (lower) {
				case 'm':
				case 'l':
					var move = lower === 'm';
					for (var j = 0; j < length; j += 2) {
						this[move ? 'moveTo' : 'lineTo'](current = getPoint(j));
						if (move) {
							start = current;
							move = false;
						}
					}
					control = current;
					break;
				case 'h':
				case 'v':
					var coord = lower === 'h' ? 'x' : 'y';
					current = current.clone();
					for (var j = 0; j < length; j++) {
						current[coord] = getCoord(j, coord);
						this.lineTo(current);
					}
					control = current;
					break;
				case 'c':
					for (var j = 0; j < length; j += 6) {
						this.cubicCurveTo(
							getPoint(j),
							control = getPoint(j + 2),
							current = getPoint(j + 4));
					}
					break;
				case 's':
					for (var j = 0; j < length; j += 4) {
						this.cubicCurveTo(
							/[cs]/.test(previous)
								? current.multiply(2).subtract(control)
								: current,
							control = getPoint(j),
							current = getPoint(j + 2));
						previous = lower;
					}
					break;
				case 'q':
					for (var j = 0; j < length; j += 4) {
						this.quadraticCurveTo(
							control = getPoint(j),
							current = getPoint(j + 2));
					}
					break;
				case 't':
					for (var j = 0; j < length; j += 2) {
						this.quadraticCurveTo(
							control = (/[qt]/.test(previous)
								? current.multiply(2).subtract(control)
								: current),
							current = getPoint(j));
						previous = lower;
					}
					break;
				case 'a':
					for (var j = 0; j < length; j += 7) {
						this.arcTo(current = getPoint(j + 5),
							new Size(+coords[j], +coords[j + 1]),
							+coords[j + 2], +coords[j + 4], +coords[j + 3]);
					}
					break;
				case 'z':
					this.closePath(1e-12);
					current = start;
					break;
			}
			previous = lower;
		}
	};
	PathItem.prototype._contains = function (point) {
		var winding = point.isInside(
			this.getBounds({ internal: true, handle: true }))
			? this._getWinding(point)
			: {};
		return winding.onPath || !!(winding.winding);
	};
	PathItem.prototype.getIntersections = function (path, include, _matrix, _returnFirst) {
		var self = this === path || !path,
			matrix1 = this._matrix._orNullIfIdentity(),
			matrix2 = self ? matrix1
				: (_matrix || path._matrix)._orNullIfIdentity();
		return self || this.getBounds(matrix1).intersects(
			path.getBounds(matrix2), 1e-12)
			? Curve.getIntersections(
				this.getCurves(), !self && path.getCurves(), include,
				matrix1, matrix2, _returnFirst)
			: [];
	};
	PathItem.prototype.getNearestLocation = function () {
		var point = Point.read(arguments),
			curves = this.getCurves(),
			minDist = Infinity,
			minLoc = null;
		for (var i = 0, l = curves.length; i < l; i++) {
			var loc = curves[i].getNearestLocation(point);
			if (loc._distance < minDist) {
				minDist = loc._distance;
				minLoc = loc;
			}
		}
		return minLoc;
	};
	PathItem.prototype.getNearestPoint = function () {
		var loc = this.getNearestLocation.apply(this, arguments);
		return loc ? loc.getPoint() : loc;
	};
	PathItem.prototype.interpolate = function (from, to, factor) {
		var isPath = !this._children,
			name = isPath ? '_segments' : '_children',
			itemsFrom = from[name],
			itemsTo = to[name],
			items = this[name];
		if (!itemsFrom || !itemsTo || itemsFrom.length !== itemsTo.length) {
			throw new Error('Invalid operands in interpolate() call: ' +
				from + ', ' + to);
		}
		var current = items.length,
			length = itemsTo.length;
		if (current < length) {
			var ctor = isPath ? Segment : Path;
			for (var i = current; i < length; i++) {
				this.add(new ctor());
			}
		} else if (current > length) {
			this[isPath ? 'removeSegments' : 'removeChildren'](length, current);
		}
		for (var i = 0; i < length; i++) {
			items[i].interpolate(itemsFrom[i], itemsTo[i], factor);
		}
		if (isPath) {
			this.setClosed(from._closed);
			this._changed(9);
		}
	};
	PathItem.prototype.compare = function (path) {
		var ok = false;
		if (path) {
			var paths1 = this._children || [this],
				paths2 = path._children ? path._children.slice() : [path],
				length1 = paths1.length,
				length2 = paths2.length,
				matched = [],
				count = 0;
			ok = true;
			var boundsOverlaps = CollisionDetection.findItemBoundsCollisions(paths1, paths2, Numerical.GEOMETRIC_EPSILON);
			for (var i1 = length1 - 1; i1 >= 0 && ok; i1--) {
				var path1 = paths1[i1];
				ok = false;
				var pathBoundsOverlaps = boundsOverlaps[i1];
				if (pathBoundsOverlaps) {
					for (var i2 = pathBoundsOverlaps.length - 1; i2 >= 0 && !ok; i2--) {
						if (path1.compare(paths2[pathBoundsOverlaps[i2]])) {
							if (!matched[pathBoundsOverlaps[i2]]) {
								matched[pathBoundsOverlaps[i2]] = true;
								count++;
							}
							ok = true;
						}
					}
				}
			}
			ok = ok && count === length2;
		}
		return ok;
	};
	PathItem.prototype._getWinding = function (point, dir, closed) {
		return PathItem.getWinding(point, this.getCurves(), dir, closed);
	};
	PathItem.prototype.unite = function (path, options) {
		return PathItem.traceBoolean(this, path, 'unite', options);
	};
	PathItem.prototype.intersect = function (path, options) {
		return PathItem.traceBoolean(this, path, 'intersect', options);
	};
	PathItem.prototype.subtract = function (path, options) {
		return PathItem.traceBoolean(this, path, 'subtract', options);
	};
	PathItem.prototype.exclude = function (path, options) {
		return PathItem.traceBoolean(this, path, 'exclude', options);
	};
	PathItem.prototype.divide = function (path, options) {
		return options && (options.trace == false || options.stroke)
			? PathItem.splitBoolean(this, path, 'divide')
			: PathItem.createResult([
				this.subtract(path, options),
				this.intersect(path, options)
			], true, this, path, options);
	};
	PathItem.prototype.resolveCrossings = function () {
		var children = this._children,
			paths = children || [this];

		function hasOverlap(seg, path) {
			var inter = seg && seg._intersection;
			return inter && inter._overlap && inter._path === path;
		}

		var hasOverlaps = false,
			hasCrossings = false,
			intersections = this.getIntersections(null, function (inter) {
				return inter.hasOverlap() && (hasOverlaps = true) ||
					inter.isCrossing() && (hasCrossings = true);
			}),
			clearCurves = hasOverlaps && hasCrossings && [];
		intersections = CurveLocation.expand(intersections);
		if (hasOverlaps) {
			var overlaps = PathItem.divideLocations(intersections, function (inter) {
				return inter.hasOverlap();
			}, clearCurves);
			for (var i = overlaps.length - 1; i >= 0; i--) {
				var overlap = overlaps[i],
					path = overlap._path,
					seg = overlap._segment,
					prev = seg.getPrevious(),
					next = seg.getNext();
				if (hasOverlap(prev, path) && hasOverlap(next, path)) {
					seg.remove();
					prev._handleOut._set(0, 0);
					next._handleIn._set(0, 0);
					if (prev !== seg && !prev.getCurve().hasLength()) {
						next._handleIn.set(prev._handleIn);
						prev.remove();
					}
				}
			}
		}
		if (hasCrossings) {
			PathItem.divideLocations(intersections, hasOverlaps && function (inter) {
				var curve1 = inter.getCurve(),
					seg1 = inter.getSegment(),
					other = inter._intersection,
					curve2 = other._curve,
					seg2 = other._segment;
				if (curve1 && curve2 && curve1._path && curve2._path)
					return true;
				if (seg1)
					seg1._intersection = null;
				if (seg2)
					seg2._intersection = null;
			}, clearCurves);
			if (clearCurves)
				PathItem.clearCurveHandles(clearCurves);
			paths = PathItem.tracePaths(Base.each(paths, function (path) {
				this.push.apply(this, path._segments);
			}, []));
		}
		var length = paths.length,
			item;
		if (length > 1 && children) {
			if (paths !== children)
				this.setChildren(paths);
			item = this;
		} else if (length === 1 && !children) {
			if (paths[0] !== this)
				this.setSegments(paths[0].removeSegments());
			item = this;
		}
		if (!item) {
			item = new CompoundPath({ insert: false });
			item.addChildren(paths);
			item = item.reduce();
			item.copyAttributes(this);
			this.replaceWith(item);
		}
		return item;
	};
	PathItem.prototype.reorient = function (nonZero, clockwise) {
		var children = this._children;
		if (children && children.length) {
			this.setChildren(PathItem.reorientPaths(this.removeChildren(),
				function (w) {
					return !!(nonZero ? w : w & 1);
				},
				clockwise));
		} else if (clockwise !== undefined) {
			this.setClockwise(clockwise);
		}
		return this;
	};
	PathItem.prototype.getInteriorPoint = function () {
		var bounds = this.getBounds(),
			point = bounds.getCenter(true);
		if (!this.contains(point)) {
			var curves = this.getCurves(),
				y = point.y,
				intercepts = [],
				roots = [];
			for (var i = 0, l = curves.length; i < l; i++) {
				var v = curves[i].getValues(),
					o0 = v[1],
					o1 = v[3],
					o2 = v[5],
					o3 = v[7];
				if (y >= Math.min(o0, o1, o2, o3) && y <= Math.max(o0, o1, o2, o3)) {
					var monoCurves = Curve.getMonoCurves(v);
					for (var j = 0, m = monoCurves.length; j < m; j++) {
						var mv = monoCurves[j],
							mo0 = mv[1],
							mo3 = mv[7];
						if ((mo0 !== mo3) &&
							(y >= mo0 && y <= mo3 || y >= mo3 && y <= mo0)) {
							var x = y === mo0 ? mv[0]
								: y === mo3 ? mv[6]
									: Curve.solveCubic(mv, 1, y, roots, 0, 1)
										=== 1
										? Curve.getPoint(mv, roots[0]).x
										: (mv[0] + mv[6]) / 2;
							intercepts.push(x);
						}
					}
				}
			}
			if (intercepts.length > 1) {
				intercepts.sort(function (a, b) { return a - b; });
				point.x = (intercepts[0] + intercepts[1]) / 2;
			}
		}
		return point;
	};

	PathItem.getPaths = function (path) {
		return path._children || [path];
	};
	PathItem.preparePath = function (path, resolve) {
		var res = path
			.clone(false)
			.reduce({ simplify: true })
			.transform(null, true, true);
		if (resolve) {
			var paths = PathItem.getPaths(res);
			for (var i = 0, l = paths.length; i < l; i++) {
				var path = paths[i];
				if (!path._closed && !path.isEmpty()) {
					path.closePath(1e-12);
					path.getFirstSegment().setHandleIn(0, 0);
					path.getLastSegment().setHandleOut(0, 0);
				}
			}
			res = res
				.resolveCrossings()
				.reorient(true, true);
		}
		return res;
	};
	PathItem.createResult = function (paths, simplify, path1, path2, options) {
		var result = new CompoundPath({ insert: false });
		result.addChildren(paths, true);
		result = result.reduce({ simplify: simplify });
		if (!(options && options.insert == false)) {
			result.insertAbove(path2 && path1.isSibling(path2)
				&& path1.getIndex() < path2.getIndex() ? path2 : path1);
		}
		result.copyAttributes(path1, true);
		return result;
	};
	PathItem.filterIntersection = function (inter) {
		return inter.hasOverlap() || inter.isCrossing();
	};
	PathItem.traceBoolean = function (path1, path2, operation, options) {
		if (options && (options.trace == false || options.stroke) &&
			/^(subtract|intersect)$/.test(operation))
			return PathItem.splitBoolean(path1, path2, operation);
		var operators = {
			unite: { '1': true, '2': true },
			intersect: { '2': true },
			subtract: { '1': true },
			exclude: { '1': true, '-1': true }
		};
		var _path1 = PathItem.preparePath(path1, true),
			_path2 = path2 && path1 !== path2 && PathItem.preparePath(path2, true),
			operator = operators[operation];
		operator[operation] = true;
		if (_path2 && (operator.subtract || operator.exclude)
			^ (_path2.isClockwise() ^ _path1.isClockwise()))
			_path2.reverse();
		var crossings = PathItem.divideLocations(CurveLocation.expand(
			_path1.getIntersections(_path2, PathItem.filterIntersection))),
			paths1 = PathItem.getPaths(_path1),
			paths2 = _path2 && PathItem.getPaths(_path2),
			segments = [],
			curves = [],
			paths;

		function collectPaths(paths) {
			for (var i = 0, l = paths.length; i < l; i++) {
				var path = paths[i];
				segments.push.apply(segments, path._segments);
				curves.push.apply(curves, path.getCurves());
				path._overlapsOnly = true;
			}
		}

		function getCurves(indices) {
			var list = [];
			for (var i = 0, l = indices && indices.length; i < l; i++) {
				list.push(curves[indices[i]]);
			}
			return list;
		}

		if (crossings.length) {
			collectPaths(paths1);
			if (paths2)
				collectPaths(paths2);

			var curvesValues = new Array(curves.length);
			for (var i = 0, l = curves.length; i < l; i++) {
				curvesValues[i] = curves[i].getValues();
			}
			var curveCollisions = CollisionDetection.findCurveBoundsCollisions(
				curvesValues, curvesValues, 0, true);
			var curveCollisionsMap = {};
			for (var i = 0; i < curves.length; i++) {
				var curve = curves[i],
					id = curve._path._id,
					map = curveCollisionsMap[id] = curveCollisionsMap[id] || {};
				map[curve.getIndex()] = {
					hor: getCurves(curveCollisions[i].hor),
					ver: getCurves(curveCollisions[i].ver)
				};
			}

			for (var i = 0, l = crossings.length; i < l; i++) {
				PathItem.propagateWinding(crossings[i]._segment, _path1, _path2,
					curveCollisionsMap, operator);
			}
			for (var i = 0, l = segments.length; i < l; i++) {
				var segment = segments[i],
					inter = segment._intersection;
				if (!segment._winding) {
					PathItem.propagateWinding(segment, _path1, _path2,
						curveCollisionsMap, operator);
				}
				if (!(inter && inter._overlap))
					segment._path._overlapsOnly = false;
			}
			paths = PathItem.tracePaths(segments, operator);
		} else {
			paths = PathItem.reorientPaths(
				paths2 ? paths1.concat(paths2) : paths1.slice(),
				function (w) {
					return !!operator[w];
				});
		}
		return PathItem.createResult(paths, true, path1, path2, options);
	};
	PathItem.splitBoolean = function (path1, path2, operation) {
		var _path1 = PathItem.preparePath(path1),
			_path2 = PathItem.preparePath(path2),
			crossings = _path1.getIntersections(_path2, PathItem.filterIntersection),
			subtract = operation === 'subtract',
			divide = operation === 'divide',
			added = {},
			paths = [];

		function addPath(path) {
			if (!added[path._id] && (divide ||
				_path2.contains(path.getPointAt(path.getLength() / 2))
				^ subtract)) {
				paths.unshift(path);
				return added[path._id] = true;
			}
		}

		for (var i = crossings.length - 1; i >= 0; i--) {
			var path = crossings[i].split();
			if (path) {
				if (addPath(path))
					path.getFirstSegment().setHandleIn(0, 0);
				_path1.getLastSegment().setHandleOut(0, 0);
			}
		}
		addPath(_path1);
		return PathItem.createResult(paths, false, path1, path2);
	};
	PathItem.linkIntersections = function (from, to) {
		var prev = from;
		while (prev) {
			if (prev === to)
				return;
			prev = prev._previous;
		}
		while (from._next && from._next !== to)
			from = from._next;
		if (!from._next) {
			while (to._previous)
				to = to._previous;
			from._next = to;
			to._previous = from;
		}
	};
	PathItem.clearCurveHandles = function (curves) {
		for (var i = curves.length - 1; i >= 0; i--)
			curves[i].clearHandles();
	};
	PathItem.reorientPaths = function (paths, isInside, clockwise) {
		var length = paths && paths.length;
		if (length) {
			var lookup = Base.each(paths, function (path, i) {
				this[path._id] = {
					container: null,
					winding: path.isClockwise() ? 1 : -1,
					index: i
				};
			}, {}),
				sorted = paths.slice().sort(function (a, b) {
					return Math.abs(b.getArea()) - Math.abs(a.getArea());
				}),
				first = sorted[0];
			var collisions = CollisionDetection.findItemBoundsCollisions(sorted,
				null, Numerical.GEOMETRIC_EPSILON);
			if (clockwise == null)
				clockwise = first.isClockwise();
			for (var i = 0; i < length; i++) {
				var path1 = sorted[i],
					entry1 = lookup[path1._id],
					containerWinding = 0,
					indices = collisions[i];
				if (indices) {
					var point = null;
					for (var j = indices.length - 1; j >= 0; j--) {
						if (indices[j] < i) {
							point = point || path1.getInteriorPoint();
							var path2 = sorted[indices[j]];
							if (path2.contains(point)) {
								var entry2 = lookup[path2._id];
								containerWinding = entry2.winding;
								entry1.winding += containerWinding;
								entry1.container = entry2.exclude
									? entry2.container : path2;
								break;
							}
						}
					}
				}
				if (isInside(entry1.winding) === isInside(containerWinding)) {
					entry1.exclude = true;
					paths[entry1.index] = null;
				} else {
					var container = entry1.container;
					path1.setClockwise(
						container ? !container.isClockwise() : clockwise);
				}
			}
		}
		return paths;
	};
	PathItem.divideLocations = function (locations, include, clearLater) {
		var results = include && [],
			tMin = 1e-8,
			tMax = 1 - tMin,
			clearHandles = false,
			clearCurves = clearLater || [],
			clearLookup = clearLater && {},
			renormalizeLocs,
			prevCurve,
			prevTime;

		function getId(curve) {
			return curve._path._id + '.' + curve._segment1._index;
		}

		for (var i = (clearLater && clearLater.length) - 1; i >= 0; i--) {
			var curve = clearLater[i];
			if (curve._path)
				clearLookup[getId(curve)] = true;
		}

		for (var i = locations.length - 1; i >= 0; i--) {
			var loc = locations[i],
				time = loc._time,
				origTime = time,
				exclude = include && !include(loc),
				curve = loc._curve,
				segment;
			if (curve) {
				if (curve !== prevCurve) {
					clearHandles = !curve.hasHandles()
						|| clearLookup && clearLookup[getId(curve)];
					renormalizeLocs = [];
					prevTime = null;
					prevCurve = curve;
				} else if (prevTime >= tMin) {
					time /= prevTime;
				}
			}
			if (exclude) {
				if (renormalizeLocs)
					renormalizeLocs.push(loc);
				continue;
			} else if (include) {
				results.unshift(loc);
			}
			prevTime = origTime;
			if (time < tMin) {
				segment = curve._segment1;
			} else if (time > tMax) {
				segment = curve._segment2;
			} else {
				var newCurve = curve.divideAtTime(time, true);
				if (clearHandles)
					clearCurves.push(curve, newCurve);
				segment = newCurve._segment1;
				for (var j = renormalizeLocs.length - 1; j >= 0; j--) {
					var l = renormalizeLocs[j];
					l._time = (l._time - time) / (1 - time);
				}
			}
			loc._setSegment(segment);
			var inter = segment._intersection,
				dest = loc._intersection;
			if (inter) {
				PathItem.linkIntersections(inter, dest);
				var other = inter;
				while (other) {
					PathItem.linkIntersections(other._intersection, inter);
					other = other._next;
				}
			} else {
				segment._intersection = dest;
			}
		}
		if (!clearLater)
			PathItem.clearCurveHandles(clearCurves);
		return results || locations;
	};
	PathItem.getWinding = function (point, curves, dir, closed, dontFlip) {
		var curvesList = Array.isArray(curves)
			? curves
			: curves[dir ? 'hor' : 'ver'];
		var ia = dir ? 1 : 0,
			io = ia ^ 1,
			pv = [point.x, point.y],
			pa = pv[ia],
			po = pv[io],
			windingEpsilon = 1e-9,
			qualityEpsilon = 1e-6,
			paL = pa - windingEpsilon,
			paR = pa + windingEpsilon,
			windingL = 0,
			windingR = 0,
			pathWindingL = 0,
			pathWindingR = 0,
			onPath = false,
			onAnyPath = false,
			quality = 1,
			roots = [],
			vPrev,
			vClose;

		function addWinding(v) {
			var o0 = v[io + 0],
				o3 = v[io + 6];
			if (po < Math.min(o0, o3) || po > Math.max(o0, o3)) {
				return;
			}
			var a0 = v[ia + 0],
				a1 = v[ia + 2],
				a2 = v[ia + 4],
				a3 = v[ia + 6];
			if (o0 === o3) {
				if (a0 < paR && a3 > paL || a3 < paR && a0 > paL) {
					onPath = true;
				}
				return;
			}
			var t = po === o0 ? 0
				: po === o3 ? 1
					: paL > Math.max(a0, a1, a2, a3) || paR < Math.min(a0, a1, a2, a3)
						? 1
						: Curve.solveCubic(v, io, po, roots, 0, 1) > 0
							? roots[0]
							: 1,
				a = t === 0 ? a0
					: t === 1 ? a3
						: Curve.getPoint(v, t)[dir ? 'y' : 'x'],
				winding = o0 > o3 ? 1 : -1,
				windingPrev = vPrev[io] > vPrev[io + 6] ? 1 : -1,
				a3Prev = vPrev[ia + 6];
			if (po !== o0) {
				if (a < paL) {
					pathWindingL += winding;
				} else if (a > paR) {
					pathWindingR += winding;
				} else {
					onPath = true;
				}
				if (a > pa - qualityEpsilon && a < pa + qualityEpsilon)
					quality /= 2;
			} else {
				if (winding !== windingPrev) {
					if (a0 < paL) {
						pathWindingL += winding;
					} else if (a0 > paR) {
						pathWindingR += winding;
					}
				} else if (a0 != a3Prev) {
					if (a3Prev < paR && a > paR) {
						pathWindingR += winding;
						onPath = true;
					} else if (a3Prev > paL && a < paL) {
						pathWindingL += winding;
						onPath = true;
					}
				}
				quality /= 4;
			}
			vPrev = v;
			return !dontFlip && a > paL && a < paR
				&& Curve.getTangent(v, t)[dir ? 'x' : 'y'] === 0
				&& PathItem.getWinding(point, curves, !dir, closed, true);
		}

		function handleCurve(v) {
			var o0 = v[io + 0],
				o1 = v[io + 2],
				o2 = v[io + 4],
				o3 = v[io + 6];
			if (po <= Math.max(o0, o1, o2, o3) && po >= Math.min(o0, o1, o2, o3)) {
				var a0 = v[ia + 0],
					a1 = v[ia + 2],
					a2 = v[ia + 4],
					a3 = v[ia + 6],
					monoCurves = paL > Math.max(a0, a1, a2, a3) ||
						paR < Math.min(a0, a1, a2, a3)
						? [v] : Curve.getMonoCurves(v, dir),
					res;
				for (var i = 0, l = monoCurves.length; i < l; i++) {
					if (res = addWinding(monoCurves[i]))
						return res;
				}
			}
		}

		for (var i = 0, l = curvesList.length; i < l; i++) {
			var curve = curvesList[i],
				path = curve._path,
				v = curve.getValues(),
				res;
			if (!i || curvesList[i - 1]._path !== path) {
				vPrev = null;
				if (!path._closed) {
					vClose = Curve.getValues(
						path.getLastCurve().getSegment2(),
						curve.getSegment1(),
						null, !closed);
					if (vClose[io] !== vClose[io + 6]) {
						vPrev = vClose;
					}
				}

				if (!vPrev) {
					vPrev = v;
					var prev = path.getLastCurve();
					while (prev && prev !== curve) {
						var v2 = prev.getValues();
						if (v2[io] !== v2[io + 6]) {
							vPrev = v2;
							break;
						}
						prev = prev.getPrevious();
					}
				}
			}

			if (res = handleCurve(v))
				return res;

			if (i + 1 === l || curvesList[i + 1]._path !== path) {
				if (vClose && (res = handleCurve(vClose)))
					return res;
				if (onPath && !pathWindingL && !pathWindingR) {
					pathWindingL = pathWindingR = path.isClockwise(closed) ^ dir
						? 1 : -1;
				}
				windingL += pathWindingL;
				windingR += pathWindingR;
				pathWindingL = pathWindingR = 0;
				if (onPath) {
					onAnyPath = true;
					onPath = false;
				}
				vClose = null;
			}
		}
		windingL = Math.abs(windingL);
		windingR = Math.abs(windingR);
		return {
			winding: Math.max(windingL, windingR),
			windingL: windingL,
			windingR: windingR,
			quality: quality,
			onPath: onAnyPath
		};
	};
	PathItem.propagateWinding = function (segment, path1, path2, curveCollisionsMap,
		operator) {
		var chain = [],
			start = segment,
			totalLength = 0,
			winding;
		do {
			var curve = segment.getCurve();
			if (curve) {
				var length = curve.getLength();
				chain.push({ segment: segment, curve: curve, length: length });
				totalLength += length;
			}
			segment = segment.getNext();
		} while (segment && !segment._intersection && segment !== start);
		var offsets = [0.5, 0.25, 0.75],
			winding = { winding: 0, quality: -1 },
			tMin = 1e-3,
			tMax = 1 - tMin;
		for (var i = 0; i < offsets.length && winding.quality < 0.5; i++) {
			var length = totalLength * offsets[i];
			for (var j = 0, l = chain.length; j < l; j++) {
				var entry = chain[j],
					curveLength = entry.length;
				if (length <= curveLength) {
					var curve = entry.curve,
						path = curve._path,
						parent = path._parent,
						operand = parent instanceof CompoundPath ? parent : path,
						t = Numerical.clamp(curve.getTimeAt(length), tMin, tMax),
						pt = curve.getPointAtTime(t),
						dir = Math.abs(curve.getTangentAtTime(t).y) < Math.SQRT1_2;
					var wind = null;
					if (operator.subtract && path2) {
						var otherPath = operand === path1 ? path2 : path1,
							pathWinding = otherPath._getWinding(pt, dir, true);
						if (operand === path1 && pathWinding.winding ||
							operand === path2 && !pathWinding.winding) {
							if (pathWinding.quality < 1) {
								continue;
							} else {
								wind = { winding: 0, quality: 1 };
							}
						}
					}
					wind = wind || PathItem.getWinding(
						pt, curveCollisionsMap[path._id][curve.getIndex()],
						dir, true);
					if (wind.quality > winding.quality)
						winding = wind;
					break;
				}
				length -= curveLength;
			}
		}
		for (var j = chain.length - 1; j >= 0; j--) {
			chain[j].segment._winding = winding;
		}
	};
	PathItem.tracePaths = function (segments, operator) {
		var paths = [],
			starts;

		function isValid(seg) {
			var winding;
			return !!(seg && !seg._visited && (!operator
				|| operator[(winding = seg._winding || {}).winding]
				&& !(operator.unite && winding.winding === 2
					&& winding.windingL && winding.windingR)));
		}

		function isStart(seg) {
			if (seg) {
				for (var i = 0, l = starts.length; i < l; i++) {
					if (seg === starts[i])
						return true;
				}
			}
			return false;
		}

		function visitPath(path) {
			var segments = path._segments;
			for (var i = 0, l = segments.length; i < l; i++) {
				segments[i]._visited = true;
			}
		}

		function getCrossingSegments(segment, collectStarts) {
			var inter = segment._intersection,
				start = inter,
				crossings = [];
			if (collectStarts)
				starts = [segment];

			function collect(inter, end) {
				while (inter && inter !== end) {
					var other = inter._segment,
						path = other && other._path;
					if (path) {
						var next = other.getNext() || path.getFirstSegment(),
							nextInter = next._intersection;
						if (other !== segment && (isStart(other)
							|| isStart(next)
							|| next && (isValid(other) && (isValid(next)
								|| nextInter && isValid(nextInter._segment))))
						) {
							crossings.push(other);
						}
						if (collectStarts)
							starts.push(other);
					}
					inter = inter._next;
				}
			}

			if (inter) {
				collect(inter);
				while (inter && inter._previous)
					inter = inter._previous;
				collect(inter, start);
			}
			return crossings;
		}

		segments.sort(function (seg1, seg2) {
			var inter1 = seg1._intersection,
				inter2 = seg2._intersection,
				over1 = !!(inter1 && inter1._overlap),
				over2 = !!(inter2 && inter2._overlap),
				path1 = seg1._path,
				path2 = seg2._path;
			return over1 ^ over2
				? over1 ? 1 : -1
				: !inter1 ^ !inter2
					? inter1 ? 1 : -1
					: path1 !== path2
						? path1._id - path2._id
						: seg1._index - seg2._index;
		});

		for (var i = 0, l = segments.length; i < l; i++) {
			var seg = segments[i],
				valid = isValid(seg),
				path = null,
				finished = false,
				closed = true,
				branches = [],
				branch,
				visited,
				handleIn;
			if (valid && seg._path._overlapsOnly) {
				var path1 = seg._path,
					path2 = seg._intersection._segment._path;
				if (path1.compare(path2)) {
					if (path1.getArea())
						paths.push(path1.clone(false));
					visitPath(path1);
					visitPath(path2);
					valid = false;
				}
			}
			while (valid) {
				var first = !path,
					crossings = getCrossingSegments(seg, first),
					other = crossings.shift(),
					finished = !first && (isStart(seg) || isStart(other)),
					cross = !finished && other;
				if (first) {
					path = new Path({ insert: false });
					branch = null;
				}
				if (finished) {
					if (seg.isFirst() || seg.isLast())
						closed = seg._path._closed;
					seg._visited = true;
					break;
				}
				if (cross && branch) {
					branches.push(branch);
					branch = null;
				}
				if (!branch) {
					if (cross)
						crossings.push(seg);
					branch = {
						start: path._segments.length,
						crossings: crossings,
						visited: visited = [],
						handleIn: handleIn
					};
				}
				if (cross)
					seg = other;
				if (!isValid(seg)) {
					path.removeSegments(branch.start);
					for (var j = 0, k = visited.length; j < k; j++) {
						visited[j]._visited = false;
					}
					visited.length = 0;
					do {
						seg = branch && branch.crossings.shift();
						if (!seg || !seg._path) {
							seg = null;
							branch = branches.pop();
							if (branch) {
								visited = branch.visited;
								handleIn = branch.handleIn;
							}
						}
					} while (branch && !isValid(seg));
					if (!seg)
						break;
				}
				var next = seg.getNext();
				path.add(new Segment(seg._point, handleIn,
					next && seg._handleOut));
				seg._visited = true;
				visited.push(seg);
				seg = next || seg._path.getFirstSegment();
				handleIn = next && next._handleIn;
			}
			if (finished) {
				if (closed) {
					path.getFirstSegment().setHandleIn(handleIn);
					path.setClosed(closed);
				}
				if (path.getArea() !== 0) {
					paths.push(path);
				}
			}
		}
		return paths;
	};

	var Path = function (arg) {
		this._closed = false;
		this._segments = [];
		this._version = 0;
		var args = arguments,
			segments = Array.isArray(arg)
				? typeof arg[0] === 'object'
					? arg
					: args
				: arg && (arg.size === undefined && (arg.x !== undefined
					|| arg.point !== undefined))
					? args
					: null;
		if (segments && segments.length > 0) {
			this.setSegments(segments);
		} else {
			this._curves = undefined;
			if (!segments && typeof arg === 'string') {
				this.setPathData(arg);
				arg = null;
			}
		}
		this._initialize(!segments && arg);
	};
	InitClassWithStatics(Path, PathItem);

	Path.prototype._equals = function (item) {
		return this._closed === item._closed
			&& Base.equals(this._segments, item._segments);
	};
	Path.prototype.copyContent = function (source) {
		this.setSegments(source._segments);
		this._closed = source._closed;
	};
	Path.prototype._changed = function _changed(flags) {
		Item.prototype._changed.call(this, flags);
		if (flags & 8) {
			this._length = this._area = undefined;
			if (flags & 32) {
				this._version++;
			} else if (this._curves) {
				for (var i = 0, l = this._curves.length; i < l; i++)
					this._curves[i]._changed();
			}
		} else if (flags & 64) {
			this._bounds = undefined;
		}
	};
	Path.prototype.getSegments = function () {
		return this._segments;
	};
	Path.prototype.setSegments = function (segments) {
		var length = segments && segments.length;
		this._segments.length = 0;
		this._curves = undefined;
		if (length) {
			var last = segments[length - 1];
			if (typeof last === 'boolean') {
				this.setClosed(last);
				length--;
			}
			this._add(Segment.readList(segments, 0, {}, length));
		}
	};
	Path.prototype.getFirstSegment = function () {
		return this._segments[0];
	};
	Path.prototype.getLastSegment = function () {
		return this._segments[this._segments.length - 1];
	};
	Path.prototype.getCurves = function () {
		var curves = this._curves,
			segments = this._segments;
		if (!curves) {
			var length = this._countCurves();
			curves = this._curves = new Array(length);
			for (var i = 0; i < length; i++)
				curves[i] = new Curve(this, segments[i],
					segments[i + 1] || segments[0]);
		}
		return curves;
	};
	Path.prototype.getFirstCurve = function () {
		return this.getCurves()[0];
	};
	Path.prototype.getLastCurve = function () {
		var curves = this.getCurves();
		return curves[curves.length - 1];
	};
	Path.prototype.isClosed = function () {
		return this._closed;
	};
	Path.prototype.setClosed = function (closed) {
		if (this._closed != (closed = !!closed)) {
			this._closed = closed;
			if (this._curves) {
				var length = this._curves.length = this._countCurves();
				if (closed)
					this._curves[length - 1] = new Curve(this,
						this._segments[length - 1], this._segments[0]);
			}
			this._changed(41);
		}
	};
	Path.prototype.isEmpty = function () {
		return !this._segments.length;
	};
	Path.prototype._transformContent = function (matrix) {
		var segments = this._segments,
			coords = new Array(6);
		for (var i = 0, l = segments.length; i < l; i++)
			segments[i]._transformCoordinates(matrix, coords, true);
		return true;
	};
	Path.prototype._add = function (segs, index) {
		var segments = this._segments,
			curves = this._curves,
			amount = segs.length,
			append = index == null,
			index = append ? segments.length : index;
		for (var i = 0; i < amount; i++) {
			var segment = segs[i];
			if (segment._path)
				segment = segs[i] = segment.clone();
			segment._path = this;
			segment._index = index + i;
		}
		if (append) {
			segments.push.apply(segments, segs);
		} else {
			segments.splice.apply(segments, [index, 0].concat(segs));
			for (var i = index + amount, l = segments.length; i < l; i++)
				segments[i]._index = i;
		}
		if (curves) {
			var total = this._countCurves(),
				start = index > 0 && index + amount - 1 === total ? index - 1
					: index,
				insert = start,
				end = Math.min(start + amount, total);
			if (segs._curves) {
				curves.splice.apply(curves, [start, 0].concat(segs._curves));
				insert += segs._curves.length;
			}
			for (var i = insert; i < end; i++)
				curves.splice(i, 0, new Curve(this, null, null));
			this._adjustCurves(start, end);
		}
		this._changed(41);
		return segs;
	};
	Path.prototype._adjustCurves = function (start, end) {
		var segments = this._segments,
			curves = this._curves,
			curve;
		for (var i = start; i < end; i++) {
			curve = curves[i];
			curve._path = this;
			curve._segment1 = segments[i];
			curve._segment2 = segments[i + 1] || segments[0];
			curve._changed();
		}
		if (curve = curves[this._closed && !start ? segments.length - 1
			: start - 1]) {
			curve._segment2 = segments[start] || segments[0];
			curve._changed();
		}
		if (curve = curves[end]) {
			curve._segment1 = segments[end];
			curve._changed();
		}
	};
	Path.prototype._countCurves = function () {
		var length = this._segments.length;
		return !this._closed && length > 0 ? length - 1 : length;
	};
	Path.prototype.add = function (segment1) {
		var args = arguments;
		return args.length > 1 && typeof segment1 !== 'number'
			? this._add(Segment.readList(args))
			: this._add([Segment.read(args)])[0];
	};
	Path.prototype.insert = function (index, segment1) {
		var args = arguments;
		return args.length > 2 && typeof segment1 !== 'number'
			? this._add(Segment.readList(args, 1), index)
			: this._add([Segment.read(args, 1)], index)[0];
	};
	Path.prototype.addSegment = function () {
		return this._add([Segment.read(arguments)])[0];
	};
	Path.prototype.removeSegment = function (index) {
		return this.removeSegments(index, index + 1)[0] || null;
	};
	Path.prototype.clear = Path.prototype.removeSegments = function (start, end, _includeCurves) {
		start = start || 0;
		end = Base.pick(end, this._segments.length);
		var segments = this._segments,
			curves = this._curves,
			count = segments.length,
			removed = segments.splice(start, end - start),
			amount = removed.length;
		if (!amount)
			return removed;
		for (var i = 0; i < amount; i++) {
			var segment = removed[i];
			segment._index = segment._path = null;
		}
		for (var i = start, l = segments.length; i < l; i++)
			segments[i]._index = i;
		if (curves) {
			var index = start > 0 && end === count + (this._closed ? 1 : 0)
				? start - 1
				: start,
				curves = curves.splice(index, amount);
			for (var i = curves.length - 1; i >= 0; i--)
				curves[i]._path = null;
			if (_includeCurves)
				removed._curves = curves.slice(1);
			this._adjustCurves(index, index);
		}
		this._changed(41);
		return removed;
	};
	Path.prototype.hasHandles = function () {
		var segments = this._segments;
		for (var i = 0, l = segments.length; i < l; i++) {
			if (segments[i].hasHandles())
				return true;
		}
		return false;
	};
	Path.prototype.clearHandles = function () {
		var segments = this._segments;
		for (var i = 0, l = segments.length; i < l; i++)
			segments[i].clearHandles();
	};
	Path.prototype.getLength = function () {
		if (this._length == null) {
			var curves = this.getCurves(),
				length = 0;
			for (var i = 0, l = curves.length; i < l; i++)
				length += curves[i].getLength();
			this._length = length;
		}
		return this._length;
	};
	Path.prototype.getArea = function () {
		var area = this._area;
		if (area == null) {
			var segments = this._segments,
				closed = this._closed;
			area = 0;
			for (var i = 0, l = segments.length; i < l; i++) {
				var last = i + 1 === l;
				area += Curve.getArea(Curve.getValues(
					segments[i], segments[last ? 0 : i + 1],
					null, last && !closed));
			}
			this._area = area;
		}
		return area;
	};
	Path.prototype.divideAt = function (location) {
		var loc = this.getLocationAt(location),
			curve;
		return loc && (curve = loc.getCurve().divideAt(loc.getCurveOffset()))
			? curve._segment1
			: null;
	};
	Path.prototype.splitAt = function (location) {
		var loc = this.getLocationAt(location),
			index = loc && loc.index,
			time = loc && loc.time,
			tMin = 1e-8,
			tMax = 1 - tMin;
		if (time > tMax) {
			index++;
			time = 0;
		}
		var curves = this.getCurves();
		if (index >= 0 && index < curves.length) {
			if (time >= tMin) {
				curves[index++].divideAtTime(time);
			}
			var segs = this.removeSegments(index, this._segments.length, true),
				path;
			if (this._closed) {
				this.setClosed(false);
				path = this;
			} else {
				path = new Path({ insert: false });
				path.insertAbove(this);
				path.copyAttributes(this);
			}
			path._add(segs, 0);
			this.addSegment(segs[0]);
			return path;
		}
		return null;
	};
	Path.prototype.split = function (index, time) {
		var curve,
			location = time === undefined ? index
				: (curve = this.getCurves()[index])
				&& curve.getLocationAtTime(time);
		return location != null ? this.splitAt(location) : null;
	};
	Path.prototype.join = function (path, tolerance) {
		var epsilon = tolerance || 0;
		if (path && path !== this) {
			var segments = path._segments,
				last1 = this.getLastSegment(),
				last2 = path.getLastSegment();
			if (!last2)
				return this;
			if (last1 && last1._point.isClose(last2._point, epsilon))
				path.reverse();
			var first2 = path.getFirstSegment();
			if (last1 && last1._point.isClose(first2._point, epsilon)) {
				last1.setHandleOut(first2._handleOut);
				this._add(segments.slice(1));
			} else {
				var first1 = this.getFirstSegment();
				if (first1 && first1._point.isClose(first2._point, epsilon))
					path.reverse();
				last2 = path.getLastSegment();
				if (first1 && first1._point.isClose(last2._point, epsilon)) {
					first1.setHandleIn(last2._handleIn);
					this._add(segments.slice(0, segments.length - 1), 0);
				} else {
					this._add(segments.slice());
				}
			}
			if (path._closed)
				this._add([segments[0]]);
			path.remove();
		}
		var first = this.getFirstSegment(),
			last = this.getLastSegment();
		if (first !== last && first._point.isClose(last._point, epsilon)) {
			first.setHandleIn(last._handleIn);
			last.remove();
			this.setClosed(true);
		}
		return this;
	};
	Path.prototype.reduce = function (options) {
		var curves = this.getCurves(),
			simplify = options && options.simplify,
			tolerance = simplify ? 1e-7 : 0;
		for (var i = curves.length - 1; i >= 0; i--) {
			var curve = curves[i];
			if (!curve.hasHandles() && (!curve.hasLength(tolerance)
				|| simplify && curve.isCollinear(curve.getNext())))
				curve.remove();
		}
		return this;
	};
	Path.prototype.reverse = function () {
		this._segments.reverse();
		for (var i = 0, l = this._segments.length; i < l; i++) {
			var segment = this._segments[i];
			var handleIn = segment._handleIn;
			segment._handleIn = segment._handleOut;
			segment._handleOut = handleIn;
			segment._index = i;
		}
		this._curves = null;
		this._changed(9);
	};
	Path.prototype.compare = function compare(path) {
		if (!path || path instanceof CompoundPath)
			return PathItem.prototype.compare.call(this, path);
		var curves1 = this.getCurves(),
			curves2 = path.getCurves(),
			length1 = curves1.length,
			length2 = curves2.length;
		if (!length1 || !length2) {
			return length1 == length2;
		}
		var v1 = curves1[0].getValues(),
			values2 = [],
			pos1 = 0, pos2,
			end1 = 0, end2;
		for (var i = 0; i < length2; i++) {
			var v2 = curves2[i].getValues();
			values2.push(v2);
			var overlaps = Curve.getOverlaps(v1, v2);
			if (overlaps) {
				pos2 = !i && overlaps[0][0] > 0 ? length2 - 1 : i;
				end2 = overlaps[0][1];
				break;
			}
		}
		var abs = Math.abs,
			epsilon = 1e-8,
			v2 = values2[pos2],
			start2;
		while (v1 && v2) {
			var overlaps = Curve.getOverlaps(v1, v2);
			if (overlaps) {
				var t1 = overlaps[0][0];
				if (abs(t1 - end1) < epsilon) {
					end1 = overlaps[1][0];
					if (end1 === 1) {
						v1 = ++pos1 < length1 ? curves1[pos1].getValues() : null;
						end1 = 0;
					}
					var t2 = overlaps[0][1];
					if (abs(t2 - end2) < epsilon) {
						if (!start2)
							start2 = [pos2, t2];
						end2 = overlaps[1][1];
						if (end2 === 1) {
							if (++pos2 >= length2)
								pos2 = 0;
							v2 = values2[pos2] || curves2[pos2].getValues();
							end2 = 0;
						}
						if (!v1) {
							return start2[0] === pos2 && start2[1] === end2;
						}
						continue;
					}
				}
			}
			break;
		}
		return false;
	};
	Path.prototype.getLocationAt = function (offset) {
		if (typeof offset === 'number') {
			var curves = this.getCurves(),
				length = 0;
			for (var i = 0, l = curves.length; i < l; i++) {
				var start = length,
					curve = curves[i];
				length += curve.getLength();
				if (length > offset) {
					return curve.getLocationAt(offset - start);
				}
			}
			if (curves.length > 0 && offset <= this.getLength()) {
				return new CurveLocation(curves[curves.length - 1], 1);
			}
		} else if (offset && offset.getPath && offset.getPath() === this) {
			return offset;
		}
		return null;
	};
	Path.prototype.getPointAt = function (offset) {
		var loc = this.getLocationAt(offset);
		return loc && loc['getPoint']();
	};
	Path.prototype.getTangentAt = function (offset) {
		var loc = this.getLocationAt(offset);
		return loc && loc['getTangent']();
	};
	Path.prototype.getNormalAt = function (offset) {
		var loc = this.getLocationAt(offset);
		return loc && loc['getNormal']();
	};
	Path.prototype.getCurvatureAt = function (offset) {
		var loc = this.getLocationAt(offset);
		return loc && loc['getCurvature']();
	};
	Path.prototype.moveTo = function () {
		var segments = this._segments;
		if (segments.length === 1)
			this.removeSegment(0);
		if (!segments.length)
			this._add([new Segment(Point.read(arguments))]);
	};
	Path.prototype.lineTo = function () {
		this._add([new Segment(Point.read(arguments))]);
	};
	Path.prototype.cubicCurveTo = function () {
		var args = arguments,
			handle1 = Point.read(args),
			handle2 = Point.read(args),
			to = Point.read(args),
			current = Path.getCurrentSegment(this);
		current.setHandleOut(handle1.subtract(current._point));
		this._add([new Segment(to, handle2.subtract(to))]);
	};
	Path.prototype.quadraticCurveTo = function () {
		var args = arguments,
			handle = Point.read(args),
			to = Point.read(args),
			current = Path.getCurrentSegment(this)._point;
		this.cubicCurveTo(
			handle.add(current.subtract(handle).multiply(1 / 3)),
			handle.add(to.subtract(handle).multiply(1 / 3)),
			to
		);
	};
	Path.prototype.curveTo = function () {
		var args = arguments,
			through = Point.read(args),
			to = Point.read(args),
			t = Base.pick(Base.read(args), 0.5),
			t1 = 1 - t,
			current = Path.getCurrentSegment(this)._point,
			handle = through.subtract(current.multiply(t1 * t1))
				.subtract(to.multiply(t * t)).divide(2 * t * t1);
		if (handle.isNaN())
			throw new Error(
				'Cannot put a curve through points with parameter = ' + t);
		this.quadraticCurveTo(handle, to);
	};
	Path.prototype.arcTo = function () {
		var args = arguments,
			abs = Math.abs,
			sqrt = Math.sqrt,
			current = Path.getCurrentSegment(this),
			from = current._point,
			to = Point.read(args),
			through,
			peek = args[0],
			clockwise = Base.pick(peek, true),
			center, extent, vector, matrix;
		if (typeof clockwise === 'boolean') {
			var middle = from.add(to).divide(2),
				through = middle.add(middle.subtract(from).rotate(
					clockwise ? -90 : 90));
		} else if (args.length - (args.__index || 0) <= 2) {
			through = to;
			to = Point.read(args);
		} else if (!from.equals(to)) {
			var radius = Size.read(args),
				isZero = Numerical.isZero;
			if (isZero(radius.width) || isZero(radius.height))
				return this.lineTo(to);
			var rotation = Base.read(args),
				clockwise = !!Base.read(args),
				large = !!Base.read(args),
				middle = from.add(to).divide(2),
				pt = from.subtract(middle).rotate(-rotation),
				x = pt.x,
				y = pt.y,
				rx = abs(radius.width),
				ry = abs(radius.height),
				rxSq = rx * rx,
				rySq = ry * ry,
				xSq = x * x,
				ySq = y * y;
			var factor = sqrt(xSq / rxSq + ySq / rySq);
			if (factor > 1) {
				rx *= factor;
				ry *= factor;
				rxSq = rx * rx;
				rySq = ry * ry;
			}
			factor = (rxSq * rySq - rxSq * ySq - rySq * xSq) /
				(rxSq * ySq + rySq * xSq);
			if (abs(factor) < 1e-12)
				factor = 0;
			if (factor < 0)
				throw new Error(
					'Cannot create an arc with the given arguments');
			center = new Point(rx * y / ry, -ry * x / rx)
				.multiply((large === clockwise ? -1 : 1) * sqrt(factor))
				.rotate(rotation).add(middle);
			matrix = new Matrix().translate(center).rotate(rotation)
				.scale(rx, ry);
			vector = matrix._inverseTransform(from);
			extent = vector.getDirectedAngle(matrix._inverseTransform(to));
			if (!clockwise && extent > 0)
				extent -= 360;
			else if (clockwise && extent < 0)
				extent += 360;
		}
		if (through) {
			var l1 = new Line(from.add(through).divide(2),
				through.subtract(from).rotate(90), true),
				l2 = new Line(through.add(to).divide(2),
					to.subtract(through).rotate(90), true),
				line = new Line(from, to),
				throughSide = line.getSide(through);
			center = l1.intersect(l2, true);
			if (!center) {
				if (!throughSide)
					return this.lineTo(to);
				throw new Error(
					'Cannot create an arc with the given arguments');
			}
			vector = from.subtract(center);
			extent = vector.getDirectedAngle(to.subtract(center));
			var centerSide = line.getSide(center, true);
			if (centerSide === 0) {
				extent = throughSide * abs(extent);
			} else if (throughSide === centerSide) {
				extent += extent < 0 ? 360 : -360;
			}
		}
		if (extent) {
			var epsilon = 1e-5,
				ext = abs(extent),
				count = ext >= 360
					? 4
					: Math.ceil((ext - epsilon) / 90),
				inc = extent / count,
				half = inc * Math.PI / 360,
				z = 4 / 3 * Math.sin(half) / (1 + Math.cos(half)),
				segments = [];
			for (var i = 0; i <= count; i++) {
				var pt = to,
					out = null;
				if (i < count) {
					out = vector.rotate(90).multiply(z);
					if (matrix) {
						pt = matrix._transformPoint(vector);
						out = matrix._transformPoint(vector.add(out))
							.subtract(pt);
					} else {
						pt = center.add(vector);
					}
				}
				if (!i) {
					current.setHandleOut(out);
				} else {
					var _in = vector.rotate(-90).multiply(z);
					if (matrix) {
						_in = matrix._transformPoint(vector.add(_in))
							.subtract(pt);
					}
					segments.push(new Segment(pt, _in, out));
				}
				vector = vector.rotate(inc);
			}
			this._add(segments);
		}
	};
	Path.prototype.lineBy = function () {
		var to = Point.read(arguments),
			current = Path.getCurrentSegment(this)._point;
		this.lineTo(current.add(to));
	};
	Path.prototype.curveBy = function () {
		var args = arguments,
			through = Point.read(args),
			to = Point.read(args),
			parameter = Base.read(args),
			current = Path.getCurrentSegment(this)._point;
		this.curveTo(current.add(through), current.add(to), parameter);
	};
	Path.prototype.cubicCurveBy = function () {
		var args = arguments,
			handle1 = Point.read(args),
			handle2 = Point.read(args),
			to = Point.read(args),
			current = Path.getCurrentSegment(this)._point;
		this.cubicCurveTo(current.add(handle1), current.add(handle2),
			current.add(to));
	};
	Path.prototype.quadraticCurveBy = function () {
		var args = arguments,
			handle = Point.read(args),
			to = Point.read(args),
			current = Path.getCurrentSegment(this)._point;
		this.quadraticCurveTo(current.add(handle), current.add(to));
	};
	Path.prototype.arcBy = function () {
		var args = arguments,
			current = Path.getCurrentSegment(this)._point,
			point = current.add(Point.read(args)),
			clockwise = Base.pick(args[0], true);
		if (typeof clockwise === 'boolean') {
			this.arcTo(point, clockwise);
		} else {
			this.arcTo(point, current.add(Point.read(args)));
		}
	};
	Path.prototype.closePath = function (tolerance) {
		this.setClosed(true);
		this.join(this, tolerance);
	};
	Path.prototype._getBounds = function (matrix, options) {
		var method = options.handle
			? 'getHandleBounds'
			: options.stroke
				? 'getStrokeBounds'
				: 'getBounds';
		return Path[method](this._segments, this._closed, this, matrix, options);
	};

	Path.getCurrentSegment = function (that) {
		var segments = that._segments;
		if (!segments.length)
			throw new Error('Use a moveTo() command first');
		return segments[segments.length - 1];
	}
	Path.getBounds = function (segments, closed, path, matrix, options, strokePadding) {
		var first = segments[0];
		if (!first)
			return new Rectangle();
		var coords = new Array(6),
			prevCoords = first._transformCoordinates(matrix, new Array(6)),
			min = prevCoords.slice(0, 2),
			max = min.slice(),
			roots = new Array(2);

		function processSegment(segment) {
			segment._transformCoordinates(matrix, coords);
			for (var i = 0; i < 2; i++) {
				Curve._addBounds(
					prevCoords[i],
					prevCoords[i + 4],
					coords[i + 2],
					coords[i],
					i, strokePadding ? strokePadding[i] : 0, min, max, roots);
			}
			var tmp = prevCoords;
			prevCoords = coords;
			coords = tmp;
		}

		for (var i = 1, l = segments.length; i < l; i++)
			processSegment(segments[i]);
		if (closed)
			processSegment(first);
		return new Rectangle(min[0], min[1], max[0] - min[0], max[1] - min[1]);
	};
	Path.getStrokeBounds = function (segments, closed, path, matrix, options) {
		var stroke = false,
			strokeWidth = 1,
			strokeMatrix = stroke && path._getStrokeMatrix(matrix, options),
			strokePadding = stroke && Path._getStrokePadding(strokeWidth,
				strokeMatrix),
			bounds = Path.getBounds(segments, closed, path, matrix, options,
				strokePadding);
		if (!stroke)
			return bounds;
		var strokeRadius = strokeWidth / 2,
			join = 'miter',
			cap = 'butt',
			miterLimit = 10,
			joinBounds = new Rectangle(new Size(strokePadding));

		function addPoint(point) {
			bounds = bounds.include(point);
		}

		function addRound(segment) {
			bounds = bounds.unite(
				joinBounds.setCenter(segment._point.transform(matrix)));
		}

		function addJoin(segment, join) {
			if (join === 'round' || segment.isSmooth()) {
				addRound(segment);
			} else {
				Path._addBevelJoin(segment, join, strokeRadius, miterLimit,
					matrix, strokeMatrix, addPoint);
			}
		}

		function addCap(segment, cap) {
			if (cap === 'round') {
				addRound(segment);
			} else {
				Path._addSquareCap(segment, cap, strokeRadius, matrix,
					strokeMatrix, addPoint);
			}
		}

		var length = segments.length - (closed ? 0 : 1);
		if (length > 0) {
			for (var i = 1; i < length; i++) {
				addJoin(segments[i], join);
			}
			if (closed) {
				addJoin(segments[0], join);
			} else {
				addCap(segments[0], cap);
				addCap(segments[segments.length - 1], cap);
			}
		}
		return bounds;
	};
	Path._getStrokePadding = function (radius, matrix) {
		if (!matrix)
			return [radius, radius];
		var hor = new Point(radius, 0).transform(matrix),
			ver = new Point(0, radius).transform(matrix),
			phi = hor.getAngleInRadians(),
			a = hor.getLength(),
			b = ver.getLength();
		var sin = Math.sin(phi),
			cos = Math.cos(phi),
			tan = Math.tan(phi),
			tx = Math.atan2(b * tan, a),
			ty = Math.atan2(b, tan * a);
		return [Math.abs(a * Math.cos(tx) * cos + b * Math.sin(tx) * sin),
		Math.abs(b * Math.sin(ty) * cos + a * Math.cos(ty) * sin)];
	};
	Path._addBevelJoin = function (segment, join, radius, miterLimit, matrix,
		strokeMatrix, addPoint, isArea) {
		var curve2 = segment.getCurve(),
			curve1 = curve2.getPrevious(),
			point = curve2.getPoint1().transform(matrix),
			normal1 = curve1.getNormalAtTime(1).multiply(radius)
				.transform(strokeMatrix),
			normal2 = curve2.getNormalAtTime(0).multiply(radius)
				.transform(strokeMatrix),
			angle = normal1.getDirectedAngle(normal2);
		if (angle < 0 || angle >= 180) {
			normal1 = normal1.negate();
			normal2 = normal2.negate();
		}
		if (isArea)
			addPoint(point);
		addPoint(point.add(normal1));
		if (join === 'miter') {
			var corner = new Line(point.add(normal1),
				new Point(-normal1.y, normal1.x), true
			).intersect(new Line(point.add(normal2),
				new Point(-normal2.y, normal2.x), true
			), true);
			if (corner && point.getDistance(corner) <= miterLimit * radius) {
				addPoint(corner);
			}
		}
		addPoint(point.add(normal2));
	};
	Path._addSquareCap = function (segment, cap, radius, matrix, strokeMatrix,
		addPoint, isArea) {
		var point = segment._point.transform(matrix),
			loc = segment.getLocation(),
			normal = loc.getNormal()
				.multiply(loc.getTime() === 0 ? radius : -radius)
				.transform(strokeMatrix);
		if (cap === 'square') {
			if (isArea) {
				addPoint(point.subtract(normal));
				addPoint(point.add(normal));
			}
			point = point.add(normal.rotate(-90));
		}
		addPoint(point.add(normal));
		addPoint(point.subtract(normal));
	};
	Path.getHandleBounds = function (segments, closed, path, matrix, options) {
		var stroke = false,
			strokePadding,
			joinPadding;
		if (stroke) {
			var strokeMatrix = path._getStrokeMatrix(matrix, options),
				strokeRadius = 1 / 2,
				joinRadius = strokeRadius;
			joinRadius = strokeRadius * 10;
			strokePadding = Path._getStrokePadding(strokeRadius, strokeMatrix);
			joinPadding = Path._getStrokePadding(joinRadius, strokeMatrix);
		}
		var coords = new Array(6),
			x1 = Infinity,
			x2 = -x1,
			y1 = x1,
			y2 = x2;
		for (var i = 0, l = segments.length; i < l; i++) {
			var segment = segments[i];
			segment._transformCoordinates(matrix, coords);
			for (var j = 0; j < 6; j += 2) {
				var padding = !j ? joinPadding : strokePadding,
					paddingX = padding ? padding[0] : 0,
					paddingY = padding ? padding[1] : 0,
					x = coords[j],
					y = coords[j + 1],
					xn = x - paddingX,
					xx = x + paddingX,
					yn = y - paddingY,
					yx = y + paddingY;
				if (xn < x1) x1 = xn;
				if (xx > x2) x2 = xx;
				if (yn < y1) y1 = yn;
				if (yx > y2) y2 = yx;
			}
		}
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	};

	var CompoundPath = function CompoundPath(arg) {
		this._children = [];
		this._namedChildren = {};
		if (!this._initialize(arg)) {
			if (typeof arg === 'string') {
				this.setPathData(arg);
			} else {
				this.addChildren(Array.isArray(arg) ? arg : arguments);
			}
		}
	};
	InitClassWithStatics(CompoundPath, PathItem);

	CompoundPath.prototype.insertChildren = function insertChildren(index, items) {
		var list = items,
			first = list[0];
		if (first && typeof first[0] === 'number')
			list = [list];
		for (var i = items.length - 1; i >= 0; i--) {
			var item = list[i];
			if (list === items && !(item instanceof Path))
				list = Base.slice(list);
			if (Array.isArray(item)) {
				list[i] = new Path({ segments: item, insert: false });
			} else if (item instanceof CompoundPath) {
				list.splice.apply(list, [i, 1].concat(item.removeChildren()));
				item.remove();
			}
		}
		return Item.prototype.insertChildren.call(this, index, list);
	};
	CompoundPath.prototype.reduce = function reduce(options) {
		var children = this._children;
		for (var i = children.length - 1; i >= 0; i--) {
			var path = children[i].reduce(options);
			if (path.isEmpty())
				path.remove();
		}
		if (!children.length) {
			var path = new Path({ insert: false });
			path.copyAttributes(this);
			path.insertAbove(this);
			this.remove();
			return path;
		}
		return Item.prototype.reduce.call(this);
	};
	CompoundPath.prototype.isClosed = function () {
		var children = this._children;
		for (var i = 0, l = children.length; i < l; i++) {
			if (!children[i]._closed)
				return false;
		}
		return true;
	};
	CompoundPath.prototype.setClosed = function (closed) {
		var children = this._children;
		for (var i = 0, l = children.length; i < l; i++) {
			children[i].setClosed(closed);
		}
	};
	CompoundPath.prototype.getFirstSegment = function () {
		var first = this.getFirstChild();
		return first && first.getFirstSegment();
	};
	CompoundPath.prototype.getLastSegment = function () {
		var last = this.getLastChild();
		return last && last.getLastSegment();
	};
	CompoundPath.prototype.getCurves = function () {
		var children = this._children,
			curves = [];
		for (var i = 0, l = children.length; i < l; i++) {
			curves.push.apply(curves, children[i].getCurves());
		}
		return curves;
	};
	CompoundPath.prototype.getFirstCurve = function () {
		var first = this.getFirstChild();
		return first && first.getFirstCurve();
	};
	CompoundPath.prototype.getLastCurve = function () {
		var last = this.getLastChild();
		return last && last.getLastCurve();
	};
	CompoundPath.prototype.getArea = function () {
		var children = this._children,
			area = 0;
		for (var i = 0, l = children.length; i < l; i++)
			area += children[i].getArea();
		return area;
	};
	CompoundPath.prototype.getLength = function () {
		var children = this._children,
			length = 0;
		for (var i = 0, l = children.length; i < l; i++)
			length += children[i].getLength();
		return length;
	};
	CompoundPath.prototype.moveTo = function () {
		var current = CompoundPath.getCurrentPath(this),
			path = current && current.isEmpty() ? current
				: new Path({ insert: false });
		if (path !== current)
			this.addChild(path);
		path.moveTo.apply(path, arguments);
	};
	CompoundPath.prototype.closePath = function (tolerance) {
		CompoundPath.getCurrentPath(this, true).closePath(tolerance);
	};
	CompoundPath.prototype.lineTo = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['lineTo'].apply(path, arguments);
	};
	CompoundPath.prototype.cubicCurveTo = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['cubicCurveTo'].apply(path, arguments);
	};
	CompoundPath.prototype.quadraticCurveTo = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['quadraticCurveTo'].apply(path, arguments);
	};
	CompoundPath.prototype.curveTo = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['curveTo'].apply(path, arguments);
	};
	CompoundPath.prototype.arcTo = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['arcTo'].apply(path, arguments);
	};
	CompoundPath.prototype.lineBy = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['lineBy'].apply(path, arguments);
	};
	CompoundPath.prototype.cubicCurveBy = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['cubicCurveBy'].apply(path, arguments);
	};
	CompoundPath.prototype.quadraticCurveBy = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['quadraticCurveBy'].apply(path, arguments);
	};
	CompoundPath.prototype.curveBy = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['curveBy'].apply(path, arguments);
	};
	CompoundPath.prototype.arcBy = function () {
		var path = CompoundPath.getCurrentPath(this, true);
		path['arcBy'].apply(path, arguments);
	};
	CompoundPath.prototype.reverse = function (param) {
		var children = this._children,
			res;
		for (var i = 0, l = children.length; i < l; i++) {
			res = children[i]['reverse'](param) || res;
		}
		return res;
	};

	CompoundPath.getCurrentPath = function (that, check) {
		var children = that._children;
		if (check && !children.length)
			throw new Error('Use a moveTo() command first');
		return children[children.length - 1];
	};

	window.PathBoolean = {
		Base,
		CollisionDetection, Numerical, UID,
		Point, LinkedPoint,
		Rectangle, LinkedRectangle,
		Matrix, Line, Item,
		Segment, SegmentPoint,
		Curve, CurveLocation,
		Path, PathItem,
		CompoundPath,
	};

})(window);

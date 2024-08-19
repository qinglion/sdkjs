(function (window) {

	function Point(x, y) {
		this.x = x;
		this.y = y;
	}
	Point.prototype.clone = function () {
		return new Point(this.x, this.y);
	};
	Point.prototype.negate = function () {
		return new Point(-this.x, -this.y);
	};
	Point.prototype.getAngle = function () {
		return this.getAngleInRadians.apply(this) * 180 / Math.PI;
	};
	Point.prototype.getAngleInRadians = function () {
		return this.isZero()
			? this.angle || 0
			: this.angle = Math.atan2(this.y, this.x);
	}
	Point.prototype.isEqual = function (other) {
		return this.x === other.x && this.y === other.y;
	};
	Point.prototype.isZero = function () {
		// return this.x === 0 && this.y === 0;
		return (-1e-12 < this.x && this.x < 1e-12) && (-1e-12 < this.y && this.y < 1e-12);
	};
	Point.prototype.isCollinear = function (other) {
		const x1 = this.x;
		const y1 = this.y;
		const x2 = other.x;
		const y2 = other.y;
		return Math.abs(x1 * y2 - y1 * x2)
			<= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) * 1e-8;
	};
	Point.prototype.getDistance = function (other) {
		const deltaX = other.x - this.x;
		const deltaY = other.y - this.y;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	};
	Point.prototype.subtract = function (other) {
		return new Point(this.x - other.x, this.y - other.y);
	};
	Point.prototype.dot = function (other) {
		// Скалярное произведение векторов
		return this.x * other.x + this.y * other.y;
	};

	function Segment(point, handleIn, handleOut, props) {
		this.point = point || new Point(0, 0);
		this.handleIn = handleIn || new Point(0, 0);
		this.handleOut = handleOut || new Point(0, 0);

		if (props) {
			this.path = props.path;
			this.index = props.index;
		}

		// this.intersection;
	}
	Segment.prototype.setProps = function (props) {
		this.path = props.path;
		this.index = props.index;
		return this;
	};
	Segment.prototype.clone = function (insertToPath) {
		const props = insertToPath
			? { path: this.path, index: this.index + 1 }
			: undefined;
		return new Segment(this.point.clone(), this.handleIn.clone(), this.handleOut.clone(), props);
	};
	Segment.prototype.isEqual = function (other) {
		return this.point.isEqual(other.point)
			&& this.handleIn.isEqual(other.handleIn)
			&& this.handleOut.isEqual(other.handleOut);
	};
	Segment.prototype.setHandleIn = function (x, y) {
		this.handleIn = new Point(x, y);
	};
	Segment.prototype.setHandleOut = function (x, y) {
		this.handleOut = new Point(x, y);
	};
	Segment.prototype.remove = function () {
		if (this.path) {
			const index = this.index;
			this.path.segments.splice(index, 1);
			for (let i = index, l = this.path.segments.length; i < l; i++) {
				this.path.segments[i].index = i;
			}

			this.path = null;
			this.index = null;
		}
	};
	Segment.prototype.getIndex = function () {
		if (this.path && this.index === undefined) {
			for (let i = 0, l = this.path.getSegments().length; i < l; i++) {
				if (this.path.segments[i] === this)
					this.index = i;
			}
		}
		return this.index;
	};

	function Curve(segment1, segment2) {
		this.segment1 = segment1;
		this.segment2 = segment2;

		this.path = this.segment1.path;
	}
	Curve.prototype.getPoints = function () {
		return [
			this.segment1.point.clone(),
			new Point(this.segment1.point.x + this.segment1.handleOut.x, this.segment1.point.y + this.segment1.handleOut.y),
			new Point(this.segment2.point.x + this.segment2.handleIn.x, this.segment2.point.y + this.segment2.handleIn.y),
			this.segment2.point.clone()
		];
	};
	Curve.prototype.getPointAtTime = function (t) {
		const P = this.getPoints();
		return new Point(
			Math.pow(1 - t, 3) * P[0].x + 3 * t * Math.pow(1 - t, 2) * P[1].x + 3 * t * t * (1 - t) * P[2].x + Math.pow(t, 3) * P[3].x,
			Math.pow(1 - t, 3) * P[0].y + 3 * t * Math.pow(1 - t, 2) * P[1].y + 3 * t * t * (1 - t) * P[2].y + Math.pow(t, 3) * P[3].y
		);
	};
	Curve.prototype.getPointAt = function (location) {
		var values = this.getValues();
		return Curve.getPoint(values, Curve.getTimeAt(values, location));
	}
	Curve.prototype.getTangentAtTime = function (time) {
		return Curve.getTangent(this.getValues(), time);
	};
	Curve.prototype.getTangentAt = function (location) {
		var values = this.getValues();
		return Curve.getTangent(values, location);
	};
	Curve.prototype.getValues = function () {
		const p1 = this.segment1.point;
		const h1 = this.segment1.handleOut;
		const h2 = this.segment2.handleIn;
		const p2 = this.segment2.point;

		const x1 = p1.x;
		const y1 = p1.y;
		const x2 = p2.x;
		const y2 = p2.y;

		const values = [
			x1, y1,
			x1 + h1.x, y1 + h1.y,
			x2 + h2.x, y2 + h2.y,
			x2, y2
		];
		return values;
	};
	Curve.prototype.getPrevious = function () {
		var curves = this.path && this.path.getCurves();
		const index = this.getIndex();
		return curves && (curves[index - 1] || this.path.closed && curves[curves.length - 1]) || null;
	};
	Curve.prototype.getIndex = function () {
		let index = this.segment1.index || this.segment1.getIndex();
		if (index === undefined && this.path) {
			const curves = this.path.getCurves();
			for (let i = 0, l = curves.length; i < l; i++) {
				if (curves[i] === this) index = i;
			}
		}
		return this.index = index;
	};
	Curve.prototype.getNext = function () {
		var curves = this.path && this.path.getCurves();
		const index = this.getIndex();
		return curves && (curves[index + 1] || this.path.closed && curves[0]) || null;
	};
	Curve.prototype.getLength = function () {
		if (this.length == null) {
			const values = this.getValues();
			const a = 0;
			const b = 1;
			this.length = Curve.getLength(values, a, b);
		}
		return this.length;
	};
	Curve.prototype.getPartLength = function (from, to) {
		return Curve.getLength(this.getValues(), from, to);
	}
	Curve.prototype.getPath = function () {
		return this.segment1.path;
	};

	// static methods
	Curve.isStraight = function (values) {
		var x0 = values[0], y0 = values[1];
		var x3 = values[6], y3 = values[7];

		return test(
			new Point(x0, y0),
			new Point(values[2] - x0, values[3] - y0),
			new Point(values[4] - x3, values[5] - y3),
			new Point(x3, y3)
		);

		function test(p1, h1, h2, p2) {
			if (h1.isZero() && h2.isZero()) {
				return true;
			} else {
				var v = p2.subtract(p1);
				if (v.isZero()) {
					return false;
				} else if (v.isCollinear(h1) && v.isCollinear(h2)) {
					var epsilon = 1e-7;

					// В paperjs используется класс Line - решил его не создавать
					// var l = new Line(p1, p2);
					// var distance1 = l.getDistance(p1.add(h1));
					// var distance2 = l.getDistance(p2.add(h2));

					function getDistanceToLine(point, vector) {
						const numerator = Math.abs(vector.x * point.y - vector.y * point.x);
						const denominator = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
						return numerator / denominator;
					}

					var distance1 = getDistanceToLine(h1, v);
					var distance2 = getDistanceToLine(h2, v);

					if (distance1 < epsilon && distance2 < epsilon) {
						var div = v.dot(v);
						var s1 = v.dot(h1) / div;
						var s2 = v.dot(h2) / div;
						return s1 >= 0 && s1 <= 1 && s2 <= 0 && s2 >= -1;
					}
				}
			}
			return false;
		}
	};
	Curve.classify = function (v) {
		var x0 = v[0], y0 = v[1];
		let x1 = v[2], y1 = v[3];
		let x2 = v[4], y2 = v[5];
		let x3 = v[6], y3 = v[7];

		let a1 = x0 * (y3 - y2) + y0 * (x2 - x3) + x3 * y2 - y3 * x2;
		let a2 = x1 * (y0 - y3) + y1 * (x3 - x0) + x0 * y3 - y0 * x3;
		let a3 = x2 * (y1 - y0) + y2 * (x0 - x1) + x1 * y0 - y1 * x0;

		let d3 = 3 * a3;
		let d2 = d3 - a2;
		let d1 = d2 - a2 + a1;

		let l = Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3);
		let s = l !== 0 ? 1 / l : 0;

		let serpentine = 'serpentine';

		d1 *= s;
		d2 *= s;
		d3 *= s;

		function type(type, t1, t2) {
			var hasRoots = t1 !== undefined;
			var t1Ok = hasRoots && t1 > 0 && t1 < 1;
			var t2Ok = hasRoots && t2 > 0 && t2 < 1;
			if (hasRoots && (!(t1Ok || t2Ok) || type === 'loop' && !(t1Ok && t2Ok))) {
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

		const isZero = function (val) {
			const EPSILON = 1e-12;
			return val >= -EPSILON && val <= EPSILON;
		};

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
		return type(
			d > 0 ? serpentine : 'loop',
			(d2 + f1) / f2,
			(d2 - f1) / f2
		);
	};
	Curve.getLength = function (values, a, b, ds) {
		if (a === undefined) a = 0;
		if (b === undefined) b = 1;
		if (Curve.isStraight(values)) {
			var c = values;
			if (b < 1) {
				c = Curve.subdivide(c, b)[0];
				a /= b;
			}
			if (a > 0) {
				c = Curve.subdivide(c, a)[1];
			}
			var dx = c[6] - c[0];
			var dy = c[7] - c[1];
			return Math.sqrt(dx * dx + dy * dy);
		}
		return Numerical.integrate(ds || getLengthIntegrand(values), a, b, getIterations(a, b));
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
	Curve.solveCubic = function (v, coord, val, roots, min, max) {
		var v0 = v[coord];
		var v1 = v[coord + 2];
		var v2 = v[coord + 4];
		var v3 = v[coord + 6];
		var res = 0;

		if (!(v0 < val && v3 < val && v1 < val && v2 < val ||
			v0 > val && v3 > val && v1 > val && v2 > val)) {
			var c = 3 * (v1 - v0);
			var b = 3 * (v2 - v1) - c;
			var a = v3 - v0 - c - b;
			res = Numerical.solveCubic(a, b, c, v0 - val, roots, min, max);
		}
		return res;
	};
	Curve.getTimeOf = function (v, point) {
		var p0 = new Point(v[0], v[1]);
		var p3 = new Point(v[6], v[7]);

		var epsilon = 1e-12;
		var geomEpsilon = 1e-7;

		var t = point.getDistance(p0) <= epsilon ? 0
			: point.getDistance(p0) <= epsilon ? 1
				: null;
		if (t === null) {
			var coords = [point.x, point.y],
				roots = [];
			for (var c = 0; c < 2; c++) {
				var count = Curve.solveCubic(v, c, coords[c], roots, 0, 1);
				for (var i = 0; i < count; i++) {
					var u = roots[i];
					if (point.getDistance(Curve.getPoint(v, u)) <= geomEpsilon)
						return u;
				}
			}
		}

		return point.getDistance(p0) <= geomEpsilon ? 0
			: point.getDistance(p3) <= geomEpsilon ? 1
				: null;
	}
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
	Curve.getPoint = function (v, t) {
		return Curve.evaluate(v, t, 0, false);
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
	Curve.getTangent = function (v, t) {
		return Curve.evaluate(v, t, 1, true);
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
			ds = getLengthIntegrand(v),
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
			length += Numerical.integrate(ds, start, t, getIterations(start, t));
			start = t;
			return length - offset;
		}
		return Numerical.findRoot(f, ds, start + guess, a, b, 32, 1e-12);
	}

	function getLengthIntegrand(v) {
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
	}
	function getIterations(a, b) {
		return Math.max(2, Math.min(16, Math.ceil(Math.abs(b - a) * 32)));
	}


	function CurveLocation(curve, time) {
		this.curve = curve;
		this.time = time;
		this.point = curve.getPointAtTime(time);

		this.path = curve.path;

		// this.intersection
		// this.offset
		// this.curveOffset
		// this.overlap
	}
	CurveLocation.prototype.getPath = function () {
		return this.curve ? this.curve.getPath() : null;
	};
	CurveLocation.prototype.getPoint = function () {
		return this.point;
	};
	CurveLocation.prototype.getIndex = function () {
		return this.curve.getIndex();
	};
	CurveLocation.prototype.getCurve = function () {
		return this.curve;
	};
	CurveLocation.prototype.getTime = function () {
		var curve = this.getCurve();
		var time = this.time;
		return curve && time == null
			? this.time = Curve.getTimeOf(curve.getValues(), this.point)
			: time;
	};
	CurveLocation.prototype.getCurveOffset = function () {
		var offset = this.curveOffset;
		if (offset == null) {
			var curve = this.getCurve(),
				time = this.getTime();
			this.curveOffset = offset = time != null && curve && curve.getPartLength(0, time);
		}
		return offset;
	}
	CurveLocation.prototype.getOffset = function () {
		var offset = this.offset;
		if (offset == null) {
			offset = 0;
			var path = this.path;
			var index = this.getIndex();
			if (path && index != null) {
				var curves = path.getCurves();
				for (var i = 0; i < index; i++)
					offset += curves[i].getLength();
			}
			this.offset = offset += this.getCurveOffset();
		}
		return offset;
	};
	CurveLocation.prototype.getTangent = function () {
		var curve = this.getCurve();
		var time = this.getTime();
		return time != null && curve && curve.getTangentAt(time, true);
	};
	CurveLocation.prototype.equals = function (other, _ignoreOther) {
		if (this === other) return true;
		var res = false;
		if (other instanceof CurveLocation) {
			var c1 = this.getCurve();
			var c2 = other.getCurve();
			var p1 = c1.path;
			var p2 = c2.path;

			if (p1 === p2) {
				var epsilon = 1e-7;

				var diff = Math.abs(this.getOffset() - other.getOffset());

				var i1 = !_ignoreOther && this.intersection;
				var i2 = !_ignoreOther && other.intersection;

				res = (diff < epsilon
					|| p1 && Math.abs(p1.getLength() - diff) < epsilon)
					&& (!i1 && !i2 || i1 && i2 && i1.equals(i2, true));
			}
		}
		return res;
	};
	CurveLocation.prototype.hasOverlap = function () {
		return !!this.overlap;
	};
	CurveLocation.prototype.isTouching = function () {
		var inter = this.intersection;
		if (inter && this.getTangent().isCollinear(inter.getTangent())) {
			var curve1 = this.getCurve();
			var curve2 = inter.getCurve();

			const p1x = curve1.segment1.point.x;
			const p1y = curve1.segment1.point.y;
			const v1x = curve1.segment2.point.x - curve1.segment1.point.x;
			const v1y = curve1.segment2.point.x - curve1.segment1.point.x;

			const p2x = curve2.segment1.point.x;
			const p2y = curve2.segment1.point.y;
			const v2x = curve2.segment2.point.x - curve2.segment1.point.x;
			const v2y = curve2.segment2.point.x - curve2.segment1.point.x;

			return !(curve1.isStraight() && curve2.isStraight()
				&& intersects(p1x, p1y, v1x, v1y, p2x, p2y, v2x, v2y));

			function intersects(p1x, p1y, v1x, v1y, p2x, p2y, v2x, v2y) {
				var cross = v1x * v2y - v1y * v2x;
				if (!Numerical.isMachineZero(cross)) {
					var dx = p1x - p2x,
						dy = p1y - p2y,
						u1 = (v2x * dy - v2y * dx) / cross,
						u2 = (v1x * dy - v1y * dx) / cross,
						epsilon = 1e-12,
						uMin = -epsilon,
						uMax = 1 + epsilon;
					if (uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
						u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
						return new Point(p1x + u1 * v1x, p1y + u1 * v1y);
					}
				}
			}
		}
		return false;
	};
	CurveLocation.prototype.isCrossing = function () {
		var inter = this.intersection;
		if (!inter) return false;

		var t1 = this.getTime();
		var t2 = inter.getTime();

		var tMin = 1e-8;
		var tMax = 1 - tMin;

		var t1Inside = t1 >= tMin && t1 <= tMax;
		var t2Inside = t2 >= tMin && t2 <= tMax;

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
			? (isInRange(a1, a3, a4) ^ isInRange(a2, a3, a4)) && (isInRange(a1, a4, a3) ^ isInRange(a2, a4, a3))
			: (isInRange(a3, a1, a2) ^ isInRange(a4, a1, a2)) && (isInRange(a3, a2, a1) ^ isInRange(a4, a2, a1))
		);
	};

	// static
	CurveLocation.insert = function (locations, loc, merge) {
		var length = locations.length;
		let l = 0;
		let r = length - 1;

		function search(index, dir) {
			for (var i = index + dir; i >= -1 && i <= length; i += dir) {
				var loc2 = locations[((i % length) + length) % length];
				if (loc.getPoint().getDistance(loc2.getPoint()) > 1e-7)
					break;
				if (loc.equals(loc2))
					return loc2;
			}
			return null;
		}

		while (l <= r) {
			var m = (l + r) >>> 1;
			var loc2 = locations[m];

			var found;
			if (merge && (found = loc.equals(loc2) ? loc2 : (search(m, -1) || search(m, 1)))) {
				if (loc.overlap) {
					found.overlap = found.intersection.overlap = true;
				}
				return found;
			}

			var path1 = loc.getPath();
			var path2 = loc2.getPath();
			var diff = path1 !== path2
				? path1.id - path2.id
				: (loc.getIndex() + loc.getTime()) - (loc2.getIndex() + loc2.getTime());

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
			CurveLocation.insert(expanded, locations[i].intersection, false);
		}
		return expanded;
	};

	function Path(segments /* Segment[] */, closed /* Bool */) {
		const path = this;
		this.segments = segments && segments.map(function (segment, index) {
			return segment.setProps({ path: path, index: index });
		});
		this.closed = closed;

		// this.curves
	}
	Path.prototype.clone = function () {
		const copy = new Path();
		copy.segments = this.segments.map(function (segment) {
			return segment.clone();
		})
		copy.closed = this.closed;
		return copy;
	};
	Path.prototype.isEmpty = function () {
		return !this.segments.length;
	}
	Path.prototype.getLength = function () {
		if (this.length == null) {
			var curves = this.getCurves();
			var length = 0;
			for (var i = 0, l = curves.length; i < l; i++)
				length += curves[i].getLength();
			this.length = length;
		}
		return this.length;
	};
	Path.prototype.getSegments = function () {
		return this.segments;
	};
	Path.prototype.getFirstSegment = function () {
		return this.segments[0];
	};
	Path.prototype.getLastSegment = function () {
		return this.segments[this.segments.length - 1];
	};
	Path.prototype.getCurves = function () {
		let curves = this.curves;
		const segments = this.segments;
		if (!curves) {
			const length = !this.closed && this.segments.length > 0
				? this.segments.length - 1
				: this.segments.length;
			curves = this.curves = new Array(length);
			for (var i = 0; i < length; i++) {
				const newCurve = new Curve(segments[i], segments[i + 1] || segments[0]);
				newCurve.path = this;
				curves[i] = newCurve;
			}
		}
		return curves;
	};
	Path.prototype.closePath = function () {
		this.closed = true;
		var first = this.getFirstSegment();
		var last = this.getLastSegment();
		if (first !== last) {
			if (first.point.getDistance(last.point) < 1e-12) {
				first.setHandleIn(last.handleIn.x, last.handleIn.y);
				last.remove();
			}
		}
		return this;
	};
	Path.prototype.resolveCrossings = function () {
		var paths = this.children || [this];

		var hasOverlaps = false;
		var hasCrossings = false;

		function hasOverlap(seg, path) {
			var inter = seg && seg.intersection;
			return inter && inter.overlap && inter.path === path;
		}

		function handleIntersection(inter) {
			if (inter.hasOverlap()) { hasOverlaps = true; }
			if (inter.isCrossing()) { hasCrossings = true; }
			return hasOverlaps || hasCrossings;
		}

		let curves1 = this.getCurves();
		var length1 = curves1.length;
		var values1 = new Array(length1);

		for (var i = 0; i < length1; i++) {
			values1[i] = curves1[i].getValues();
		}

		var boundsCollisions = CollisionDetection.findCurveBoundsCollisions(values1, values1, 1e-7);

		function addLocation(locations, include, c1, t1, c2, t2, overlap) {
			var excludeStart = !overlap && c1.getPrevious() === c2;
			var excludeEnd = !overlap && c1 !== c2 && c1.getNext() === c2;
			var tMin = 1e-8;
			var tMax = 1 - tMin;

			if (t1 !== null && t1 >= (excludeStart ? tMin : 0) && t1 <= (excludeEnd ? tMax : 1)) {
				if (t2 !== null && t2 >= (excludeEnd ? tMin : 0) && t2 <= (excludeStart ? tMax : 1)) {
					var loc1 = new CurveLocation(c1, t1);
					var loc2 = new CurveLocation(c2, t2);

					loc1.intersection = loc2;
					loc2.intersection = loc1;

					if (!include || include(loc1)) {
						CurveLocation.insert(locations, loc1, true);
					}
				}
			}
		}

		function intersect(p1x, p1y, v1x, v1y, p2x, p2y, v2x, v2y, asVector, isInfinite) {
			if (!asVector) {
				v1x -= p1x;
				v1y -= p1y;
				v2x -= p2x;
				v2y -= p2y;
			}
			var cross = v1x * v2y - v1y * v2x;
			if (!Numerical.isMachineZero(cross)) {
				var dx = p1x - p2x;
				var dy = p1y - p2y;

				var u1 = (v2x * dy - v2y * dx) / cross;
				var u2 = (v1x * dy - v1y * dx) / cross;

				var epsilon = 1e-12;
				var uMin = -epsilon;
				var uMax = 1 + epsilon;

				if (isInfinite || uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
					if (!isInfinite) {
						u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
					}
					return new Point(p1x + u1 * v1x, p1y + u1 * v1y);
				}
			}
		}

		function addLineIntersection(v1, v2, c1, c2, locations, include) {
			var pt = intersect(
				v1[0], v1[1], v1[6], v1[7],
				v2[0], v2[1], v2[6], v2[7]
			);
			if (pt) {
				addLocation(locations, include,
					c1, Curve.getTimeOf(v1, pt),
					c2, Curve.getTimeOf(v2, pt)
				);
			}
		}

		function getSelfIntersection(v1, c1, locations, include) {
			var info = Curve.classify(v1);
			if (info.type === 'loop') {
				var roots = info.roots;
				addLocation(locations, include, c1, roots[0], c1, roots[1]);
			}
			return locations;
		}

		function getCurveIntersections(v1, v2, c1, c2, locations, include) {
			var epsilon = 1e-12;

			if (Math.max(v1[0], v1[2], v1[4], v1[6]) + epsilon > Math.min(v2[0], v2[2], v2[4], v2[6]) &&
				Math.min(v1[0], v1[2], v1[4], v1[6]) - epsilon < Math.max(v2[0], v2[2], v2[4], v2[6]) &&
				Math.max(v1[1], v1[3], v1[5], v1[7]) + epsilon > Math.min(v2[1], v2[3], v2[5], v2[7]) &&
				Math.min(v1[1], v1[3], v1[5], v1[7]) - epsilon < Math.max(v2[1], v2[3], v2[5], v2[7])) {
				var overlaps = getOverlaps(v1, v2);

				if (overlaps) {
					for (var i = 0; i < 2; i++) {
						var overlap = overlaps[i];
						addLocation(locations, include, c1, overlap[0], c2, overlap[1], true);
					}
				} else {
					var straight1 = Curve.isStraight(v1);
					var straight2 = Curve.isStraight(v2);
					var straight = straight1 && straight2;
					var flip = straight1 && !straight2;
					var before = locations.length;

					(straight
						? addLineIntersection
						: straight1 || straight2
							? addCurveLineIntersections
							: addCurveIntersections)(
								flip ? v2 : v1, flip ? v1 : v2,
								flip ? c2 : c1, flip ? c1 : c2,
								locations, include, flip, 0, 0, 0, 1, 0, 1);

					if (!straight || locations.length === before) {
						for (var i = 0; i < 4; i++) {
							var t1 = i >> 1,
								t2 = i & 1,
								i1 = t1 * 6,
								i2 = t2 * 6,
								p1 = new Point(v1[i1], v1[i1 + 1]),
								p2 = new Point(v2[i2], v2[i2 + 1]);
							if (p1.getDistance(p2) <= epsilon) {
								addLocation(locations, include, c1, t1, c2, t2);
							}
						}
					}
				}
			}
			return locations;

			function getOverlaps(v1, v2) {
				function getSquaredLineLength(v) {
					var x = v[6] - v[0],
						y = v[7] - v[1];
					return x * x + y * y;
				}

				function getDistance(px, py, vx, vy, x, y, asVector) {
					if (!asVector) {
						vx -= px;
						vy -= py;
					}
					const distance = vx === 0 ? (vy > 0 ? x - px : px - x)
						: vy === 0 ? (vx < 0 ? y - py : py - y)
							: ((x - px) * vy - (y - py) * vx) / (
								vy > vx
									? vy * Math.sqrt(1 + (vx * vx) / (vy * vy))
									: vx * Math.sqrt(1 + (vy * vy) / (vx * vx))
							);
					return Math.abs(distance);
				}

				var timeEpsilon = 1e-8;
				var geomEpsilon = 1e-7;
				var straight1 = Curve.isStraight(v1);
				var straight2 = Curve.isStraight(v2);
				var straightBoth = straight1 && straight2;
				var flip = getSquaredLineLength(v1) < getSquaredLineLength(v2);
				var l1 = flip ? v2 : v1;
				var l2 = flip ? v1 : v2;
				var px = l1[0], py = l1[1];
				var vx = l1[6] - px, vy = l1[7] - py;

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

				var v = [v1, v2];
				var pairs = [];
				for (var i = 0; i < 4 && pairs.length < 2; i++) {
					var i1 = i & 1;
					var i2 = i1 ^ 1;

					var t1 = i >> 1;
					var t2 = Curve.getTimeOf(v[i1], new Point(v[i2][t1 ? 6 : 0], v[i2][t1 ? 7 : 1]));

					if (t2 != null) {
						var pair = i1 ? [t1, t2] : [t2, t1];
						if (!pairs.length ||
							Math.abs(pair[0] - pairs[0][0]) > timeEpsilon &&
							Math.abs(pair[1] - pairs[0][1]) > timeEpsilon) {
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
					if (Math.abs(o2[2] - o1[2]) > geomEpsilon ||
						Math.abs(o2[3] - o1[3]) > geomEpsilon ||
						Math.abs(o2[4] - o1[4]) > geomEpsilon ||
						Math.abs(o2[5] - o1[5]) > geomEpsilon)
						pairs = null;
				}
				return pairs;
			}
		}

		function getCurveLineIntersections(v, px, py, vx, vy) {
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
		}

		function addCurveLineIntersections(v1, v2, c1, c2, locations, include, flip) {
			var x1 = v2[0], y1 = v2[1],
				x2 = v2[6], y2 = v2[7];

			var roots = getCurveLineIntersections(v1, x1, y1, x2 - x1, y2 - y1);
			for (var i = 0, l = roots.length; i < l; i++) {
				var t1 = roots[i],
					p1 = Curve.getPoint(v1, t1),
					t2 = Curve.getTimeOf(v2, p1);
				if (t2 !== null) {
					addLocation(locations, include,
						flip ? c2 : c1, flip ? t2 : t1,
						flip ? c1 : c2, flip ? t1 : t2
					);
				}
			}
		}

		function addCurveIntersections(v1, v2, c1, c2, locations, include, flip, recursion, calls, tMin, tMax, uMin, uMax) {
			if (++calls >= 4096 || ++recursion >= 40) {
				return calls;
			}

			var fatLineEpsilon = 1e-9;
			var q0x = v2[0], q0y = v2[1], q3x = v2[6], q3y = v2[7];

			var getSignedDistance = function (px, py, vx, vy, x, y, asVector) {
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

			var d1 = getSignedDistance(q0x, q0y, q3x, q3y, v2[2], v2[3]);
			var d2 = getSignedDistance(q0x, q0y, q3x, q3y, v2[4], v2[5]);

			var factor = d1 * d2 > 0 ? 3 / 4 : 4 / 9;
			var dMin = factor * Math.min(0, d1, d2);
			var dMax = factor * Math.max(0, d1, d2);

			var dp0 = getSignedDistance(q0x, q0y, q3x, q3y, v1[0], v1[1]);
			var dp1 = getSignedDistance(q0x, q0y, q3x, q3y, v1[2], v1[3]);
			var dp2 = getSignedDistance(q0x, q0y, q3x, q3y, v1[4], v1[5]);
			var dp3 = getSignedDistance(q0x, q0y, q3x, q3y, v1[6], v1[7]);

			var hull = getConvexHull(dp0, dp1, dp2, dp3);
			var top = hull[0];
			var bottom = hull[1];

			var tMinClip;
			var tMaxClip;

			if (d1 === 0 && d2 === 0 && dp0 === 0 && dp1 === 0 && dp2 === 0 && dp3 === 0
				|| (tMinClip = clipConvexHull(top, bottom, dMin, dMax)) == null
				|| (tMaxClip = clipConvexHull(top.reverse(), bottom.reverse(), dMin, dMax)) == null) {
				return calls;
			}

			var tMinNew = tMin + (tMax - tMin) * tMinClip;
			var tMaxNew = tMin + (tMax - tMin) * tMaxClip;

			if (Math.max(uMax - uMin, tMaxNew - tMinNew) < fatLineEpsilon) {
				var t = (tMinNew + tMaxNew) / 2;
				var u = (uMin + uMax) / 2;
				addLocation(locations, include,
					flip ? c2 : c1, flip ? u : t,
					flip ? c1 : c2, flip ? t : u
				);
			} else {
				v1 = Curve.getPart(v1, tMinClip, tMaxClip);
				var uDiff = uMax - uMin;
				if (tMaxClip - tMinClip > 0.8) {
					if (tMaxNew - tMinNew > uDiff) {
						var parts = Curve.subdivide(v1, 0.5),
							t = (tMinNew + tMaxNew) / 2;
						calls = addCurveIntersections(
							v2, parts[0], c2, c1, locations, include, !flip,
							recursion, calls, uMin, uMax, tMinNew, t);
						calls = addCurveIntersections(
							v2, parts[1], c2, c1, locations, include, !flip,
							recursion, calls, uMin, uMax, t, tMaxNew);
					} else {
						var parts = Curve.subdivide(v2, 0.5),
							u = (uMin + uMax) / 2;
						calls = addCurveIntersections(
							parts[0], v1, c2, c1, locations, include, !flip,
							recursion, calls, uMin, u, tMinNew, tMaxNew);
						calls = addCurveIntersections(
							parts[1], v1, c2, c1, locations, include, !flip,
							recursion, calls, u, uMax, tMinNew, tMaxNew);
					}
				} else {
					if (uDiff === 0 || uDiff >= fatLineEpsilon) {
						calls = addCurveIntersections(
							v2, v1, c2, c1, locations, include, !flip,
							recursion, calls, uMin, uMax, tMinNew, tMaxNew);
					} else {
						calls = addCurveIntersections(
							v1, v2, c1, c2, locations, include, flip,
							recursion, calls, tMinNew, tMaxNew, uMin, uMax);
					}
				}
			}
			return calls;
		}

		function getConvexHull(dq0, dq1, dq2, dq3) {
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
		}

		function clipConvexHull(hullTop, hullBottom, dMin, dMax) {
			if (hullTop[0][1] < dMin) {
				return clipConvexHullPart(hullTop, true, dMin);
			} else if (hullBottom[0][1] > dMax) {
				return clipConvexHullPart(hullBottom, false, dMax);
			} else {
				return hullTop[0][0];
			}
		}

		function clipConvexHullPart(part, top, threshold) {
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
		}

		var locations = [];
		for (var index1 = 0; index1 < length1; index1++) {
			var curve1 = curves1[index1];
			var v1 = values1[index1];
			getSelfIntersection(v1, curve1, locations, handleIntersection);
			var collisions1 = boundsCollisions[index1];

			if (collisions1) {
				for (var j = 0; j < collisions1.length; j++) {
					var index2 = collisions1[j];
					if (index2 > index1) {
						var curve2 = curves1[index2];
						var v2 = values1[index2];
						getCurveIntersections(v1, v2, curve1, curve2, locations, handleIntersection);
					}
				}
			}
		}

		var intersections = locations;

		// here
		debugger

		var clearCurves = hasOverlaps && hasCrossings && [];
		intersections = CurveLocation.expand(intersections);
		if (hasOverlaps) {
			var overlaps = divideLocations(intersections, function (inter) {
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
			divideLocations(intersections, hasOverlaps && function (inter) {
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
				clearCurveHandles(clearCurves);
			paths = tracePaths(Base.each(paths, function (path) {
				Base.push(this, path._segments);
			}, []));
		}
		var length = paths.length,
			item;
		if (length > 1 && this.children) {
			if (paths !== this.children)
				this.setChildren(paths);
			item = this;
		} else if (length === 1 && !this.children) {
			if (paths[0] !== this)
				this.setSegments(paths[0].removeSegments());
			item = this;
		}
		if (!item) {
			item = new CompoundPath(Item.NO_INSERT);
			item.addChildren(paths);
			item = item.reduce();
			item.copyAttributes(this);
			this.replaceWith(item);
		}
		return item;
	};

	function CompoundPath(children) {
		this.children = children;
	}
	CompoundPath.prototype.clone = function () {
		return new CompoundPath(this.children.map(function (child) {
			return child.clone();
		}));
	};
	CompoundPath.prototype.resolveCrossings = function () {
		Path.prototype.resolveCrossings.call(this);
	};
	CompoundPath.prototype.getCurves = function () {
		const children = this.children;
		const curves = [];
		for (let i = 0, l = children.length; i < l; i++) {
			curves.push.apply(curves, children[i].getCurves());
		}
		return curves;
	};


	// BIG DIVIDING LINE (classes are above)

	const operators = {
		unite: { '1': true, '2': true },
		intersect: { '2': true },
		subtract: { '1': true },
		exclude: { '1': true, '-1': true }
	};

	function traceBoolean(path1, path2, operation) {
		var _path1 = preparePath(path1);
		var _path2 = preparePath(path2);

		var operator = operators[operation];
		operator[operation] = true;

		if ((operator.subtract || operator.exclude) ^ (_path2.isClockwise() ^ _path1.isClockwise())) {
			_path2.reverse();
		}

		let intersections = _path1.getIntersections(_path2, filterIntersection);
		let locations = CurveLocation.expand(intersections);
		var crossings = divideLocations(locations);

		let paths1 = getPaths(_path1);
		let paths2 = getPaths(_path2);

		let segments = [];
		let curves = [];
		let paths;

		function collectPaths(paths) {
			for (var i = 0, l = paths.length; i < l; i++) {
				var path = paths[i];
				Base.push(segments, path.segments);
				Base.push(curves, path.getCurves());
				path.overlapsOnly = true;
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
			collectPaths(paths2);

			var curvesValues = new Array(curves.length);
			for (var i = 0, l = curves.length; i < l; i++) {
				curvesValues[i] = curves[i].getValues();
			}

			var curveCollisions = CollisionDetection.findCurveBoundsCollisions(curvesValues, curvesValues, 0, true);
			var curveCollisionsMap = {};
			for (var i = 0; i < curves.length; i++) {
				var curve = curves[i];
				let id = curve._path._id;
				let map = curveCollisionsMap[id] = curveCollisionsMap[id] || {};
				map[curve.getIndex()] = {
					hor: getCurves(curveCollisions[i].hor),
					ver: getCurves(curveCollisions[i].ver)
				};
			}

			for (var i = 0, l = crossings.length; i < l; i++) {
				propagateWinding(crossings[i]._segment, _path1, _path2, curveCollisionsMap, operator);
			}

			for (var i = 0, l = segments.length; i < l; i++) {
				var segment = segments[i];
				let inter = segment._intersection;
				if (!segment._winding) {
					propagateWinding(segment, _path1, _path2, curveCollisionsMap, operator);
				}
				if (!inter || !inter._overlap) {
					segment._path._overlapsOnly = false;
				}
			}

			paths = tracePaths(segments, operator);
		} else {
			paths = reorientPaths(
				paths2 ? paths1.concat(paths2) : paths1.slice(),
				function (w) {
					return !!operator[w];
				});
		}
		return createResult(paths, true, path1, path2, options);
	}

	function preparePath(path) {
		var res = path.clone();
		// res = res.reduce(); // TODO

		var paths = getPaths(res);
		for (let i = 0, l = paths.length; i < l; i++) {
			var path = paths[i];
			if (!path.closed && !path.isEmpty()) {
				path.closePath();
				path.getFirstSegment().setHandleIn(0, 0);
				path.getLastSegment().setHandleOut(0, 0);
			}
		}

		res = res.resolveCrossings();
		return res;
	}

	function getPaths(path) {
		return path.children || [path];
	}

	const CollisionDetection = {
		findItemBoundsCollisions: function (items1, items2, tolerance) {
			function getBounds(items) {
				const bounds = new Array(items.length);
				for (var i = 0; i < items.length; i++) {
					const rect = items[i].getBounds();
					bounds[i] = [rect.left, rect.top, rect.right, rect.bottom];
				}
				return bounds;
			}

			const bounds1 = getBounds(items1);
			const bounds2 = !items2 || items2 === items1
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

		findBoundsCollisions: function (boundsA, boundsB, tolerance, sweepVertical, onlySweepAxisCollisions) {
			var self = !boundsB || boundsA === boundsB;
			let allBounds = self ? boundsA : boundsA.concat(boundsB);
			let lengthA = boundsA.length;
			let lengthAll = allBounds.length;

			function binarySearch(indices, coord, value) {
				var lo = 0;
				var hi = indices.length;
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

			var pri0 = sweepVertical ? 1 : 0;
			var pri1 = pri0 + 2;
			var sec0 = sweepVertical ? 0 : 1;
			var sec1 = sec0 + 2;

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
				var curIndex = allIndicesByPri0[i];
				var curBounds = allBounds[curIndex];
				var origIndex = self ? curIndex : curIndex - lengthA;
				var isCurrentA = curIndex < lengthA;
				var isCurrentB = self || !isCurrentA;
				var curCollisions = isCurrentA ? [] : null;

				if (activeIndicesByPri1.length) {
					var pruneCount = binarySearch(activeIndicesByPri1, pri1, curBounds[pri0] - tolerance) + 1;
					activeIndicesByPri1.splice(0, pruneCount);
					if (self && onlySweepAxisCollisions) {
						curCollisions = curCollisions.concat(activeIndicesByPri1);
						for (var j = 0; j < activeIndicesByPri1.length; j++) {
							var activeIndex = activeIndicesByPri1[j];
							allCollisions[activeIndex].push(origIndex);
						}
					} else {
						var curSec1 = curBounds[sec1];
						var curSec0 = curBounds[sec0];
						for (var j = 0; j < activeIndicesByPri1.length; j++) {
							var activeIndex = activeIndicesByPri1[j];
							var activeBounds = allBounds[activeIndex];
							var isActiveA = activeIndex < lengthA;
							var isActiveB = self || activeIndex >= lengthA;

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

	const Numerical = {
		EPSILON: 1e-12,
		MACHINE_EPSILON: 1.12e-16,

		isMachineZero: function (val) {
			return val >= -Numerical.MACHINE_EPSILON && val <= Numerical.MACHINE_EPSILON;
		},

		isZero: function (val) {
			return val >= -Numerical.EPSILON && val <= Numerical.EPSILON;
		},

		getNormalizationFactor: function () {
			var norm = Math.max.apply(Math, arguments);
			return norm && (norm < 1e-8 || norm > 1e8)
				? pow(2, -Math.round(log2(norm)))
				: 0;
		},

		getDiscriminant: function (a, b, c) {
			function split(v) {
				var x = v * 134217729,
					y = v - x,
					hi = y + x,
					lo = v - hi;
				return [hi, lo];
			}

			var D = b * b - a * c,
				E = b * b + a * c;
			if (Math.abs(D) * 3 < E) {
				var ad = split(a);
				var bd = split(b);
				var cd = split(c);

				var p = b * b;
				var dp = (bd[0] * bd[0] - p + 2 * bd[0] * bd[1]) + bd[1] * bd[1];

				var q = a * c;
				var dq = (ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0]) + ad[1] * cd[1];

				D = (p - q) + (dp - dq);
			}
			return D;
		},

		findRoot: function (f, df, x, a, b, n, tolerance) {
			for (var i = 0; i < n; i++) {
				var fx = f(x),
					dx = fx / df(x),
					nx = x - dx;
				if (Math.abs(dx) < tolerance) {
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
			return Numerical.clamp(x, a, b);
		},

		integrate: function (f, a, b, n) {
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

			var x = abscissas[n - 2];
			var w = weights[n - 2];

			var A = (b - a) * 0.5;
			var B = A + a;
			var i = 0;
			var m = (n + 1) >> 1;
			var sum = n & 1 ? w[i++] * f(B) : 0;
			while (i < m) {
				var Ax = A * x[i];
				sum += w[i++] * (f(B + Ax) + f(B - Ax));
			}
			return A * sum;
		},

		clamp: function (value, min, max) {
			return value < min ? min : value > max ? max : value;
		},

		solveCubic: function (a, b, c, d, roots, min, max) {
			var f = Numerical.getNormalizationFactor(Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));
			if (f) {
				a *= f;
				b *= f;
				c *= f;
				d *= f;
			}

			var x, b1, c2, qd, q;
			function evaluate(x0) {
				x = x0;
				var tmp = a * x;
				b1 = tmp + b;
				c2 = b1 * x + c;
				qd = (tmp + b1) * x + c2;
				q = c2 * x + d;
			}

			if (Math.abs(a) < Numerical.EPSILON) {
				a = b;
				b1 = c;
				c2 = d;
				x = Infinity;
			} else if (Math.abs(d) < Numerical.EPSILON) {
				b1 = b;
				c2 = c;
				x = 0;
			} else {
				evaluate(-(b / a) / 3);
				var t = q / a,
					r = Math.pow(Math.abs(t), 1 / 3),
					s = t < 0 ? -1 : 1,
					td = -qd / a,
					rd = td > 0 ? 1.324717957244746 * Math.max(r, Math.sqrt(td)) : r,
					x0 = x - s * rd;
				if (x0 !== x) {
					do {
						evaluate(x0);
						x0 = qd === 0 ? x : x - q / qd / (1 + Numerical.MACHINE_EPSILON);
					} while (s * x0 > s * x);
					if (Math.abs(a) * x * x > Math.abs(d / x)) {
						c2 = -d / x;
						b1 = (c2 - c) / x;
					}
				}
			}
			var count = Numerical.solveQuadratic(a, b1, c2, roots, min, max);
			var boundless = min == null;
			if (isFinite(x) && (count === 0
				|| count > 0 && x !== roots[0] && x !== roots[1])
				&& (boundless || x > min - Numerical.EPSILON && x < max + Numerical.EPSILON))
				roots[count++] = boundless ? x : Numerical.clamp(x, min, max);
			return count;
		},

		solveQuadratic: function (a, b, c, roots, min, max) {
			var x1, x2 = Infinity;
			if (Math.abs(a) < Numerical.EPSILON) {
				if (Math.abs(b) < Numerical.EPSILON)
					return Math.abs(c) < Numerical.EPSILON ? -1 : 0;
				x1 = -c / b;
			} else {
				b *= -0.5;
				var D = Numerical.getDiscriminant(a, b, c);
				if (D && Math.abs(D) < Numerical.MACHINE_EPSILON) {
					var f = Numerical.getNormalizationFactor(Math.abs(a), Math.abs(b), Math.abs(c));
					if (f) {
						a *= f;
						b *= f;
						c *= f;
						D = Numerical.getDiscriminant(a, b, c);
					}
				}
				if (D >= -Numerical.MACHINE_EPSILON) {
					var Q = D < 0 ? 0 : Math.sqrt(D),
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
				minB = min - Numerical.EPSILON,
				maxB = max + Numerical.EPSILON;
			if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB))
				roots[count++] = boundless ? x1 : Numerical.clamp(x1, min, max);
			if (x2 !== x1
				&& isFinite(x2) && (boundless || x2 > minB && x2 < maxB))
				roots[count++] = boundless ? x2 : Numerical.clamp(x2, min, max);
			return count;
		}
	}

	// EXPORTS

	window.PathBoolean = {
		Point, Segment, Curve, CurveLocation, Path, CompoundPath, traceBoolean
	};

	// TEST CASE 1

	// const pause = window.pause = new CompoundPath([
	// 	new Path([
	// 		new Segment(new Point(100, 200)),
	// 		new Segment(new Point(100, 350)),
	// 		new Segment(new Point(130, 350)),
	// 		new Segment(new Point(130, 200)),
	// 	], true),
	// 	new Path([
	// 		new Segment(new Point(180, 200)),
	// 		new Segment(new Point(180, 350)),
	// 		new Segment(new Point(150, 350)),
	// 		new Segment(new Point(150, 200)),
	// 	], false)
	// ]);

	// const circle = window.circle = new Path([
	// 	new Segment(new Point(100, 100), new Point(-55, 0), new Point(55, 0)),
	// 	new Segment(new Point(200, 200), new Point(0, -55), new Point(0, 55)),
	// 	new Segment(new Point(100, 300), new Point(55, 0), new Point(-55, 0)),
	// 	new Segment(new Point(0, 200), new Point(0, 55), new Point(0, -55))
	// ], true);

	// const result = traceBoolean(pause, circle, 'exclude');
	// console.log(result)

	// TEST CASE 2

	const selfInter = new Path([
		new Segment(new Point(0, 0)),
		new Segment(new Point(100, 0)),
		new Segment(new Point(0, 100)),
		new Segment(new Point(100, 100))
	], true)

	const circle = window.circle = new Path([
		new Segment(new Point(100, 100), new Point(-55, 0), new Point(55, 0)),
		new Segment(new Point(200, 200), new Point(0, -55), new Point(0, 55)),
		new Segment(new Point(100, 300), new Point(55, 0), new Point(-55, 0)),
		new Segment(new Point(0, 200), new Point(0, 55), new Point(0, -55))
	], true);

	const result = traceBoolean(selfInter, circle, 'exclude');
	console.log(result)

})(window);

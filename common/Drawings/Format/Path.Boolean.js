(function (window) {

	function Point(x, y) {
		this.x = x;
		this.y = y;
	}
	Point.prototype.clone = function () {
		return new Point(this.x, this.y);
	};
	Point.prototype.isEqual = function (other) {
		return this.x === other.x && this.y === other.y;
	};
	Point.prototype.getDistance = function (other) {
		const deltaX = other.x - this.x;
		const deltaY = other.y - this.y;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	};

	function Segment(point, handleIn, handleOut, props) {
		this.point = point || new Point(0, 0);
		this.handleIn = handleIn || new Point(0, 0);
		this.handleOut = handleOut || new Point(0, 0);

		if (props) {
			this.path = props.path;
			this.index = props.index;
		}

		// this._intersection;
	}
	Segment.prototype.setProps = function (props) {
		this.path = props.path;
		this.index = props.index;
		return this;
	};
	Segment.prototype.clone = function () {
		const props = {
			path: this.path,
			index: this.index + 1
		};
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

	function Curve(segment1, segment2) {
		this.segment1 = segment1;
		this.segment2 = segment2;
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

	function CurveLocation(curve, time) {
		this.curve = curve;
		this.time = time;
		this.point = curve.getPointAtTime(time);

		this.path;
	}

	function Path(segments, closed) {
		const path = this;
		this.segments = segments && segments.map(function (segment, index) {
			return segment.setProps({ path: path, index: index });
		});
		this.closed = closed;
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
	Path.prototype.getFirstSegment = function () {
		return this.segments[0];
	};
	Path.prototype.getLastSegment = function () {
		return this.segments[this.segments.length - 1];
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
			var inter = seg && seg._intersection;
			return inter && inter._overlap && inter._path === path;
		}

		function handleIntersection(inter) {
			if (inter.hasOverlap()) { hasOverlaps = true; }
			if (inter.isCrossing()) { hasCrossings = true; }
			return hasOverlaps || hasCrossings;
		}

		// Stuck here
		debugger

		var matrix1 = this._matrix._orNullIfIdentity();
		var epsilon = 1e-7;
		var length1 = curves1.length;
		var values1 = new Array(length1);
		var locations = [];

		for (var i = 0; i < length1; i++) {
			values1[i] = curves1[i].getValues(matrix1);
		}

		var boundsCollisions = CollisionDetection.findCurveBoundsCollisions(values1, values1, epsilon);

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

	// BIG DIVIDING LINE (classes are above)

	operators = {
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
				Base.push(segments, path._segments);
				Base.push(curves, path.getCurves());
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

	// EXPORTS

	window.PathBoolean = {
		Point, Segment, Curve, CurveLocation, Path, CompoundPath, traceBoolean
	};

	// TEST CASE 1

	const pause = window.pause = new CompoundPath([
		new Path([
			new Segment(new Point(100, 200)),
			new Segment(new Point(100, 350)),
			new Segment(new Point(130, 350)),
			new Segment(new Point(130, 200)),
		], true),
		new Path([
			new Segment(new Point(180, 200)),
			new Segment(new Point(180, 350)),
			new Segment(new Point(150, 350)),
			new Segment(new Point(150, 200)),
		], false)
	]);

	const circle = window.circle = new Path([
		new Segment(new Point(100, 100), new Point(-55, 0), new Point(55, 0)),
		new Segment(new Point(200, 200), new Point(0, -55), new Point(0, 55)),
		new Segment(new Point(100, 300), new Point(55, 0), new Point(-55, 0)),
		new Segment(new Point(0, 200), new Point(0, 55), new Point(0, -55))
	], true);

	const result = traceBoolean(pause, circle, 'exclude');
	console.log(result)

})(window);

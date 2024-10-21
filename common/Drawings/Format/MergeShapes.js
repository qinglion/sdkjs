// Copy of paper-full.js (paperjs.org)

var paper = function (self, undefined) {

	function InitClassWithStatics(fClass, fBase, nType) {
		AscFormat.InitClass(fClass, fBase, nType);

		Object.getOwnPropertyNames(fBase).forEach(function (prop) {
			if (['prototype', 'name', 'length'].includes(prop) || Function.prototype.hasOwnProperty(prop)) { return; }
			Object.defineProperty(fClass, prop, Object.getOwnPropertyDescriptor(fBase, prop));
		});
		fClass.base = fBase;
	}

	var window = self.window,
		document = self.document;

	function globalInject(dest, src, enumerable, beans, preserve) {
		var beansNames = {};

		function field(name, val) {
			val = val || (val = Object.getOwnPropertyDescriptor(src, name)) && (val.get ? val : val.value);
			if (typeof val === 'string' && val[0] === '#')
				val = dest[val.substring(1)] || val;
			var isFunc = typeof val === 'function',
				res = val,
				prev = preserve || isFunc && !val.base
					? (val && val.get ? name in dest : dest[name])
					: null,
				bean;
			if (!preserve || !prev) {
				if (isFunc && prev)
					val.base = prev;
				if (isFunc && beans !== false
					&& (bean = name.match(/^([gs]et|is)(([A-Z])(.*))$/)))
					beansNames[bean[3].toLowerCase() + bean[4]] = bean[2];
				if (!res || isFunc || !res.get || typeof res.get !== 'function'
					|| !Base.isPlainObject(res)) {
					res = { value: res, writable: true };
				}
				if ((Object.getOwnPropertyDescriptor(dest, name)
					|| { configurable: true }).configurable) {
					res.configurable = true;
					res.enumerable = enumerable != null ? enumerable : !bean;
				}
				Object.defineProperty(dest, name, res);
			}
		}
		if (src) {
			var hidden = /^(statics|enumerable|beans|preserve)$/;
			for (var name in src) {
				if (src.hasOwnProperty(name) && !hidden.test(name))
					field(name);
			}
			for (var name in beansNames) {
				var part = beansNames[name],
					set = dest['set' + part],
					get = dest['get' + part] || set && dest['is' + part];
				if (get && (beans === true || get.length === 0))
					field(name, { get: get, set: set });
			}
		}
		return dest;
	}

	var Base = function Base() {
		for (var i = 0, l = arguments.length; i < l; i++) {
			var src = arguments[i];
			if (src)
				Object.assign(this, src);
		}
		return this;
	};

	Base.prototype.initialize = Base;
	Base.prototype.set = Base;
	Base.prototype.inject = function () {
		for (var i = 0, l = arguments.length; i < l; i++) {
			var src = arguments[i];
			if (src) {
				globalInject(this, src, src.enumerable, src.beans, src.preserve);
			}
		}
		return this;
	};
	Base.prototype.extend = function () {
		var res = Object.create(this);
		return res.inject.apply(res, arguments);
	};
	Base.prototype.each = function (iter, bind) {
		return each(this, iter, bind);
	};
	Base.prototype.clone = function () {
		return new this.constructor(this);
	};

	Base.set = Object.assign;
	Base.create = Object.create;
	Base.define = Object.defineProperty;
	Base.describe = Object.getOwnPropertyDescriptor;
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
	Base.clone = function (obj) {
		return Object.assign(new obj.constructor(), obj);
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
	Base.inject = function (src) {
		if (src) {
			var statics = src.statics === true ? src : src.statics,
				beans = src.beans,
				preserve = src.preserve;
			if (statics !== src)
				globalInject(this.prototype, src, src.enumerable, beans, preserve);
			globalInject(this, statics, null, beans, preserve);
		}
		for (var i = 1, l = arguments.length; i < l; i++)
			this.inject(arguments[i]);
		return this;
	};
	Base.extend = function () {
		var base = this,
			ctor,
			proto;
		for (var i = 0, obj, l = arguments.length;
			i < l && !(ctor && proto); i++) {
			obj = arguments[i];
			ctor = ctor || obj.initialize;
			proto = proto || obj.prototype;
		}
		ctor = ctor || function () {
			base.apply(this, arguments);
		};
		proto = ctor.prototype = proto || Object.create(this.prototype);
		Object.defineProperty(proto, 'constructor',
			{ value: ctor, writable: true, configurable: true });
		globalInject(ctor, this);
		if (arguments.length)
			this.inject.apply(ctor, arguments);
		ctor.base = base;
		return ctor;
	};

	Base.prototype.toString = function () {
		return this._id != null
			? (this._class || 'Object') + (this._name
				? " '" + this._name + "'"
				: ' @' + this._id)
			: '{ ' + Base.each(this, function (value, key) {
				if (!/^_/.test(key)) {
					var type = typeof value;
					this.push(key + ': ' + (type === 'number'
						? Formatter.instance.number(value)
						: type === 'string' ? "'" + value + "'" : value));
				}
			}, []).join(', ') + ' }';
	};
	Base.prototype.getClassName = function () {
		return this._class || '';
	};
	Base.prototype.importJSON = function (json) {
		return Base.importJSON(json, this);
	};
	Base.prototype.exportJSON = function (options) {
		return Base.exportJSON(this, options);
	};
	Base.prototype.toJSON = function () {
		return Base.serialize(this);
	};
	Base.prototype.set = function (props, exclude) {
		if (props)
			Base.filter(this, props, exclude, this._prioritize);
		return this;
	};

	tmpBaseExtend = Base.extend;
	Base.exports = {};
	Base.extend = function extend() {
		var res = tmpBaseExtend.apply(this, arguments),
			name = res.prototype._class;
		if (name && !Base.exports[name])
			Base.exports[name] = res;
		return res;
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
			var value = this.peek(list, start);
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
		obj = Base.create(proto);
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
	Base.peek = function (list, start) {
		return list[list.__index = start || list.__index || 0];
	};
	Base.remain = function (list) {
		return list.length - (list.__index || 0);
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
				filtered = list.__filtered = Base.create(source);
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
	Base.getSource = function (list) {
		var source = list.__source;
		if (source === undefined) {
			var arg = list.length === 1 && list[0];
			source = list.__source = arg && Base.isPlainObject(arg)
				? arg : null;
		}
		return source;
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
		return Base.isPlainObject(obj) || Array.isArray(obj)
			|| asString && typeof obj === 'string';
	};
	Base.serialize = function (obj, options, compact, dictionary) {
		options = options || {};

		var isRoot = !dictionary,
			res;
		if (isRoot) {
			options.formatter = new Formatter(options.precision);
			dictionary = {
				length: 0,
				definitions: {},
				references: {},
				add: function (item, create) {
					var id = '#' + item._id,
						ref = this.references[id];
					if (!ref) {
						this.length++;
						var res = create.call(item),
							name = item._class;
						if (name && res[0] !== name)
							res.unshift(name);
						this.definitions[id] = res;
						ref = this.references[id] = [id];
					}
					return ref;
				}
			};
		}
		if (obj && obj._serialize) {
			res = obj._serialize(options, dictionary);
			var name = obj._class;
			if (name && !obj._compactSerialize && (isRoot || !compact)
				&& res[0] !== name) {
				res.unshift(name);
			}
		} else if (Array.isArray(obj)) {
			res = [];
			for (var i = 0, l = obj.length; i < l; i++)
				res[i] = Base.serialize(obj[i], options, compact, dictionary);
		} else if (Base.isPlainObject(obj)) {
			res = {};
			var keys = Object.keys(obj);
			for (var i = 0, l = keys.length; i < l; i++) {
				var key = keys[i];
				res[key] = Base.serialize(obj[key], options, compact,
					dictionary);
			}
		} else if (typeof obj === 'number') {
			res = options.formatter.number(obj, options.precision);
		} else {
			res = obj;
		}
		return isRoot && dictionary.length > 0
			? [['dictionary', dictionary.definitions], res]
			: res;
	};
	Base.deserialize = function (json, create, _data, _setDictionary, _isRoot) {
		var res = json,
			isFirst = !_data,
			hasDictionary = isFirst && json && json.length
				&& json[0][0] === 'dictionary';
		_data = _data || {};
		if (Array.isArray(json)) {
			var type = json[0],
				isDictionary = type === 'dictionary';
			if (json.length == 1 && /^#/.test(type)) {
				return _data.dictionary[type];
			}
			type = Base.exports[type];
			res = [];
			for (var i = type ? 1 : 0, l = json.length; i < l; i++) {
				res.push(Base.deserialize(json[i], create, _data,
					isDictionary, hasDictionary));
			}
			if (type) {
				var args = res;
				if (create) {
					res = create(type, args, isFirst || _isRoot);
				} else {
					res = new type(args);
				}
			}
		} else if (Base.isPlainObject(json)) {
			res = {};
			if (_setDictionary)
				_data.dictionary = res;
			for (var key in json)
				res[key] = Base.deserialize(json[key], create, _data);
		}
		return hasDictionary ? res[1] : res;
	};
	Base.exportJSON = function (obj, options) {
		var json = Base.serialize(obj, options);
		return options && options.asString == false
			? json
			: JSON.stringify(json);
	};
	Base.importJSON = function (json, target) {
		return Base.deserialize(
			typeof json === 'string' ? JSON.parse(json) : json,
			function (ctor, args, isRoot) {
				var useTarget = isRoot && target
					&& target.constructor === ctor,
					obj = useTarget ? target
						: Base.create(ctor.prototype);
				if (args.length === 1 && obj instanceof Item
					&& (useTarget || !(obj instanceof Layer))) {
					var arg = args[0];
					if (Base.isPlainObject(arg)) {
						arg.insert = false;
						if (useTarget) {
							args = args.concat([Item.INSERT]);
						}
					}
				}
				(useTarget ? obj.set : ctor).apply(obj, args);
				if (useTarget)
					target = null;
				return obj;
			});
	};
	Base.push = function (list, items) {
		var itemsLength = items.length;
		if (itemsLength < 4096) {
			list.push.apply(list, items);
		} else {
			var startLength = list.length;
			list.length += itemsLength;
			for (var i = 0; i < itemsLength; i++) {
				list[startLength + i] = items[i];
			}
		}
		return list;
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
			Base.push(list, items);
			return [];
		} else {
			var args = [index, remove];
			if (items)
				Base.push(args, items);
			var removed = list.splice.apply(list, args);
			for (var i = 0, l = removed.length; i < l; i++)
				removed[i]._index = undefined;
			for (var i = index + amount, l = list.length; i < l; i++)
				list[i]._index = i;
			return removed;
		}
	};
	Base.capitalize = function (str) {
		return str.replace(/\b[a-z]/g, function (match) {
			return match.toUpperCase();
		});
	};
	Base.camelize = function (str) {
		return str.replace(/-(.)/g, function (match, chr) {
			return chr.toUpperCase();
		});
	};
	Base.hyphenate = function (str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	};

	var Emitter = {
		on: function (type, func) {
			if (typeof type !== 'string') {
				Base.each(type, function (value, key) {
					this.on(key, value);
				}, this);
			} else {
				var types = this._eventTypes,
					entry = types && types[type],
					handlers = this._callbacks = this._callbacks || {};
				handlers = handlers[type] = handlers[type] || [];
				if (handlers.indexOf(func) === -1) {
					handlers.push(func);
					if (entry && entry.install && handlers.length === 1)
						entry.install.call(this, type);
				}
			}
			return this;
		},

		off: function (type, func) {
			if (typeof type !== 'string') {
				Base.each(type, function (value, key) {
					this.off(key, value);
				}, this);
				return;
			}
			var types = this._eventTypes,
				entry = types && types[type],
				handlers = this._callbacks && this._callbacks[type],
				index;
			if (handlers) {
				if (!func || (index = handlers.indexOf(func)) !== -1
					&& handlers.length === 1) {
					if (entry && entry.uninstall)
						entry.uninstall.call(this, type);
					delete this._callbacks[type];
				} else if (index !== -1) {
					handlers.splice(index, 1);
				}
			}
			return this;
		},

		once: function (type, func) {
			return this.on(type, function handler() {
				func.apply(this, arguments);
				this.off(type, handler);
			});
		},

		emit: function (type, event) {
			var handlers = this._callbacks && this._callbacks[type];
			if (!handlers)
				return false;
			var args = Base.slice(arguments, 1),
				setTarget = event && event.target && !event.currentTarget;
			handlers = handlers.slice();
			if (setTarget)
				event.currentTarget = this;
			for (var i = 0, l = handlers.length; i < l; i++) {
				if (handlers[i].apply(this, args) == false) {
					if (event && event.stop)
						event.stop();
					break;
				}
			}
			if (setTarget)
				delete event.currentTarget;
			return true;
		},

		responds: function (type) {
			return !!(this._callbacks && this._callbacks[type]);
		},

		attach: '#on',
		detach: '#off',
		fire: '#emit',

		_installEvents: function (install) {
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
		},

		statics: {
			inject: function inject(src) {
				var events = src._events;
				if (events) {
					var types = {};
					Base.each(events, function (entry, key) {
						var isString = typeof entry === 'string',
							name = isString ? entry : key,
							part = Base.capitalize(name),
							type = name.substring(2).toLowerCase();
						types[type] = isString ? {} : entry;
						name = '_' + name;
						src['get' + part] = function () {
							return this[name];
						};
						src['set' + part] = function (func) {
							var prev = this[name];
							if (prev)
								this.off(type, prev);
							if (func)
								this.on(type, func);
							this[name] = func;
						};
					});
					src._eventTypes = types;
				}
				return inject.base.apply(this, arguments);
			}
		}
	};

	var PaperScope = function () {
		Base.call(this);
		paper = this;
		this.settings = new Base({
			applyMatrix: true,
			insertItems: true,
			handleSize: 4,
			hitTolerance: 0
		});
		this.project = null;
		this.projects = [];
		this.tools = [];
		this._id = PaperScope._id++;
		PaperScope._scopes[this._id] = this;
		var proto = PaperScope.prototype;
		if (!this.support) {
			proto.support = {
				nativeDash: false,
			};
		}
		if (!this.agent) {
			var user = self.navigator.userAgent.toLowerCase(),
				os = (/(darwin|win|mac|linux|freebsd|sunos)/.exec(user) || [])[0],
				platform = os === 'darwin' ? 'mac' : os,
				agent = proto.agent = proto.browser = { platform: platform };
			if (platform)
				agent[platform] = true;
			user.replace(
				/(opera|chrome|safari|webkit|firefox|msie|trident|atom|node|jsdom)\/?\s*([.\d]+)(?:.*version\/([.\d]+))?(?:.*rv\:v?([.\d]+))?/g,
				function (match, n, v1, v2, rv) {
					if (!agent.chrome) {
						var v = n === 'opera' ? v2 :
							/^(node|trident)$/.test(n) ? rv : v1;
						agent.version = v;
						agent.versionNumber = parseFloat(v);
						n = { trident: 'msie', jsdom: 'node' }[n] || n;
						agent.name = n;
						agent[n] = true;
					}
				}
			);
			if (agent.chrome)
				delete agent.webkit;
			if (agent.atom)
				delete agent.chrome;
		}
	};

	InitClassWithStatics(PaperScope, Base);
	PaperScope.prototype.version = "0.12.17";
	PaperScope.prototype.getPaper = function () {
		return this;
	};
	PaperScope.prototype.execute = function (code, options) {
	};
	PaperScope.prototype.install = function (scope) {
		var that = this;
		Base.each(['project', 'view', 'tool'], function (key) {
			Base.define(scope, key, {
				configurable: true,
				get: function () {
					return that[key];
				}
			});
		});
		for (var key in this)
			if (!/^_/.test(key) && this[key])
				scope[key] = this[key];
	};
	PaperScope.prototype.setup = function (element) {
		paper = this;
		this.project = new Project(element);
		return this;
	};
	PaperScope.prototype.activate = function () {
		paper = this;
	};
	PaperScope.prototype.clear = function () {
		var projects = this.projects,
			tools = this.tools;
		for (var i = projects.length - 1; i >= 0; i--)
			projects[i].remove();
		for (var i = tools.length - 1; i >= 0; i--)
			tools[i].remove();
	};
	PaperScope.prototype.remove = function () {
		this.clear();
		delete PaperScope._scopes[this._id];
	};
	PaperScope._scopes = {};
	PaperScope._id = 0;
	PaperScope.get = function (id) {
		return this._scopes[id] || null;
	};
	PaperScope.getAttribute = function (el, attr) {
		return el['getAttribute'](attr) || el['getAttribute']('data-paper-' + attr);
	};
	PaperScope.hasAttribute = function (el, attr) {
		return el['hasAttribute'](attr) || el['hasAttribute']('data-paper-' + attr);
	};

	var PaperScopeItem = function (activate) {
		Base.call();
		this._scope = paper;
		this._index = this._scope[this._list].push(this) - 1;
		if (activate || !this._scope[this._reference])
			this.activate();
	};

	InitClassWithStatics(PaperScopeItem, Base);

	PaperScopeItem.prototype.on = function (type, func) {
		if (typeof type !== 'string') {
			Base.each(type, function (value, key) {
				this.on(key, value);
			}, this);
		} else {
			var types = this._eventTypes,
				entry = types && types[type],
				handlers = this._callbacks = this._callbacks || {};
			handlers = handlers[type] = handlers[type] || [];
			if (handlers.indexOf(func) === -1) {
				handlers.push(func);
				if (entry && entry.install && handlers.length === 1)
					entry.install.call(this, type);
			}
		}
		return this;
	};
	PaperScopeItem.prototype.off = function (type, func) {
		if (typeof type !== 'string') {
			Base.each(type, function (value, key) {
				this.off(key, value);
			}, this);
			return;
		}
		var types = this._eventTypes,
			entry = types && types[type],
			handlers = this._callbacks && this._callbacks[type],
			index;
		if (handlers) {
			if (!func || (index = handlers.indexOf(func)) !== -1
				&& handlers.length === 1) {
				if (entry && entry.uninstall)
					entry.uninstall.call(this, type);
				delete this._callbacks[type];
			} else if (index !== -1) {
				handlers.splice(index, 1);
			}
		}
		return this;
	};
	PaperScopeItem.prototype.once = function (type, func) {
		return this.on(type, function handler() {
			func.apply(this, arguments);
			this.off(type, handler);
		});
	};
	PaperScopeItem.prototype.emit = function (type, event) {
		var handlers = this._callbacks && this._callbacks[type];
		if (!handlers)
			return false;
		var args = Base.slice(arguments, 1),
			setTarget = event && event.target && !event.currentTarget;
		handlers = handlers.slice();
		if (setTarget)
			event.currentTarget = this;
		for (var i = 0, l = handlers.length; i < l; i++) {
			if (handlers[i].apply(this, args) == false) {
				if (event && event.stop)
					event.stop();
				break;
			}
		}
		if (setTarget)
			delete event.currentTarget;
		return true;
	};
	PaperScopeItem.prototype.responds = function (type) {
		return !!(this._callbacks && this._callbacks[type]);
	};
	PaperScopeItem.prototype._installEvents = function (install) {
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
	};
	PaperScopeItem.prototype.activate = function () {
		if (!this._scope)
			return false;
		var prev = this._scope[this._reference];
		if (prev && prev !== this)
			prev.emit('deactivate');
		this._scope[this._reference] = this;
		this.emit('activate', prev);
		return true;
	};
	PaperScopeItem.prototype.isActive = function () {
		return this._scope[this._reference] === this;
	};
	PaperScopeItem.prototype.remove = function () {
		if (this._index == null)
			return false;
		Base.splice(this._scope[this._list], null, this._index, 1);
		if (this._scope[this._reference] == this)
			this._scope[this._reference] = null;
		this._scope = null;
		return true;
	};
	PaperScopeItem.prototype.attach = PaperScopeItem.prototype.on;
	PaperScopeItem.prototype.detach = PaperScopeItem.prototype.off;
	PaperScopeItem.prototype.fire = PaperScopeItem.prototype.emit;

	PaperScopeItem.inject = function inject(src) {
		var events = src._events;
		if (events) {
			var types = {};
			Base.each(events, function (entry, key) {
				var isString = typeof entry === 'string',
					name = isString ? entry : key,
					part = Base.capitalize(name),
					type = name.substring(2).toLowerCase();
				types[type] = isString ? {} : entry;
				name = '_' + name;
				src['get' + part] = function () {
					return this[name];
				};
				src['set' + part] = function (func) {
					var prev = this[name];
					if (prev)
						this.off(type, prev);
					if (func)
						this.on(type, func);
					this[name] = func;
				};
			});
			src._eventTypes = types;
		}
		return Base.inject.apply(this, arguments);
	};

	var CollisionDetection = {
		findItemBoundsCollisions: function (items1, items2, tolerance) {
			function getBounds(items) {
				var bounds = new Array(items.length);
				for (var i = 0; i < items.length; i++) {
					var rect = items[i].getBounds();
					bounds[i] = [rect.left, rect.top, rect.right, rect.bottom];
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

	var Formatter = function (precision) {
		Base.call(this);
		this.precision = Base.pick(precision, 5);
		this.multiplier = Math.pow(10, this.precision);
	}

	InitClassWithStatics(Formatter, Base);

	Formatter.prototype.number = function (val) {
		return this.precision < 16
			? Math.round(val * this.multiplier) / this.multiplier : val;
	};
	Formatter.prototype.pair = function (val1, val2, separator) {
		return this.number(val1) + (separator || ',') + this.number(val2);
	};
	Formatter.prototype.point = function (val, separator) {
		return this.number(val.x) + (separator || ',') + this.number(val.y);
	};
	Formatter.prototype.size = function (val, separator) {
		return this.number(val.width) + (separator || ',')
			+ this.number(val.height);
	};
	Formatter.prototype.rectangle = function (val, separator) {
		return this.point(val, separator) + (separator || ',')
			+ this.size(val, separator);
	};
	Formatter.instance = new Formatter();

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

	var Point = function (arg0, arg1) {
		Base.call(this);
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

	Point.prototype.initialize = Point;
	Point.prototype._class = 'Point';
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
	Point.prototype.toString = function () {
		var f = Formatter.instance;
		return '{ x: ' + f.number(this.x) + ', y: ' + f.number(this.y) + ' }';
	};
	Point.prototype._serialize = function (options) {
		var f = options.formatter;
		return [f.number(this.x), f.number(this.y)];
	};
	Point.prototype.getLength = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	Point.prototype.setLength = function (length) {
		if (this.isZero()) {
			var angle = this._angle || 0;
			this._set(
				Math.cos(angle) * length,
				Math.sin(angle) * length
			);
		} else {
			var scale = length / this.getLength();
			if (Numerical.isZero(scale))
				this.getAngle();
			this._set(
				this.x * scale,
				this.y * scale
			);
		}
	};
	Point.prototype.getAngle = function () {
		return this.getAngleInRadians.apply(this, arguments) * 180 / Math.PI;
	};
	Point.prototype.setAngle = function (angle) {
		this.setAngleInRadians.call(this, angle * Math.PI / 180);
	};
	Point.prototype.getAngleInDegrees = Point.prototype.getAngle;
	Point.prototype.setAngleInDegrees = Point.prototype.setAngle;
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
	Point.prototype.getQuadrant = function () {
		return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3;
	};
	Point.prototype.beans = false;
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
	Point.prototype.modulo = function () {
		var point = Point.read(arguments);
		return new Point(this.x % point.x, this.y % point.y);
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
	Point.prototype.isColinear = Point.prototype.isCollinear;
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
	Point.prototype.isInQuadrant = function (q) {
		return this.x * (q > 1 && q < 4 ? -1 : 1) >= 0
			&& this.y * (q > 2 ? -1 : 1) >= 0;
	};
	Point.prototype.dot = function () {
		var point = Point.read(arguments);
		return this.x * point.x + this.y * point.y;
	};
	Point.prototype.cross = function () {
		var point = Point.read(arguments);
		return this.x * point.y - this.y * point.x;
	};
	Point.prototype.project = function () {
		var point = Point.read(arguments),
			scale = point.isZero() ? 0 : this.dot(point) / point.dot(point);
		return new Point(
			point.x * scale,
			point.y * scale
		);
	};

	Point.min = function () {
		var args = arguments,
			point1 = Point.read(args),
			point2 = Point.read(args);
		return new Point(
			Math.min(point1.x, point2.x),
			Math.min(point1.y, point2.y)
		);
	};
	Point.max = function () {
		var args = arguments,
			point1 = Point.read(args),
			point2 = Point.read(args);
		return new Point(
			Math.max(point1.x, point2.x),
			Math.max(point1.y, point2.y)
		);
	};
	Point.random = function () {
		return new Point(Math.random(), Math.random());
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

	Point.prototype.round = function () {
		return new Point(Math.round(this.x), Math.round(this.y));
	};
	Point.prototype.ceil = function () {
		return new Point(Math.ceil(this.x), Math.ceil(this.y));
	};
	Point.prototype.floor = function () {
		return new Point(Math.floor(this.x), Math.floor(this.y));
	};
	Point.prototype.abs = function () {
		return new Point(Math.abs(this.x), Math.abs(this.y));
	};

	var LinkedPoint = function (x, y, owner, setter) {
		// Point.call(this);
		this._x = x;
		this._y = y;
		this._owner = owner;
		this._setter = setter;
	};

	InitClassWithStatics(LinkedPoint, Point);
	LinkedPoint.prototype.initialize = LinkedPoint;

	LinkedPoint.prototype._set = function (x, y, _dontNotify) {
		this._x = x;
		this._y = y;
		if (!_dontNotify)
			this._owner[this._setter](this);
		return this;
	};
	LinkedPoint.prototype.getX = function () {
		return this._x;
	};
	LinkedPoint.prototype.setX = function (x) {
		this._x = x;
		this._owner[this._setter](this);
	};
	LinkedPoint.prototype.getY = function () {
		return this._y;
	};
	LinkedPoint.prototype.setY = function (y) {
		this._y = y;
		this._owner[this._setter](this);
	};
	LinkedPoint.prototype.isSelected = function () {
		return !!(this._owner._selection & this._getSelection());
	};
	LinkedPoint.prototype.setSelected = function (selected) {
		this._owner._changeSelection(this._getSelection(), selected);
	};
	LinkedPoint.prototype._getSelection = function () {
		return this._setter === 'setPosition' ? 4 : 0;
	};

	Object.defineProperty(LinkedPoint.prototype, 'x', {
		get: function () {
			return this.getX();
		},
		set: function (value) {
			this.setX(value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(LinkedPoint.prototype, 'y', {
		get: function () {
			return this.getY();
		},
		set: function (value) {
			this.setY(value);
		},
		enumerable: true,
		configurable: true
	});

	// var Rectangle = function Rectangle(arg0, arg1, arg2, arg3) {
	// 	Base.call(this);
	// 	var args = arguments,
	// 		type = typeof arg0,
	// 		read;
	// 	if (type === 'number') {
	// 		this._set(arg0, arg1, arg2, arg3);
	// 		read = 4;
	// 	} else if (type === 'undefined' || arg0 === null) {
	// 		this._set(0, 0, 0, 0);
	// 		read = arg0 === null ? 1 : 0;
	// 	} else if (args.length === 1) {
	// 		if (Array.isArray(arg0)) {
	// 			this._set.apply(this, arg0);
	// 			read = 1;
	// 		} else if (arg0.x !== undefined || arg0.width !== undefined) {
	// 			this._set(arg0.x || 0, arg0.y || 0,
	// 				arg0.width || 0, arg0.height || 0);
	// 			read = 1;
	// 		} else if (arg0.from === undefined && arg0.to === undefined) {
	// 			this._set(0, 0, 0, 0);
	// 			if (Base.readSupported(args, this)) {
	// 				read = 1;
	// 			}
	// 		}
	// 	}
	// 	if (read === undefined) {
	// 		var frm = Point.readNamed(args, 'from'),
	// 			next = Base.peek(args),
	// 			x = frm.x,
	// 			y = frm.y,
	// 			width,
	// 			height;
	// 		if (next && next.x !== undefined || Base.hasNamed(args, 'to')) {
	// 			var to = Point.readNamed(args, 'to');
	// 			width = to.x - x;
	// 			height = to.y - y;
	// 			if (width < 0) {
	// 				x = to.x;
	// 				width = -width;
	// 			}
	// 			if (height < 0) {
	// 				y = to.y;
	// 				height = -height;
	// 			}
	// 		} else {
	// 			var size = Size.read(args);
	// 			width = size.width;
	// 			height = size.height;
	// 		}
	// 		this._set(x, y, width, height);
	// 		read = args.__index;
	// 	}
	// 	var filtered = args.__filtered;
	// 	if (filtered)
	// 		this.__filtered = filtered;
	// 	if (this.__read)
	// 		this.__read = read;
	// 	return this;
	// };

	// InitClassWithStatics(Rectangle, Base);

	// Rectangle.prototype._class = 'Rectangle';
	// Rectangle.prototype._readIndex = true;
	// Rectangle.prototype.beans = true;
	// Rectangle.prototype.initialize = Rectangle;
	// Rectangle.prototype.set = Rectangle;
	// Rectangle.prototype._set = function (x, y, width, height) {
	// 	this.x = x;
	// 	this.y = y;
	// 	this.width = width;
	// 	this.height = height;
	// 	return this;
	// };
	// Rectangle.prototype.clone = function () {
	// 	return new Rectangle(this.x, this.y, this.width, this.height);
	// };
	// Rectangle.prototype.equals = function (rect) {
	// 	var rt = Base.isPlainValue(rect)
	// 		? Rectangle.read(arguments)
	// 		: rect;
	// 	return rt === this
	// 		|| rt && this.x === rt.x && this.y === rt.y
	// 		&& this.width === rt.width && this.height === rt.height
	// 		|| false;
	// };
	// Rectangle.prototype.toString = function () {
	// 	var f = Formatter.instance;
	// 	return '{ x: ' + f.number(this.x)
	// 		+ ', y: ' + f.number(this.y)
	// 		+ ', width: ' + f.number(this.width)
	// 		+ ', height: ' + f.number(this.height)
	// 		+ ' }';
	// };
	// Rectangle.prototype._serialize = function (options) {
	// 	var f = options.formatter;
	// 	return [f.number(this.x),
	// 	f.number(this.y),
	// 	f.number(this.width),
	// 	f.number(this.height)];
	// };
	// Rectangle.prototype.getPoint = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.x, this.y, this, 'setPoint');
	// };
	// Rectangle.prototype.setPoint = function () {
	// 	var point = Point.read(arguments);
	// 	this.x = point.x;
	// 	this.y = point.y;
	// };
	// Rectangle.prototype.getSize = function (_dontLink) {
	// 	var ctor = _dontLink ? Size : LinkedSize;
	// 	return new ctor(this.width, this.height, this, 'setSize');
	// };
	// Rectangle.prototype._fw = 1;
	// Rectangle.prototype._fh = 1;
	// Rectangle.prototype.setSize = function () {
	// 	var size = Size.read(arguments),
	// 		sx = this._sx,
	// 		sy = this._sy,
	// 		w = size.width,
	// 		h = size.height;
	// 	if (sx) {
	// 		this.x += (this.width - w) * sx;
	// 	}
	// 	if (sy) {
	// 		this.y += (this.height - h) * sy;
	// 	}
	// 	this.width = w;
	// 	this.height = h;
	// 	this._fw = this._fh = 1;
	// };
	// Rectangle.prototype.getLeft = function () {
	// 	return this.x;
	// };
	// Rectangle.prototype.setLeft = function (left) {
	// 	if (!this._fw) {
	// 		var amount = left - this.x;
	// 		this.width -= this._sx === 0.5 ? amount * 2 : amount;
	// 	}
	// 	this.x = left;
	// 	this._sx = this._fw = 0;
	// };
	// Rectangle.prototype.getTop = function () {
	// 	return this.y;
	// };
	// Rectangle.prototype.setTop = function (top) {
	// 	if (!this._fh) {
	// 		var amount = top - this.y;
	// 		this.height -= this._sy === 0.5 ? amount * 2 : amount;
	// 	}
	// 	this.y = top;
	// 	this._sy = this._fh = 0;
	// };
	// Rectangle.prototype.getRight = function () {
	// 	return this.x + this.width;
	// };
	// Rectangle.prototype.setRight = function (right) {
	// 	if (!this._fw) {
	// 		var amount = right - this.x;
	// 		this.width = this._sx === 0.5 ? amount * 2 : amount;
	// 	}
	// 	this.x = right - this.width;
	// 	this._sx = 1;
	// 	this._fw = 0;
	// };
	// Rectangle.prototype.getBottom = function () {
	// 	return this.y + this.height;
	// };
	// Rectangle.prototype.setBottom = function (bottom) {
	// 	if (!this._fh) {
	// 		var amount = bottom - this.y;
	// 		this.height = this._sy === 0.5 ? amount * 2 : amount;
	// 	}
	// 	this.y = bottom - this.height;
	// 	this._sy = 1;
	// 	this._fh = 0;
	// };
	// Rectangle.prototype.getCenterX = function () {
	// 	return this.x + this.width / 2;
	// };
	// Rectangle.prototype.setCenterX = function (x) {
	// 	if (this._fw || this._sx === 0.5) {
	// 		this.x = x - this.width / 2;
	// 	} else {
	// 		if (this._sx) {
	// 			this.x += (x - this.x) * 2 * this._sx;
	// 		}
	// 		this.width = (x - this.x) * 2;
	// 	}
	// 	this._sx = 0.5;
	// 	this._fw = 0;
	// };
	// Rectangle.prototype.getCenterY = function () {
	// 	return this.y + this.height / 2;
	// };
	// Rectangle.prototype.setCenterY = function (y) {
	// 	if (this._fh || this._sy === 0.5) {
	// 		this.y = y - this.height / 2;
	// 	} else {
	// 		if (this._sy) {
	// 			this.y += (y - this.y) * 2 * this._sy;
	// 		}
	// 		this.height = (y - this.y) * 2;
	// 	}
	// 	this._sy = 0.5;
	// 	this._fh = 0;
	// };
	// Rectangle.prototype.getCenter = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getCenterX(), this.getCenterY(), this, 'setCenter');
	// };
	// Rectangle.prototype.setCenter = function () {
	// 	var point = Point.read(arguments);
	// 	this.setCenterX(point.x);
	// 	this.setCenterY(point.y);
	// 	return this;
	// };
	// Rectangle.prototype.getArea = function () {
	// 	return this.width * this.height;
	// };
	// Rectangle.prototype.isEmpty = function () {
	// 	return this.width === 0 || this.height === 0;
	// };
	// Rectangle.prototype.contains = function (arg) {
	// 	return arg && arg.width !== undefined
	// 		|| (Array.isArray(arg) ? arg : arguments).length === 4
	// 		? this._containsRectangle(Rectangle.read(arguments))
	// 		: this._containsPoint(Point.read(arguments));
	// };
	// Rectangle.prototype._containsPoint = function (point) {
	// 	var x = point.x,
	// 		y = point.y;
	// 	return x >= this.x && y >= this.y
	// 		&& x <= this.x + this.width
	// 		&& y <= this.y + this.height;
	// };
	// Rectangle.prototype._containsRectangle = function (rect) {
	// 	var x = rect.x,
	// 		y = rect.y;
	// 	return x >= this.x && y >= this.y
	// 		&& x + rect.width <= this.x + this.width
	// 		&& y + rect.height <= this.y + this.height;
	// };
	// Rectangle.prototype.intersects = function () {
	// 	var rect = Rectangle.read(arguments),
	// 		epsilon = Base.read(arguments) || 0;
	// 	return rect.x + rect.width > this.x - epsilon
	// 		&& rect.y + rect.height > this.y - epsilon
	// 		&& rect.x < this.x + this.width + epsilon
	// 		&& rect.y < this.y + this.height + epsilon;
	// };
	// Rectangle.prototype.intersect = function () {
	// 	var rect = Rectangle.read(arguments),
	// 		x1 = Math.max(this.x, rect.x),
	// 		y1 = Math.max(this.y, rect.y),
	// 		x2 = Math.min(this.x + this.width, rect.x + rect.width),
	// 		y2 = Math.min(this.y + this.height, rect.y + rect.height);
	// 	return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	// };
	// Rectangle.prototype.unite = function () {
	// 	var rect = Rectangle.read(arguments),
	// 		x1 = Math.min(this.x, rect.x),
	// 		y1 = Math.min(this.y, rect.y),
	// 		x2 = Math.max(this.x + this.width, rect.x + rect.width),
	// 		y2 = Math.max(this.y + this.height, rect.y + rect.height);
	// 	return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	// };
	// Rectangle.prototype.include = function () {
	// 	var point = Point.read(arguments);
	// 	var x1 = Math.min(this.x, point.x),
	// 		y1 = Math.min(this.y, point.y),
	// 		x2 = Math.max(this.x + this.width, point.x),
	// 		y2 = Math.max(this.y + this.height, point.y);
	// 	return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	// };
	// Rectangle.prototype.expand = function () {
	// 	var amount = Size.read(arguments),
	// 		hor = amount.width,
	// 		ver = amount.height;
	// 	return new Rectangle(this.x - hor / 2, this.y - ver / 2,
	// 		this.width + hor, this.height + ver);
	// };
	// Rectangle.prototype.scale = function (hor, ver) {
	// 	return this.expand(this.width * hor - this.width,
	// 		this.height * (ver === undefined ? hor : ver) - this.height);
	// };
	// Rectangle.prototype.beans = true;
	// Rectangle.prototype.getTopLeft = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getLeft(), this.getTop(), this, 'setTopLeft');
	// };
	// Rectangle.prototype.setTopLeft = function () {
	// 	var point = Point.read(arguments);
	// 	this.setLeft(point.x);
	// 	this.setTop(point.y);
	// };
	// Rectangle.prototype.getTopRight = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getRight(), this.getTop(), this, 'setTopRight');
	// };
	// Rectangle.prototype.setTopRight = function () {
	// 	var point = Point.read(arguments);
	// 	this.setRight(point.x);
	// 	this.setTop(point.y);
	// };
	// Rectangle.prototype.getBottomLeft = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getLeft(), this.getBottom(), this, 'setBottomLeft');
	// };
	// Rectangle.prototype.setBottomLeft = function () {
	// 	var point = Point.read(arguments);
	// 	this.setLeft(point.x);
	// 	this.setBottom(point.y);
	// };
	// Rectangle.prototype.getBottomRight = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getRight(), this.getBottom(), this, 'setBottomRight');
	// };
	// Rectangle.prototype.setBottomRight = function () {
	// 	var point = Point.read(arguments);
	// 	this.setRight(point.x);
	// 	this.setBottom(point.y);
	// };
	// Rectangle.prototype.getLeftCenter = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getLeft(), this.getCenterY(), this, 'setLeftCenter');
	// };
	// Rectangle.prototype.setLeftCenter = function () {
	// 	var point = Point.read(arguments);
	// 	this.setLeft(point.x);
	// 	this.setCenterY(point.y);
	// };
	// Rectangle.prototype.getTopCenter = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getCenterX(), this.getTop(), this, 'setTopCenter');
	// };
	// Rectangle.prototype.setTopCenter = function () {
	// 	var point = Point.read(arguments);
	// 	this.setCenterX(point.x);
	// 	this.setTop(point.y);
	// };
	// Rectangle.prototype.getRightCenter = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getRight(), this.getCenterY(), this, 'setRightCenter');
	// };
	// Rectangle.prototype.setRightCenter = function () {
	// 	var point = Point.read(arguments);
	// 	this.setRight(point.x);
	// 	this.setCenterY(point.y);
	// };
	// Rectangle.prototype.getBottomCenter = function (_dontLink) {
	// 	var ctor = _dontLink ? Point : LinkedPoint;
	// 	return new ctor(this.getCenterX(), this.getBottom(), this, 'setBottomCenter');
	// };
	// Rectangle.prototype.setBottomCenter = function () {
	// 	var point = Point.read(arguments);
	// 	this.setCenterX(point.x);
	// 	this.setBottom(point.y);
	// };

	var Rectangle = Base.extend({
		_class: 'Rectangle',
		_readIndex: true,
		beans: true,

		initialize: function Rectangle(arg0, arg1, arg2, arg3) {
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
					next = Base.peek(args),
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
		},

		set: '#initialize',

		_set: function (x, y, width, height) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return this;
		},

		clone: function () {
			return new Rectangle(this.x, this.y, this.width, this.height);
		},

		equals: function (rect) {
			var rt = Base.isPlainValue(rect)
				? Rectangle.read(arguments)
				: rect;
			return rt === this
				|| rt && this.x === rt.x && this.y === rt.y
				&& this.width === rt.width && this.height === rt.height
				|| false;
		},

		toString: function () {
			var f = Formatter.instance;
			return '{ x: ' + f.number(this.x)
				+ ', y: ' + f.number(this.y)
				+ ', width: ' + f.number(this.width)
				+ ', height: ' + f.number(this.height)
				+ ' }';
		},

		_serialize: function (options) {
			var f = options.formatter;
			return [f.number(this.x),
			f.number(this.y),
			f.number(this.width),
			f.number(this.height)];
		},

		getPoint: function (_dontLink) {
			var ctor = _dontLink ? Point : LinkedPoint;
			return new ctor(this.x, this.y, this, 'setPoint');
		},

		setPoint: function () {
			var point = Point.read(arguments);
			this.x = point.x;
			this.y = point.y;
		},

		getSize: function (_dontLink) {
			var ctor = _dontLink ? Size : LinkedSize;
			return new ctor(this.width, this.height, this, 'setSize');
		},

		_fw: 1,
		_fh: 1,

		setSize: function () {
			var size = Size.read(arguments),
				sx = this._sx,
				sy = this._sy,
				w = size.width,
				h = size.height;
			if (sx) {
				this.x += (this.width - w) * sx;
			}
			if (sy) {
				this.y += (this.height - h) * sy;
			}
			this.width = w;
			this.height = h;
			this._fw = this._fh = 1;
		},

		getLeft: function () {
			return this.x;
		},

		setLeft: function (left) {
			if (!this._fw) {
				var amount = left - this.x;
				this.width -= this._sx === 0.5 ? amount * 2 : amount;
			}
			this.x = left;
			this._sx = this._fw = 0;
		},

		getTop: function () {
			return this.y;
		},

		setTop: function (top) {
			if (!this._fh) {
				var amount = top - this.y;
				this.height -= this._sy === 0.5 ? amount * 2 : amount;
			}
			this.y = top;
			this._sy = this._fh = 0;
		},

		getRight: function () {
			return this.x + this.width;
		},

		setRight: function (right) {
			if (!this._fw) {
				var amount = right - this.x;
				this.width = this._sx === 0.5 ? amount * 2 : amount;
			}
			this.x = right - this.width;
			this._sx = 1;
			this._fw = 0;
		},

		getBottom: function () {
			return this.y + this.height;
		},

		setBottom: function (bottom) {
			if (!this._fh) {
				var amount = bottom - this.y;
				this.height = this._sy === 0.5 ? amount * 2 : amount;
			}
			this.y = bottom - this.height;
			this._sy = 1;
			this._fh = 0;
		},

		getCenterX: function () {
			return this.x + this.width / 2;
		},

		setCenterX: function (x) {
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
		},

		getCenterY: function () {
			return this.y + this.height / 2;
		},

		setCenterY: function (y) {
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
		},

		getCenter: function (_dontLink) {
			var ctor = _dontLink ? Point : LinkedPoint;
			return new ctor(this.getCenterX(), this.getCenterY(), this, 'setCenter');
		},

		setCenter: function () {
			var point = Point.read(arguments);
			this.setCenterX(point.x);
			this.setCenterY(point.y);
			return this;
		},

		getArea: function () {
			return this.width * this.height;
		},

		isEmpty: function () {
			return this.width === 0 || this.height === 0;
		},

		contains: function (arg) {
			return arg && arg.width !== undefined
				|| (Array.isArray(arg) ? arg : arguments).length === 4
				? this._containsRectangle(Rectangle.read(arguments))
				: this._containsPoint(Point.read(arguments));
		},

		_containsPoint: function (point) {
			var x = point.x,
				y = point.y;
			return x >= this.x && y >= this.y
				&& x <= this.x + this.width
				&& y <= this.y + this.height;
		},

		_containsRectangle: function (rect) {
			var x = rect.x,
				y = rect.y;
			return x >= this.x && y >= this.y
				&& x + rect.width <= this.x + this.width
				&& y + rect.height <= this.y + this.height;
		},

		intersects: function () {
			var rect = Rectangle.read(arguments),
				epsilon = Base.read(arguments) || 0;
			return rect.x + rect.width > this.x - epsilon
				&& rect.y + rect.height > this.y - epsilon
				&& rect.x < this.x + this.width + epsilon
				&& rect.y < this.y + this.height + epsilon;
		},

		intersect: function () {
			var rect = Rectangle.read(arguments),
				x1 = Math.max(this.x, rect.x),
				y1 = Math.max(this.y, rect.y),
				x2 = Math.min(this.x + this.width, rect.x + rect.width),
				y2 = Math.min(this.y + this.height, rect.y + rect.height);
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		},

		unite: function () {
			var rect = Rectangle.read(arguments),
				x1 = Math.min(this.x, rect.x),
				y1 = Math.min(this.y, rect.y),
				x2 = Math.max(this.x + this.width, rect.x + rect.width),
				y2 = Math.max(this.y + this.height, rect.y + rect.height);
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		},

		include: function () {
			var point = Point.read(arguments);
			var x1 = Math.min(this.x, point.x),
				y1 = Math.min(this.y, point.y),
				x2 = Math.max(this.x + this.width, point.x),
				y2 = Math.max(this.y + this.height, point.y);
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		},

		expand: function () {
			var amount = Size.read(arguments),
				hor = amount.width,
				ver = amount.height;
			return new Rectangle(this.x - hor / 2, this.y - ver / 2,
				this.width + hor, this.height + ver);
		},

		scale: function (hor, ver) {
			return this.expand(this.width * hor - this.width,
				this.height * (ver === undefined ? hor : ver) - this.height);
		}
	},
		Base.each(
			[
				['Top', 'Left'], ['Top', 'Right'],
				['Bottom', 'Left'], ['Bottom', 'Right'],
				['Left', 'Center'], ['Top', 'Center'],
				['Right', 'Center'], ['Bottom', 'Center']
			],
			function (parts, index) {
				var part = parts.join(''),
					xFirst = /^[RL]/.test(part);
				if (index >= 4)
					parts[1] += xFirst ? 'Y' : 'X';
				var x = parts[xFirst ? 0 : 1],
					y = parts[xFirst ? 1 : 0],
					getX = 'get' + x,
					getY = 'get' + y,
					setX = 'set' + x,
					setY = 'set' + y,
					get = 'get' + part,
					set = 'set' + part;
				this[get] = function (_dontLink) {
					var ctor = _dontLink ? Point : LinkedPoint;
					return new ctor(this[getX](), this[getY](), this, set);
				};
				this[set] = function () {
					var point = Point.read(arguments);
					this[setX](point.x);
					this[setY](point.y);
				};
			},
			{
				beans: true
			}
		)
	);

	var LinkedRectangle = Rectangle.extend({
		initialize: function Rectangle(x, y, width, height, owner, setter) {
			this._set(x, y, width, height, true);
			this._owner = owner;
			this._setter = setter;
		},

		_set: function (x, y, width, height, _dontNotify) {
			this._x = x;
			this._y = y;
			this._width = width;
			this._height = height;
			if (!_dontNotify)
				this._owner[this._setter](this);
			return this;
		}
	},
		new function () {
			var proto = Rectangle.prototype;

			return Base.each(['x', 'y', 'width', 'height'], function (key) {
				var part = Base.capitalize(key),
					internal = '_' + key;
				this['get' + part] = function () {
					return this[internal];
				};

				this['set' + part] = function (value) {
					this[internal] = value;
					if (!this._dontNotify)
						this._owner[this._setter](this);
				};
			}, Base.each(['Point', 'Size', 'Center',
				'Left', 'Top', 'Right', 'Bottom', 'CenterX', 'CenterY',
				'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight',
				'LeftCenter', 'TopCenter', 'RightCenter', 'BottomCenter'],
				function (key) {
					var name = 'set' + key;
					this[name] = function () {
						this._dontNotify = true;
						proto[name].apply(this, arguments);
						this._dontNotify = false;
						this._owner[this._setter](this);
					};
				}, {
				isSelected: function () {
					return !!(this._owner._selection & 2);
				},

				setSelected: function (selected) {
					var owner = this._owner;
					if (owner._changeSelection) {
						owner._changeSelection(2, selected);
					}
				}
			})
			);
		});

	var Matrix = function Matrix(arg, _dontNotify) {
		Base.call(this);
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
	Matrix.prototype._class = 'Matrix';
	Matrix.prototype.initialize = Matrix;
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
	Matrix.prototype._serialize = function (options, dictionary) {
		return Base.serialize(this.getValues(), options, true, dictionary);
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
	Matrix.prototype.toString = function () {
		var f = Formatter.instance;
		return '[[' + [f.number(this._a), f.number(this._c),
		f.number(this._tx)].join(', ') + '], ['
			+ [f.number(this._b), f.number(this._d),
			f.number(this._ty)].join(', ') + ']]';
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
	Matrix.prototype.invert = function () {
		var a = this._a,
			b = this._b,
			c = this._c,
			d = this._d,
			tx = this._tx,
			ty = this._ty,
			det = a * d - b * c,
			res = null;
		if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
			this._a = d / det;
			this._b = -b / det;
			this._c = -c / det;
			this._d = a / det;
			this._tx = (c * ty - d * tx) / det;
			this._ty = (b * tx - a * ty) / det;
			res = this;
		}
		return res;
	};
	Matrix.prototype.inverted = function () {
		return this.clone().invert();
	};
	Matrix.prototype.concatenate = Matrix.prototype.append;
	Matrix.prototype.preConcatenate = Matrix.prototype.prepend;
	Matrix.prototype.chain = Matrix.prototype.appended;
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
	Matrix.prototype.isSingular = function () {
		return !this.isInvertible();
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
	Matrix.prototype.inverseTransform = function () {
		return this._inverseTransform(Point.read(arguments));
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
	Matrix.prototype.getScaling = function () {
		return this.decompose().scaling;
	};
	Matrix.prototype.getRotation = function () {
		return this.decompose().rotation;
	};
	Matrix.prototype.applyToContext = function (ctx) {
		if (!this.isIdentity()) {
			ctx.transform(this._a, this._b, this._c, this._d,
				this._tx, this._ty);
		}
	};

	var Line = function Line(arg0, arg1, arg2, arg3, arg4) {
		Base.call(this);
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
	Line.prototype._class = 'Line';
	Line.prototype.initialize = Line;
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
		return Math.abs(
			Line.getSignedDistance(px, py, vx, vy, x, y, asVector));
	};

	var Project = function Project(element) {
		PaperScopeItem.call(this, true);
		this._children = [];
		this._namedChildren = {};
		this._activeLayer = null;
		this._selectionItems = {};
		this._selectionCount = 0;
		this._updateVersion = 0;
	};

	InitClassWithStatics(Project, PaperScopeItem);
	Project.prototype._class = 'Project';
	Project.prototype._list = 'projects';
	Project.prototype._reference = 'project';
	Project.prototype._compactSerialize = true;
	Project.prototype.initialize = Project;
	Project.prototype._serialize = function (options, dictionary) {
		return Base.serialize(this._children, options, true, dictionary);
	};
	Project.prototype._changed = function (flags, item) {
		var changes = this._changes;
		if (changes && item) {
			var changesById = this._changesById,
				id = item._id,
				entry = changesById[id];
			if (entry) {
				entry.flags |= flags;
			} else {
				changes.push(changesById[id] = { item: item, flags: flags });
			}
		}
	};
	Project.prototype.clear = function () {
		var children = this._children;
		for (var i = children.length - 1; i >= 0; i--)
			children[i].remove();
	};
	Project.prototype.isEmpty = function () {
		return !this._children.length;
	};
	Project.prototype.remove = function remove() {
		if (!remove.base.call(this))
			return false;
		return true;
	};
	Project.prototype.getIndex = function () {
		return this._index;
	};
	Project.prototype.getOptions = function () {
		return this._scope.settings;
	};
	Project.prototype.getLayers = function () {
		return this._children;
	};
	Project.prototype.getActiveLayer = function () {
		return this._activeLayer || new Layer({ project: this, insert: true });
	};
	Project.prototype.getSymbolDefinitions = function () {
		var definitions = [];
		return definitions;
	};
	Project.prototype.getSymbols = 'getSymbolDefinitions';
	Project.prototype.getSelectedItems = function () {
		var selectionItems = this._selectionItems,
			items = [];
		for (var id in selectionItems) {
			var item = selectionItems[id],
				selection = item._selection;
			if ((selection & 1) && item.isInserted()) {
				items.push(item);
			} else if (!selection) {
				this._updateSelection(item);
			}
		}
		return items;
	};
	Project.prototype._updateSelection = function (item) {
		var id = item._id,
			selectionItems = this._selectionItems;
		if (item._selection) {
			if (selectionItems[id] !== item) {
				this._selectionCount++;
				selectionItems[id] = item;
			}
		} else if (selectionItems[id] === item) {
			this._selectionCount--;
			delete selectionItems[id];
		}
	};
	Project.prototype.selectAll = function () {
		var children = this._children;
		for (var i = 0, l = children.length; i < l; i++)
			children[i].setFullySelected(true);
	};
	Project.prototype.deselectAll = function () {
		var selectionItems = this._selectionItems;
		for (var i in selectionItems)
			selectionItems[i].setFullySelected(false);
	};
	Project.prototype.addLayer = function (layer) {
		return this.insertLayer(undefined, layer);
	};
	Project.prototype.insertLayer = function (index, layer) {
		if (layer instanceof Layer) {
			layer._remove(false, true);
			Base.splice(this._children, [layer], index, 0);
			layer._setProject(this, true);
			var name = layer._name;
			if (name)
				layer.setName(name);
			if (this._changes)
				layer._changed(5);
			if (!this._activeLayer)
				this._activeLayer = layer;
		} else {
			layer = null;
		}
		return layer;
	};
	Project.prototype._insertItem = function (index, item, _created) {
		item = this.insertLayer(index, item)
			|| (this._activeLayer || this._insertItem(undefined,
				new Layer(Item.NO_INSERT), true))
				.insertChild(index, item);
		if (_created && item.activate)
			item.activate();
		return item;
	};
	Project.prototype.getItems = function (options) {
		return Item._getItems(this, options);
	};
	Project.prototype.getItem = function (options) {
		return Item._getItems(this, options, null, null, true)[0] || null;
	};
	Project.prototype.importJSON = function (json) {
		this.activate();
		var layer = this._activeLayer;
		return Base.importJSON(json, layer && layer.isEmpty() && layer);
	};
	Project.prototype.removeOn = function (type) {
		var sets = this._removeSets;
		if (sets) {
			if (type === 'mouseup')
				sets.mousedrag = null;
			var set = sets[type];
			if (set) {
				for (var id in set) {
					var item = set[id];
					for (var key in sets) {
						var other = sets[key];
						if (other && other != set)
							delete other[item._id];
					}
					item.remove();
				}
				sets[type] = null;
			}
		}
	};
	Project.prototype.draw = function (ctx, matrix, pixelRatio) {
		this._updateVersion++;
		ctx.save();
		matrix.applyToContext(ctx);
		var children = this._children,
			param = new Base({
				offset: new Point(0, 0),
				pixelRatio: pixelRatio,
				viewMatrix: matrix.isIdentity() ? null : matrix,
				matrices: [new Matrix()],
				updateMatrix: true
			});
		for (var i = 0, l = children.length; i < l; i++) {
			children[i].draw(ctx, param);
		}
		ctx.restore();

		if (this._selectionCount > 0) {
			ctx.save();
			ctx.strokeWidth = 1;
			var items = this._selectionItems,
				size = this._scope.settings.handleSize,
				version = this._updateVersion;
			for (var id in items) {
				items[id]._drawSelection(ctx, matrix, size, items, version);
			}
			ctx.restore();
		}
	};

	var Item = function () {
		Base.call();
	}
	InitClassWithStatics(Item, Base);

	Item.prototype.on = function (type, func) {
		if (typeof type !== 'string') {
			Base.each(type, function (value, key) {
				this.on(key, value);
			}, this);
		} else {
			var types = this._eventTypes,
				entry = types && types[type],
				handlers = this._callbacks = this._callbacks || {};
			handlers = handlers[type] = handlers[type] || [];
			if (handlers.indexOf(func) === -1) {
				handlers.push(func);
				if (entry && entry.install && handlers.length === 1)
					entry.install.call(this, type);
			}
		}
		return this;
	};
	Item.prototype.off = function (type, func) {
		if (typeof type !== 'string') {
			Base.each(type, function (value, key) {
				this.off(key, value);
			}, this);
			return;
		}
		var types = this._eventTypes,
			entry = types && types[type],
			handlers = this._callbacks && this._callbacks[type],
			index;
		if (handlers) {
			if (!func || (index = handlers.indexOf(func)) !== -1
				&& handlers.length === 1) {
				if (entry && entry.uninstall)
					entry.uninstall.call(this, type);
				delete this._callbacks[type];
			} else if (index !== -1) {
				handlers.splice(index, 1);
			}
		}
		return this;
	};
	Item.prototype.once = function (type, func) {
		return this.on(type, function handler() {
			func.apply(this, arguments);
			this.off(type, handler);
		});
	};
	Item.prototype.emit = function (type, event) {
		var handlers = this._callbacks && this._callbacks[type];
		if (!handlers)
			return false;
		var args = Base.slice(arguments, 1),
			setTarget = event && event.target && !event.currentTarget;
		handlers = handlers.slice();
		if (setTarget)
			event.currentTarget = this;
		for (var i = 0, l = handlers.length; i < l; i++) {
			if (handlers[i].apply(this, args) == false) {
				if (event && event.stop)
					event.stop();
				break;
			}
		}
		if (setTarget)
			delete event.currentTarget;
		return true;
	};
	Item.prototype.responds = function (type) {
		return !!(this._callbacks && this._callbacks[type]);
	};
	Item.prototype.attach = Item.prototype.on;
	Item.prototype.detach = Item.prototype.off;
	Item.prototype.fir = Item.prototype.emit;
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
	};
	Item.inject = function inject(src) {
		var events = src._events;
		if (events) {
			var types = {};
			Base.each(events, function (entry, key) {
				var isString = typeof entry === 'string',
					name = isString ? entry : key,
					part = Base.capitalize(name),
					type = name.substring(2).toLowerCase();
				types[type] = isString ? {} : entry;
				name = '_' + name;
				src['get' + part] = function () {
					return this[name];
				};
				src['set' + part] = function (func) {
					var prev = this[name];
					if (prev)
						this.off(type, prev);
					if (func)
						this.on(type, func);
					this[name] = func;
				};
			});
			src._eventTypes = types;
		}
		return Base.inject.apply(this, arguments);
	};
	Item.extend = function extend(src) {
		if (src._serializeFields)
			src._serializeFields = Base.set({},
				this.prototype._serializeFields, src._serializeFields);
		return Base.extend.apply(this, arguments);
	};
	Item.INSERT = { insert: true };
	Item.NO_INSERT = { insert: false };
	Item.prototype._class = 'Item';
	Item.prototype._name = null;
	Item.prototype._applyMatrix = true;
	Item.prototype._canApplyMatrix = true;
	Item.prototype._canScaleStroke = false;
	Item.prototype._pivot = null;
	Item.prototype._visible = true;
	Item.prototype._blendMode = 'normal';
	Item.prototype._opacity = 1;
	Item.prototype._locked = false;
	Item.prototype._guide = false;
	Item.prototype._clipMask = false;
	Item.prototype._selection = 0;
	Item.prototype._selectBounds = true;
	Item.prototype._selectChildren = false;
	Item.prototype._serializeFields = {
		name: null,
		applyMatrix: null,
		matrix: new Matrix(),
		pivot: null,
		visible: true,
		blendMode: 'normal',
		opacity: 1,
		locked: false,
		guide: false,
		clipMask: false,
		selected: false,
		data: {}
	};
	Item.prototype._prioritize = ['applyMatrix'];
	Item.prototype.initialize = function Item() {
	};
	Item.prototype._initialize = function (props, point) {
		var hasProps = props && Base.isPlainObject(props),
			internal = hasProps && props.internal === true,
			matrix = this._matrix = new Matrix(),
			project = hasProps && props.project || paper.project,
			settings = paper.settings;
		this._id = internal ? null : UID.get();
		this._parent = this._index = null;
		this._applyMatrix = this._canApplyMatrix && settings.applyMatrix;
		if (point)
			matrix.translate(point);
		matrix._owner = this;
		if (internal || hasProps && props.insert == false
			|| !settings.insertItems && !(hasProps && props.insert == true)) {
			this._setProject(project);
		} else {
			(hasProps && props.parent || project)
				._insertItem(undefined, this, true);
		}
		if (hasProps && props !== Item.NO_INSERT && props !== Item.INSERT) {
			this.set(props, {
				internal: true, insert: true, project: true, parent: true
			});
		}
		return hasProps;
	};
	Item.prototype._serialize = function (options, dictionary) {
		var props = {},
			that = this;

		function serialize(fields) {
			for (var key in fields) {
				var value = that[key];
				if (!Base.equals(value, key === 'leading'
					? fields.fontSize * 1.2 : fields[key])) {
					props[key] = Base.serialize(value, options,
						key !== 'data', dictionary);
				}
			}
		}

		serialize(this._serializeFields);
		if (!(this instanceof Group))
			serialize({});
		return [this._class, props];
	};
	Item.prototype._changed = function (flags) {
		var symbol = this._symbol,
			cacheParent = this._parent || symbol,
			project = this._project;
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
		if (project)
			project._changed(flags, this);
		if (symbol)
			symbol._changed(flags);
	};
	Item.prototype.getId = function () {
		return this._id;
	};
	Item.prototype.getName = function () {
		return this._name;
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
	Item.prototype.setStyle = function (style) {

	};
	Item.prototype.getSelection = function () {
		return this._selection;
	};
	Item.prototype.setSelection = function (selection) {
		if (selection !== this._selection) {
			this._selection = selection;
			var project = this._project;
			if (project) {
				project._updateSelection(this);
				this._changed(257);
			}
		}
	};
	Item.prototype._changeSelection = function (flag, selected) {
		var selection = this._selection;
		this.setSelection(selected ? selection | flag : selection & ~flag);
	};
	Item.prototype.isSelected = function () {
		if (this._selectChildren) {
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++)
				if (children[i].isSelected())
					return true;
		}
		return !!(this._selection & 1);
	};
	Item.prototype.setSelected = function (selected) {
		if (this._selectChildren) {
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++)
				children[i].setSelected(selected);
		}
		this._changeSelection(1, selected);
	};
	Item.prototype.isFullySelected = function () {
		var children = this._children,
			selected = !!(this._selection & 1);
		if (children && selected) {
			for (var i = 0, l = children.length; i < l; i++)
				if (!children[i].isFullySelected())
					return false;
			return true;
		}
		return selected;
	};
	Item.prototype.setFullySelected = function (selected) {
		var children = this._children;
		if (children) {
			for (var i = 0, l = children.length; i < l; i++)
				children[i].setFullySelected(selected);
		}
		this._changeSelection(1, selected);
	};
	Item.prototype.isClipMask = function () {
		return this._clipMask;
	};
	Item.prototype.setClipMask = function (clipMask) {
		if (this._clipMask != (clipMask = !!clipMask)) {
			this._clipMask = clipMask;
			if (clipMask) {
				this.setFillColor(null);
				this.setStrokeColor(null);
			}
			this._changed(257);
			if (this._parent)
				this._parent._changed(2048);
		}
	};
	Item.prototype.getData = function () {
		if (!this._data)
			this._data = {};
		return this._data;
	};
	Item.prototype.setData = function (data) {
		this._data = data;
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
	Item.prototype.getPivot = function () {
		var pivot = this._pivot;
		return pivot
			? new LinkedPoint(pivot.x, pivot.y, this, 'setPivot')
			: null;
	};
	Item.prototype.setPivot = function () {
		this._pivot = Point.read(arguments, 0, { clone: true, readNull: true });
		this._position = undefined;
	};

	Item.prototype.getBounds = function (matrix, options) {
		var hasMatrix = options || matrix instanceof Matrix,
			opts = Base.set({}, hasMatrix ? options : matrix,
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
				_matrix.set(_matrix._backup
					|| new Matrix().translate(_matrix.getTranslation()));
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
			if (item._visible && !item.isEmpty(true)) {
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

	Item.prototype._decompose = function () {
		return this._applyMatrix
			? null
			: this._decomposed || (this._decomposed = this._matrix.decompose());
	};
	Item.prototype.getRotation = function () {
		var decomposed = this._decompose();
		return decomposed ? decomposed.rotation : 0;
	};
	Item.prototype.setRotation = function (rotation) {
		var current = this.getRotation();
		if (current != null && rotation != null) {
			var decomposed = this._decomposed;
			this.rotate(rotation - current);
			if (decomposed) {
				decomposed.rotation = rotation;
				this._decomposed = decomposed;
			}
		}
	};
	Item.prototype.getScaling = function () {
		var decomposed = this._decompose(),
			s = decomposed && decomposed.scaling;
		return new LinkedPoint(s ? s.x : 1, s ? s.y : 1, this, 'setScaling');
	};
	Item.prototype.setScaling = function () {
		var current = this.getScaling(),
			scaling = Point.read(arguments, 0, { clone: true, readNull: true });
		if (current && scaling && !current.equals(scaling)) {
			var rotation = this.getRotation(),
				decomposed = this._decomposed,
				matrix = new Matrix(),
				isZero = Numerical.isZero;
			if (isZero(current.x) || isZero(current.y)) {
				matrix.translate(decomposed.translation);
				if (rotation) {
					matrix.rotate(rotation);
				}
				matrix.scale(scaling.x, scaling.y);
				this._matrix.set(matrix);
			} else {
				var center = this.getPosition(true);
				matrix.translate(center);
				if (rotation)
					matrix.rotate(rotation);
				matrix.scale(scaling.x / current.x, scaling.y / current.y);
				if (rotation)
					matrix.rotate(-rotation);
				matrix.translate(center.negate());
				this.transform(matrix);
			}
			if (decomposed) {
				decomposed.scaling = scaling;
				this._decomposed = decomposed;
			}
		}
	};
	Item.prototype.getMatrix = function () {
		return this._matrix;
	};
	Item.prototype.setMatrix = function () {
		var matrix = this._matrix;
		matrix.set.apply(matrix, arguments);
	};
	Item.prototype.getGlobalMatrix = function (_dontClone) {
		var matrix = this._globalMatrix;
		if (matrix) {
			var parent = this._parent;
			var parents = [];
			while (parent) {
				if (!parent._globalMatrix) {
					matrix = null;
					for (var i = 0, l = parents.length; i < l; i++) {
						parents[i]._globalMatrix = null;
					}
					break;
				}
				parents.push(parent);
				parent = parent._parent;
			}
		}
		if (!matrix) {
			matrix = this._globalMatrix = this._matrix.clone();
			var parent = this._parent;
			if (parent)
				matrix.prepend(parent.getGlobalMatrix(true));
		}
		return _dontClone ? matrix : matrix.clone();
	};
	Item.prototype.getApplyMatrix = function () {
		return this._applyMatrix;
	};
	Item.prototype.setApplyMatrix = function (apply) {
		if (this._applyMatrix = this._canApplyMatrix && !!apply)
			this.transform(null, true);
	};

	Item.prototype.getTransformContent = Item.prototype.getApplyMatrix;
	Item.prototype.setTransformContent = Item.prototype.setApplyMatrix;

	Item.prototype.getProject = function () {
		return this._project;
	};
	Item.prototype._setProject = function (project, installEvents) {
		if (this._project !== project) {
			if (this._project)
				this._installEvents(false);
			this._project = project;
			var children = this._children;
			for (var i = 0, l = children && children.length; i < l; i++)
				children[i]._setProject(project);
			installEvents = true;
		}
		if (installEvents)
			this._installEvents(true);
	};

	tmpItemPrototype_InstallEvents = Item.prototype._installEvents;
	Item.prototype._installEvents = function _installEvents(install) {
		tmpItemPrototype_InstallEvents.call(this, install);
		var children = this._children;
		for (var i = 0, l = children && children.length; i < l; i++)
			children[i]._installEvents(install);
	};
	Item.prototype.getLayer = function () {
		var parent = this;
		while (parent = parent._parent) {
			if (parent instanceof Layer)
				return parent;
		}
		return null;
	};
	Item.prototype.getParent = function () {
		return this._parent;
	};
	Item.prototype.setParent = function (item) {
		return item.addChild(this);
	};
	Item.prototype._getOwner = Item.prototype.getParent;
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
		return item === this || item && this._class === item._class
			&& this._matrix.equals(item._matrix)
			&& this._locked === item._locked
			&& this._visible === item._visible
			&& this._blendMode === item._blendMode
			&& this._opacity === item._opacity
			&& this._clipMask === item._clipMask
			&& this._guide === item._guide
			&& this._equals(item)
			|| false;
	};
	Item.prototype._equals = function (item) {
		return Base.equals(this._children, item._children);
	};
	Item.prototype.clone = function (options) {
		var copy = new this.constructor(Item.NO_INSERT),
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
		this.setStyle({});
		var keys = ['_locked', '_visible', '_blendMode', '_opacity', '_clipMask', '_guide'];
		for (var i = 0, l = keys.length; i < l; i++) {
			var key = keys[i];
			if (source.hasOwnProperty(key))
				this[key] = source[key];
		}
		if (!excludeMatrix)
			this._matrix.set(source._matrix, true);
		this.setApplyMatrix(source._applyMatrix);
		this.setPivot(source._pivot);
		this.setSelection(source._selection);
		var data = source._data,
			name = source._name;
		this._data = data ? Base.clone(data) : null;
		if (name)
			this.setName(name);
	};
	Item.prototype.rasterize = function (arg0, arg1) {
		return {};
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
	Item.prototype.importJSON = function (json) {
		var res = Base.importJSON(json, this);
		return res !== this ? this.addChild(res) : res;
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
			var project = this._project,
				notifySelf = project._changes;
			for (var i = 0, l = items.length; i < l; i++) {
				var item = items[i],
					name = item._name;
				item._parent = this;
				item._setProject(project, true);
				if (name)
					item.setName(name);
				if (notifySelf)
					item._changed(5);
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
	Item.prototype.sendToBack = function () {
		var owner = this._getOwner();
		return owner ? owner._insertItem(0, this) : null;
	};
	Item.prototype.bringToFront = function () {
		var owner = this._getOwner();
		return owner ? owner._insertItem(undefined, this) : null;
	};
	Item.prototype.appendBottom = function (item) {
		return this.insertChild(0, item);
	};

	Item.prototype.appendTop = Item.prototype.addChild;
	Item.prototype.moveAbove = Item.prototype.insertAbove;
	Item.prototype.moveBelow = Item.prototype.insertBelow;

	Item.prototype.addTo = function (owner) {
		return owner._insertItem(undefined, this);
	};
	Item.prototype.copyTo = function (owner) {
		return this.clone(false).addTo(owner);
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
			project = this._project,
			index = this._index;
		if (owner) {
			if (this._name)
				this._removeNamed();
			if (index != null) {
				if (project._activeLayer === this)
					project._activeLayer = this.getNextSibling()
						|| this.getPreviousSibling();
				Base.splice(owner._children, null, index, 1);
			}
			this._installEvents(false);
			if (notifySelf && project._changes)
				this._changed(5);
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
	Item.prototype.removeChildren = function (start, end) {
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

	Item.prototype.clear = Item.prototype.removeChildren;

	Item.prototype.reverseChildren = function () {
		if (this._children) {
			this._children.reverse();
			for (var i = 0, l = this._children.length; i < l; i++)
				this._children[i]._index = i;
			this._changed(11);
		}
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
	Item.prototype.isEditable = function () {
		var item = this;
		while (item) {
			if (!item._visible || item._locked)
				return false;
			item = item._parent;
		}
		return true;
	};
	Item.prototype.hasFill = function () {
		return false;
	};
	Item.prototype.hasStroke = function () {
		return false
	};
	Item.prototype.hasShadow = function () {
		return false
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
	Item.prototype.hasChildren = function () {
		return this._children && this._children.length > 0;
	};
	Item.prototype.isInserted = function () {
		return this._parent ? this._parent.isInserted() : false;
	};
	Item.prototype.isAbove = function (item) {
		return this._getOrder(item) === -1;
	};
	Item.prototype.isBelow = function (item) {
		return this._getOrder(item) === 1;
	};
	Item.prototype.isParent = function (item) {
		return this._parent === item;
	};
	Item.prototype.isChild = function (item) {
		return item && item._parent === this;
	};
	Item.prototype.isDescendant = function (item) {
		var parent = this;
		while (parent = parent._parent) {
			if (parent === item)
				return true;
		}
		return false;
	};
	Item.prototype.isAncestor = function (item) {
		return item ? item.isDescendant(this) : false;
	};
	Item.prototype.isSibling = function (item) {
		return this._parent === item._parent;
	};
	Item.prototype.isGroupedWith = function (item) {
		var parent = this._parent;
		while (parent) {
			if (parent._parent
				&& /^(Group|Layer|CompoundPath)$/.test(parent._class)
				&& item.isDescendant(parent))
				return true;
			parent = parent._parent;
		}
		return false;
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
	Item.prototype.globalToLocal = function () {
		return this.getGlobalMatrix(true)._inverseTransform(
			Point.read(arguments));
	};
	Item.prototype.localToGlobal = function () {
		return this.getGlobalMatrix(true)._transformPoint(
			Point.read(arguments));
	};
	Item.prototype.parentToLocal = function () {
		return this._matrix._inverseTransform(Point.read(arguments));
	};
	Item.prototype.localToParent = function () {
		return this._matrix._transformPoint(Point.read(arguments));
	};
	Item.prototype.fitBounds = function (rectangle, fill) {
		rectangle = Rectangle.read(arguments);
		var bounds = this.getBounds(),
			itemRatio = bounds.height / bounds.width,
			rectRatio = rectangle.height / rectangle.width,
			scale = (fill ? itemRatio > rectRatio : itemRatio < rectRatio)
				? rectangle.width / bounds.width
				: rectangle.height / bounds.height,
			newBounds = new Rectangle(new Point(),
				new Size(bounds.width * scale, bounds.height * scale));
		newBounds.setCenter(rectangle.getCenter());
		this.setBounds(newBounds);
	};

	var Group = function (arg) {
		Item.call(this);
		this._children = [];
		this._namedChildren = {};
		if (!this._initialize(arg))
			this.addChildren(Array.isArray(arg) ? arg : arguments);
	};
	InitClassWithStatics(Group, Item)
	Group.prototype.initialize = Group;
	Group.prototype._class = 'Group';
	Group.prototype._selectBounds = false;
	Group.prototype._selectChildren = true;
	Group.prototype._serializeFields = {
		children: []
	};
	Group.prototype._changed = function _changed(flags) {
		Item.prototype._changed.call(this, flags);
		if (flags & 2050) {
			this._clipItem = undefined;
		}
	};
	Group.prototype._getClipItem = function () {
		var clipItem = this._clipItem;
		if (clipItem === undefined) {
			clipItem = null;
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++) {
				if (children[i]._clipMask) {
					clipItem = children[i];
					break;
				}
			}
			this._clipItem = clipItem;
		}
		return clipItem;
	};
	Group.prototype.isClipped = function () {
		return !!this._getClipItem();
	};
	Group.prototype.setClipped = function (clipped) {
		var child = this.getFirstChild();
		if (child)
			child.setClipMask(clipped);
	};
	Group.prototype._getBounds = function _getBounds(matrix, options) {
		var clipItem = this._getClipItem();
		return clipItem
			? clipItem._getCachedBounds(clipItem._matrix.prepended(matrix),
				Base.set({}, options, { stroke: false }))
			: _getBounds.base.call(this, matrix, options);
	};
	Group.prototype._hitTestChildren = function _hitTestChildren(point, options, viewMatrix) {
		var clipItem = this._getClipItem();
		return (!clipItem || clipItem.contains(point))
			&& _hitTestChildren.base.call(this, point, options, viewMatrix,
				clipItem);
	};
	Group.prototype._draw = function (ctx, param) {
		var clip = param.clip,
			clipItem = !clip && this._getClipItem();
		param = param.extend({ clipItem: clipItem, clip: false });
		if (clip) {
			ctx.beginPath();
			param.dontStart = param.dontFinish = true;
		} else if (clipItem) {
			clipItem.draw(ctx, param.extend({ clip: true }));
		}
		var children = this._children;
		for (var i = 0, l = children.length; i < l; i++) {
			var item = children[i];
			if (item !== clipItem)
				item.draw(ctx, param);
		}
	};

	var Layer = function Layer() {
		Group.apply(this, arguments);
	};
	InitClassWithStatics(Layer, Group);
	Layer.prototype.initialize - Layer;
	Layer.prototype._class = 'Layer';
	Layer.prototype._getOwner = function () {
		return this._parent || this._index != null && this._project;
	};
	Layer.prototype.isInserted = function isInserted() {
		return this._parent ? Item.prototype.isInserted.call(this) : this._index != null;
	};
	Layer.prototype.activate = function () {
		this._project._activeLayer = this;
	};

	var Segment = function (arg0, arg1, arg2, arg3, arg4, arg5) {
		Base.apply(this, arguments);
		var count = arguments.length,
			point, handleIn, handleOut, selection;
		if (count > 0) {
			if (arg0 == null || typeof arg0 === 'object') {
				if (count === 1 && arg0 && 'point' in arg0) {
					point = arg0.point;
					handleIn = arg0.handleIn;
					handleOut = arg0.handleOut;
					selection = arg0.selection;
				} else {
					point = arg0;
					handleIn = arg1;
					handleOut = arg2;
					selection = arg3;
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
		if (selection)
			this.setSelection(selection);
	}
	InitClassWithStatics(Segment, Base);
	Segment.prototype.initialize = Segment;
	Segment.prototype._class = 'Segment';
	Segment.prototype.beans = true;
	Segment.prototype._selection = 0;
	Segment.prototype._serialize = function (options, dictionary) {
		var point = this._point,
			selection = this._selection,
			obj = selection || this.hasHandles()
				? [point, this._handleIn, this._handleOut]
				: point;
		if (selection)
			obj.push(selection);
		return Base.serialize(obj, options, true, dictionary);
	};
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
	Segment.prototype.setPoint = function () {
		this._point.set(Point.read(arguments));
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
	Segment.prototype.getSelection = function () {
		return this._selection;
	};
	Segment.prototype.setSelection = function (selection) {
		var oldSelection = this._selection,
			path = this._path;
		this._selection = selection = selection || 0;
		if (path && selection !== oldSelection) {
			path._updateSelection(this, oldSelection, selection);
			path._changed(257);
		}
	};
	Segment.prototype._changeSelection = function (flag, selected) {
		var selection = this._selection;
		this.setSelection(selected ? selection | flag : selection & ~flag);
	};
	Segment.prototype.isSelected = function () {
		return !!(this._selection & 7);
	};
	Segment.prototype.setSelected = function (selected) {
		this._changeSelection(7, selected);
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
	Segment.prototype.smooth = function (options, _first, _last) {
		var opts = options || {},
			type = opts.type,
			factor = opts.factor,
			prev = this.getPrevious(),
			next = this.getNext(),
			p0 = (prev || this)._point,
			p1 = this._point,
			p2 = (next || this)._point,
			d1 = p0.getDistance(p1),
			d2 = p1.getDistance(p2);
		if (!type || type === 'catmull-rom') {
			var a = factor === undefined ? 0.5 : factor,
				d1_a = Math.pow(d1, a),
				d1_2a = d1_a * d1_a,
				d2_a = Math.pow(d2, a),
				d2_2a = d2_a * d2_a;
			if (!_first && prev) {
				var A = 2 * d2_2a + 3 * d2_a * d1_a + d1_2a,
					N = 3 * d2_a * (d2_a + d1_a);
				this.setHandleIn(N !== 0
					? new Point(
						(d2_2a * p0._x + A * p1._x - d1_2a * p2._x) / N - p1._x,
						(d2_2a * p0._y + A * p1._y - d1_2a * p2._y) / N - p1._y)
					: new Point());
			}
			if (!_last && next) {
				var A = 2 * d1_2a + 3 * d1_a * d2_a + d2_2a,
					N = 3 * d1_a * (d1_a + d2_a);
				this.setHandleOut(N !== 0
					? new Point(
						(d1_2a * p2._x + A * p1._x - d2_2a * p0._x) / N - p1._x,
						(d1_2a * p2._y + A * p1._y - d2_2a * p0._y) / N - p1._y)
					: new Point());
			}
		} else if (type === 'geometric') {
			if (prev && next) {
				var vector = p0.subtract(p2),
					t = factor === undefined ? 0.4 : factor,
					k = t * d1 / (d1 + d2);
				if (!_first)
					this.setHandleIn(vector.multiply(k));
				if (!_last)
					this.setHandleOut(vector.multiply(k - t));
			}
		} else {
			throw new Error('Smoothing method \'' + type + '\' not supported.');
		}
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
		return segment === this || segment && this._class === segment._class
			&& this._point.equals(segment._point)
			&& this._handleIn.equals(segment._handleIn)
			&& this._handleOut.equals(segment._handleOut)
			|| false;
	};
	Segment.prototype.toString = function () {
		var parts = ['point: ' + this._point];
		if (!this._handleIn.isZero())
			parts.push('handleIn: ' + this._handleIn);
		if (!this._handleOut.isZero())
			parts.push('handleOut: ' + this._handleOut);
		return '{ ' + parts.join(', ') + ' }';
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
		var x, y,
			selected;
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
			selected = pt.selected;
		}
		this._x = x;
		this._y = y;
		this._owner = owner;
		owner[key] = this;
		if (selected)
			this.setSelected(true);
	}
	InitClassWithStatics(SegmentPoint, Point);
	SegmentPoint.prototype.initialize = SegmentPoint;
	SegmentPoint.prototype._set = function (x, y) {
		this._x = x;
		this._y = y;
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
	SegmentPoint.prototype.setX = function (x) {
		this._x = x;
		this._owner._changed(this);
	};
	SegmentPoint.prototype.setY = function (y) {
		this._y = y;
		this._owner._changed(this);
	};

	Object.defineProperty(SegmentPoint.prototype, 'x', {
		get: function () {
			return this.getX();
		},
		set: function (value) {
			this.setX(value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(SegmentPoint.prototype, 'y', {
		get: function () {
			return this.getY();
		},
		set: function (value) {
			this.setY(value);
		},
		enumerable: true,
		configurable: true
	});

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
	Curve.prototype.initialize = Curve;
	Curve.prototype._class = 'Curve';
	Curve.prototype._serialize = function (options, dictionary) {
		return Base.serialize(this.hasHandles()
			? [this.getPoint1(), this.getHandle1(), this.getHandle2(),
			this.getPoint2()]
			: [this.getPoint1(), this.getPoint2()],
			options, true, dictionary);
	};
	Curve.prototype._changed = function () {
		this._length = this._bounds = undefined;
	};
	Curve.prototype.clone = function () {
		return new Curve(this._segment1, this._segment2);
	};
	Curve.prototype.toString = function () {
		var parts = ['point1: ' + this._segment1._point];
		if (!this._segment1._handleOut.isZero())
			parts.push('handle1: ' + this._segment1._handleOut);
		if (!this._segment2._handleIn.isZero())
			parts.push('handle2: ' + this._segment2._handleIn);
		parts.push('point2: ' + this._segment2._point);
		return '{ ' + parts.join(', ') + ' }';
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
	Curve.prototype.setPoint1 = function () {
		this._segment1._point.set(Point.read(arguments));
	};
	Curve.prototype.getPoint2 = function () {
		return this._segment2._point;
	};
	Curve.prototype.setPoint2 = function () {
		this._segment2._point.set(Point.read(arguments));
	};
	Curve.prototype.getHandle1 = function () {
		return this._segment1._handleOut;
	};
	Curve.prototype.setHandle1 = function () {
		this._segment1._handleOut.set(Point.read(arguments));
	};
	Curve.prototype.getHandle2 = function () {
		return this._segment2._handleIn;
	};
	Curve.prototype.setHandle2 = function () {
		this._segment2._handleIn.set(Point.read(arguments));
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
	Curve.prototype.isSelected = function () {
		return this.getPoint1().isSelected()
			&& this.getHandle1().isSelected()
			&& this.getHandle2().isSelected()
			&& this.getPoint2().isSelected();
	};
	Curve.prototype.setSelected = function (selected) {
		this.getPoint1().setSelected(selected);
		this.getHandle1().setSelected(selected);
		this.getHandle2().setSelected(selected);
		this.getPoint2().setSelected(selected);
	};
	Curve.prototype.getValues = function (matrix) {
		return Curve.getValues(this._segment1, this._segment2, matrix);
	};
	Curve.prototype.getPoints = function () {
		var coords = this.getValues(),
			points = [];
		for (var i = 0; i < 8; i += 2)
			points.push(new Point(coords[i], coords[i + 1]));
		return points;
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
	Curve.isFlatEnough = function (v, flatness) {
		var x0 = v[0], y0 = v[1],
			x1 = v[2], y1 = v[3],
			x2 = v[4], y2 = v[5],
			x3 = v[6], y3 = v[7],
			ux = 3 * x1 - 2 * x0 - x3,
			uy = 3 * y1 - 2 * y0 - y3,
			vx = 3 * x2 - 2 * x3 - x0,
			vy = 3 * y2 - 2 * y3 - y0;
		return Math.max(ux * ux, vx * vx) + Math.max(uy * uy, vy * vy)
			<= 16 * flatness * flatness;
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
	Curve.isLinear = function (v, epsilon) {
		var x0 = v[0], y0 = v[1],
			x3 = v[6], y3 = v[7];
		var test = function (p1, h1, h2, p2) {
			var third = p2.subtract(p1).divide(3);
			return h1.equals(third) && h2.negate().equals(third);
		};
		return test(
			new Point(x0, y0),
			new Point(v[2] - x0, v[3] - y0),
			new Point(v[4] - x3, v[5] - y3),
			new Point(x3, y3), epsilon);
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
	Curve.prototype.isHorizontal = function () {
		return this.isStraight() && Math.abs(this.getTangentAtTime(0.5).y)
			< 1e-8;
	};
	Curve.prototype.isVertical = function () {
		return this.isStraight() && Math.abs(this.getTangentAtTime(0.5).x)
			< 1e-8;
	};
	Curve.prototype.isLinear = function (epsilon) {
		var seg1 = this._segment1,
			seg2 = this._segment2;
		const test = function (p1, h1, h2, p2) {
			var third = p2.subtract(p1).divide(3);
			return h1.equals(third) && h2.negate().equals(third);
		}
		return test(seg1._point, seg1._handleOut, seg2._handleIn, seg2._point, epsilon);
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
	Curve.prototype.getParameterAt = Curve.prototype.getTimeAt;
	Curve.prototype.getTimesWithTangent = function () {
		var tangent = Point.read(arguments);
		return tangent.isZero()
			? []
			: Curve.getTimesWithTangent(this.getValues(), tangent);
	};
	Curve.prototype.getOffsetAtTime = function (t) {
		return this.getPartLength(0, t);
	};
	Curve.prototype.getLocationOf = function () {
		return this.getLocationAtTime(this.getTimeOf(Point.read(arguments)));
	};
	Curve.prototype.getOffsetOf = function () {
		var loc = this.getLocationOf.apply(this, arguments);
		return loc ? loc.getOffset() : null;
	};
	Curve.prototype.getTimeOf = function () {
		return Curve.getTimeOf(this.getValues(), Point.read(arguments));
	};
	Curve.prototype.getParameterOf = Curve.prototype.getTimeOf;
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

	Curve._evaluateMethods = ['getPoint', 'getTangent', 'getNormal', 'getWeightedTangent', 'getWeightedNormal', 'getCurvature'];
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
	Curve.prototype.getWeightedTangentAtTime = function (time) {
		return Curve['getWeightedTangent'](this.getValues(), time);
	};
	Curve.prototype.getWeightedNormalAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getWeightedNormal'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getWeightedNormalAtTime = function (time) {
		return Curve[getWeightedNormal](this.getValues(), time);
	};
	Curve.prototype.getCurvatureAt = function (location, _isTime) {
		var values = this.getValues();
		return Curve['getCurvature'](values, _isTime
			? location
			: Curve.getTimeAt(values, location));
	};
	Curve.prototype.getCurvatureAtTime = function (time) {
		return Curve[getCurvature](this.getValues(), time);
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
	Curve.getWeightedTangent = function (v, t) {
		return Curve.evaluate(v, t, 1, false);
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

	Curve.static = {
		addLocation: function (locations, include, c1, t1, c2, t2, overlap) {
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
		},
		addCurveIntersections: function (v1, v2, c1, c2, locations, include, flip,
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
				hull = Curve.static.getConvexHull(dp0, dp1, dp2, dp3),
				top = hull[0],
				bottom = hull[1],
				tMinClip,
				tMaxClip;
			if (d1 === 0 && d2 === 0
				&& dp0 === 0 && dp1 === 0 && dp2 === 0 && dp3 === 0
				|| (tMinClip = Curve.static.clipConvexHull(top, bottom, dMin, dMax)) == null
				|| (tMaxClip = Curve.static.clipConvexHull(top.reverse(), bottom.reverse(),
					dMin, dMax)) == null)
				return calls;
			var tMinNew = tMin + (tMax - tMin) * tMinClip,
				tMaxNew = tMin + (tMax - tMin) * tMaxClip;
			if (Math.max(uMax - uMin, tMaxNew - tMinNew) < fatLineEpsilon) {
				var t = (tMinNew + tMaxNew) / 2,
					u = (uMin + uMax) / 2;
				Curve.static.addLocation(locations, include,
					flip ? c2 : c1, flip ? u : t,
					flip ? c1 : c2, flip ? t : u);
			} else {
				v1 = Curve.getPart(v1, tMinClip, tMaxClip);
				var uDiff = uMax - uMin;
				if (tMaxClip - tMinClip > 0.8) {
					if (tMaxNew - tMinNew > uDiff) {
						var parts = Curve.subdivide(v1, 0.5),
							t = (tMinNew + tMaxNew) / 2;
						calls = Curve.static.addCurveIntersections(
							v2, parts[0], c2, c1, locations, include, !flip,
							recursion, calls, uMin, uMax, tMinNew, t);
						calls = Curve.static.addCurveIntersections(
							v2, parts[1], c2, c1, locations, include, !flip,
							recursion, calls, uMin, uMax, t, tMaxNew);
					} else {
						var parts = Curve.subdivide(v2, 0.5),
							u = (uMin + uMax) / 2;
						calls = Curve.static.addCurveIntersections(
							parts[0], v1, c2, c1, locations, include, !flip,
							recursion, calls, uMin, u, tMinNew, tMaxNew);
						calls = Curve.static.addCurveIntersections(
							parts[1], v1, c2, c1, locations, include, !flip,
							recursion, calls, u, uMax, tMinNew, tMaxNew);
					}
				} else {
					if (uDiff === 0 || uDiff >= fatLineEpsilon) {
						calls = Curve.static.addCurveIntersections(
							v2, v1, c2, c1, locations, include, !flip,
							recursion, calls, uMin, uMax, tMinNew, tMaxNew);
					} else {
						calls = Curve.static.addCurveIntersections(
							v1, v2, c1, c2, locations, include, flip,
							recursion, calls, tMinNew, tMaxNew, uMin, uMax);
					}
				}
			}
			return calls;
		},
		getConvexHull: function (dq0, dq1, dq2, dq3) {
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
		},
		clipConvexHull: function (hullTop, hullBottom, dMin, dMax) {
			if (hullTop[0][1] < dMin) {
				return Curve.static.clipConvexHullPart(hullTop, true, dMin);
			} else if (hullBottom[0][1] > dMax) {
				return Curve.static.clipConvexHullPart(hullBottom, false, dMax);
			} else {
				return hullTop[0][0];
			}
		},
		clipConvexHullPart: function (part, top, threshold) {
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
		},
		getCurveLineIntersections: function (v, px, py, vx, vy) {
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
		},
		addCurveLineIntersections: function (v1, v2, c1, c2, locations, include,
			flip) {
			var x1 = v2[0], y1 = v2[1],
				x2 = v2[6], y2 = v2[7];
			var roots = Curve.static.getCurveLineIntersections(v1, x1, y1, x2 - x1, y2 - y1);
			for (var i = 0, l = roots.length; i < l; i++) {
				var t1 = roots[i],
					p1 = Curve.getPoint(v1, t1),
					t2 = Curve.getTimeOf(v2, p1);
				if (t2 !== null) {
					Curve.static.addLocation(locations, include,
						flip ? c2 : c1, flip ? t2 : t1,
						flip ? c1 : c2, flip ? t1 : t2);
				}
			}
		},
		addLineIntersection: function (v1, v2, c1, c2, locations, include) {
			var pt = Line.intersect(
				v1[0], v1[1], v1[6], v1[7],
				v2[0], v2[1], v2[6], v2[7]);
			if (pt) {
				Curve.static.addLocation(locations, include,
					c1, Curve.getTimeOf(v1, pt),
					c2, Curve.getTimeOf(v2, pt));
			}
		},
		getCurveIntersections: function (v1, v2, c1, c2, locations, include) {
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
				var overlaps = Curve.static.getOverlaps(v1, v2);
				if (overlaps) {
					for (var i = 0; i < 2; i++) {
						var overlap = overlaps[i];
						Curve.static.addLocation(locations, include,
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
						? Curve.static.addLineIntersection
						: straight1 || straight2
							? Curve.static.addCurveLineIntersections
							: Curve.static.addCurveIntersections)(
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
								Curve.static.addLocation(locations, include,
									c1, t1,
									c2, t2);
							}
						}
					}
				}
			}
			return locations;
		},
		getSelfIntersection: function (v1, c1, locations, include) {
			var info = Curve.classify(v1);
			if (info.type === 'loop') {
				var roots = info.roots;
				Curve.static.addLocation(locations, include,
					c1, roots[0],
					c1, roots[1]);
			}
			return locations;
		},
		getIntersections: function (curves1, curves2, include, matrix1, matrix2,
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
					Curve.static.getSelfIntersection(v1, curve1, locations, include);
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
							Curve.static.getCurveIntersections(
								v1, v2, curve1, curve2, locations, include);
						}
					}
				}
			}
			return locations;
		},
		getOverlaps: function (v1, v2) {

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
		},
		getTimesWithTangent: function (v, tangent) {
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
		},
	};

	Curve.getOverlaps = Curve.static.getOverlaps;
	Curve.getIntersections = Curve.static.getIntersections;
	Curve.getCurveLineIntersections = Curve.static.getCurveLineIntersections;
	Curve.getTimesWithTangent = Curve.static.getTimesWithTangent;

	Curve.prototype.getIntersections = function (curve) {
		var v1 = this.getValues(),
			v2 = curve && curve !== this && curve.getValues();
		return v2 ? Curve.static.getCurveIntersections(v1, v2, this, curve, [])
			: Curve.static.getSelfIntersection(v1, this, []);
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
	CurveLocation.prototype.initialize = CurveLocation;
	CurveLocation.prototype._class = 'CurveLocation';
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
	CurveLocation.prototype.getParameter = CurveLocation.prototype.getTime;
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
	CurveLocation.prototype.toString = function () {
		var parts = [],
			point = this.getPoint(),
			f = Formatter.instance;
		if (point)
			parts.push('point: ' + point);
		var index = this.getIndex();
		if (index != null)
			parts.push('index: ' + index);
		var time = this.getTime();
		if (time != null)
			parts.push('time: ' + f.number(time));
		if (this._distance != null)
			parts.push('distance: ' + f.number(this._distance));
		return '{ ' + parts.join(', ') + ' }';
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

	Object.defineProperty(CurveLocation.prototype, 'tangent', {
		get: function () {
			return this.getTangent();
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(CurveLocation.prototype, 'normal', {
		get: function () {
			return this.getNormal();
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(CurveLocation.prototype, 'weightedTangent', {
		get: function () {
			return this.getWeightedTangent();
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(CurveLocation.prototype, 'weightedNormal', {
		get: function () {
			return this.getWeightedTangent();
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(CurveLocation.prototype, 'curvature', {
		get: function () {
			return this.getCurvature();
		},
		enumerable: true,
		configurable: true
	});

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

	debugger

	var PathItem = Item.extend({
		_class: 'PathItem',
		_selectBounds: false,
		_canScaleStroke: true,
		beans: true,

		initialize: function PathItem() {
		},

		statics: {
			create: function (arg) {
				var data,
					segments,
					compound;
				if (Base.isPlainObject(arg)) {
					segments = arg.segments;
					data = arg.pathData;
				} else if (Array.isArray(arg)) {
					segments = arg;
				} else if (typeof arg === 'string') {
					data = arg;
				}
				if (segments) {
					var first = segments[0];
					compound = first && Array.isArray(first[0]);
				} else if (data) {
					compound = (data.match(/m/gi) || []).length > 1
						|| /z\s*\S+/i.test(data);
				}
				var ctor = compound ? CompoundPath : Path;
				return new ctor(arg);
			}
		},

		_asPathItem: function () {
			return this;
		},

		isClockwise: function () {
			return this.getArea() >= 0;
		},

		setClockwise: function (clockwise) {
			if (this.isClockwise() != (clockwise = !!clockwise))
				this.reverse();
		},

		setPathData: function (data) {

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
		},

		_canComposite: function () {
			return !(this.hasFill() && this.hasStroke());
		},

		_contains: function (point) {
			var winding = point.isInside(
				this.getBounds({ internal: true, handle: true }))
				? this._getWinding(point)
				: {};
			return winding.onPath || !!(winding.winding);
		},

		getIntersections: function (path, include, _matrix, _returnFirst) {
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
		},

		getCrossings: function (path) {
			return this.getIntersections(path, function (inter) {
				return inter.isCrossing();
			});
		},

		getNearestLocation: function () {
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
		},

		getNearestPoint: function () {
			var loc = this.getNearestLocation.apply(this, arguments);
			return loc ? loc.getPoint() : loc;
		},

		interpolate: function (from, to, factor) {
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
		},

		compare: function (path) {
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
		},

	});

	var Path = PathItem.extend({
		_class: 'Path',
		_serializeFields: {
			segments: [],
			closed: false
		},

		initialize: function Path(arg) {
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
				this._segmentSelection = 0;
				if (!segments && typeof arg === 'string') {
					this.setPathData(arg);
					arg = null;
				}
			}
			this._initialize(!segments && arg);
		},

		_equals: function (item) {
			return this._closed === item._closed
				&& Base.equals(this._segments, item._segments);
		},

		copyContent: function (source) {
			this.setSegments(source._segments);
			this._closed = source._closed;
		},

		_changed: function _changed(flags) {
			_changed.base.call(this, flags);
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
		},

		getSegments: function () {
			return this._segments;
		},

		setSegments: function (segments) {
			var fullySelected = this.isFullySelected(),
				length = segments && segments.length;
			this._segments.length = 0;
			this._segmentSelection = 0;
			this._curves = undefined;
			if (length) {
				var last = segments[length - 1];
				if (typeof last === 'boolean') {
					this.setClosed(last);
					length--;
				}
				this._add(Segment.readList(segments, 0, {}, length));
			}
			if (fullySelected)
				this.setFullySelected(true);
		},

		getFirstSegment: function () {
			return this._segments[0];
		},

		getLastSegment: function () {
			return this._segments[this._segments.length - 1];
		},

		getCurves: function () {
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
		},

		getFirstCurve: function () {
			return this.getCurves()[0];
		},

		getLastCurve: function () {
			var curves = this.getCurves();
			return curves[curves.length - 1];
		},

		isClosed: function () {
			return this._closed;
		},

		setClosed: function (closed) {
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
		}
	}, {
		beans: true,

		getPathData: function (_matrix, _precision) {
			var segments = this._segments,
				length = segments.length,
				f = new Formatter(_precision),
				coords = new Array(6),
				first = true,
				curX, curY,
				prevX, prevY,
				inX, inY,
				outX, outY,
				parts = [];

			function addSegment(segment, skipLine) {
				segment._transformCoordinates(_matrix, coords);
				curX = coords[0];
				curY = coords[1];
				if (first) {
					parts.push('M' + f.pair(curX, curY));
					first = false;
				} else {
					inX = coords[2];
					inY = coords[3];
					if (inX === curX && inY === curY
						&& outX === prevX && outY === prevY) {
						if (!skipLine) {
							var dx = curX - prevX,
								dy = curY - prevY;
							parts.push(
								dx === 0 ? 'v' + f.number(dy)
									: dy === 0 ? 'h' + f.number(dx)
										: 'l' + f.pair(dx, dy));
						}
					} else {
						parts.push('c' + f.pair(outX - prevX, outY - prevY)
							+ ' ' + f.pair(inX - prevX, inY - prevY)
							+ ' ' + f.pair(curX - prevX, curY - prevY));
					}
				}
				prevX = curX;
				prevY = curY;
				outX = coords[4];
				outY = coords[5];
			}

			if (!length)
				return '';

			for (var i = 0; i < length; i++)
				addSegment(segments[i]);
			if (this._closed && length > 0) {
				addSegment(segments[0], true);
				parts.push('z');
			}
			return parts.join('');
		},

		isEmpty: function () {
			return !this._segments.length;
		},

		_transformContent: function (matrix) {
			var segments = this._segments,
				coords = new Array(6);
			for (var i = 0, l = segments.length; i < l; i++)
				segments[i]._transformCoordinates(matrix, coords, true);
			return true;
		},

		_add: function (segs, index) {
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
				if (segment._selection)
					this._updateSelection(segment, 0, segment._selection);
			}
			if (append) {
				Base.push(segments, segs);
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
		},

		_adjustCurves: function (start, end) {
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
		},

		_countCurves: function () {
			var length = this._segments.length;
			return !this._closed && length > 0 ? length - 1 : length;
		},

		add: function (segment1) {
			var args = arguments;
			return args.length > 1 && typeof segment1 !== 'number'
				? this._add(Segment.readList(args))
				: this._add([Segment.read(args)])[0];
		},

		insert: function (index, segment1) {
			var args = arguments;
			return args.length > 2 && typeof segment1 !== 'number'
				? this._add(Segment.readList(args, 1), index)
				: this._add([Segment.read(args, 1)], index)[0];
		},

		addSegment: function () {
			return this._add([Segment.read(arguments)])[0];
		},

		insertSegment: function (index) {
			return this._add([Segment.read(arguments, 1)], index)[0];
		},

		addSegments: function (segments) {
			return this._add(Segment.readList(segments));
		},

		insertSegments: function (index, segments) {
			return this._add(Segment.readList(segments), index);
		},

		removeSegment: function (index) {
			return this.removeSegments(index, index + 1)[0] || null;
		},

		removeSegments: function (start, end, _includeCurves) {
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
				if (segment._selection)
					this._updateSelection(segment, segment._selection, 0);
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
		},

		clear: '#removeSegments',

		hasHandles: function () {
			var segments = this._segments;
			for (var i = 0, l = segments.length; i < l; i++) {
				if (segments[i].hasHandles())
					return true;
			}
			return false;
		},

		clearHandles: function () {
			var segments = this._segments;
			for (var i = 0, l = segments.length; i < l; i++)
				segments[i].clearHandles();
		},

		getLength: function () {
			if (this._length == null) {
				var curves = this.getCurves(),
					length = 0;
				for (var i = 0, l = curves.length; i < l; i++)
					length += curves[i].getLength();
				this._length = length;
			}
			return this._length;
		},

		getArea: function () {
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
		},

		isFullySelected: function () {
			var length = this._segments.length;
			return this.isSelected() && length > 0 && this._segmentSelection
				=== length * 7;
		},

		setFullySelected: function (selected) {
			if (selected)
				this._selectSegments(true);
			this.setSelected(selected);
		},

		setSelection: function setSelection(selection) {
			if (!(selection & 1))
				this._selectSegments(false);
			setSelection.base.call(this, selection);
		},

		_selectSegments: function (selected) {
			var segments = this._segments,
				length = segments.length,
				selection = selected ? 7 : 0;
			this._segmentSelection = selection * length;
			for (var i = 0; i < length; i++)
				segments[i]._selection = selection;
		},

		_updateSelection: function (segment, oldSelection, newSelection) {
			segment._selection = newSelection;
			var selection = this._segmentSelection += newSelection - oldSelection;
			if (selection > 0)
				this.setSelected(true);
		},

		divideAt: function (location) {
			var loc = this.getLocationAt(location),
				curve;
			return loc && (curve = loc.getCurve().divideAt(loc.getCurveOffset()))
				? curve._segment1
				: null;
		},

		splitAt: function (location) {
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
					path = new Path(Item.NO_INSERT);
					path.insertAbove(this);
					path.copyAttributes(this);
				}
				path._add(segs, 0);
				this.addSegment(segs[0]);
				return path;
			}
			return null;
		},

		split: function (index, time) {
			var curve,
				location = time === undefined ? index
					: (curve = this.getCurves()[index])
					&& curve.getLocationAtTime(time);
			return location != null ? this.splitAt(location) : null;
		},

		join: function (path, tolerance) {
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
		},

		reduce: function (options) {
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
		},

		reverse: function () {
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
		},

		flatten: function (flatness) {
			var flattener = new PathFlattener(this, flatness || 0.25, 256, true),
				parts = flattener.parts,
				length = parts.length,
				segments = [];
			for (var i = 0; i < length; i++) {
				segments.push(new Segment(parts[i].curve.slice(0, 2)));
			}
			if (!this._closed && length > 0) {
				segments.push(new Segment(parts[length - 1].curve.slice(6)));
			}
			this.setSegments(segments);
		},

		simplify: function (tolerance) {
			var segments = new PathFitter(this).fit(tolerance || 2.5);
			if (segments)
				this.setSegments(segments);
			return !!segments;
		},

		smooth: function (options) {
			var that = this,
				opts = options || {},
				type = opts.type || 'asymmetric',
				segments = this._segments,
				length = segments.length,
				closed = this._closed;

			function getIndex(value, _default) {
				var index = value && value.index;
				if (index != null) {
					var path = value.path;
					if (path && path !== that)
						throw new Error(value._class + ' ' + index + ' of ' + path
							+ ' is not part of ' + that);
					if (_default && value instanceof Curve)
						index++;
				} else {
					index = typeof value === 'number' ? value : _default;
				}
				return Math.min(index < 0 && closed
					? index % length
					: index < 0 ? index + length : index, length - 1);
			}

			var loop = closed && opts.from === undefined && opts.to === undefined,
				from = getIndex(opts.from, 0),
				to = getIndex(opts.to, length - 1);

			if (from > to) {
				if (closed) {
					from -= length;
				} else {
					var tmp = from;
					from = to;
					to = tmp;
				}
			}
			if (/^(?:asymmetric|continuous)$/.test(type)) {
				var asymmetric = type === 'asymmetric',
					min = Math.min,
					amount = to - from + 1,
					n = amount - 1,
					padding = loop ? min(amount, 4) : 1,
					paddingLeft = padding,
					paddingRight = padding,
					knots = [];
				if (!closed) {
					paddingLeft = min(1, from);
					paddingRight = min(1, length - to - 1);
				}
				n += paddingLeft + paddingRight;
				if (n <= 1)
					return;
				for (var i = 0, j = from - paddingLeft; i <= n; i++, j++) {
					knots[i] = segments[(j < 0 ? j + length : j) % length]._point;
				}

				var x = knots[0]._x + 2 * knots[1]._x,
					y = knots[0]._y + 2 * knots[1]._y,
					f = 2,
					n_1 = n - 1,
					rx = [x],
					ry = [y],
					rf = [f],
					px = [],
					py = [];
				for (var i = 1; i < n; i++) {
					var internal = i < n_1,
						a = internal ? 1 : asymmetric ? 1 : 2,
						b = internal ? 4 : asymmetric ? 2 : 7,
						u = internal ? 4 : asymmetric ? 3 : 8,
						v = internal ? 2 : asymmetric ? 0 : 1,
						m = a / f;
					f = rf[i] = b - m;
					x = rx[i] = u * knots[i]._x + v * knots[i + 1]._x - m * x;
					y = ry[i] = u * knots[i]._y + v * knots[i + 1]._y - m * y;
				}

				px[n_1] = rx[n_1] / rf[n_1];
				py[n_1] = ry[n_1] / rf[n_1];
				for (var i = n - 2; i >= 0; i--) {
					px[i] = (rx[i] - px[i + 1]) / rf[i];
					py[i] = (ry[i] - py[i + 1]) / rf[i];
				}
				px[n] = (3 * knots[n]._x - px[n_1]) / 2;
				py[n] = (3 * knots[n]._y - py[n_1]) / 2;

				for (var i = paddingLeft, max = n - paddingRight, j = from;
					i <= max; i++, j++) {
					var segment = segments[j < 0 ? j + length : j],
						pt = segment._point,
						hx = px[i] - pt._x,
						hy = py[i] - pt._y;
					if (loop || i < max)
						segment.setHandleOut(hx, hy);
					if (loop || i > paddingLeft)
						segment.setHandleIn(-hx, -hy);
				}
			} else {
				for (var i = from; i <= to; i++) {
					segments[i < 0 ? i + length : i].smooth(opts,
						!loop && i === from, !loop && i === to);
				}
			}
		},

		toPath: '#clone',

		compare: function compare(path) {
			if (!path || path instanceof CompoundPath)
				return compare.base.call(this, path);
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
		},

	}, Base.each(Curve._evaluateMethods,
		function (name) {
			this[name + 'At'] = function (offset) {
				var loc = this.getLocationAt(offset);
				return loc && loc[name]();
			};
		},
		{
			beans: false,

			getLocationOf: function () {
				var point = Point.read(arguments),
					curves = this.getCurves();
				for (var i = 0, l = curves.length; i < l; i++) {
					var loc = curves[i].getLocationOf(point);
					if (loc)
						return loc;
				}
				return null;
			},

			getOffsetOf: function () {
				var loc = this.getLocationOf.apply(this, arguments);
				return loc ? loc.getOffset() : null;
			},

			getLocationAt: function (offset) {
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
			},

			getOffsetsWithTangent: function () {
				var tangent = Point.read(arguments);
				if (tangent.isZero()) {
					return [];
				}

				var offsets = [];
				var curveStart = 0;
				var curves = this.getCurves();
				for (var i = 0, l = curves.length; i < l; i++) {
					var curve = curves[i];
					var curveTimes = curve.getTimesWithTangent(tangent);
					for (var j = 0, m = curveTimes.length; j < m; j++) {
						var offset = curveStart + curve.getOffsetAtTime(curveTimes[j]);
						if (offsets.indexOf(offset) < 0) {
							offsets.push(offset);
						}
					}
					curveStart += curve.length;
				}
				return offsets;
			}
		}),
		new function () {

			function drawHandles(ctx, segments, matrix, size) {
				if (size <= 0) return;

				var half = size / 2,
					miniSize = size - 2,
					miniHalf = half - 1,
					coords = new Array(6),
					pX, pY;

				function drawHandle(index) {
					var hX = coords[index],
						hY = coords[index + 1];
					if (pX != hX || pY != hY) {
						ctx.beginPath();
						ctx.moveTo(pX, pY);
						ctx.lineTo(hX, hY);
						ctx.stroke();
						ctx.beginPath();
						ctx.arc(hX, hY, half, 0, Math.PI * 2, true);
						ctx.fill();
					}
				}

				for (var i = 0, l = segments.length; i < l; i++) {
					var segment = segments[i],
						selection = segment._selection;
					segment._transformCoordinates(matrix, coords);
					pX = coords[0];
					pY = coords[1];
					if (selection & 2)
						drawHandle(2);
					if (selection & 4)
						drawHandle(4);
					ctx.fillRect(pX - half, pY - half, size, size);
					if (miniSize > 0 && !(selection & 1)) {
						var fillStyle = ctx.fillStyle;
						ctx.fillStyle = '#ffffff';
						ctx.fillRect(pX - miniHalf, pY - miniHalf, miniSize, miniSize);
						ctx.fillStyle = fillStyle;
					}
				}
			}

			function drawSegments(ctx, path, matrix) {
				var segments = path._segments,
					length = segments.length,
					coords = new Array(6),
					first = true,
					curX, curY,
					prevX, prevY,
					inX, inY,
					outX, outY;

				function drawSegment(segment) {
					if (matrix) {
						segment._transformCoordinates(matrix, coords);
						curX = coords[0];
						curY = coords[1];
					} else {
						var point = segment._point;
						curX = point._x;
						curY = point._y;
					}
					if (first) {
						ctx.moveTo(curX, curY);
						first = false;
					} else {
						if (matrix) {
							inX = coords[2];
							inY = coords[3];
						} else {
							var handle = segment._handleIn;
							inX = curX + handle._x;
							inY = curY + handle._y;
						}
						if (inX === curX && inY === curY
							&& outX === prevX && outY === prevY) {
							ctx.lineTo(curX, curY);
						} else {
							ctx.bezierCurveTo(outX, outY, inX, inY, curX, curY);
						}
					}
					prevX = curX;
					prevY = curY;
					if (matrix) {
						outX = coords[4];
						outY = coords[5];
					} else {
						var handle = segment._handleOut;
						outX = prevX + handle._x;
						outY = prevY + handle._y;
					}
				}

				for (var i = 0; i < length; i++)
					drawSegment(segments[i]);
				if (path._closed && length > 0)
					drawSegment(segments[0]);
			}

			return {
				_draw: function (ctx, param, viewMatrix, strokeMatrix) {
					var dontStart = param.dontStart,
						dontPaint = param.dontFinish || param.clip,
						hasFill = false,
						hasStroke = false,
						dashArray = [],
						dashLength = !paper.support.nativeDash && hasStroke
							&& dashArray && dashArray.length;

					if (!dontStart)
						ctx.beginPath();

					if (hasFill || hasStroke && !dashLength || dontPaint) {
						drawSegments(ctx, this, strokeMatrix);
						if (this._closed)
							ctx.closePath();
					}

					if (!dontPaint && (hasFill || hasStroke)) {
						this._setStyles(ctx, param, viewMatrix);
					}
				},

				_drawSelected: function (ctx, matrix) {
					ctx.beginPath();
					drawSegments(ctx, this, matrix);
					ctx.stroke();
					drawHandles(ctx, this._segments, matrix, paper.settings.handleSize);
				}
			};
		},
		new function () {
			function getCurrentSegment(that) {
				var segments = that._segments;
				if (!segments.length)
					throw new Error('Use a moveTo() command first');
				return segments[segments.length - 1];
			}

			return {
				moveTo: function () {
					var segments = this._segments;
					if (segments.length === 1)
						this.removeSegment(0);
					if (!segments.length)
						this._add([new Segment(Point.read(arguments))]);
				},

				moveBy: function () {
					throw new Error('moveBy() is unsupported on Path items.');
				},

				lineTo: function () {
					this._add([new Segment(Point.read(arguments))]);
				},

				cubicCurveTo: function () {
					var args = arguments,
						handle1 = Point.read(args),
						handle2 = Point.read(args),
						to = Point.read(args),
						current = getCurrentSegment(this);
					current.setHandleOut(handle1.subtract(current._point));
					this._add([new Segment(to, handle2.subtract(to))]);
				},

				quadraticCurveTo: function () {
					var args = arguments,
						handle = Point.read(args),
						to = Point.read(args),
						current = getCurrentSegment(this)._point;
					this.cubicCurveTo(
						handle.add(current.subtract(handle).multiply(1 / 3)),
						handle.add(to.subtract(handle).multiply(1 / 3)),
						to
					);
				},

				curveTo: function () {
					var args = arguments,
						through = Point.read(args),
						to = Point.read(args),
						t = Base.pick(Base.read(args), 0.5),
						t1 = 1 - t,
						current = getCurrentSegment(this)._point,
						handle = through.subtract(current.multiply(t1 * t1))
							.subtract(to.multiply(t * t)).divide(2 * t * t1);
					if (handle.isNaN())
						throw new Error(
							'Cannot put a curve through points with parameter = ' + t);
					this.quadraticCurveTo(handle, to);
				},

				arcTo: function () {
					var args = arguments,
						abs = Math.abs,
						sqrt = Math.sqrt,
						current = getCurrentSegment(this),
						from = current._point,
						to = Point.read(args),
						through,
						peek = Base.peek(args),
						clockwise = Base.pick(peek, true),
						center, extent, vector, matrix;
					if (typeof clockwise === 'boolean') {
						var middle = from.add(to).divide(2),
							through = middle.add(middle.subtract(from).rotate(
								clockwise ? -90 : 90));
					} else if (Base.remain(args) <= 2) {
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
				},

				lineBy: function () {
					var to = Point.read(arguments),
						current = getCurrentSegment(this)._point;
					this.lineTo(current.add(to));
				},

				curveBy: function () {
					var args = arguments,
						through = Point.read(args),
						to = Point.read(args),
						parameter = Base.read(args),
						current = getCurrentSegment(this)._point;
					this.curveTo(current.add(through), current.add(to), parameter);
				},

				cubicCurveBy: function () {
					var args = arguments,
						handle1 = Point.read(args),
						handle2 = Point.read(args),
						to = Point.read(args),
						current = getCurrentSegment(this)._point;
					this.cubicCurveTo(current.add(handle1), current.add(handle2),
						current.add(to));
				},

				quadraticCurveBy: function () {
					var args = arguments,
						handle = Point.read(args),
						to = Point.read(args),
						current = getCurrentSegment(this)._point;
					this.quadraticCurveTo(current.add(handle), current.add(to));
				},

				arcBy: function () {
					var args = arguments,
						current = getCurrentSegment(this)._point,
						point = current.add(Point.read(args)),
						clockwise = Base.pick(Base.peek(args), true);
					if (typeof clockwise === 'boolean') {
						this.arcTo(point, clockwise);
					} else {
						this.arcTo(point, current.add(Point.read(args)));
					}
				},

				closePath: function (tolerance) {
					this.setClosed(true);
					this.join(this, tolerance);
				}
			};
		}, {

		_getBounds: function (matrix, options) {
			var method = options.handle
				? 'getHandleBounds'
				: options.stroke
					? 'getStrokeBounds'
					: 'getBounds';
			return Path[method](this._segments, this._closed, this, matrix, options);
		},

		statics: {
			getBounds: function (segments, closed, path, matrix, options, strokePadding) {
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
			},

			getStrokeBounds: function (segments, closed, path, matrix, options) {
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
			},

			_getStrokePadding: function (radius, matrix) {
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
			},

			_addBevelJoin: function (segment, join, radius, miterLimit, matrix,
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
			},

			_addSquareCap: function (segment, cap, radius, matrix, strokeMatrix,
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
			},

			getHandleBounds: function (segments, closed, path, matrix, options) {
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
			}
		}
	});

	Path.inject({
		statics: new function () {

			var kappa = 0.5522847498307936,
				ellipseSegments = [
					new Segment([-1, 0], [0, kappa], [0, -kappa]),
					new Segment([0, -1], [-kappa, 0], [kappa, 0]),
					new Segment([1, 0], [0, -kappa], [0, kappa]),
					new Segment([0, 1], [kappa, 0], [-kappa, 0])
				];

			function createPath(segments, closed, args) {
				var props = Base.getNamed(args),
					path = new Path(props && (
						props.insert == true ? Item.INSERT
							: props.insert == false ? Item.NO_INSERT
								: null
					));
				path._add(segments);
				path._closed = closed;
				return path.set(props, Item.INSERT);
			}

			function createEllipse(center, radius, args) {
				var segments = new Array(4);
				for (var i = 0; i < 4; i++) {
					var segment = ellipseSegments[i];
					segments[i] = new Segment(
						segment._point.multiply(radius).add(center),
						segment._handleIn.multiply(radius),
						segment._handleOut.multiply(radius)
					);
				}
				return createPath(segments, true, args);
			}

			return {
				Line: function () {
					var args = arguments;
					return createPath([
						new Segment(Point.readNamed(args, 'from')),
						new Segment(Point.readNamed(args, 'to'))
					], false, args);
				},

				Circle: function () {
					var args = arguments,
						center = Point.readNamed(args, 'center'),
						radius = Base.readNamed(args, 'radius');
					return createEllipse(center, new Size(radius), args);
				},

				Rectangle: function () {
					var args = arguments,
						rect = Rectangle.readNamed(args, 'rectangle'),
						radius = Size.readNamed(args, 'radius', 0,
							{ readNull: true }),
						bl = rect.getBottomLeft(true),
						tl = rect.getTopLeft(true),
						tr = rect.getTopRight(true),
						br = rect.getBottomRight(true),
						segments;
					if (!radius || radius.isZero()) {
						segments = [
							new Segment(bl),
							new Segment(tl),
							new Segment(tr),
							new Segment(br)
						];
					} else {
						radius = Size.min(radius, rect.getSize(true).divide(2));
						var rx = radius.width,
							ry = radius.height,
							hx = rx * kappa,
							hy = ry * kappa;
						segments = [
							new Segment(bl.add(rx, 0), null, [-hx, 0]),
							new Segment(bl.subtract(0, ry), [0, hy]),
							new Segment(tl.add(0, ry), null, [0, -hy]),
							new Segment(tl.add(rx, 0), [-hx, 0], null),
							new Segment(tr.subtract(rx, 0), null, [hx, 0]),
							new Segment(tr.add(0, ry), [0, -hy], null),
							new Segment(br.subtract(0, ry), null, [0, hy]),
							new Segment(br.subtract(rx, 0), [hx, 0])
						];
					}
					return createPath(segments, true, args);
				},

				RoundRectangle: '#Rectangle',

				Ellipse: function () {
					// var args = arguments,
					// 	ellipse = Shape._readEllipse(args);
					// return createEllipse(ellipse.center, ellipse.radius, args);
				},

				Oval: '#Ellipse',

				Arc: function () {
					var args = arguments,
						from = Point.readNamed(args, 'from'),
						through = Point.readNamed(args, 'through'),
						to = Point.readNamed(args, 'to'),
						props = Base.getNamed(args),
						path = new Path(props && props.insert == false
							&& Item.NO_INSERT);
					path.moveTo(from);
					path.arcTo(through, to);
					return path.set(props);
				},

				RegularPolygon: function () {
					var args = arguments,
						center = Point.readNamed(args, 'center'),
						sides = Base.readNamed(args, 'sides'),
						radius = Base.readNamed(args, 'radius'),
						step = 360 / sides,
						three = sides % 3 === 0,
						vector = new Point(0, three ? -radius : radius),
						offset = three ? -1 : 0.5,
						segments = new Array(sides);
					for (var i = 0; i < sides; i++)
						segments[i] = new Segment(center.add(
							vector.rotate((i + offset) * step)));
					return createPath(segments, true, args);
				},

				Star: function () {
					var args = arguments,
						center = Point.readNamed(args, 'center'),
						points = Base.readNamed(args, 'points') * 2,
						radius1 = Base.readNamed(args, 'radius1'),
						radius2 = Base.readNamed(args, 'radius2'),
						step = 360 / points,
						vector = new Point(0, -1),
						segments = new Array(points);
					for (var i = 0; i < points; i++)
						segments[i] = new Segment(center.add(vector.rotate(step * i)
							.multiply(i % 2 ? radius2 : radius1)));
					return createPath(segments, true, args);
				}
			};
		}
	});

	var CompoundPath = PathItem.extend({
		_class: 'CompoundPath',
		_serializeFields: {
			children: []
		},
		beans: true,

		initialize: function CompoundPath(arg) {
			this._children = [];
			this._namedChildren = {};
			if (!this._initialize(arg)) {
				if (typeof arg === 'string') {
					this.setPathData(arg);
				} else {
					this.addChildren(Array.isArray(arg) ? arg : arguments);
				}
			}
		},

		insertChildren: function insertChildren(index, items) {
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
			return insertChildren.base.call(this, index, list);
		},

		reduce: function reduce(options) {
			var children = this._children;
			for (var i = children.length - 1; i >= 0; i--) {
				var path = children[i].reduce(options);
				if (path.isEmpty())
					path.remove();
			}
			if (!children.length) {
				var path = new Path(Item.NO_INSERT);
				path.copyAttributes(this);
				path.insertAbove(this);
				this.remove();
				return path;
			}
			return reduce.base.call(this);
		},

		isClosed: function () {
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++) {
				if (!children[i]._closed)
					return false;
			}
			return true;
		},

		setClosed: function (closed) {
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++) {
				children[i].setClosed(closed);
			}
		},

		getFirstSegment: function () {
			var first = this.getFirstChild();
			return first && first.getFirstSegment();
		},

		getLastSegment: function () {
			var last = this.getLastChild();
			return last && last.getLastSegment();
		},

		getCurves: function () {
			var children = this._children,
				curves = [];
			for (var i = 0, l = children.length; i < l; i++) {
				Base.push(curves, children[i].getCurves());
			}
			return curves;
		},

		getFirstCurve: function () {
			var first = this.getFirstChild();
			return first && first.getFirstCurve();
		},

		getLastCurve: function () {
			var last = this.getLastChild();
			return last && last.getLastCurve();
		},

		getArea: function () {
			var children = this._children,
				area = 0;
			for (var i = 0, l = children.length; i < l; i++)
				area += children[i].getArea();
			return area;
		},

		getLength: function () {
			var children = this._children,
				length = 0;
			for (var i = 0, l = children.length; i < l; i++)
				length += children[i].getLength();
			return length;
		},

		getPathData: function (_matrix, _precision) {
			var children = this._children,
				paths = [];
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i],
					mx = child._matrix;
				paths.push(child.getPathData(_matrix && !mx.isIdentity()
					? _matrix.appended(mx) : _matrix, _precision));
			}
			return paths.join('');
		},

		_hitTestChildren: function _hitTestChildren(point, options, viewMatrix) {
			return _hitTestChildren.base.call(this, point,
				options.class === Path || options.type === 'path' ? options
					: Base.set({}, options, { fill: false }),
				viewMatrix);
		},

		_draw: function (ctx, param, viewMatrix, strokeMatrix) {
			var children = this._children;
			if (!children.length)
				return;

			param = param.extend({ dontStart: true, dontFinish: true });
			ctx.beginPath();
			for (var i = 0, l = children.length; i < l; i++)
				children[i].draw(ctx, param, strokeMatrix);

			if (!param.clip) {
				this._setStyles(ctx, param, viewMatrix);
			}
		},

		_drawSelected: function (ctx, matrix, selectionItems) {
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i],
					mx = child._matrix;
				if (!selectionItems[child._id]) {
					child._drawSelected(ctx, mx.isIdentity() ? matrix
						: matrix.appended(mx));
				}
			}
		}
	},
		new function () {
			function getCurrentPath(that, check) {
				var children = that._children;
				if (check && !children.length)
					throw new Error('Use a moveTo() command first');
				return children[children.length - 1];
			}

			return Base.each(['lineTo', 'cubicCurveTo', 'quadraticCurveTo', 'curveTo',
				'arcTo', 'lineBy', 'cubicCurveBy', 'quadraticCurveBy', 'curveBy',
				'arcBy'],
				function (key) {
					this[key] = function () {
						var path = getCurrentPath(this, true);
						path[key].apply(path, arguments);
					};
				}, {
				moveTo: function () {
					var current = getCurrentPath(this),
						path = current && current.isEmpty() ? current
							: new Path(Item.NO_INSERT);
					if (path !== current)
						this.addChild(path);
					path.moveTo.apply(path, arguments);
				},

				moveBy: function () {
					var current = getCurrentPath(this, true),
						last = current && current.getLastSegment(),
						point = Point.read(arguments);
					this.moveTo(last ? point.add(last._point) : point);
				},

				closePath: function (tolerance) {
					getCurrentPath(this, true).closePath(tolerance);
				}
			}
			);
		}, Base.each(['reverse', 'flatten', 'simplify', 'smooth'], function (key) {
			this[key] = function (param) {
				var children = this._children,
					res;
				for (var i = 0, l = children.length; i < l; i++) {
					res = children[i][key](param) || res;
				}
				return res;
			};
		}, {}));

	PathItem.inject(new function () {
		var min = Math.min,
			max = Math.max,
			abs = Math.abs,
			operators = {
				unite: { '1': true, '2': true },
				intersect: { '2': true },
				subtract: { '1': true },
				exclude: { '1': true, '-1': true }
			};

		function getPaths(path) {
			return path._children || [path];
		}

		function preparePath(path, resolve) {
			var res = path
				.clone(false)
				.reduce({ simplify: true })
				.transform(null, true, true);
			if (resolve) {
				var paths = getPaths(res);
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
		}

		function createResult(paths, simplify, path1, path2, options) {
			var result = new CompoundPath(Item.NO_INSERT);
			result.addChildren(paths, true);
			result = result.reduce({ simplify: simplify });
			if (!(options && options.insert == false)) {
				result.insertAbove(path2 && path1.isSibling(path2)
					&& path1.getIndex() < path2.getIndex() ? path2 : path1);
			}
			result.copyAttributes(path1, true);
			return result;
		}

		function filterIntersection(inter) {
			return inter.hasOverlap() || inter.isCrossing();
		}

		function traceBoolean(path1, path2, operation, options) {
			if (options && (options.trace == false || options.stroke) &&
				/^(subtract|intersect)$/.test(operation))
				return splitBoolean(path1, path2, operation);
			var _path1 = preparePath(path1, true),
				_path2 = path2 && path1 !== path2 && preparePath(path2, true),
				operator = operators[operation];
			operator[operation] = true;
			if (_path2 && (operator.subtract || operator.exclude)
				^ (_path2.isClockwise() ^ _path1.isClockwise()))
				_path2.reverse();
			var crossings = divideLocations(CurveLocation.expand(
				_path1.getIntersections(_path2, filterIntersection))),
				paths1 = getPaths(_path1),
				paths2 = _path2 && getPaths(_path2),
				segments = [],
				curves = [],
				paths;

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
					propagateWinding(crossings[i]._segment, _path1, _path2,
						curveCollisionsMap, operator);
				}
				for (var i = 0, l = segments.length; i < l; i++) {
					var segment = segments[i],
						inter = segment._intersection;
					if (!segment._winding) {
						propagateWinding(segment, _path1, _path2,
							curveCollisionsMap, operator);
					}
					if (!(inter && inter._overlap))
						segment._path._overlapsOnly = false;
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

		function splitBoolean(path1, path2, operation) {
			var _path1 = preparePath(path1),
				_path2 = preparePath(path2),
				crossings = _path1.getIntersections(_path2, filterIntersection),
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
			return createResult(paths, false, path1, path2);
		}

		function linkIntersections(from, to) {
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
		}

		function clearCurveHandles(curves) {
			for (var i = curves.length - 1; i >= 0; i--)
				curves[i].clearHandles();
		}

		function reorientPaths(paths, isInside, clockwise) {
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
						return abs(b.getArea()) - abs(a.getArea());
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
		}

		function divideLocations(locations, include, clearLater) {
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
					linkIntersections(inter, dest);
					var other = inter;
					while (other) {
						linkIntersections(other._intersection, inter);
						other = other._next;
					}
				} else {
					segment._intersection = dest;
				}
			}
			if (!clearLater)
				clearCurveHandles(clearCurves);
			return results || locations;
		}

		function getWinding(point, curves, dir, closed, dontFlip) {
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
				if (po < min(o0, o3) || po > max(o0, o3)) {
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
						: paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3)
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
					&& getWinding(point, curves, !dir, closed, true);
			}

			function handleCurve(v) {
				var o0 = v[io + 0],
					o1 = v[io + 2],
					o2 = v[io + 4],
					o3 = v[io + 6];
				if (po <= max(o0, o1, o2, o3) && po >= min(o0, o1, o2, o3)) {
					var a0 = v[ia + 0],
						a1 = v[ia + 2],
						a2 = v[ia + 4],
						a3 = v[ia + 6],
						monoCurves = paL > max(a0, a1, a2, a3) ||
							paR < min(a0, a1, a2, a3)
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
			windingL = abs(windingL);
			windingR = abs(windingR);
			return {
				winding: max(windingL, windingR),
				windingL: windingL,
				windingR: windingR,
				quality: quality,
				onPath: onAnyPath
			};
		}

		function propagateWinding(segment, path1, path2, curveCollisionsMap,
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
							dir = abs(curve.getTangentAtTime(t).y) < Math.SQRT1_2;
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
						wind = wind || getWinding(
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
		}

		function tracePaths(segments, operator) {
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
						path = new Path(Item.NO_INSERT);
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
		}

		return {
			_getWinding: function (point, dir, closed) {
				return getWinding(point, this.getCurves(), dir, closed);
			},

			unite: function (path, options) {
				return traceBoolean(this, path, 'unite', options);
			},

			intersect: function (path, options) {
				return traceBoolean(this, path, 'intersect', options);
			},

			subtract: function (path, options) {
				return traceBoolean(this, path, 'subtract', options);
			},

			exclude: function (path, options) {
				return traceBoolean(this, path, 'exclude', options);
			},

			divide: function (path, options) {
				return options && (options.trace == false || options.stroke)
					? splitBoolean(this, path, 'divide')
					: createResult([
						this.subtract(path, options),
						this.intersect(path, options)
					], true, this, path, options);
			},

			resolveCrossings: function () {
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
					item = new CompoundPath(Item.NO_INSERT);
					item.addChildren(paths);
					item = item.reduce();
					item.copyAttributes(this);
					this.replaceWith(item);
				}
				return item;
			},

			reorient: function (nonZero, clockwise) {
				var children = this._children;
				if (children && children.length) {
					this.setChildren(reorientPaths(this.removeChildren(),
						function (w) {
							return !!(nonZero ? w : w & 1);
						},
						clockwise));
				} else if (clockwise !== undefined) {
					this.setClockwise(clockwise);
				}
				return this;
			},

			getInteriorPoint: function () {
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
						if (y >= min(o0, o1, o2, o3) && y <= max(o0, o1, o2, o3)) {
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
			}
		};
	});

	var PathFlattener = Base.extend({
		_class: 'PathFlattener',

		initialize: function (path, flatness, maxRecursion, ignoreStraight, matrix) {
			var curves = [],
				parts = [],
				length = 0,
				minSpan = 1 / (maxRecursion || 32),
				segments = path._segments,
				segment1 = segments[0],
				segment2;

			function addCurve(segment1, segment2) {
				var curve = Curve.getValues(segment1, segment2, matrix);
				curves.push(curve);
				computeParts(curve, segment1._index, 0, 1);
			}

			function computeParts(curve, index, t1, t2) {
				if ((t2 - t1) > minSpan
					&& !(ignoreStraight && Curve.isStraight(curve))
					&& !Curve.isFlatEnough(curve, flatness || 0.25)) {
					var halves = Curve.subdivide(curve, 0.5),
						tMid = (t1 + t2) / 2;
					computeParts(halves[0], index, t1, tMid);
					computeParts(halves[1], index, tMid, t2);
				} else {
					var dx = curve[6] - curve[0],
						dy = curve[7] - curve[1],
						dist = Math.sqrt(dx * dx + dy * dy);
					if (dist > 0) {
						length += dist;
						parts.push({
							offset: length,
							curve: curve,
							index: index,
							time: t2,
						});
					}
				}
			}

			for (var i = 1, l = segments.length; i < l; i++) {
				segment2 = segments[i];
				addCurve(segment1, segment2);
				segment1 = segment2;
			}
			if (path._closed)
				addCurve(segment2 || segment1, segments[0]);
			this.curves = curves;
			this.parts = parts;
			this.length = length;
			this.index = 0;
		},

		_get: function (offset) {
			var parts = this.parts,
				length = parts.length,
				start,
				i, j = this.index;
			for (; ;) {
				i = j;
				if (!j || parts[--j].offset < offset)
					break;
			}
			for (; i < length; i++) {
				var part = parts[i];
				if (part.offset >= offset) {
					this.index = i;
					var prev = parts[i - 1],
						prevTime = prev && prev.index === part.index ? prev.time : 0,
						prevOffset = prev ? prev.offset : 0;
					return {
						index: part.index,
						time: prevTime + (part.time - prevTime)
							* (offset - prevOffset) / (part.offset - prevOffset)
					};
				}
			}
			return {
				index: parts[length - 1].index,
				time: 1
			};
		},

		drawPart: function (ctx, from, to) {
			var start = this._get(from),
				end = this._get(to);
			for (var i = start.index, l = end.index; i <= l; i++) {
				var curve = Curve.getPart(this.curves[i],
					i === start.index ? start.time : 0,
					i === end.index ? end.time : 1);
				if (i === start.index)
					ctx.moveTo(curve[0], curve[1]);
				ctx.bezierCurveTo.apply(ctx, curve.slice(2));
			}
		}
	}, Base.each(Curve._evaluateMethods,
		function (name) {
			this[name + 'At'] = function (offset) {
				var param = this._get(offset);
				return Curve[name](this.curves[param.index], param.time);
			};
		}, {})
	);

	var PathFitter = Base.extend({
		initialize: function (path) {
			var points = this.points = [],
				segments = path._segments,
				closed = path._closed;
			for (var i = 0, prev, l = segments.length; i < l; i++) {
				var point = segments[i].point;
				if (!prev || !prev.equals(point)) {
					points.push(prev = point.clone());
				}
			}
			if (closed) {
				points.unshift(points[points.length - 1]);
				points.push(points[1]);
			}
			this.closed = closed;
		},

		fit: function (error) {
			var points = this.points,
				length = points.length,
				segments = null;
			if (length > 0) {
				segments = [new Segment(points[0])];
				if (length > 1) {
					this.fitCubic(segments, error, 0, length - 1,
						points[1].subtract(points[0]),
						points[length - 2].subtract(points[length - 1]));
					if (this.closed) {
						segments.shift();
						segments.pop();
					}
				}
			}
			return segments;
		},

		fitCubic: function (segments, error, first, last, tan1, tan2) {
			var points = this.points;
			if (last - first === 1) {
				var pt1 = points[first],
					pt2 = points[last],
					dist = pt1.getDistance(pt2) / 3;
				this.addCurve(segments, [pt1, pt1.add(tan1.normalize(dist)),
					pt2.add(tan2.normalize(dist)), pt2]);
				return;
			}
			var uPrime = this.chordLengthParameterize(first, last),
				maxError = Math.max(error, error * error),
				split,
				parametersInOrder = true;
			for (var i = 0; i <= 4; i++) {
				var curve = this.generateBezier(first, last, uPrime, tan1, tan2);
				var max = this.findMaxError(first, last, curve, uPrime);
				if (max.error < error && parametersInOrder) {
					this.addCurve(segments, curve);
					return;
				}
				split = max.index;
				if (max.error >= maxError)
					break;
				parametersInOrder = this.reparameterize(first, last, uPrime, curve);
				maxError = max.error;
			}
			var tanCenter = points[split - 1].subtract(points[split + 1]);
			this.fitCubic(segments, error, first, split, tan1, tanCenter);
			this.fitCubic(segments, error, split, last, tanCenter.negate(), tan2);
		},

		addCurve: function (segments, curve) {
			var prev = segments[segments.length - 1];
			prev.setHandleOut(curve[1].subtract(curve[0]));
			segments.push(new Segment(curve[3], curve[2].subtract(curve[3])));
		},

		generateBezier: function (first, last, uPrime, tan1, tan2) {
			var epsilon = 1e-12,
				abs = Math.abs,
				points = this.points,
				pt1 = points[first],
				pt2 = points[last],
				C = [[0, 0], [0, 0]],
				X = [0, 0];

			for (var i = 0, l = last - first + 1; i < l; i++) {
				var u = uPrime[i],
					t = 1 - u,
					b = 3 * u * t,
					b0 = t * t * t,
					b1 = b * t,
					b2 = b * u,
					b3 = u * u * u,
					a1 = tan1.normalize(b1),
					a2 = tan2.normalize(b2),
					tmp = points[first + i]
						.subtract(pt1.multiply(b0 + b1))
						.subtract(pt2.multiply(b2 + b3));
				C[0][0] += a1.dot(a1);
				C[0][1] += a1.dot(a2);
				C[1][0] = C[0][1];
				C[1][1] += a2.dot(a2);
				X[0] += a1.dot(tmp);
				X[1] += a2.dot(tmp);
			}

			var detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1],
				alpha1,
				alpha2;
			if (abs(detC0C1) > epsilon) {
				var detC0X = C[0][0] * X[1] - C[1][0] * X[0],
					detXC1 = X[0] * C[1][1] - X[1] * C[0][1];
				alpha1 = detXC1 / detC0C1;
				alpha2 = detC0X / detC0C1;
			} else {
				var c0 = C[0][0] + C[0][1],
					c1 = C[1][0] + C[1][1];
				alpha1 = alpha2 = abs(c0) > epsilon ? X[0] / c0
					: abs(c1) > epsilon ? X[1] / c1
						: 0;
			}

			var segLength = pt2.getDistance(pt1),
				eps = epsilon * segLength,
				handle1,
				handle2;
			if (alpha1 < eps || alpha2 < eps) {
				alpha1 = alpha2 = segLength / 3;
			} else {
				var line = pt2.subtract(pt1);
				handle1 = tan1.normalize(alpha1);
				handle2 = tan2.normalize(alpha2);
				if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
					alpha1 = alpha2 = segLength / 3;
					handle1 = handle2 = null;
				}
			}

			return [pt1,
				pt1.add(handle1 || tan1.normalize(alpha1)),
				pt2.add(handle2 || tan2.normalize(alpha2)),
				pt2];
		},

		reparameterize: function (first, last, u, curve) {
			for (var i = first; i <= last; i++) {
				u[i - first] = this.findRoot(curve, this.points[i], u[i - first]);
			}
			for (var i = 1, l = u.length; i < l; i++) {
				if (u[i] <= u[i - 1])
					return false;
			}
			return true;
		},

		findRoot: function (curve, point, u) {
			var curve1 = [],
				curve2 = [];
			for (var i = 0; i <= 2; i++) {
				curve1[i] = curve[i + 1].subtract(curve[i]).multiply(3);
			}
			for (var i = 0; i <= 1; i++) {
				curve2[i] = curve1[i + 1].subtract(curve1[i]).multiply(2);
			}
			var pt = this.evaluate(3, curve, u),
				pt1 = this.evaluate(2, curve1, u),
				pt2 = this.evaluate(1, curve2, u),
				diff = pt.subtract(point),
				df = pt1.dot(pt1) + diff.dot(pt2);
			return Numerical.isMachineZero(df) ? u : u - diff.dot(pt1) / df;
		},

		evaluate: function (degree, curve, t) {
			var tmp = curve.slice();
			for (var i = 1; i <= degree; i++) {
				for (var j = 0; j <= degree - i; j++) {
					tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
				}
			}
			return tmp[0];
		},

		chordLengthParameterize: function (first, last) {
			var u = [0];
			for (var i = first + 1; i <= last; i++) {
				u[i - first] = u[i - first - 1]
					+ this.points[i].getDistance(this.points[i - 1]);
			}
			for (var i = 1, m = last - first; i <= m; i++) {
				u[i] /= u[m];
			}
			return u;
		},

		findMaxError: function (first, last, curve, u) {
			var index = Math.floor((last - first + 1) / 2),
				maxDist = 0;
			for (var i = first + 1; i < last; i++) {
				var P = this.evaluate(3, curve, u[i - first]);
				var v = P.subtract(this.points[i]);
				var dist = v.x * v.x + v.y * v.y;
				if (dist >= maxDist) {
					maxDist = dist;
					index = i;
				}
			}
			return {
				error: maxDist,
				index: index
			};
		}
	});

	var paper = new (PaperScope.inject(Base.exports, {
		Base: Base,
		Item: Item,
		Numerical: Numerical,
		document: document,
		window: window,
	}))();

	window.PathBoolean = {
		Base,
		Emitter, Formatter,
		CollisionDetection, Numerical, UID,
		Point, LinkedPoint,
		Rectangle, LinkedRectangle,
		Matrix, Line, Item, Group,
		Layer,
		Segment, SegmentPoint,
		Curve, CurveLocation,
		Path, PathItem,
		CompoundPath, PathFitter, PathFlattener
	}

	return paper;
}.call(this, typeof self === 'object' ? self : null);

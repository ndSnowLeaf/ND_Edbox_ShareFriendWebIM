define([
	'require',
	'jlang',
	'jquery'
],function(
	require,
	jlang,
	$
){
	function toArray(){
		var result = [];
		for(var i=0;i<arguments.length;i++){
			var item = arguments[i];
			if($.isArray(item)){
				result.push.apply(result,item);
			}else if(item!==undefined){
				result.push(item);
			}
		}
		return result;
	}

	function rejectError(msg){
		throw msg;
	}

	function Bundle(manifest){
		this.name=manifest.name;
		this.requires=toArray(manifest.requires);
		this.state=0;
		var activator=manifest.activator;
		if(!activator){
			activator={start:$.noop,stop:$.noop};
		}else if($.isFunction(activator)){
			activator={start:activator,stop:$.noop};
		}else{
			activator={start:activator.start||$.noop,stop:activator.stop||$.noop};
		}
		this.activator=activator;
		this.extensionPoints=toArray(manifest.extensionPoints);
		this.extensions=manifest.extensions;
	}

	function BundleContext(){
		this._services={};
	}
	BundleContext.prototype.registerService=function(name,obj){
		this._services[name]=obj;
	};
	BundleContext.prototype.getService=function(name){
		var obj = this._services[name];
		if(!obj){
			rejectError('no service with name:'+name);
		}
		return obj;
	};

	function Platform(){
		var bundleManifests = [],bundles = [],bundleMap = {};

		var eventManager = jlang.EventManager(['ready']);
		var events = {
			ready : []
		};
		var _platform = this;

		this.ready = function(callback){
			eventManager.on('ready',callback);
		};

		var bundleContext = new BundleContext();

		function getBundlePath(name){
			return 'bundles/'+name+'/bundle.js';
		}
		function getBundleManifest(name){
			for(var i=0;i<bundleManifests.length;i++){
				if(bundleManifests[i].name==name){
					return bundleManifests[i];
				}
			}
		}

		function installBundle(name){
			if(!name) return;
			if(getBundleManifest(name)) return;
			require([getBundlePath(name)],function(manifest){
				if(!manifest) return;
				if(getBundleManifest(name)) return;
				if($.isFunction(manifest)){
					manifest= new manifest();
				}
				manifest.name=name;
				bundleManifests.push(manifest);
				var bundle = new Bundle(manifest);
				bundles.push(bundle);
				bundleMap[bundle.name]=bundle;
				startAllBundle();
				for(var i=0;i<bundle.requires.length;i++){
					installBundle(bundle.requires[i]);
				}
			});
		}

		function getBundle(name){
			return bundleMap[name];
		}

		function startAllBundle(){
			for(var i=0;i<bundles.length;i++){
				var bundle = bundles[i];
				if(startBundle(bundle)===true){
					startAllBundle();
					break;
				}
			}
		}
		function startBundle(bundle){
			if(bundle.state==1) return;
			var resolved=true;
			for(var i=0;i<bundle.requires.length;i++){
				var name = bundle.requires[i],
					requireBundle=getBundle(name);
				if(!requireBundle || requireBundle.state == 0){
					resolved=false;
					break;
				}
			}
			if(resolved){
				bundle.state=1;
				bundle.activator.start(bundleContext);
				var extensions=bundle.extensions;
				if($.isFunction(extensions)){
					extensions=extensions(bundleContext);
				}
				extensions=toArray(extensions);
				for(var i=0;i<extensions.length;i++){
					var extension=extensions[i];
					if($.isFunction(extension)){
						extension=extension(bundleContext);
					}
					extension.bundle=bundle.name;
					processExtension(extension);
				}
				processWaitingExtensions(bundle);
				checkBootstrap();
				return true;
			}
		}

		var waitingExtensions={};
		function processExtension(extension){
			var targetBundle = getBundle(extension.targetBundle || extension.bundle);
			if(!targetBundle) return;
			if(targetBundle.state==1){
				processExtensionPoint(targetBundle,extension);
			}else{
				var e = waitingExtensions[extension.targetBundle];
				if(!e) e = waitingExtensions[extension.targetBundle] = [];
				e.push(extension);
			}
		}
		function processWaitingExtensions(bundle){
			var extensions = waitingExtensions[bundle.name];
			if(extensions && extensions.length){
				for(var i=0;i<extensions.length;i++){
					processExtensionPoint(bundle,extensions[i]);
				}
			}
			delete waitingExtensions[bundle.name];
		}
		function processExtensionPoint(bundle,extension){
			var extensionPoints = bundle.extensionPoints;
			for(var i=0;i<extensionPoints.length;i++){
				var ep = extensionPoints[i];
				if(ep.point === extension.point){
					(ep.resolve||$.noop)(extension.config);
				}
			}
		}
		var mainBundleNames = [],
			bootstrap = false,
			started = false;
		function checkBootstrap(b){
			if(started) return;
			if(b===true){
				bootstrap = b;
			}
			if(!bootstrap) return;
			var ready = true;
			for(var i=0;i<mainBundleNames.length;i++){
				var bundle = getBundle(mainBundleNames[i]);
				if(!bundle || bundle.state!=1){
					ready = false;
					break;
				}
			}
			if(ready){
				started = true;
				eventManager.trigger('ready',bundleContext);
			}
		}
		this.console={
			install:function(bundleName){
				var names = toArray.apply(null,arguments);
				for(var i=0;i<names.length;i++){
					var name = names[i];
					mainBundleNames.push(name);
					installBundle(name);
				}
			},
			bootstrap:function(callback){
				_platform.ready(callback);
				checkBootstrap(true);
			},
			exit:function(){

			}
		};
	}

	return Platform;
});
define(["./workbench","./ToolbarView/view"],function(Workbench,ToolbarView){var workbench;return function(){return{activator:function(bundleContext){workbench=new Workbench,bundleContext.registerService("workbench",workbench),toolbarView=new ToolbarView(bundleContext)},extensionPoints:[{point:"event",resolve:function(config){workbench.on(config)}},{point:"action",resolve:function(config){workbench.registerAction(config)}},{point:"perspective",resolve:function(config){workbench.registerPerspective(config)}},{point:"view",resolve:function(config){workbench.registerView(config)}},{point:"editor",resolve:function(config){workbench.registerEditor(config)}},{point:"dialog",resolve:function(config){workbench.registerDialog(config)}},{point:"toolbar",resolve:function(config){toolbarView.registerButton(config)}}],extensions:function(bundleContext){return[{point:"action",config:function(workbench){return[{name:"save",handle:function(){console.log("execute action: save"),workbench.saveAll()}}]}},{point:"view",config:[toolbarView]},{point:"toolbar",config:[{label:"Save",icon:"save.png",action:"save"}]}]}}}});
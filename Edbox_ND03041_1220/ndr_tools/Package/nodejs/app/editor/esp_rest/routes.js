var site=require("./controllers_old/site"),questions=require("./controller/questions"),assets=require("./controllers_old/assets"),assetsV2=require("./controller/assets"),multer=require("multer"),upload=multer({dest:__dirname+"/temp"}),coursewareobject=require("./controller/coursewareobject"),coursewareObjectTemplate=require("./controller/CoursewareObjectTemplate"),tools=require("./controller/tools");module.exports=function(e){e.all("/",site.index),e.get("/v1.3/questions/:id",coursewareobject.get),e.get("/v1.3/questions/:id/item",questions.getItem),e.put("/v1.3/questions/:id/item",questions.saveItem),e.get("/v1.3/questions/:id/qtiplayer",questions.qtiplayer),e.get("/v1.3/assets",assets.search),e.get("/v1.3/assets/get",assets.get),e.get("/v1.3/assets/proxy",assets.proxy),e.get("/v1.3/assets/proxy2",assets.proxy2),e.get("/v1.3/assets/proxy3/:base/*",assets.proxy3),e.post("/v1.3/assets/actions/upload",upload.single("file"),assets.upload),e.get("/v2.0/assets",assetsV2.search),e.get("/v2.0/assets/get",assetsV2.get),e.get("/v2.0/assets/proxy3/:base/*",assetsV2.proxy3),e.post("/v2.0/assets/actions/upload",upload.single("file"),assetsV2.upload),e.get("/v2.0/courseware_objects/:id",coursewareobject.get),e.get("/v2.0/courseware_objects/:id/main",coursewareobject.getMain),e.get("/v2.0/courseware_objects/:id/pages/:pageId",coursewareobject.getPage),e.get("/v2.0/courseware_objects/:id/resource_files",coursewareobject.searchResourceFiles),e.post("/v2.0/courseware_objects",coursewareobject.create),e.post("/v2.0/courseware_objects/actions/from_template",coursewareobject.createFromTemplate),e.post("/v2.0/courseware_objects/:id/pages",coursewareobject.createPage),e.post("/v2.0/courseware_objects/:id/resource_files/actions/upload",coursewareobject.uploadResourceFile),e.post("/v2.0/courseware_objects/:id/actions/copy",coursewareobject.copy),e.put("/v2.0/courseware_objects/:id/main",coursewareobject.updateMain),e.put("/v2.0/courseware_objects/:id/pages/:pageId",coursewareobject.updatePage),e.get("/v0.1/public/templates",coursewareObjectTemplate.templates),e.get("/v0.1/public/template",coursewareObjectTemplate.template),e.post("/v0.1/pptpackage",tools.pptpackage),e.post("/v0.1/pptpackageex",tools.pptpackageex),e.post("/v0.1/generation/question",tools.generation),e.post("/v0.1/synchrony/question",tools.sync),e.post("/v0.1/copy/question",tools.copy),e.post("/v0.1/tools/merge_questions",tools.merge_questions),e.post("/v0.1/tools/download_and_copy",tools.download_and_copy)};
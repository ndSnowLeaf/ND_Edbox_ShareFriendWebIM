var interaction=require("./extensions/controllers"),assets=require("./extensions/assets");module.exports=function(e){e.post("/v0.1/interaction/:module_type",interaction.create),e.get("/v0.1/interaction/:module_type/:module_instance_id",interaction.get),e.put("/v0.1/interaction/:module_type/:module_instance_id",interaction.modify),e.put("/v0.2/subject_tool/:module_type/:module_instance_id",interaction.modifySubjectTool),e.post("/v0.1/dynamic_create_question",interaction.dynamicCreateQuestion),e.get("/v0.1/module/measure_gravity/user_guide",interaction.moduleMeasureGravityUserGuide),e.post("/v0.1/archives/:file_name",assets.saveAchiveFile),e.get("/v0.1/archives/:file_name",assets.loadAchiveFile),e.get("/v3.0/speechSynthesis",assets.speechSynthesis),e.post("/v3.0/speechSynthesis_en",assets.speechSynthesisV2),e.post("/v3.0/assets/cs/download",assets.downloadFromCS),e.post("/v3.0/voiceRecord/start",assets.startVoiceRecord),e.post("/v3.0/voiceRecord/stop",assets.stopVoiceRecord),e.get("/v3.0/voiceRecord/volumn",assets.getVoiceVolumn),e.post("/v3.0/wordCard/download",assets.downloadWordCardResource)};
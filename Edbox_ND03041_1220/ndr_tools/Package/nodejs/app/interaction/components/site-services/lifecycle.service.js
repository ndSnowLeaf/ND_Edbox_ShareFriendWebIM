define(["angularAMD"],function(e){"use strict";e.service("LifecycleService",["RestAngularLifecycle","$stateParams","$filter",function(e,r,c){return{getResourceTechInfo:function(r){return e("v0.6").one("assets").one(r+"?include=TI").get()},getWordsResourceByChapterId:function(r){return e("v0.6").one("assets").one("list?include=TI,LC&rid=ad7e5fb6-ca4c-4016-ac09-b28b0574eb86&rid=89632d66-51f4-4c62-ba02-67fcff12452e&rid=850eddf5-7f09-4309-bdef-8cd35096439f&rid=857d955e-3683-428e-a46f-d5c27ac5e70a&rid=0fce38c0-5729-4c31-8435-a1f94b6667c7&rid=81db230e-d448-40fb-ac4f-61067e21b574&rid=42b26b43-e33c-422e-8691-642673549340&rid=064c7d3e-5d02-47d5-a82e-f343075039f0&rid=850f96ad-dd5b-4e12-a4fe-e4b860db6fd6&rid=8f62e53d-e90e-4689-a03c-b92efc3df7a1").get()},getEnglishVocabularyCards:function(r,c,n){if(n=n||"(0, 200)",r){var a="search?include=TI,EDU,LC,CG&limit="+n+"&&relation=chapters/"+r+"/wq";return e("v0.6").one("vocabularies").one("actions").one(a).get()}if(c){var a="search?include=TI,EDU,LC,CG&limit="+n+"&words="+c+"&";return e("v0.6").one("vocabularies").one("actions").one(a).get()}return!1},getChineseVocabularyCards:function(r,c,n,a){var i=["query?include=TI,LC,EDU,CG,CR&coverage=RSD/workspace/ASSEMBLE&words=",c,"&limit=(",n,",",a,")&category=$RT0301"],d=i.join("");return e("v0.6").one("coursewareobjects").one("actions").one(d).get()}}}])});
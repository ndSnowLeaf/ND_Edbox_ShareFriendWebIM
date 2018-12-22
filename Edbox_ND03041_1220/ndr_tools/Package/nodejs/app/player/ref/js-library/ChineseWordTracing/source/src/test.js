/**
 * Created by Administrator on 2016/12/16.
 */
var myWord;
$.get("./json/zhuang.json", function (data) {
    myWord = new ChineseWordTracing({
        mode:'display',
        word:data,
        renderTo:document.querySelector('#word')
    });

    bindEvent();
});



function bindEvent() {
    if(typeof myWord != "object") return;

    $(".control").on("click", ".btn", function() {
        var index = $(this).index();

        switch (index) {
            case 0:
                myWord.showRadical();
                break;
            case 1:
                myWord.hideRadical();
                break;
            case 2:
                myWord.showStructure();
                break;
            case 3:
                myWord.hideStructure();
                break;
            case 4:
                myWord.startAutoTrace().done(function(info) {
                    console.log("全部描完了：", info)
                });
                break;
            case 5:
                myWord.stopAutoTrace();
                break;
            case 6:
                myWord.setSpeed("fast");
                break;
            case 7:
                myWord.setSpeed("normal");
                break;
            case 8:
                myWord.setSpeed("slow");
                break;
            case 9:
                myWord.reset();
                break;
            case 10:
                myWord.startSingleStepTrace();
                break;
            case 11:
                myWord.nextStep().done(function(info) {
                    console.log("下一笔的info:", info);
                });
                break;
            case 12:
                var info =  myWord.preStep();
                console.log("上一笔的info:", info);
                break;

        }
    });
}


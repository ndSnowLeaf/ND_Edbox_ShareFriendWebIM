BasicLauncher.simpleGetEnvironment = function () {
    if (this.isPPTShell || this.currentRuntime == icCreatePlayer.RUNTIME.WEB) {
        return BasicLauncher.simpleGetEnvironment.ENV.PPTShell;
    } else if (this.currentRuntime == icCreatePlayer.RUNTIME.STUDENT_MOBILE) {
        return BasicLauncher.simpleGetEnvironment.ENV.Pad;
    }
};
BasicLauncher.simpleGetEnvironment.ENV = {
    PPTShell: 'ppt',
    Pad: 'pad'
};
BasicLauncher.config = {
    'global': {
        //只包含四个流程
        'simple': {
            'controller': ['interactionStateRecoverFilter',
                'i18nFilter',
                'answerFlowController', {
                    ref: 'timerController',
                    value: {isPauseOnSubmit: false}
                }, {
                    ref: 'objectiveStatController',
                    applyTo: [BasicLauncher.simpleGetEnvironment.ENV.PPTShell]
                }, {
                    ref: 'answerProgressController',
                    applyTo: [BasicLauncher.simpleGetEnvironment.ENV.Pad]
                }]
        },
        //标准流程
        'standard': {
            'mainContainer': 'CenterPanel',
            'layout': 'objectiveInteractionLayout',
            'controller': ['interactionStateRecoverFilter', 'i18nFilter', 'answerFlowController', {
                ref: 'timerController',
                value: {isPauseOnSubmit: false}
            }, {
                ref: 'objectiveStatController',
                applyTo: [BasicLauncher.simpleGetEnvironment.ENV.PPTShell]
            }, {
                ref: 'answerProgressController',
                applyTo: [BasicLauncher.simpleGetEnvironment.ENV.Pad]
            }],
            'getEnvironment': BasicLauncher.simpleGetEnvironment,
            'component': [{
                ref: 'interactionSubmitButton',
                renderTo: (function () {
                    var o = {};
                    o[BasicLauncher.simpleGetEnvironment.ENV.PPTShell] = 'BottomPanel';
                    o[BasicLauncher.simpleGetEnvironment.ENV.Pad] = 'TopRightPanel';
                    return o;
                })(),
                value: {'view_type': 'new_em_button'}
            }, {
                ref: 'objectiveStatisticsRemake',
                renderTo: 'StatisticsPanel',
                applyTo: [BasicLauncher.simpleGetEnvironment.ENV.PPTShell]
            }, {ref: 'interactionTimer', renderTo: "TopLeftPanel", value: {view_type: 'new_timer'}}]
        }
    },
    'controller': {
        //答题流程
        'answerFlowController': {
            presenter: "AnswerFlowController",
            depends: {"timerService": "timerController"}
        },
        //时间流程
        'timerController': {presenter: 'TimerController', autowired: ['timer_type', 'time_limit', 'isPauseOnSubmit']},
        //状态恢复流程
        'interactionStateRecoverFilter': {
            presenter: "InteractionStateRecoverFilter"
        },
        //客观题统计
        'objectiveStatController': {
            presenter: 'ObjectiveStatController'
        },
        //作答进度
        'answerProgressController': {
            presenter: 'AnswerProgressController'
        },
        'i18nFilter': {
            presenter: 'I18nFilter'
        }
    },
    'layout': {'objectiveInteractionLayout': {presenter: 'ObjectiveInteractionLayout', autowired: ['questionType']}},
    'component': {
        'interactionSubmitButton': {
            presenter: 'InteractionSubmitButton',
            autowired: ['can_modify', 'linkQuestionType', 'linkQuestionId', 'view_type']
        },
        'objectiveStatisticsRemake': {
            presenter: 'ObjectiveStatisticsRemake'
        }, 'interactionTimer': {presenter: 'InteractionTimer'}
    }
};
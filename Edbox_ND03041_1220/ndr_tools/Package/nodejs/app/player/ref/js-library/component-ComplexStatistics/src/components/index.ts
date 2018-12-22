import CompoundAnswerDetail from './CompoundAnswerDetail';
import CompoundOverView from './CompoundOverView';
import CompoundUserList from './CompoundUserList';
import RoleReadAnswerDetail from './RoleReadAnswerDetail';
import RoleReadOverView from './RoleReadOverView';
import RoleReadReport from './RoleReadReport';
import RoleReadUserList from './RoleReadUserList';
import SentencePronunciationDetail from './SentencePronunciationDetail';
import SentencePronunciationList from './SentencePronunciationList';
import ChapterPronunciation from './ChapterPronunciation';
import ChapterPronunciationDetail from './ChapterPronunciationDetail';

(function () {
    if (window['Midware'] && window['Midware'].componentDefine) {
        window['Midware'].componentDefine('ComplexStatistics:CompoundAnswerDetail', function () {
            return CompoundAnswerDetail
        })
        window['Midware'].componentDefine('ComplexStatistics:CompoundOverView', function () {
            return CompoundOverView
        })
        window['Midware'].componentDefine('ComplexStatistics:CompoundUserList', function () {
            return CompoundUserList
        })
        window['Midware'].componentDefine('ComplexStatistics:RoleReadAnswerDetail', function () {
            return RoleReadAnswerDetail
        })
        window['Midware'].componentDefine('ComplexStatistics:RoleReadOverView', function () {
            return RoleReadOverView
        })
        window['Midware'].componentDefine('ComplexStatistics:RoleReadReport', function () {
            return RoleReadReport
        })
        window['Midware'].componentDefine('ComplexStatistics:RoleReadUserList', function () {
            return RoleReadUserList
        })
        window['Midware'].componentDefine('ComplexStatistics:SentencePronunciationDetail', function () {
            return SentencePronunciationDetail
        })
        window['Midware'].componentDefine('ComplexStatistics:SentencePronunciationList', function () {
            return SentencePronunciationList
        })
        window['Midware'].componentDefine('ComplexStatistics:ChapterPronunciation', function () {
            return ChapterPronunciation
        })
        window['Midware'].componentDefine('ComplexStatistics:ChapterPronunciationDetail', function () {
            return ChapterPronunciationDetail
        })
    } else {
        console.log('请先加载托管组件【Midware】')
    }
})();
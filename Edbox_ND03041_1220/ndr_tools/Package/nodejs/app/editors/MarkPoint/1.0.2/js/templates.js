define([], function () {
var templates = {};

templates["answer_item.html"] = "<div class='mark_punctuation' contenteditable='false'>{answer}</div>";

templates["template.html"] = "<div class=\"com_layout com_layout_large\">\n" +
   "    <div class=\"com_lay_main\">\n" +
   "        <div class=\"com_lay_header\">\n" +
   "            <div class=\"com_u_timebox\">\n" +
   "                <span class=\"time_1 GameQuestionTimer_minute\"></span>\n" +
   "                <span class=\"time_2\">:</span>\n" +
   "                <span class=\"time_1 GameQuestionTimer_second\"></span>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "        <div class=\"com_lay_contain punctuation_box\">\n" +
   "	        <div class=\"mark_point_container\"> \n" +
   "				<div class=\"mark_point_layout\">\n" +
   "				    <div class=\"mark_point_title\">\n" +
   "				    	<h2 class=\"title_wrapper\" >	        \n" +
   "				        	<p contenteditable=\"true\" class=\"model_title\"></p>\n" +
   "				        </h2>	         \n" +
   "				    </div>\n" +
   "				    <div class=\"mark_point_body com_lay_board\">\n" +
   "				    	<div class=\"punctuation_container\">	    		\n" +
   "					        <div class=\"punctuation_container2\">	\n" +
   "						        <div class=\"mark_point_content punctuation_text_main\" contenteditable=\"true\">                \n" +
   "						        </div>			         			    \n" +
   "						    </div>\n" +
   "						    <div class='answer_button'>设为选项</div>	\n" +
   "				        </div>\n" +
   "				        	 		              \n" +
   "				        <span class=\"content_size_wrapper count_character\"><span class='mark_point_content_size num_now'></span>/ <span class=\"num_all\">200</span></span>\n" +
   "				   		<div class=\"quick_actions_box\">\n" +
   "			                <!-- 点击之后按钮变成不可编辑的状态添加类名 btn_disabled -->\n" +
   "			                <a class=\"foot_title_operate com_u_btn2\">一键设为选项</a>\n" +
   "			                <a class=\"foot_title_operate com_u_btn3\">一键还原</a>\n" +
   "						</div>\n" +
   "					    <div class=\"mark_point_footer punctuation_bottom\">\n" +
   "					        <div class=\"foot_title_wraper\">\n" +
   "					        	<div class=\"foot_title answer_title\">标点选项</div>\n" +
   "					        	<a class=\"answer_item_prev icon_turn prev\"></a>  \n" +
   "					        	<div class=\"pun_answer_box\">\n" +
   "						        	<ul class=\"foot_content answer_list punctuation_list list_bot clearfix\">\n" +
   "						        	\n" +
   "						        	</ul>\n" +
   "					        	</div>		        	\n" +
   "					        	<a class=\"answer_item_next icon_turn next\"></a> 		        	\n" +
   "					        	<a class=\"foot_title_operate com_u_btn4\">+添加干扰项</a>\n" +
   "					        </div>		       \n" +
   "					    </div>\n" +
   "					    <div class=\"confuse_answers btnselect\" style=\"display:none\">\n" +
   "					     	<i class=\"tips\"></i>\n" +
   "				        	 <ul class=\"answer_list punctuation_list clearfix\"> \n" +
   "				        	\n" +
   "					        </ul>\n" +
   "					        <div class=\"surebox\">\n" +
   "					        	<a class=\"confuse_answers_close_button surebtn\">关闭</a>\n" +
   "					        </div>\n" +
   "				        </div>\n" +
   "				    </div>	\n" +
   "				</div>\n" +
   "			</div>\n" +
   "		</div>\n" +
   "	</div> \n" +
   "</div>\n" +
   "";
return templates;});
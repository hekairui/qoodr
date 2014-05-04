define(["jquery"],function($){
	var h ='';
	var t ='<li><a href="#" data-charindex="{seq}">{title}</a></li>';
	//var m ='<li><a href="#" data-ci="{ci}" data-ps="{ps}" data-ci="{ci}">{txt}</a></li>';
	var m ='<li data-ci="{ci}" data-ps="{ps}"><div class="tit"><h4>第 {chapter} 章</h4><span>{date}</span></div><div class="desc">{txt}</div><i class="flag"></i><a class="delete">删除</a></li>'
	return {
		clearEl:function(el){
			$("#"+el).empty();
		},
		appendBook:function(el,html,up,seq){
			// console.log(seq)
			if (!up) {
				$("#"+el).append("<div class='character' data-charindex='"+seq+"'>"+html+"</div>");
			}else{
				$("#"+el).prepend("<div class='character' data-charindex='"+seq+"'>"+html+"</div>");
			}			
		},
		settingText:function(el,text){
			$("#"+el).text(text)
		},
		appendCatalogue:function(el,bookInfo){
			for(var i in bookInfo.dir){
				 h+= $.nano(t,{title:bookInfo.dir[i].title,seq:bookInfo.dir[i].seq});
			}
			$("#"+el).append(h);
			h = "";
		},
		appendMarks:function(el,marks){
			for (var i = 0; i < marks.length; i++) {
				h+=$.nano(m,{ci:marks[i].ci,chapter:marks[i].ci,ps:marks[i].ps,txt:marks[i].text,date:marks[i].data})	
			};
			$("#"+el).append(h);
			h = "";
		}
	}
})

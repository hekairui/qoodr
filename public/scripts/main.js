define(["./book.js","./drawing.js","jquery","./sql.js"],function(book,drawing,$,sql){
	$(window).scroll(function(){
		var a = $(this).height();
  		var b = $(this).scrollTop()
  		var c = $(".content").height();
		var lastP = $(".readed").last()
		if (a+b==c) {
			bookInfo.ci = (lastP.parent().attr("data-charindex"))*1+1;
			console.log(bookInfo.ci)
			if (bookInfo.ci < 0) return;
			book.loadEpub(bookInfo.ci,function(r){
				drawing.appendBook("bookContent",r,false,bookInfo.ci); 
			});
		};
		if (b == 0) {
			bookInfo.ci = (lastP.parent().attr("data-charindex"))*1-1;
			console.log(bookInfo.ci)
			if (bookInfo.ci < 0) return;
			book.loadEpub(bookInfo.ci,function(r){
				drawing.appendBook("bookContent",r,true,bookInfo.ci);
			})
		};
		$("#bookContent p").each(function(){
		    var fold = $(window).scrollTop();;
		    if (fold >= $(this).offset().top-70) {           
		      $(this).addClass('readed');
		    }else{
		      if ($(".readed").length != 1)$(this).removeClass('readed');
		    };
		}); 
		if(window.g_scroll_timer){
		    clearTimeout(window.g_scroll_timer);
		    window.g_scroll_timer =0;
		}
		window.g_scroll_timer = setTimeout(function(){
		    sql.sendProgress(bid*1,($(".readed").last().parent().attr("data-charindex"))*1,$(".readed").last().attr("ps")*1+1,bookInfo.font,bookInfo.mark);
		},5000) 
		
	});
	$("#catalogueTrigger").bind("click",function(){
		var el = $("#catalogue");
		(el.css("display")==="block")?el.hide():el.show();
		drawing.clearEl("chapterUl");
		drawing.appendCatalogue("chapterUl",bookInfo);
	});
	$("#catalogueClose").bind("click",function(){
		$("#catalogue").hide();
	});
	$("#bookMarkClose").bind("click",function(){
		$("#bookMark").hide();
	});
	$("#chapterUl").on("click","a",function(){
		bookInfo.ci = ($(this).attr("data-charindex")*1-1);
		book.loadEpub(bookInfo.ci,function(r){
			drawing.clearEl("bookContent");
			drawing.appendBook("bookContent",r,false,bookInfo.ci);
			$("#catalogue").hide();
			$("#bookContent p:first").addClass("readed");
		})
	});
	$("#fontTrigger").bind("click",function(){
		var el = $("#font");
		(el.css("display")==="block")?el.hide():el.show();
	});
	$("#font li").click(function(){
		var size = ($(this).attr("class").replace(/\D/g,""))*1-2;
		sql.saveFont(bookInfo.bid,size,($(".readed").last().parent().attr("data-charindex"))*1,$(".readed").last().attr("ps")*1+1,bookInfo.mark,function(){
			window.location.reload();
		})
	});
	$("#bookMarkTrigger").bind("click",function(){
		var el = $("#bookMark");
		(el.css("display")==="block")?el.hide():el.show();
		console.log(bookInfo.mark)
		drawing.clearEl("bookmarkList");
		if(bookInfo.mark)drawing.appendMarks("bookmarkList",bookInfo.mark)
	});
	$("#addMark").click(function(){
		var d = new Date();
		var data = d.toLocaleString();	
		var mark = {
			ci:($(".readed").last().parent().attr("data-charindex"))*1,
			ps:$(".readed").last().attr("ps")*1+1,
			text:$(".readed").last().text().substring(0,25),
			data:data,
			ciname:$(".readed").last().parent().attr("data-ciname")
		}
		if (!bookInfo.mark)bookInfo.mark=[];
		console.log(!bookInfo.mark)
		bookInfo.mark.push(mark);
		console.log(bookInfo.mark);
		sql.saveMark(bookInfo.bid,mark.ci,mark.ps,bookInfo.font,bookInfo.mark,function(r){
			//console.log(r)
			//bookInfo.mark = [{mark}];
			$("#bookMark").hide();
		});
	});
	$("#bookmarkList").on({
		mouseenter: function () {
			$(this).addClass("on");
			$(this).find(".delete").show();
		},
		mouseleave: function () {
			$(this).removeClass("on");
			$(this).find(".delete").hide();
		}
	},"li");
	var bid = getParameterByName("bid");
	book.getEpub(function(bookInfo){
		drawing.settingText("title",bookInfo.name)
	});
	var bookInfo = book.getBookInfo();
	sql.getProgress(bid*1,function(r){
		(isNaN(r.ci))?bookInfo.ci = 0:bookInfo.ci = r.ci;
		(r.ps)?bookInfo.ps = r.ps:bookInfo.ps = 0;
		(r.font)?bookInfo.font = r.font:bookInfo.font = 16;
		bookInfo.bid = bid*1;
		bookInfo.mark = r.mark;
		//console.log(bookInfo.mark)	
		book.loadEpub(bookInfo.ci,function(r){
			$("#bookContent").css("font-size",bookInfo.font+"px")
			drawing.appendBook("bookContent",r,false,bookInfo.ci);
			$(window).scrollTop(($($("#bookContent p")[bookInfo.ps]).offset().top)-90);
		})
	}); 
	// (function getParameterByName(name) {
 //        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
 //        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
 //            results = regex.exec(location.search);
 //            //console.log(results);
 //        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
 //    })("bid")

    // /[\?&]xiaohong=([^&#]*)/ 
    // ? or & xiaohong= !&#
    // var a = "b1990[a";
    // a = a.replace(/[^b]/g,"");
    // console.log(a)
  //   var a = '<h1>·<a href="###" target="_blank">报考指南：怎样才能让平行志愿报的更合理</a><span>(04/30 11:58)</span></h1>'
  //   var regex = new RegExp("[\>].[\<]"),
		// results = regex.exec(a);
		// a = a.replace(/[\>].[\<]/g,"><");
		// console.log(a)
})


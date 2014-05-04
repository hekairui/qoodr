define(["jquery","init"],function($){
	var root = "book/epub/",
		bookInfo = {
			dir : []	//书的目录
		},//收集书籍信息
		epubPath = "",//epub的地址		
		dirname = function(path){
			return path.substring(0 , path.lastIndexOf('/'));
		},
		getEpubPath = function(path,key1,key2,cb){
			getreq({url:path,async:false,dataType:"xml"},function(e,r){
				//(!key1)?cb(r):cb($(r).find(key1).attr(key2));
				epubPath = dirname(path);
				switch(key1)
				{
					case "rootfile":
						cb($(r).find(key1).attr(key2));	
						break;
					case "spine":	
						cb($(r).find('#'+$(r).find(key1).attr(key2)).attr('href'));
						break;
					case null:
						cb(r);
						break;
				}
			})
		},
		buildEpub = function(r){
			var jr  = $(r);
			jr.find("navPoint").each(function(i,el){
				var jel = $(el)
				bookInfo.dir.push({seq:jel.attr('playOrder'),title:jel.find('text').text(),src:jel.find('content').attr('src')})
			});
			bookInfo.name = jr.find("docTitle").find("text").text();
			return bookInfo.dir;
		},
		reduceParagraph = function(r){
			var jbr = $("#bookReady");
			jbr.html("");
			jbr.append($(r).find("body").html());
			jbr.find("p").each(function(i,el){
				$(this).attr("ps",i);
			});
			return $("#bookReady").html();
		}
	return {
		//获取书的目录和地址,返回书籍相关信息
		getEpub:function(cb){			
			getEpubPath(root+"/META-INF/container.xml","rootfile","full-path",function(r){
				getEpubPath(root+r,"spine","toc",function(r){
					getEpubPath(epubPath+"/"+r,null,null,function(r){
						buildEpub(r);
						cb(bookInfo);
					})
				})
			})
		},
		//按传入的i,获取书籍的第i章内容
		loadEpub:function(i,cb){
			getreq({url:epubPath+"/"+bookInfo.dir[i].src,dataType: 'xml'},function(e,r){cb(reduceParagraph(r))})
		},
		getBookInfo:function(){
			return bookInfo;
		}
	}
});

define(["jquery"],function($,sql){
	$("#bookList").on("click","li",function(){
		window.location.href="/qoodr?bid="+$(this).attr("data-bid"); 
	})
})


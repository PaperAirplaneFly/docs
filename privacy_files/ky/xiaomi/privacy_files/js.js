
//打开app
//var from = {$Think.session.fromSDK};
$(function(){
	$(".openApp").click(function(){
		$("._getCardBox").hide();
		var src = $(this).attr('asrc');
		var ifr = document.createElement('iframe');
		ifr.src = src;
		ifr.style.display = 'none';
		document.body.appendChild(ifr);
		window.setTimeout(function(){
			document.body.removeChild(ifr);
			$("._downAppBox").show();
		},3000);
	});

	$(".SDKopenApp").click(function(){
		javascript:jadr.openAppPage($(this).attr('asrc'));
	});

	$("#_closeBox").click(function(){
		$("._downAppBox").hide();
	});
})

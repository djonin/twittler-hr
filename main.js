$(document).ready(function(){
	var $body = $('body');
	//list of tweetls
	var $list = $('<div></div>');
	$list.appendTo($body);
	//newest tweetl
	var lastTweetl;
	var stream = streams.home;
	var loadTweetls = function() {
		var $tempList = $('<div></div>');
		var index = stream.length - 1;
		var startHeight = $(document).height();
		while((index >= 0)&&(stream[index]!=lastTweetl)){
			var tweetl = stream[index];
			var $tweetl = $('<div class="tweetl"></div>');
			var currentTime = new Date().getTime();
			var $timeStamp = $('<abbr class="timeago" title="'+currentTime+'"></abbr>');
			$tweetl.text(': ' + tweetl.message);
			$('<a class="username">@'+tweetl.user+'</a>').prependTo($tweetl);
			$('<br>').appendTo($tweetl);
			$timeStamp.appendTo($tweetl);
			$tweetl.appendTo($tempList);
			index -= 1;
		}
		lastTweetl = stream[stream.length -1];
		//fade in new tweetls
		$tempList.hide().css('opacity',0.0).prependTo($list).fadeIn(100).animate({opacity: 2.0});
		//attach timestamps
		jQuery("abbr.timeago").timeago();
		var heightIncrease = $(document).height() - startHeight;
		var scrollPos = $(document).scrollTop();
		//adjust scroll position if we are not at the top of the page
		if((scrollPos>0)&&(heightIncrease>0)) {
			$(document).scrollTop(scrollPos + heightIncrease);
		}
		//re-attach event handlers
		$('.username').off('click');
		$('.username').on('click', function() {
			var temp = streams.users[$(this).text().substring(1)];
			if(temp != undefined) {
				if(stream == temp) {
					stream = streams.home;
				}
				else {
					stream = temp;
				}
				lastTweetl = undefined;
				$list.empty();
			}
		});
	}
	//initial call
	loadTweetls();
	//load tweetls every 100 ms
	setInterval(loadTweetls, 100);
	//tweetl button handler
	$('#tweetl').on('click', function() {
		var newTweet = {};
		//no login system implemented, use placeholder nickname
		newTweet.user = 'user_login';
		newTweet.created_at = new Date().getTime();
		newTweet.message = $('#tweetler').val();
		addTweet(newTweet);
		$('#tweetler').val('');
	});
});
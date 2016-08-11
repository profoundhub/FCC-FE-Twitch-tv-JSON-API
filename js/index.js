$(document).ready(function() {
  let channels = ["freecodecamp", "storbeck", "KyleLong", "VersusTheStream", "DooMNoThx", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404", "mtvdaniel", "medrybw", "cretetion", "sheevergaming", "TR7K", "OgamingSC2", "ESL_SC2"];

  let logoN = '//www.oxfamindia.org/sites/default/files/No-Logo-Available_16.png',
    api = '//api.twitch.tv/kraken/users/freecodecamp/follows/channels/',
    followers = [],
    status422 = [];

  $.getJSON(api, function(data) {
    for (i = 0; i < data.follows.length; i++) {
      followers.push(data.follows[i].channel.name);
    }
    
    let twitchMerge = channels.concat(followers);
    let uniqueNames = [];
    
    $.each(twitchMerge, function(i, el) {
      if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });

    uniqueNames.forEach(function(channels) {

      let streamURLs = '//api.twitch.tv/kraken/streams/' + channels + '?callback=?';
      let channelURLs = '//api.twitch.tv/kraken/channels/' + channels;

      // GET Streams
      $.getJSON(streamURLs, function(result) {

        let state;

        if (result.stream === null) {
          state = "Offline";
        } else if (result.status === 422) {
          state = "AccountClosed";
        } else {
          state = "Online";
        }

        $.getJSON(channelURLs, function(data) {

          let img = data.logo;
          
          if (img === null) {
            img = 'https://s3.amazonaws.com/uifaces/faces/twitter/fffabs/128.jpg';
          }
          
          let name = data.display_name,
            game = data.game + "",
            url = data.url,
            status = data.status;
          
          if (game === 'null') {
            game = 'Unknown';
          } else if (game === '') {
            game = 'Unknown';
          }
          
          let outputTwitch = "<table class='table table-filter table-striped'><tbody class='table-hover'><tr data-status=" + state + "><td class='media " + state + "'><div class='media'><a href='" + url + "' class='pull-left'>";
          outputTwitch += "<img class='iconsUsers' src='" + img + "' class='media-photo' /></a>";
          outputTwitch += "<div class='media-body'>";
          outputTwitch += "<span class='media-meta pull-Right " + state + "'>" + state + "</span>";
          outputTwitch += "<h4 class='title'><a id='name' href='" + url + "'>" + name + "</a>";
          outputTwitch += "<span class='pull-right page' id='game'>" + game + "</span></h4>";
          outputTwitch += "</div></div></td></tr></tbody></table>";

          if (state === "Online") {
            $('#TwitchStream').prepend(outputTwitch);
          } else if (state === "Offline") {
            $('#TwitchStream').append(outputTwitch);
          } else if (state === "AccountClosed") {
            $('#TwitchStream').append(outputTwitch);
          } else {
            $('#TwitchStream').append(outputTwitch);
          }
          
        }).fail(function(err) {

          let img2 = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/576663/AccountClosed256.png';
          
          let name = channels.display_name,
            game = channels.game + "",
            url = channels.url,
            status = "unknown";
          
          let outputTwitch2 = "<table class='table table-filter table-striped'><tbody class='table-hover'><tr data-status=" + state + "><td class='media " + state + "'><div class='media'><a class='pull-left'>";
          outputTwitch2 += "<img class='iconsUsers' src='" + img2 + "' class='media-photo' /></a>";
          outputTwitch2 += "<div class='media-body'>";
          outputTwitch2 += "<span class='media-meta pull-Right " + state + "'> Account Closed </span>";
          outputTwitch2 += "<h4 class='title'>" + channels + " ";
          outputTwitch2 += "<span class='pull-right page' id='game'> Account Closed </span></h4>";
          outputTwitch2 += "</div></div></td></tr></tbody></table>";

          if (err.status === 422) {
            $('#TwitchStream').append(outputTwitch2);
          }
          
        }); // GET JSON: channelURLs        
      }); // getJSON: streamURLs 
    }); //
  }); // channels.forEach(function(channels))
  
  $('.btn-filter').on('click', function() {
    var $target = $(this).data('target');
    if ($target != 'all') {
      $('.table tr').css('display', 'none');
      $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
    } else {
      $('.table tr').css('display', 'none').fadeIn('slow');
    }
  });
  
}); // $(document).ready(function()
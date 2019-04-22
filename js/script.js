function update_time() {
    var m = moment();
    $('.time').html(m.format('HH:mm'));
}

function update_timeicon() {
    $(".timeicon").removeClass("morning day evening night midnight dawn");

    var m = moment();
    var hour = m.hour();
    var tod = "morning";

    if (hour < 5) {
        tod = "midnight";
    } else if (hour < 7) {
        tod = "dawn";
    } else if (hour < 10) {
        tod = "morning";
    } else if (hour < 17) {
        tod = "day";
    } else if (hour < 19) {
        tod = "evening";
    } else {
        tod = "night"
    }

    $(".timeicon").addClass(tod);
}

function update_weather() {
    if (weatherKey && weatherUrl && weatherCity) {
        var wurl = weatherUrl + "?q=" + weatherCity + "&appid=" + weatherKey;

        $.ajax({
            url: wurl,
            dataType: "json",
            error: function (xhr) {
                var resp = JSON.parse(xhr.responseText);
                console.log(resp.cod + ": " + resp.message);
            },
            success: function (data) {
                var weather = "";
                var cast = data["weather"][0];
                var group = cast.main;
                var id = cast.id;

                if (group == "Clouds") {
                    weather = "cloudy";
                } else if (group == "Atmosphere") {
                    weather = "fog";

                    if (id == 781 || id == 731) {
                        weather = "tornado";
                    }
                } else if (group == "Clear") {
                    weather = "fair";
                } else if (group == "Rain" || group == "Drizzle") {
                    weather = "rain";

                    if (id == 511) {
                        weather = "freezingrain";
                    }
                } else if (group == "Thunderstorm") {
                    weather = "thunderstorm";

                    if (id == 210) {
                        weather = "lightning";
                    }

                    if (id == 212) {
                        weather = "heavystorm";
                    }
                } else if (group == "Snow") {
                    weather = "snow";
                }

                if (weather) {
                    $(".weathericon").removeClass().addClass("weathericon " + weather);
                }
            }
        });
    }
}

$(function () {
    if (location_name) {
        $(".location").text(location_name);
    }

    update_time();
    update_timeicon();

    setInterval(update_time, 1000);
    setInterval(update_timeicon, 3600000);

    if (weatherKey && weatherUrl && weatherCity) {
        update_weather();
        setInterval(update_weather, 900000);
    } else {
        console.warn("xc2-time: Weather options not set!");
    }
});

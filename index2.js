function onJSONget(data)
{
    $("#output").html('<img src="" class="img-fluid" alt="" id="profilePic">');
    $("#profilePic").attr("src", data.graphql.user.profile_pic_url_hd);
    $("#profilePic").attr("download", "profile.jpg");

    $("#search").attr("disabled", false);
    $("#search").html("Search");
    $("#username").val("");
}

function onJSONfail(data)
{
    $("#output").html('<div class="alert alert-danger alert-dismissible fade show" role="alert"> <strong>Error:</strong> Check the username and try again. <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">×</span> </button> </div>');

    $("#search").attr("disabled", false);
    $("#search").html("Search");
}

function search()
{
    let user = $("#username").val();

    if (user)
    {
        $("#search").attr("disabled", true);
        $("#search").html('<div class="spinner-border spinner-border-sm" role="status">');

        let url = `https://instagram.com/${user}?__a=1`;

        $.getJSON(url, onJSONget).fail(onJSONfail);
    }
}

$("#search").click(search);

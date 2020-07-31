const _URL = URL || window.URL;

function errorFunc()
{
    $("#output").html('<div class="alert alert-danger alert-dismissible fade show" role="alert"> <strong>Error:</strong> Check the link and try again. Make sure post is from a public account. <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">×</span> </button> </div>');

    $("#search").attr("disabled", false);
    $("#search").html("Search");
}

function grabPosts(data)
{
    if (data.graphql)
    {
        let __type = data.graphql.shortcode_media.__typename;

        if (__type == "GraphImage")
        {
            $("#output").html('<img src="" class="img-fluid" alt="" id="imgPost">');
            $("#imgPost").attr("src", data.graphql.shortcode_media.display_url);
        }
        else if (__type == "GraphVideo")
        {
            $("#output").html('<div class="embed-responsive embed-responsive-4by3"> <video class="embed-responsive-item" src="" id="vidPost" allowfullscreen controls></video> </div>');
            $("#vidPost").attr("src", data.graphql.shortcode_media.video_url);
        }
        else if (__type == "GraphSidecar")
        {
            $("#output").html('<div id="postSlide" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators" id="indicators"></ol><div class="carousel-inner" id="postSlideInner"></div></div>');

            let index = 0;
            let edges = data.graphql.shortcode_media.edge_sidecar_to_children.edges;

            let img;
            let vid;
            let ind;

            for (edge of edges)
            {
                if (edge.node.__typename == "GraphImage")
                {
                    if (index == 0)
                    {
                        img = '<div class="carousel-item active"><img src="' + edge.node.display_url + '" class="d-block w-100" alt=""></div>';
                        $("#postSlideInner").append(img);
                    }
                    else
                    {
                        img = '<div class="carousel-item"><img src="' + edge.node.display_url + '" class="d-block w-100" alt=""></div>';
                        $("#postSlideInner").append(img);
                    }
                }
                else if (edge.node.__typename == "GraphVideo")
                {
                    if (index == 0)
                    {
                        vid = '<div class="carousel-item active"><div class="embed-responsive embed-responsive-4by3"> <video class="embed-responsive-item" src="' + edge.node.video_url + '" id="vidPost" allowfullscreen controls></video> </div></div>';
                        $("#postSlideInner").append(vid);
                    }
                    else
                    {
                        vid = '<div class="carousel-item"><div class="embed-responsive embed-responsive-4by3"> <video class="embed-responsive-item" src="' + edge.node.video_url + '" id="vidPost" allowfullscreen controls></video> </div></div>';
                        $("#postSlideInner").append(vid);
                    }
                }

                if (index == 0)
                {
                    ind = '<li data-target="#postSlide" data-slide-to="' + index + '" class="active"></li>';
                    $("#indicators").append(ind);
                }
                else
                {
                    ind = '<li data-target="#postSlide" data-slide-to="' + index + '"></li>';
                    $("#indicators").append(ind);
                }

                index++;
            }
            $('#postSlide').carousel({ interval: false });
        }

        $("#search").attr("disabled", false);
        $("#search").html("Search");
        $("#link").val("");
    }
    else
    {
        errorFunc();
    }
}

function searchClick()
{
    let link = $("#link").val();

    if (link)
    {
        $("#search").attr("disabled", true);
        $("#search").html('<div class="spinner-border spinner-border-sm" role="status">');

        if (!link.startsWith("http"))
        {
            link = `http://${link}`;
        }

        try
        {
            let url = new _URL(link);

            if ((url.hostname == "instagram.com" || url.hostname == "www.instagram.com") && (url.pathname.startsWith("/p") || url.pathname.startsWith("/tv")))
            {
                $.getJSON(url.origin + url.pathname + "?__a=1", grabPosts).fail(errorFunc);
            }
            else
            {
                errorFunc();
            }
        }
        catch (e)
        {
            errorFunc();
        }
    }
}


$("#search").click(searchClick);

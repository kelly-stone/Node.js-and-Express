$(document).ready(function() {
  $(".delete-article").on("click", function(e) {
    //className .delete-article from show.pug
    $target = $(e.target);
    console.log($target.attr("data-id"));
  });
});

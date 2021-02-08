$(".btn").click(function () {
  switch ($(this).attr("id")) {
    case "butt3":
        //hide last three inputs
        $(".form4").css("visibility", "collapse");
        $(".form5").css("visibility", "collapse");
        $(".form6").css("visibility", "collapse");
        $("#count").attr("value", "3");
        $("#randomShuffler").prop("checked", true);
      break;
    case "butt4":
        //show fourth, hide last two
        $(".form4").css("visibility", "visible");
        $(".form5").css("visibility", "collapse");
        $(".form6").css("visibility", "collapse");
        $("#count").attr("value", "4");
        $("#randomShuffler").prop("checked", true);
      break;
    case "butt5":
        //show fourth and fith, hide last
        $(".form4").css("visibility", "visible");
        $(".form5").css("visibility", "visible");
        $(".form6").css("visibility", "collapse");
        $("#count").attr("value", "5");
        $("#randomShuffler").prop("checked", true);
      break;
    case "butt6":
        //show all
        $(".form4").css("visibility", "visible");
        $(".form5").css("visibility", "visible");
        $(".form6").css("visibility", "visible");
        $("#count").attr("value", "6");
        $("#randomShuffler").prop("checked", true);
      break;
    default:
      alert("error: invalid attribute: " + this.attr("id"));
  }
});

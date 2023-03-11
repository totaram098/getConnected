const friendProfile = document.querySelectorAll(".friendProfile");
friendProfile.forEach((div) => {
  div.addEventListener("click", (event) => {
    const targetDiv = event.target;
    const innerHTML = targetDiv.innerHTML;
    // document.getElementById("friendProfileContainer").innerHTML =  '<div class="friendProfile"> <h4>FRIENDS REQUEST</h4> </div>';
    console.log(innerHTML);
  });
});

//messages

const messages = document.querySelectorAll(".friendProfile");
messages.forEach((div) => {
  div.addEventListener("click", (event) => {
    id = div.getAttribute("data-id");
    var params = {
      userId: id,
      recieverId: "",
    };

    fetch("http://localhost:3000/getMessage", {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    const targetDiv = event.target;
    const innerHTML = targetDiv.innerHTML;
    // document.getElementById("friendProfileContainer").innerHTML =  '<div class="friendProfile"> <h4>FRIENDS REQUEST</h4> </div>';
    console.log(innerHTML);
  });
});

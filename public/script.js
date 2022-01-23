function generateJoke() {
	var text = "empty";

	fetch("https://us-central1-jokebot-ed58d.cloudfunctions.net/app/jokes") // Replace with "http://localhost:3000/jokes" when running locally
		.then((response) => response.json())
		.then((data) => {
			var joke = document.getElementById("p1");
			joke.innerHTML = data;
		});
}

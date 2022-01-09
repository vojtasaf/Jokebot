function generateJoke() {
	var text = "empty";

	fetch("http://localhost:3000/jokes")
		.then((response) => response.json())
		.then((data) => {
			var joke = document.getElementById("p1");
			joke.innerHTML = data;
		});
}

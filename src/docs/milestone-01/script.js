let wordCount = 0;

function countWordsInSection(sectionId) {
  let section = document.getElementById(sectionId);
  let text = section.innerText;
  let words = text.split(/\s+/).length;
  wordCount += words;
}

// Call the countWordsInSection function for each section when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  countWordsInSection("team");
  countWordsInSection("overview");
  countWordsInSection("application-parts");
  countWordsInSection("data-management");
  countWordsInSection("wire-frames");
  countWordsInSection("real-world");
  countWordsInSection("integrative-experience");
  document.getElementById("footer").innerHTML += wordCount;
});

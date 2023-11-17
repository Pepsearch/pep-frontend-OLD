const imageSearchForm = document.getElementById('search-form');
const imageSearchQueryInput = document.getElementById('query');
const imageSearchResultsDiv = document.getElementById('results');

imageSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = imageSearchQueryInput.value.trim();
    const apiUrl = `https://pep-image-backend.paramchosting.repl.co/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayImageResults(data);
        boldText(query);
    } catch (error) {
        console.error('Error fetching data:', error);
        imageSearchResultsDiv.innerHTML = '<p>An error occurred while fetching results.</p>';
    }
});


function displayImageResults(data) {
  resultsDiv.innerHTML = '';

  if (data && data.results && data.results.length > 0) {
    data.results.forEach((result) => {
      const imageSearchResultsDiv = document.createElement('div');
      imageSearchResultsDiv.classList.add('result-item');
      imageSearchResultsDiv.innerHTML = `
                <img src="${result.thumbnail.src}" alt="${result.title}" style="max-width: 100%;">
                <p style="margin-bottom: 0; margin-top: 4px;"><a href="${result.url}" target="_blank" style="color: #8ab4f8;">${result.title}</a></p>
            `; 
      resultsDiv.appendChild(imageSearchResultsDiv);
    });
  } else {
    resultsDiv.innerHTML = '<p>No results found.</p>';
  }
}

function boldText(queryString) {
  let links = document.querySelectorAll("#results .result-item p a");

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  links.forEach(function(link) {
    let linkText = link.textContent;

    queryString.split(" ").forEach(function(keyword) {
      let regex = new RegExp("\\b" + escapeRegExp(keyword) + "\\b", "gi");

      linkText = linkText.replace(regex, function(match) {
        return "<strong>" + match + "</strong>";
      });
    });

    link.innerHTML = linkText;
  });
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

if (getUrlParameter('q') !== undefined && getUrlParameter('q') !== '') {
  document.title = 'Pepsearch Images - ' + getUrlParameter('q');
  document.getElementById('query').value = getUrlParameter('q');
  document.getElementById('submit').click();
}

document.getElementById('submit').addEventListener('click', function() {
  window.history.pushState("", "Image Search", `/?q=${document.getElementById('query').value}`);
});

const webSearchForm = document.getElementById('search-form');
const webSearchQueryInput = document.getElementById('query');
const webSearchResultsDiv = document.getElementById('results');

webSearchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = webSearchQueryInput.value.trim();
    const apiUrl = `https://pepsearch.replit.app/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayWebResults(data);
        boldText(query);
    } catch (error) {
        console.error('Error fetching data:', error);
        webSearchResultsDiv.innerHTML = '<p>An error occurred while fetching results.</p>';
    }
});


function displayWebResults(data) {
    resultsDiv.innerHTML = '';

    if (data.web && data.web.results && data.web.results.length > 0) {
        data.web.results.forEach((result) => {
            const webSearchResultsDiv = document.createElement('div');
            webSearchResultsDiv.classList.add('result-item');
            webSearchResultsDiv.innerHTML = `
                <code style="color: #eee; font-size: 16px;"><img src="${result.meta_url.favicon}" width="16" style="margin-right: 5px; margin-bottom: -2px;">${result.meta_url.scheme}://${result.meta_url.hostname} ${result.meta_url.path}</code>
                <p style="margin-bottom: 0; margin-top: 4px;"><a href="${result.url}" target="_blank" style="color: #8ab4f8;">${result.title}</a></p>
                <p style="margin-top: 5px; color: #ccc;">${result.description}</p>
                <br>
            `;
            resultsDiv.appendChild(webSearchResultsDiv);
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

    links.forEach(function (link) {
        let linkText = link.textContent;

        queryString.split(" ").forEach(function (keyword) {
            let regex = new RegExp("\\b" + escapeRegExp(keyword) + "\\b", "gi");

            linkText = linkText.replace(regex, function (match) {
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
    document.title = 'Pepsearch - ' + getUrlParameter('q');
    document.getElementById('query').value = getUrlParameter('q');
    document.getElementById('submit').click();
}

document.getElementById('submit').addEventListener('click', function () {
    window.history.pushState("", "Pepsearch", `/?q=${document.getElementById('query').value}`);
});
